import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { queryTaskStatus } from "@/lib/providers";
import type { TaskType } from "@/lib/providers";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("taskId");
  const provider = searchParams.get("provider");
  const taskType = searchParams.get("taskType");

  if (!taskId || !provider || !taskType) {
    return NextResponse.json(
      { error: "Missing required params: taskId, provider, taskType" },
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

  try {
    const result = await queryTaskStatus(provider, taskId, taskType as TaskType);

    // Reconcile our generation log on terminal states; refund failures exactly
    // once (the RPC is idempotent and locks, so concurrent polls are safe).
    if (result.status === "completed" || result.status === "failed" || result.status === "error") {
      const { data: gen } = await supabase
        .from("generation_logs")
        .select("id, status")
        .eq("task_id", taskId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (gen && gen.status !== "completed" && gen.status !== "failed") {
        const failed = result.status !== "completed";
        await supabase
          .from("generation_logs")
          .update({
            status: failed ? "failed" : "completed",
            error_message: failed ? (result.error ?? "Generation failed") : null,
            completed_at: new Date().toISOString(),
          })
          .eq("id", gen.id);

        if (failed) {
          const { error: refundErr } = await supabase.rpc("refund_generation_credits", {
            p_generation_id: gen.id,
          });
          if (refundErr) {
            console.error("[status-api] refund failed:", refundErr);
          } else {
            console.log("[status-api] refunded credits for failed generation", gen.id);
          }
        }
      }
    }

    return NextResponse.json({
      code: 200,
      message: "success",
      data: result,
    });
  } catch (error) {
    console.error("[status-api] ERROR:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Query failed" },
      { status: 500 }
    );
  }
}
