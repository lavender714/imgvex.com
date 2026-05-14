import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listUserAssets, getDownloadUrl } from "@/lib/r2";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const assets = await listUserAssets(user.id);

    // Generate presigned download URLs for each asset
    const assetsWithUrls = await Promise.all(
      assets.map(async (asset) => ({
        ...asset,
        downloadUrl: await getDownloadUrl(asset.key),
      }))
    );

    return NextResponse.json({ assets: assetsWithUrls });
  } catch (error) {
    console.error("List assets error:", error);
    return NextResponse.json({ error: "Failed to list assets" }, { status: 500 });
  }
}
