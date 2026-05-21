import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { executeTaskWithFailover } from "@/lib/providers";
import {
  calculateGenerationCost,
  tryDeductCredits,
  logGeneration,
} from "@/lib/credits/server";
import { screenPrompt } from "@/lib/billing/creem-moderation";

export async function POST(request: Request) {
  console.log("[generate-api] Request received");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log("[generate-api] User:", user ? user.id : "null");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("[generate-api] Body:", JSON.stringify(body));
    const { taskType, model, prompt, ...rest } = body;

    if (!taskType || !model || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: taskType, model, prompt" },
        { status: 400 }
      );
    }

    const validTaskTypes = ["text-to-image", "image-to-image", "text-to-video", "image-to-video"];
    if (!validTaskTypes.includes(taskType)) {
      return NextResponse.json(
        { error: `Invalid taskType. Must be one of: ${validTaskTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // --- Content moderation (must run before credit deduction) ---
    const moderation = await screenPrompt(prompt.trim(), `${user.id}:${Date.now()}`);
    if (moderation.blocked) {
      console.warn(
        `[generate-api] Prompt blocked by moderation for user ${user.id}: decision=${moderation.decision} reason=${moderation.reason ?? "n/a"}`,
      );
      return NextResponse.json(
        {
          error: "Your prompt was blocked by our content policy. Please revise it and try again.",
          code: "CONTENT_POLICY_VIOLATION",
          decision: moderation.decision,
        },
        { status: 403 },
      );
    }

    // --- Credits check & deduct ---
    const creditsCost = calculateGenerationCost(model, taskType, {
      resolution: rest.resolution,
      duration: rest.duration,
    });

    const deducted = await tryDeductCredits(user.id, creditsCost);
    if (!deducted) {
      return NextResponse.json(
        { error: "Insufficient credits", code: "INSUFFICIENT_CREDITS", required: creditsCost },
        { status: 402 }
      );
    }

    console.log(`[generate-api] Deducted ${creditsCost} credits from ${user.id}`);

    const result = await executeTaskWithFailover(model, taskType, {
      model,
      prompt: prompt.trim(),
      ...rest,
    });

    console.log("[generate-api] Failover result:", JSON.stringify(result));

    // --- Log generation (fire-and-forget) ---
    await logGeneration({
      userId: user.id,
      taskId: result.task_id,
      provider: result.provider,
      model,
      taskType,
      prompt: prompt.trim(),
      creditsCost,
    });

    return NextResponse.json({
      code: 200,
      message: "success",
      data: {
        task_id: result.task_id,
        provider: result.provider,
        attempts: result.attempts,
        eta_seconds: result.eta_seconds,
        credits_cost: creditsCost,
      },
    });
  } catch (error) {
    console.error("[generate-api] ERROR:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
