import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUploadUrl, getUserPrefix } from "@/lib/r2";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename, contentType } = await request.json();
    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
    }

    const key = `${getUserPrefix(user.id)}${Date.now()}-${filename}`;
    const signedUrl = await getUploadUrl(key, contentType);

    return NextResponse.json({ signedUrl, key });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
