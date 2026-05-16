import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APIPOD_BASE_URL = process.env.APIPOD_BASE_URL || "https://api.apipod.ai/v1";
const APIPOD_API_KEY = process.env.APIPOD_API_KEY;

export async function POST(request: Request) {
  console.log("[generate-api-v2] Request received");
  console.log("[generate-api-v2] env key present?", !!APIPOD_API_KEY);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log("[generate-api-v2] User:", user ? user.id : "null");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("[generate-api-v2] Body:", JSON.stringify(body));
    const { type, model, prompt, ...rest } = body;

    if (!type || !model || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: type, model, prompt" },
        { status: 400 }
      );
    }

    if (!APIPOD_API_KEY) {
      return NextResponse.json(
        { error: "[generate-api-v2] APIPOD_API_KEY missing in env" },
        { status: 500 }
      );
    }

    const endpoint = type === "image" ? "/images/generations" : "/videos/generations";
    const res = await fetch(`${APIPOD_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${APIPOD_API_KEY}`,
      },
      body: JSON.stringify({ model, prompt, ...rest }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`APIPod ${type} generation failed: ${res.status} ${err}`);
    }

    const result = await res.json();
    console.log("[generate-api-v2] Result:", JSON.stringify(result));
    return NextResponse.json(result);
  } catch (error) {
    console.error("[generate-api-v2] ERROR:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
