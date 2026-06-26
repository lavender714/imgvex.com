import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { executeTaskWithFailover } from "@/lib/providers";
import {
  calculateGenerationCost,
  createGeneration,
  spendCredits,
  refundGeneration,
  attachGenerationTask,
  deleteGeneration,
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

    // --- Tier permission checks ---
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan_tier, max_video_resolution, max_video_duration, max_concurrent_jobs, max_image_resolution, unlimited_models")
      .eq("id", user.id)
      .single();

    const tier = profile?.plan_tier ?? "free";
    const maxVideoRes = profile?.max_video_resolution;
    const maxVideoDuration = profile?.max_video_duration ?? 0;
    const maxConcurrent = profile?.max_concurrent_jobs ?? 1;
    const maxImageRes = profile?.max_image_resolution ?? "1024x1024";

    // 1. Concurrent jobs check
    const { data: activeJobCount } = await supabase.rpc("count_active_jobs", {
      p_user_id: user.id,
    });
    if ((activeJobCount ?? 0) >= maxConcurrent) {
      return NextResponse.json(
        { error: `Max ${maxConcurrent} concurrent jobs on your plan`, code: "RATE_LIMITED" },
        { status: 429 }
      );
    }

    // 2. Resolution & duration checks
    if (taskType.includes("video")) {
      if (!maxVideoRes) {
        return NextResponse.json(
          { error: "Video generation requires a paid plan", code: "UPGRADE_REQUIRED" },
          { status: 403 }
        );
      }
      if (rest.resolution) {
        const allowedResolutions = ["480p", "720p", "1080p", "4K"];
        const maxIdx = allowedResolutions.indexOf(maxVideoRes);
        const reqIdx = allowedResolutions.indexOf(rest.resolution);
        if (reqIdx === -1 || reqIdx > maxIdx) {
          return NextResponse.json(
            { error: `${rest.resolution} requires a higher plan`, code: "UPGRADE_REQUIRED" },
            { status: 403 }
          );
        }
      }
      if (rest.duration && rest.duration > maxVideoDuration) {
        return NextResponse.json(
          { error: `Max ${maxVideoDuration}s video on your plan`, code: "UPGRADE_REQUIRED" },
          { status: 403 }
        );
      }
    } else {
      // Image resolution check
      const allowedImageRes = ["1024x1024", "2048x2048", "4096x4096"];
      const size = rest.size ?? "1024x1024";
      const maxIdx = allowedImageRes.indexOf(maxImageRes);
      const reqIdx = allowedImageRes.indexOf(size);
      if (reqIdx === -1 || reqIdx > maxIdx) {
        return NextResponse.json(
          { error: `${size} images require a higher plan`, code: "UPGRADE_REQUIRED" },
          { status: 403 }
        );
      }
    }

    // --- Credits check & deduct ---
    const creditsCost = calculateGenerationCost(model, taskType, {
      resolution: rest.resolution,
      duration: rest.duration,
      size: rest.size,
    });

    // Pre-create the generation row so the spend (and any refund) can be
    // anchored to a stable generation id.
    const generationId = await createGeneration({
      userId: user.id,
      model,
      taskType,
      prompt: prompt.trim(),
      creditsCost,
    });
    if (!generationId) {
      return NextResponse.json({ error: "Failed to start generation" }, { status: 500 });
    }

    const spent = await spendCredits(user.id, generationId, creditsCost, model);
    if (!spent) {
      await deleteGeneration(generationId);
      return NextResponse.json(
        { error: "Insufficient credits", code: "INSUFFICIENT_CREDITS", required: creditsCost },
        { status: 402 }
      );
    }

    console.log(`[generate-api] Spent ${creditsCost} credits for ${user.id} (generation ${generationId})`);

    let result;
    try {
      result = await executeTaskWithFailover(model, taskType, {
        model,
        prompt: prompt.trim(),
        ...rest,
      });
    } catch (execError) {
      // Generation could not be dispatched — refund immediately so the user is
      // not charged for work that never started.
      await refundGeneration(generationId);
      await deleteGeneration(generationId);
      console.error("[generate-api] dispatch failed, refunded:", execError);
      throw execError;
    }

    console.log("[generate-api] Failover result:", JSON.stringify(result));

    // Attach the provider task id so status polling can reconcile this row.
    await attachGenerationTask(generationId, result.task_id, result.provider);

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
