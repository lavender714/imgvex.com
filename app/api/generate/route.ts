import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createTaskWithFailover } from "@/lib/providers";

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
    const { type, model, prompt, ...rest } = body;

    if (!type || !model || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: type, model, prompt" },
        { status: 400 }
      );
    }

    if (type !== "image" && type !== "video") {
      return NextResponse.json(
        { error: "Invalid type. Must be 'image' or 'video'" },
        { status: 400 }
      );
    }

    const result = await createTaskWithFailover(model, type, {
      model,
      prompt: prompt.trim(),
      ...rest,
    });

    console.log("[generate-api] Failover result:", JSON.stringify(result));

    return NextResponse.json({
      code: 200,
      message: "success",
      data: {
        task_id: result.task_id,
        provider: result.provider,
        attempts: result.attempts,
        eta_seconds: result.eta_seconds,
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
