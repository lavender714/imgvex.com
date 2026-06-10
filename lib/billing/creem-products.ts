import type { NormalizedSubscriptionEntity } from "@creem_io/webhook-types";
import { createAdminClient } from "@/lib/supabase/admin";

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

export async function applyPaidSubscription(sub: NormalizedSubscriptionEntity) {
  const userId = extractUserId(sub);
  console.log("[creem] applyPaidSubscription sub=", sub.id, "userId=", userId, "product=", sub.product.id, "metadata=", JSON.stringify(sub.metadata));
  if (!userId) {
    console.warn("[creem] subscription.paid missing referenceId in metadata", sub.id);
    return;
  }
  const tier = tierForProduct(sub.product.id);
  if (!tier) {
    console.warn("[creem] No tier mapping for product", sub.product.id);
    return;
  }

  const supabase = createAdminClient();

  // Fetch current credits so we can add on top (don't overwrite)
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_balance")
    .eq("id", userId)
    .single();

  const currentBalance = profile?.credits_balance ?? 0;
  const newBalance = currentBalance + tier.creditsMonthly;
  console.log("[creem] updating user", userId, "tier=", tier.tier, "current credits=", currentBalance, "new credits=", newBalance);

  const { error } = await supabase
    .from("profiles")
    .update({
      plan_tier: tier.tier,
      credits_monthly: tier.creditsMonthly,
      credits_balance: newBalance,
      plan_started_at: sub.created_at,
      plan_ends_at: sub.current_period_end_date,
      creem_customer_id: sub.customer.id,
      creem_subscription_id: sub.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("[creem] Failed to apply paid subscription:", error);
    throw error;
  }
  console.log("[creem] applied paid subscription successfully for user", userId);
}

export async function revokeSubscription(sub: NormalizedSubscriptionEntity) {
  const userId = extractUserId(sub);
  if (!userId) {
    console.warn("[creem] revoke missing referenceId in metadata", sub.id);
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      plan_tier: "free",
      credits_monthly: 0,
      plan_ends_at: sub.current_period_end_date ?? sub.canceled_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("[creem] Failed to revoke subscription:", error);
    throw error;
  }
}
