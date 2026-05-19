"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getModelsByTaskType, getEtaSeconds } from "@/lib/providers/config";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Play,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Image,
  Video,
  Layers,
  Clock,
  Zap,
  Eye,
  Music,
  User,
  Camera,
  Heart,
  ArrowRight,
  Home,
  Link2,
  Paintbrush,
  Clapperboard,
  Copy,
  Type,
  Mic,
  MessageSquare,
  VolumeX,
  Keyboard,
  Headphones,
  Handshake,
  FolderOpen,
  Tag,
  Newspaper,
  Upload,
  X,
  Star,
  Briefcase,
  Crown,
  Wand2,
} from "lucide-react";

/* ─── Types ─── */

interface SidebarLink {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active: boolean;
}

interface SidebarCategory {
  category: string;
  items: (SidebarLink & { badge?: string | null })[];
}

type SidebarItem = SidebarLink | SidebarCategory;

function isCategory(item: SidebarItem): item is SidebarCategory {
  return "category" in item;
}

/* ─── Data ─── */

const sidebarTools: SidebarItem[] = [
  { icon: Home, label: "Home", href: "/", active: false },
  { icon: Sparkles, label: "Create", href: "/generate", active: false },
  {
    category: "AI Video",
    items: [
      { icon: Image, label: "Image to Video", href: "/tools/image-to-video", active: false, badge: null },
      { icon: Video, label: "Text to Video", href: "/tools/text-to-video", active: false, badge: null },
      { icon: Layers, label: "Video to Video", href: "/tools/video-to-video", active: true, badge: null },
    ],
  },
  {
    category: "AI Image",
    items: [
      { icon: Type, label: "Text to Image", href: "/tools/text-to-image", active: false, badge: null },
      { icon: Copy, label: "Image to Image", href: "/tools/image-to-image", active: false, badge: null },
    ],
  },
  {
    category: "",
    items: [
      { icon: Briefcase, label: "Use cases", href: "#", active: false, badge: null },
      { icon: Paintbrush, label: "Effects", href: "#", active: false, badge: null },
      { icon: Handshake, label: "Affiliate", href: "#", active: false, badge: null },
      { icon: Tag, label: "Price", href: "/pricing", active: false, badge: "50% OFF" },
      { icon: Link2, label: "API", href: "#", active: false, badge: null },
    ],
  },
];

const stylePresets = [
  { id: "anime", name: "Anime", color: "#EC4899" },
  { id: "pixar", name: "Disney Pixar", color: "#F59E0B" },
  { id: "clay", name: "Claymation", color: "#8B5CF6" },
  { id: "pixel", name: "Pixel Art", color: "#14B8A6" },
  { id: "pop", name: "Pop Art", color: "#6366F1" },
  { id: "pencil", name: "Pencil", color: "#64748B" },
];

const featureSections = [
  {
    title: "Reimagine Your Videos with Video to Video AI",
    desc: "Turn videos into eye-catching clips with our video to video AI. Choose from diverse effects and styles — anime, clay cartoon, Pixar — and transform them into masterpieces effortlessly.",
    icon: Sparkles,
    iconColor: "#818CF8",
  },
  {
    title: "Explore Diverse Filters and Effects",
    desc: "Unlock a world of creativity with our video style transfer! Whether you're looking for a stylistic, vibrant anime or nostalgic pixel art, you can easily change the look and feel of your videos.",
    icon: Paintbrush,
    iconColor: "#EC4899",
  },
  {
    title: "Stylize AI Dance Videos Creatively",
    desc: "Transform your dance videos into unique visual experiences! Our video to video AI generator helps you recreate your dance videos in a multitude of styles, from stylized animations to edgy graphics.",
    icon: Music,
    iconColor: "#14B8A6",
  },
  {
    title: "Every Move Preserved with Video to Video AI",
    desc: "Our AI video to video technology intelligently tracks motion and preserves the natural flow of your original footage. No matter how complex the movement, the transformed output maintains fluid, realistic motion.",
    icon: Camera,
    iconColor: "#F59E0B",
  },
];

const howToSteps = [
  { step: 1, title: "Upload Your Video", desc: "Upload a video file (MP4, MOV supported; max 50MB). Free users: 3-5 seconds. Paid users: up to 60 seconds." },
  { step: 2, title: "Choose a Style", desc: "Select from 70+ visual styles including anime, Pixar, claymation, pixel art, and more. Preview the effect before generating." },
  { step: 3, title: "Generate & Download", desc: "Click Create and watch the AI transform your video. Download in your preferred resolution and format." },
];

const relatedTools = [
  { name: "Image to Video", desc: "Animate any photo", href: "/tools/image-to-video" },
  { name: "Text to Video", desc: "Prompt-to-video", href: "/tools/text-to-video" },
  { name: "AI Video Generator", desc: "Full AI creation suite", href: "/generate" },
  { name: "Reference to Video", desc: "Style-based generation", href: "#" },
];

const faqs = [
  {
    q: "What is Video to Video AI?",
    a: "Video to Video AI transforms your existing videos into new visual styles using artificial intelligence. Upload any video and apply styles like anime, Pixar, claymation, pixel art, and more.",
  },
  {
    q: "What video formats are supported?",
    a: "We support MP4 and MOV formats. The maximum file size is 50MB for free users and 200MB for paid subscribers.",
  },
  {
    q: "How long can my input video be?",
    a: "Free users can upload videos of 3-5 seconds in length. Paid users can create videos of 3 to 60 seconds depending on their subscription tier.",
  },
  {
    q: "How many styles are available?",
    a: "We offer 70+ visual styles including anime, Disney Pixar, claymation, pixel art, pop art, pencil sketch, and many more. New styles are added regularly.",
  },
  {
    q: "Will the motion in my video be preserved?",
    a: "Yes, our AI intelligently tracks and preserves the natural motion and flow of your original video while applying the new visual style.",
  },
  {
    q: "Can I use the transformed videos commercially?",
    a: "Yes, all transformed videos on paid plans come with full commercial usage rights. Free plan outputs include a watermark.",
  },
];

const footerLinks: Record<string, { label: string; href: string }[]> = {
  "Creative Tools": [
    { label: "AI Video Generator", href: "/generate" },
    { label: "Text to Video AI", href: "/tools/text-to-video" },
    { label: "Image to Video AI", href: "/tools/image-to-video" },
    { label: "AI Photo Editor", href: "#" },
    { label: "AI Video Extender", href: "#" },
    { label: "Mimic Motion", href: "#" },
  ],
  "Video Models": [
    { label: "Pollo 2.5", href: "#" },
    { label: "Veo 3", href: "#" },
    { label: "Sora 2", href: "#" },
    { label: "Kling 3.0", href: "#" },
    { label: "Seanceance 2.0", href: "#" },
    { label: "Runway", href: "#" },
  ],
  "Image Models": [
    { label: "GPT Image 2", href: "#" },
    { label: "Nano Banana 2", href: "#" },
    { label: "Recraft", href: "#" },
    { label: "Ideogram", href: "#" },
    { label: "Stable Diffusion", href: "#" },
    { label: "Flux AI", href: "#" },
  ],
  "Apps": [
    { label: "Clone Viral Video", href: "#" },
    { label: "UGC Video Ads", href: "#" },
    { label: "Anime Video", href: "#" },
    { label: "Story Video", href: "#" },
    { label: "Music Video", href: "#" },
    { label: "News Video", href: "#" },
  ],
  "Company": [
    { label: "About Us", href: "#" },
    { label: "Contact Us", href: "mailto:support@imgvex.com?subject=Contact%20imgvex.AI" },
    { label: "Pricing", href: "/pricing" },
    { label: "API", href: "#" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
};

/* ─── Animation ─── */

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Components ─── */

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-[#1E293B] rounded-2xl overflow-hidden bg-[#0F0F1A]">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-5 text-left">
        <span className="text-sm font-medium text-[#F8FAFC]">{q}</span>
        <ChevronDown className={`w-4 h-4 text-[#64748B] shrink-0 ml-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="px-5 pb-5"
        >
          <p className="text-sm text-[#94A3B8] leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Page ─── */

const models = getModelsByTaskType("text-to-video");

export default function VideoToVideoPage() {
  const [selectedStyle, setSelectedStyle] = useState("anime");
  const [selectedModel, setSelectedModel] = useState("seedance-2.0-r2v");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([]);
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [genError, setGenError] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const providerRef = useRef("");
  const taskTypeRef = useRef("image-to-video");
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [inputVideoUrl, setInputVideoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const etaSeconds = getEtaSeconds(selectedModel);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const uploadToR2 = async (file: File) => {
    setIsUploading(true);
    setUploadError("");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const putRes = await fetch(data.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Failed to upload to storage");

      setInputVideoUrl(data.downloadUrl);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
      setInputVideoUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && (files[0].type.startsWith("video/") || files[0].type.startsWith("image/"))) {
      setUploadedVideo(files[0]);
      uploadToR2(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && (files[0].type.startsWith("video/") || files[0].type.startsWith("image/"))) {
      setUploadedVideo(files[0]);
      uploadToR2(files[0]);
    }
  };

  const handleRemoveVideo = () => {
    setUploadedVideo(null);
    setInputVideoUrl(null);
    setUploadError("");
  };

  const handleGenerate = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!inputVideoUrl) {
      setGenError("Please upload a video first");
      return;
    }
    setGenError("");
    setIsGenerating(true);
    setGeneratedVideos([]);
    setTaskStatus("Submitting...");
    setProgress(0);

    try {
      const styleName = stylePresets.find((s) => s.id === selectedStyle)?.name || selectedStyle;
      const body: Record<string, any> = {
        taskType: "text-to-video",
        model: selectedModel,
        prompt: `Transform this video to ${styleName} style`,
      };
      if (inputVideoUrl) {
        body.inputUrls = [inputVideoUrl];
      }
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || `Failed: ${res.status}`);
      }
      const taskId = data.data?.task_id;
      const provider = data.data?.provider || "";
      providerRef.current = provider;
      taskTypeRef.current = "text-to-video";
      if (!taskId) {
        throw new Error("No task_id returned");
      }

      const etaSeconds = getEtaSeconds(selectedModel);
      const startTime = Date.now();
      let attempts = 0;
      const maxAttempts = 120;

      const poll = async () => {
        if (attempts >= maxAttempts) {
          setGenError("Generation timed out");
          setIsGenerating(false);
          setProgress(0);
          return;
        }
        attempts++;

        const elapsed = (Date.now() - startTime) / 1000;
        const rawProgress = Math.min((elapsed / etaSeconds) * 100, 95);
        setProgress(Math.round(rawProgress));

        const pollRes = await fetch(`/api/generate/status?taskId=${taskId}&provider=${providerRef.current}&taskType=${taskTypeRef.current}`);
        const pollData = await pollRes.json();
        const status = pollData.data?.status || pollData.status || "unknown";

        const remaining = Math.max(0, Math.ceil(etaSeconds - elapsed));
        const statusText =
          status === "pending"
            ? `Queued... ~${remaining}s`
            : status === "processing"
            ? `Generating... ~${remaining}s`
            : status;
        setTaskStatus(statusText);

        if (status === "completed" || status === "success") {
          const results = pollData.data?.result || pollData.result || [];
          const urls = Array.isArray(results)
            ? results.map((r: any) => (typeof r === "string" ? r : r.url)).filter(Boolean)
            : [];
          setGeneratedVideos(urls);
          setProgress(100);
          setIsGenerating(false);
          return;
        }
        if (status === "failed" || status === "error") {
          setGenError(pollData.data?.error || pollData.error || "Generation failed");
          setIsGenerating(false);
          setProgress(0);
          return;
        }
        const delay = attempts < 3 ? 1500 : attempts < 10 ? 3000 : 5000;
        setTimeout(poll, delay);
      };
      poll();
    } catch (err: any) {
      setGenError(err.message || "Generation failed");
      setIsGenerating(false);
      setTaskStatus("");
    }
  };

  const creditCost = 45;

  return (
    <div className="min-h-screen bg-[#0B0817]">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-[#6366F1]/20 via-[#8B5CF6]/20 to-[#6366F1]/20 border-b border-[#1E293B]">
        <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#F59E0B] text-[#0B0817] text-[10px] font-bold">SALE</span>
            <span className="text-[#CBD5E1] font-medium">The Unbeatable Lowest Price</span>
          </div>
        </div>
      </div>

      <Navbar variant="app" />

      {/* ─── Workbench ─── */}
      <div className="flex h-[calc(100vh-60px-40px)] min-h-[640px]">
        {/* Left Sidebar */}
        <aside className="w-[220px] flex-shrink-0 border-r border-[#1E293B] bg-[#0A0A12] hidden lg:flex flex-col">
          <div className="flex-1 overflow-y-auto py-4">
          {sidebarTools.map((section, idx) =>
            isCategory(section) ? (
              <div key={section.category || `bottom-${idx}`} className="px-3 mb-3">
                {!section.category && <div className="h-px bg-[#1E293B] mb-3" />}
                {section.category && (
                  <p className="text-[11px] font-medium text-[#64748B] px-3 py-1.5">{section.category}</p>
                )}
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-full text-[13px] transition-colors ${
                        item.active
                          ? "bg-[rgba(236,72,153,0.12)] text-[#EC4899] font-medium"
                          : "text-[#94A3B8] hover:bg-[rgba(148,163,184,0.06)] hover:text-[#F8FAFC]"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${item.active ? "text-[#EC4899]" : "text-[#64748B]"}`} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.badge === "Hot" ? "bg-[#EF4444]/15 text-[#EF4444]" : item.badge === "New" ? "bg-[#14B8A6]/15 text-[#14B8A6]" : "bg-[#F59E0B]/15 text-[#F59E0B]"}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div key={section.label} className="px-3 mb-1">
                <Link href={section.href} className="flex items-center gap-2.5 px-3 py-2 rounded-full text-[13px] text-[#94A3B8] hover:bg-[rgba(148,163,184,0.06)] hover:text-[#F8FAFC] transition-colors">
                  <section.icon className="w-4 h-4 text-[#64748B]" />
                  {section.label}
                </Link>
              </div>
            )
          )}
          </div>
          {/* Upgrade now button */}
          <div className="p-3 border-t border-[#1E293B]">
            <Button className="w-full rounded-full bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:from-[#D4377E] hover:to-[#7C4FE0] text-white font-semibold text-[13px] h-10 transition-all" asChild>
              <Link href="/pricing">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade now
              </Link>
            </Button>
          </div>
        </aside>

        {/* Center: Upload + Style Panel */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-[640px] mx-auto flex flex-col gap-5">
            <div>
              <p className="text-lg font-bold text-[#F8FAFC] mb-1">Video to Video</p>
              <p className="text-sm text-[#64748B]">Upload Video</p>
            </div>

            {/* Model Selector */}
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC] mb-3">Model</p>
              <div className="flex flex-wrap gap-2">
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                      selectedModel === m.id
                        ? "bg-[rgba(99,102,241,0.15)] border-[#6366F1]/40 text-[#F8FAFC]"
                        : "bg-[#13101F] border-[#1E293B] text-[#64748B] hover:border-[#475569] hover:text-[#CBD5E1]"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            {uploadedVideo ? (
              <div className="relative rounded-2xl border border-[#1E293B] bg-[#13101F] overflow-hidden">
                <div className="p-4">
                  <p className="text-sm text-[#CBD5E1]">{uploadedVideo.name}</p>
                </div>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleRemoveVideo}
                  disabled={isUploading}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                  isDragging ? "border-[#8B5CF6] bg-[rgba(139,92,246,0.08)]" : "border-[#334155] bg-[#13101F] hover:border-[#475569]"
                }`}
              >
                <input ref={fileInputRef} type="file" accept="video/*,image/*" onChange={handleFileSelect} className="hidden" />
                <div className="flex flex-col items-center gap-3 py-10 px-6">
                  <div className="w-12 h-12 rounded-xl bg-[#1E293B] flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#64748B]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#CBD5E1]">Upload video or drag and drop the file here</p>
                    <p className="text-xs text-[#64748B] mt-1">(MP4 and MOV formats supported; max file size: 50 MB.)</p>
                  </div>
                </div>
              </div>
            )}
            {uploadError && <p className="text-xs text-red-400 mt-2">{uploadError}</p>}

            <p className="text-xs text-[#64748B]">
              Free users can only generate videos of 3 to 5 seconds in length, while paid users can create videos of{" "}
              <span className="text-[#EC4899] font-medium">3 to 60 seconds</span>.
            </p>

            {/* Style Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-[#F8FAFC]">Style</p>
                <Link href="#" className="text-sm text-[#818CF8] hover:underline">View All (70)</Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {stylePresets.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all ${
                      selectedStyle === style.id ? "border-[#EC4899]" : "border-[#1E293B] hover:border-[#475569]"
                    }`}
                  >
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${style.color}20, ${style.color}08)` }} />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-xs text-white font-medium">{style.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Cost & Create */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Layers className="w-4 h-4 text-[#818CF8]" />
                  <span>Credits required:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#F8FAFC]">{creditCost} Credits</span>
                  {isGenerating && (
                    <span className="text-xs text-[#64748B]">{progress}%</span>
                  )}
                </div>
              </div>
              {isGenerating && (
                <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              {genError && (
                <div className="rounded-xl bg-[rgba(239,68,68,0.1)] border border-[#EF4444]/30 px-4 py-3">
                  <p className="text-sm text-[#EF4444]">{genError}</p>
                </div>
              )}
              {taskStatus && isGenerating && (
                <div className="flex items-center gap-2 text-sm text-[#818CF8]">
                  <div className="w-4 h-4 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
                  <span>{taskStatus}</span>
                </div>
              )}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || authLoading}
                className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:from-[#D4377E] hover:to-[#7C4FE0] text-white font-semibold text-[15px] transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {authLoading
                  ? "Checking..."
                  : !user
                  ? "Sign in to Create"
                  : isGenerating
                  ? "Creating..."
                  : "Create"}
              </Button>
              {!user && !authLoading && (
                <p className="text-xs text-center text-[#64748B]">
                  Please{" "}
                  <Link href="/auth" className="text-[#818CF8] hover:underline">
                    sign in
                  </Link>{" "}
                  to create videos
                </p>
              )}
            </div>
          </div>
        </main>

        {/* Right: Preview Panel */}
        <aside className="w-[480px] flex-shrink-0 border-l border-[#1E293B] bg-[#0A0A12] hidden xl:flex flex-col">
          <div className="p-4 border-b border-[#1E293B]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Video to Video AI</h3>
            </div>
            <p className="text-xs text-[#64748B] mt-1">Transform your videos into different styles with AI.</p>
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full aspect-video rounded-2xl bg-[#13101F] border border-[#1E293B] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              {generatedVideos.length > 0 ? (
                <video
                  src={generatedVideos[0]}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : isGenerating ? (
                <>
                  <div className="absolute inset-0 opacity-30" style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.3) 0%, rgba(139,92,246,0.2) 100%)" }} />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[rgba(236,72,153,0.2)] border border-[#EC4899]/30 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#EC4899] border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-xs text-[#64748B]">{taskStatus || "Creating..."}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 opacity-30" style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.3) 0%, rgba(139,92,246,0.2) 100%)" }} />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[rgba(236,72,153,0.2)] border border-[#EC4899]/30 flex items-center justify-center cursor-pointer hover:bg-[rgba(236,72,153,0.3)] transition-colors">
                      <Play className="w-6 h-6 text-[#EC4899] ml-1" />
                    </div>
                    <p className="text-xs text-[#64748B]">Upload a video to see the preview</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ─── Marketing Content ─── */}
      <div className="border-t border-[#1E293B]">
        {/* Hero Feature */}
        <section className="py-20 px-6 md:px-12">
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-col gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-bold text-[#F8FAFC]">
                Reimagine Your Videos with Video to Video AI
              </h2>
              <p className="text-base text-[#94A3B8] max-w-[640px] mx-auto">
                Turn videos into eye-catching clips with our video to video AI. Choose from diverse effects and styles — anime, clay cartoon, Pixar — and transform them into masterpieces effortlessly.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="w-full aspect-video rounded-3xl bg-[#13101F] border border-[#1E293B] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/10 via-[#8B5CF6]/10 to-[#6366F1]/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[rgba(236,72,153,0.2)] border border-[#EC4899]/30 flex items-center justify-center cursor-pointer hover:bg-[rgba(236,72,153,0.3)] transition-colors">
                  <Play className="w-7 h-7 text-[#EC4899] ml-1" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Style Filters */}
        <section className="py-20 px-6 md:px-12 bg-[#06060A]">
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-col gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center flex flex-col gap-3">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
                Explore Diverse Filters and Effects
              </h2>
              <p className="text-base text-[#94A3B8] max-w-[640px] mx-auto">
                Unlock a world of creativity with our video style transfer! Whether you're looking for a stylistic, vibrant anime or nostalgic pixel art, you can easily change the look and feel of your videos.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stylePresets.map((style) => (
                <div key={style.id} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="w-full aspect-square rounded-2xl bg-[#13101F] border border-[#1E293B] overflow-hidden relative group-hover:border-[#475569] transition-all">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${style.color}20, ${style.color}08)` }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold" style={{ color: style.color }}>{style.name.charAt(0)}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#64748B] group-hover:text-[#CBD5E1] transition-colors">{style.name}</span>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center pt-4">
              <Button className="rounded-full bg-[#13101F] hover:bg-[#1E293B] text-white font-semibold text-sm px-6 h-11 border border-[#1E293B]" asChild>
                <Link href="/generate">Try Video to Video AI</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Feature Sections */}
        {featureSections.map((section, i) => (
          <section key={i} className={`py-20 px-6 md:px-12 ${i % 2 === 1 ? "bg-[#06060A]" : ""}`}>
            <motion.div
              className="max-w-[1200px] mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={stagger}
            >
              <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1 flex flex-col gap-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${section.iconColor}15` }}>
                    <section.icon className="w-6 h-6" style={{ color: section.iconColor }} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#F8FAFC]">{section.title}</h3>
                  <p className="text-base text-[#94A3B8] leading-relaxed">{section.desc}</p>
                </div>
                <div className="flex-1 w-full aspect-video rounded-3xl bg-[#13101F] border border-[#1E293B] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-[#EC4899]/5" />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[rgba(99,102,241,0.2)] border border-[#6366F1]/30 flex items-center justify-center">
                      <Play className="w-6 h-6 text-[#818CF8] ml-1" />
                    </div>
                    <p className="text-xs text-[#64748B]">Video Preview</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </section>
        ))}

        {/* How to Use */}
        <section className="py-20 px-6 md:px-12 bg-[#06060A]">
          <motion.div
            className="max-w-[1000px] mx-auto flex flex-col gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#F8FAFC] text-center">
              How to Use Video to Video AI Generator
            </motion.h2>
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howToSteps.map((s, i) => (
                <div key={i} className="flex flex-col gap-4 p-6 rounded-2xl bg-[#0F0F1A] border border-[#1E293B]">
                  <div className="w-10 h-10 rounded-full bg-[#6366F1]/15 border border-[#6366F1]/30 flex items-center justify-center text-sm font-bold text-[#818CF8]">
                    {s.step}
                  </div>
                  <h4 className="text-base font-semibold text-[#F8FAFC]">{s.title}</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <Button className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-6 h-11" asChild>
                <Link href="/generate">Try Video to Video AI</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Related Tools */}
        <section className="py-16 px-6 md:px-12">
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-col gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-[#F8FAFC] text-center">
              Unlock the Full Potential of Other AI Video Generators
            </motion.h2>
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="flex flex-col gap-2 p-5 rounded-2xl bg-[#0F0F1A] border border-[#1E293B] hover:border-[#475569] transition-colors"
                >
                  <h4 className="text-sm font-semibold text-[#F8FAFC]">{tool.name}</h4>
                  <p className="text-xs text-[#64748B]">{tool.desc}</p>
                  <span className="text-xs text-[#818CF8] mt-1 flex items-center gap-1">
                    Try Now <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6 md:px-12 bg-[#06060A]">
          <motion.div
            className="max-w-[800px] mx-auto flex flex-col gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#F8FAFC] text-center">
              Frequently Asked Questions
            </motion.h2>
            <motion.div variants={fadeInUp} className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  q={faq.q}
                  a={faq.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 md:px-12">
          <motion.div
            className="max-w-[800px] mx-auto text-center flex flex-col items-center gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
              Give Your Video a Makeover Now
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base text-[#94A3B8] max-w-[520px]">
              Transform any video into stunning AI-generated styles. Upload once, create endlessly.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button className="rounded-full bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:from-[#D4377E] hover:to-[#7C4FE0] text-white font-semibold text-sm px-8 h-12 transition-all" asChild>
                <Link href="/generate">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try Video to Video AI Free
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 md:px-12 bg-[#040408]">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-12 mb-10">
              <div className="max-w-[280px]">
                <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">imgvex.AI</h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  The unified console for AI video and image generation. Built for creators who demand precision.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                {Object.entries(footerLinks).map(([title, links]) => (
                  <div key={title} className="flex flex-col gap-2.5">
                    <h4 className="text-[13px] font-semibold text-[#F8FAFC]">{title}</h4>
                    {links.map((link) => (
                      <Link key={link.label} href={link.href} className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-px bg-[#1E293B] mb-6" />
            <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs text-[#475569]">
              <span>© 2026 imgvex.AI. All rights reserved.</span>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:text-[#64748B] transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-[#64748B] transition-colors">Terms</Link>
                <a href="#" className="hover:text-[#64748B] transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
