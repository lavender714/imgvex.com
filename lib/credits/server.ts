import { createClient } from "@/lib/supabase/server";
import { getModelCreditCost, getVideoCreditCost } from "./model-costs";

export interface UserCredits {
  planTier: string;
  creditsBalance: number;
  creditsMonthly: number;
}

export async function getUserCredits(userId: string): Promise<UserCredits> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("plan_tier, credits_balance, credits_monthly")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("[credits] Failed to fetch user credits:", error);
    throw new Error("Failed to fetch credits");
  }

  return {
    planTier: data.plan_tier ?? "free",
    creditsBalance: data.credits_balance ?? 0,
    creditsMonthly: data.credits_monthly ?? 0,
  };
}

/**
 * Apply resolution-based upcharge for image models whose supplier cost
 * scales significantly with output resolution (flux, gpt-image, nano-banana).
 * Keeps 1K prices competitive while covering 4K supplier costs.
 */
function applyImageSizeCost(baseCost: number, modelId: string, size?: string): number {
  if (!size) return baseCost;

  const is2k = size.includes("2k") || size === "2048x2048";
  const is4k = size.includes("4k") || size === "4096x4096";

  if (!is2k && !is4k) return baseCost;

  switch (modelId) {
    case "flux":
    case "flux-2":
      // KIE flux-2 2K costs $0.12; charge a flat 12c for non-1K resolutions
      return 12;
    case "gpt-image-2":
    case "gpt-image-2-image":
      // KIE/EvoLink gpt-image-2 4K costs ~$0.08
      return is4k ? 8 : baseCost;
    case "nano-banana-2":
    case "nano-banana-2-image":
      // EvoLink nano-banana-2 4K costs $0.128
      return is4k ? 12 : baseCost;
    case "nano-banana-pro":
      // EvoLink nano-banana-pro 4K costs $0.203
      return is4k ? 20 : baseCost;
    default:
      return baseCost;
  }
}

export function calculateGenerationCost(
  modelId: string,
  taskType: string,
  options?: { resolution?: string; duration?: number; size?: string }
): number {
  let baseCost: number;

  if (taskType.includes("video")) {
    baseCost = getVideoCreditCost(modelId, options?.resolution);
  } else {
    baseCost = getModelCreditCost(modelId);
    baseCost = applyImageSizeCost(baseCost, modelId, options?.size);
  }

  // Duration multiplier for video: default 5s is base cost
  if (taskType.includes("video") && options?.duration && options.duration > 5) {
    const multiplier = Math.ceil(options.duration / 5);
    baseCost = baseCost * multiplier;
  }

  return baseCost;
}

/**
 * Create a pending generation_logs row and return its id. The id anchors the
 * credit spend (credit_ledger.generation_id), so the row must exist before
 * spending. Returns null if the insert failed.
 */
export async function createGeneration(data: {
  userId: string;
  model: string;
  taskType: string;
  prompt?: string;
  creditsCost: number;
}): Promise<string | null> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("generation_logs")
    .insert({
      user_id: data.userId,
      model: data.model,
      task_type: data.taskType,
      prompt: data.prompt,
      credits_cost: data.creditsCost,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[credits] Failed to create generation log:", error);
    return null;
  }
  return row.id as string;
}

/**
 * Spend credits for a generation. Subscription credits are consumed before
 * topup; the split is recorded so a refund can restore the exact buckets.
 * Idempotent per generationId. Returns false if the balance is insufficient.
 * Unlimited-model access returns true without charging.
 */
export async function spendCredits(
  userId: string,
  generationId: string,
  amount: number,
  modelId?: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("spend_credits", {
    p_user_id: userId,
    p_generation_id: generationId,
    p_amount: amount,
    p_model_id: modelId,
  });

  if (error) {
    console.error("[credits] spend_credits RPC failed:", error);
    throw error;
  }
  return data === true;
}

/** Refund a failed generation's credits to the buckets they came from. Idempotent. */
export async function refundGeneration(generationId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("refund_generation_credits", {
    p_generation_id: generationId,
  });
  if (error) {
    console.error("[credits] refund_generation_credits RPC failed:", error);
  }
}

/** Attach the provider task id once the async job has been created. */
export async function attachGenerationTask(
  generationId: string,
  taskId?: string,
  provider?: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("generation_logs")
    .update({ task_id: taskId, provider })
    .eq("id", generationId);
  if (error) {
    console.error("[credits] Failed to attach task to generation:", error);
  }
}

/** Delete a pending generation row (used when the spend fails right after create). */
export async function deleteGeneration(generationId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("generation_logs")
    .delete()
    .eq("id", generationId);
  if (error) {
    console.error("[credits] Failed to delete generation log:", error);
  }
}

export async function updateGenerationStatus(
  taskId: string,
  updates: {
    status?: string;
    errorMessage?: string;
    completedAt?: string;
  }
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("generation_logs")
    .update({
      status: updates.status,
      error_message: updates.errorMessage,
      completed_at: updates.completedAt,
    })
    .eq("task_id", taskId);

  if (error) {
    console.error("[credits] Failed to update generation log:", error);
  }
}
