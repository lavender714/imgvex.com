import type { NormalizedSubscriptionEntity } from "@creem_io/webhook-types";
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

function extractUserId(sub: NormalizedSubscriptionEntity): string | null {
  const fromMeta = sub.metadata?.referenceId ?? sub.metadata?.user_id;
  if (typeof fromMeta === "string" && fromMeta.length > 0) return fromMeta;
  return null;
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

export async function revokeSubscription(sub: NormalizedSubscriptionEntity) {
  const userId = extractUserId(sub);
  if (!userId) {
    console.warn("[creem] revoke missing referenceId in metadata", sub.id);
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
      // Reset permissions to free tier
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
    console.error("[creem] Failed to revoke subscription:", error);
    throw error;
  }
}
