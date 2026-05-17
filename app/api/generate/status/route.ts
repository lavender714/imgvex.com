import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { queryTask } from "@/lib/providers";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("taskId");
  const provider = searchParams.get("provider");
  const type = searchParams.get("type");

  if (!taskId || !provider || !type) {
    return NextResponse.json(
      { error: "Missing required params: taskId, provider, type" },
      { status: 400 }
    );
  }

  if (type !== "image" && type !== "video") {
    return NextResponse.json(
      { error: "Invalid type. Must be 'image' or 'video'" },
      { status: 400 }
    );
  }

  try {
    const result = await queryTask(provider, taskId, type);
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
