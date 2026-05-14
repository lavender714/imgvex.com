import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { queryImageTask, queryVideoTask } from "@/lib/apipod";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("taskId");
  const type = searchParams.get("type");

  if (!taskId || !type) {
    return NextResponse.json(
      { error: "Missing taskId or type" },
      { status: 400 }
    );
  }

  try {
    let result;
    if (type === "image") {
      result = await queryImageTask(taskId);
    } else if (type === "video") {
      result = await queryVideoTask(taskId);
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'image' or 'video'" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Query status error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Query failed" },
      { status: 500 }
    );
  }
}
