import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createImageTask, createVideoTask } from "@/lib/apipod";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Debug: check if env vars are loaded
  const apiKey = process.env.APIPOD_API_KEY;
  const baseUrl = process.env.APIPOD_BASE_URL;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "APIPOD_API_KEY not loaded from env",
        debug: {
          cwd: process.cwd(),
          hasApiKey: !!apiKey,
          hasBaseUrl: !!baseUrl,
          envKeys: Object.keys(process.env).filter((k) => k.includes("API")),
        },
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { type, model, prompt, ...rest } = body;

    if (!type || !model || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: type, model, prompt" },
        { status: 400 }
      );
    }

    const options = {
      model,
      prompt,
      ...rest,
    };

    let result;
    if (type === "image") {
      result = await createImageTask(options);
    } else if (type === "video") {
      result = await createVideoTask(options);
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be 'image' or 'video'" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
