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

export function calculateGenerationCost(
  modelId: string,
  taskType: string,
  options?: { resolution?: string; duration?: number }
): number {
  let baseCost: number;

  if (taskType.includes("video")) {
    baseCost = getVideoCreditCost(modelId, options?.resolution);
  } else {
    baseCost = getModelCreditCost(modelId);
  }

  // Duration multiplier for video: default 5s is base cost
  if (taskType.includes("video") && options?.duration && options.duration > 5) {
    const multiplier = Math.ceil(options.duration / 5);
    baseCost = baseCost * multiplier;
  }

  return baseCost;
}

/** Atomically deduct credits. Returns true if successful, false if insufficient. */
export async function tryDeductCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("deduct_credits", {
    p_user_id: userId,
    p_amount: amount,
  });

  if (error) {
    console.error("[credits] deduct_credits RPC failed:", error);
    // Fallback: non-atomic read-update for environments without the RPC
    return fallbackDeductCredits(userId, amount);
  }

  return data === true;
}

async function fallbackDeductCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  const supabase = await createClient();

  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("credits_balance, plan_tier")
    .eq("id", userId)
    .single();

  if (fetchError) throw fetchError;
  if (profile.plan_tier === "ultra") return true;
  if (!profile || (profile.credits_balance ?? 0) < amount) return false;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ credits_balance: profile.credits_balance - amount })
    .eq("id", userId);

  if (updateError) throw updateError;
  return true;
}

export async function logGeneration(data: {
  userId: string;
  taskId?: string;
  provider?: string;
  model: string;
  taskType: string;
  prompt?: string;
  creditsCost: number;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("generation_logs").insert({
    user_id: data.userId,
    task_id: data.taskId,
    provider: data.provider,
    model: data.model,
    task_type: data.taskType,
    prompt: data.prompt,
    credits_cost: data.creditsCost,
    status: "pending",
  });

  if (error) {
    console.error("[credits] Failed to log generation:", error);
    // Don't throw — logging failure shouldn't block generation
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
