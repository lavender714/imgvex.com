"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, FileImage, FileVideo, Download, Trash2, Loader2 } from "lucide-react";

interface Asset {
  key: string;
  filename: string;
  size: number;
  lastModified: string;
  url: string;
  downloadUrl: string;
}

function formatSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "")) {
    return <FileImage className="w-5 h-5 text-[#818CF8]" />;
  }
  if (["mp4", "mov", "avi", "webm", "mkv"].includes(ext || "")) {
    return <FileVideo className="w-5 h-5 text-[#EC4899]" />;
  }
  return <FileImage className="w-5 h-5 text-[#64748B]" />;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchAssets = useCallback(async () => {
    try {
      const res = await fetch("/api/assets");
      if (!res.ok) throw new Error("Failed to fetch assets");
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      // 1. Get signed upload URL from API
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");
      const { signedUrl, key } = await res.json();

      // 2. Upload file directly to R2
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      // 3. Refresh asset list
      await fetchAssets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDownload = async (asset: Asset) => {
    try {
      const res = await fetch("/api/assets/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: asset.key }),
      });
      if (!res.ok) throw new Error("Failed to get download URL");
      const { url } = await res.json();
      window.open(url, "_blank");
    } catch {
      window.open(asset.url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0817] flex flex-col">
      {/* Top Nav */}
      <header className="h-[60px] border-b border-[#1E293B] bg-[#06060A] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-[#F8FAFC]">imgvex.AI</Link>
          <div className="w-px h-6 bg-[#1E293B]" />
          <span className="text-sm font-medium text-[#F8FAFC]">My Assets</span>
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm h-9 px-4" asChild>
            <Link href="/generate">+ New Generation</Link>
          </Button>
          <Button variant="outline" className="rounded-full border-[#1E293B] text-[#CBD5E1] hover:bg-[#1E293B] text-sm h-9 px-4" asChild>
            <Link href="/dashboard">← Back</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col gap-6">
          {/* Header + Upload */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#F8FAFC]">My Assets</h1>
              <p className="text-sm text-[#64748B]">{assets.length} files stored in Cloudflare R2</p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <Button
                disabled={uploading}
                className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm h-10 px-5"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1.5" />
                    Upload File
                  </>
                )}
              </Button>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Asset List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-[#64748B] animate-spin" />
            </div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#13101F] border border-[#1E293B] flex items-center justify-center">
                <FileImage className="w-8 h-8 text-[#475569]" />
              </div>
              <p className="text-[#64748B]">No assets yet</p>
              <p className="text-sm text-[#475569]">Upload your first file or generate content</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {assets.map((asset) => (
                <div
                  key={asset.key}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#0F0F1A] border border-[#1E293B] hover:border-[#475569] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#13101F] border border-[#1E293B] flex items-center justify-center shrink-0">
                    {getFileIcon(asset.filename)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F8FAFC] truncate">{asset.filename}</p>
                    <p className="text-xs text-[#64748B]">
                      {formatSize(asset.size)} · {formatDate(asset.lastModified)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(asset)}
                      className="w-9 h-9 rounded-lg bg-[#13101F] border border-[#1E293B] flex items-center justify-center text-[#64748B] hover:text-[#818CF8] hover:border-[#475569] transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
