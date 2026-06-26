import type {
  NormalizedSubscriptionEntity,
  NormalizedCheckoutEntity,
  NormalizedRefundEntity,
  NormalizedDisputeEntity,
} from "@creem_io/webhook-types";
import { createAdminClient } from "@/lib/supabase/admin";
import { TIER_CONFIG, buildUltraUnlimitedModels } from "./tier-config";

export type PlanTier = "free" | "lite" | "pro" | "ultra";

export interface TierConfig {
  tier: PlanTier;
  creditsMonthly: number;
}

const PRODUCT_TIER_MAP: Record<string, TierConfig> = Object.fromEntries(
  [
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_LITE_MONTHLY, { tier: "lite", creditsMonthly: 300 }],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_LITE_YEARLY, { tier: "lite", creditsMonthly: 300 }],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_MONTHLY, { tier: "pro", creditsMonthly: 800 }],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_YEARLY, { tier: "pro", creditsMonthly: 800 }],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_ULTRA_MONTHLY, { tier: "ultra", creditsMonthly: 5000 }],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_ULTRA_YEARLY, { tier: "ultra", creditsMonthly: 5000 }],
    // Test mode product IDs
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_LITE_MONTHLY_TEST, { tier: "lite", creditsMonthly: 300 }],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_LITE_YEARLY_TEST, { tier: "lite", creditsMonthly: 300 }],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_MONTHLY_TEST, { tier: "pro", creditsMonthly: 800 }],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_YEARLY_TEST, { tier: "pro", creditsMonthly: 800 }],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_ULTRA_MONTHLY_TEST, { tier: "ultra", creditsMonthly: 5000 }],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_ULTRA_YEARLY_TEST, { tier: "ultra", creditsMonthly: 5000 }],
  ].filter((entry): entry is [string, TierConfig] => Boolean(entry[0])),
);

export function tierForProduct(productId: string): TierConfig | null {
  return PRODUCT_TIER_MAP[productId] ?? null;
}

// One-time top-up credit packs (never expire). Priced ~$0.035-0.04/credit
// (3.5-4x the $0.01/credit cost, in line with subscriptions):
//   S = $19 / 500 · M = $79 / 2,000 · L = $349 / 10,000
// Env names are size-agnostic so price/credit tweaks don't require renames.
const CREDIT_PACK_MAP: Record<string, number> = Object.fromEntries(
  [
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_S, 500],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_M, 2000],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_L, 10000],
    // Test mode product IDs
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_S_TEST, 500],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_M_TEST, 2000],
    [process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_L_TEST, 10000],
  ].filter((entry): entry is [string, number] => Boolean(entry[0])),
);

export function creditPackForProduct(productId: string): number | null {
  return CREDIT_PACK_MAP[productId] ?? null;
}

function metaUserId(meta: { referenceId?: string; user_id?: string } | undefined | null): string | null {
  const fromMeta = meta?.referenceId ?? meta?.user_id;
  if (typeof fromMeta === "string" && fromMeta.length > 0) return fromMeta;
  return null;
}

function extractUserId(sub: NormalizedSubscriptionEntity): string | null {
  return metaUserId(sub.metadata as { referenceId?: string; user_id?: string } | undefined);
}

/**
 * checkout.completed — fulfill a one-time credit pack purchase. No-op for
 * subscription checkouts (those are credited by subscription.paid). Idempotent
 * per checkout id, so webhook retries cannot double-grant.
 */
export async function grantTopupCredits(checkout: NormalizedCheckoutEntity) {
  const productId = checkout.product?.id;
  const amount = productId ? creditPackForProduct(productId) : null;
  if (!amount) {
    // Not a credit pack (subscription checkout or unknown product) — ignore.
    return;
  }

  const userId = metaUserId(checkout.metadata as { referenceId?: string; user_id?: string } | undefined);
  if (!userId) {
    console.warn("[creem] checkout.completed credit pack missing referenceId", checkout.id);
    return;
  }

  const supabase = createAdminClient();
  const { data: granted, error } = await supabase.rpc("grant_topup_credits", {
    p_user_id: userId,
    p_transaction_id: checkout.id,
    p_amount: amount,
  });

  if (error) {
    console.error("[creem] grant_topup_credits failed:", error);
    throw error;
  }
  console.log(
    "[creem] checkout.completed user", userId, "pack", productId, "checkout=", checkout.id,
    granted === true ? `granted ${amount} topup credits` : "duplicate — credits unchanged",
  );
}

/**
 * Sync tier, permissions, dates and Creem ids onto the profile. These are
 * absolute writes (no increments), so they are safe to re-apply on every event
 * and every webhook retry. Does NOT touch credits. Returns the resolved tier,
 * or null if the user/product could not be resolved.
 */
async function syncSubscriptionTier(
  sub: NormalizedSubscriptionEntity,
  userId: string,
  tier: TierConfig,
) {
  const supabase = createAdminClient();
  const perms = TIER_CONFIG[tier.tier];
  const unlimitedModels = tier.tier === "ultra"
    ? buildUltraUnlimitedModels(new Date(sub.created_at))
    : {};

  const { error } = await supabase
    .from("profiles")
    .update({
      plan_tier: tier.tier,
      credits_monthly: tier.creditsMonthly,
      plan_started_at: sub.created_at,
      plan_ends_at: sub.current_period_end_date,
      creem_customer_id: sub.customer.id,
      creem_subscription_id: sub.id,
      // Tier permissions
      max_image_resolution: perms.maxImageResolution,
      max_video_resolution: perms.maxVideoResolution,
      max_video_duration: perms.maxVideoDuration,
      max_concurrent_jobs: perms.maxConcurrentJobs,
      has_watermark: perms.hasWatermark,
      commercial_license: perms.commercialLicense,
      priority_queue: perms.priorityQueue,
      privacy_controls: perms.privacyControls,
      copy_protection: perms.copyProtection,
      unlimited_models: unlimitedModels,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("[creem] Failed to sync subscription tier:", error);
    throw error;
  }
}

/**
 * subscription.paid — the billing event. Syncs tier and grants the monthly
 * credits exactly once (idempotent per Creem transaction).
 */
export async function applyPaidSubscription(sub: NormalizedSubscriptionEntity) {
  const userId = extractUserId(sub);
  console.log("[creem] applyPaidSubscription sub=", sub.id, "userId=", userId, "product=", sub.product.id);
  if (!userId) {
    console.warn("[creem] subscription.paid missing referenceId in metadata", sub.id);
    return;
  }
  const tier = tierForProduct(sub.product.id);
  if (!tier) {
    console.warn("[creem] No tier mapping for product", sub.product.id);
    return;
  }

  await syncSubscriptionTier(sub, userId, tier);

  // Grant credits idempotently, keyed on the Creem transaction. Webhook retries
  // and the subscription.active duplicate (which does NOT call this) cannot
  // double-grant: the same transaction id is a no-op.
  const supabase = createAdminClient();
  const txnId = creditGrantKey(sub);
  const { data: granted, error: grantErr } = await supabase.rpc("grant_subscription_credits", {
    p_user_id: userId,
    p_transaction_id: txnId,
    p_amount: tier.creditsMonthly,
    p_period_end: sub.current_period_end_date ?? null,
  });

  if (grantErr) {
    console.error("[creem] grant_subscription_credits failed:", grantErr);
    throw grantErr;
  }
  console.log(
    "[creem] applyPaidSubscription user", userId, "tier=", tier.tier, "txn=", txnId,
    granted === true ? `granted ${tier.creditsMonthly} credits` : "duplicate — credits unchanged",
  );
}

/**
 * subscription.active — a lifecycle event Creem also fires for one payment.
 * Syncs tier/permissions ONLY; credits are the exclusive job of paid.
 */
export async function applyActiveSubscription(sub: NormalizedSubscriptionEntity) {
  const userId = extractUserId(sub);
  console.log("[creem] applyActiveSubscription sub=", sub.id, "userId=", userId, "product=", sub.product.id);
  if (!userId) {
    console.warn("[creem] subscription.active missing referenceId in metadata", sub.id);
    return;
  }
  const tier = tierForProduct(sub.product.id);
  if (!tier) {
    console.warn("[creem] No tier mapping for product", sub.product.id);
    return;
  }
  await syncSubscriptionTier(sub, userId, tier);
  console.log("[creem] applyActiveSubscription synced tier for user", userId, "(no credit change)");
}

/**
 * Idempotency key for a subscription credit grant. Prefer the per-payment
 * transaction id (changes every renewal, stable across retries of one payment);
 * fall back to subscription id + period start if the transaction is absent.
 */
function creditGrantKey(sub: NormalizedSubscriptionEntity): string {
  const s = sub as unknown as {
    last_transaction_id?: string;
    last_transaction?: { id?: string };
    current_period_start_date?: string;
  };
  return (
    s.last_transaction_id ??
    s.last_transaction?.id ??
    `${sub.id}:${s.current_period_start_date ?? sub.created_at}`
  );
}

/**
 * subscription.canceled — the user cancelled but keeps access until the period
 * ends (Pollo/terms behaviour). Do NOT downgrade or touch credits here; just
 * record when the plan ends. The downgrade happens on subscription.expired.
 */
export async function cancelSubscription(sub: NormalizedSubscriptionEntity) {
  const userId = extractUserId(sub);
  if (!userId) {
    console.warn("[creem] cancel missing referenceId in metadata", sub.id);
    return;
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      plan_ends_at: sub.current_period_end_date ?? sub.canceled_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
  if (error) {
    console.error("[creem] Failed to record cancellation:", error);
    throw error;
  }
  console.log("[creem] subscription canceled for user", userId, "— access kept until period end");
}

/**
 * subscription.expired / paused — the period has actually ended. Downgrade to
 * free permissions and expire the subscription credit bucket (topup untouched).
 */
export async function expireSubscription(sub: NormalizedSubscriptionEntity) {
  const userId = extractUserId(sub);
  if (!userId) {
    console.warn("[creem] expire missing referenceId in metadata", sub.id);
    return;
  }

  const supabase = createAdminClient();
  const perms = TIER_CONFIG["free"];
  const { error } = await supabase
    .from("profiles")
    .update({
      plan_tier: "free",
      credits_monthly: 0,
      plan_ends_at: sub.current_period_end_date ?? sub.canceled_at,
      max_image_resolution: perms.maxImageResolution,
      max_video_resolution: perms.maxVideoResolution,
      max_video_duration: perms.maxVideoDuration,
      max_concurrent_jobs: perms.maxConcurrentJobs,
      has_watermark: perms.hasWatermark,
      commercial_license: perms.commercialLicense,
      priority_queue: perms.priorityQueue,
      privacy_controls: perms.privacyControls,
      copy_protection: perms.copyProtection,
      unlimited_models: {},
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("[creem] Failed to expire subscription:", error);
    throw error;
  }

  const { error: expErr } = await supabase.rpc("expire_subscription_credits", {
    p_user_id: userId,
    p_ref_id: `${sub.id}:${sub.current_period_end_date ?? sub.canceled_at ?? sub.id}`,
  });
  if (expErr) {
    console.error("[creem] expire_subscription_credits failed:", expErr);
    throw expErr;
  }
  console.log("[creem] subscription expired for user", userId, "— downgraded + subscription credits expired");
}

/**
 * refund.created / dispute.created — claw back the credits from the grant that
 * the refunded/charged-back payment created. We locate the original grant in our
 * own ledger (it carries user_id + amount + bucket), then revoke clamped at 0.
 * Idempotent per refund/dispute id.
 */
export async function revokeRefundedCredits(
  entity: NormalizedRefundEntity | NormalizedDisputeEntity,
  reason: "manual_refund" | "chargeback",
) {
  const e = entity as unknown as {
    id: string;
    transaction?: { id?: string };
    checkout?: { id?: string } | string;
    subscription?: { id?: string } | string;
    order?: { id?: string } | string;
  };

  const idOf = (v: { id?: string } | string | undefined): string | undefined =>
    typeof v === "string" ? v : v?.id;

  const candidates = [
    e.transaction?.id,
    idOf(e.checkout),
    idOf(e.subscription),
    idOf(e.order),
  ].filter((x): x is string => Boolean(x));

  if (candidates.length === 0) {
    console.warn("[creem] refund/dispute has no linkable ids", e.id);
    return;
  }

  const supabase = createAdminClient();
  // Find the grant we made for any of the referenced ids.
  const { data: grant, error } = await supabase
    .from("credit_ledger")
    .select("user_id, amount, transaction_type")
    .in("transaction_id", candidates)
    .in("transaction_type", ["subscription_grant", "topup_grant"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[creem] refund lookup failed:", error);
    throw error;
  }
  if (!grant) {
    console.warn("[creem] no matching grant for refund/dispute", e.id, "candidates:", candidates);
    return;
  }

  const bucket = grant.transaction_type === "topup_grant" ? "topup" : "subscription";
  const { data: removed, error: revErr } = await supabase.rpc("revoke_credits", {
    p_user_id: grant.user_id,
    p_amount: grant.amount,
    p_bucket: bucket,
    p_ref_id: e.id,
    p_reason: reason,
  });
  if (revErr) {
    console.error("[creem] revoke_credits failed:", revErr);
    throw revErr;
  }
  console.log(
    "[creem]", reason, "clawed back", removed, "credits from", bucket,
    "bucket for user", grant.user_id, "ref=", e.id,
  );
}
