"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getModelsByTaskType, getEtaSeconds } from "@/lib/providers/config";
import { getVideoCreditCost } from "@/lib/credits/model-costs";
import { useAuth } from "@/components/auth-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Upload,
  Play,
  ChevronDown,
  ChevronRight,
  Wand2,
  Sparkles,
  Image,
  Video,
  Layers,
  Clock,
  Zap,
  Eye,
  Palette,
  Music,
  Layers2,
  User,
  Camera,
  Briefcase,
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
  Crown,
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
      { icon: Image, label: "Image to Video", href: "/tools/image-to-video", active: true, badge: null },
      { icon: Video, label: "Text to Video", href: "/tools/text-to-video", active: false, badge: null },
      { icon: Layers, label: "Video to Video", href: "/tools/video-to-video", active: false, badge: null },
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
      { icon: Briefcase, label: "Use cases", href: "/solutions/ai-video-generator", active: false, badge: null },
      { icon: Paintbrush, label: "Effects", href: "/generate", active: false, badge: null },
      { icon: Handshake, label: "Affiliate", href: "mailto:support@imgvex.com?subject=Affiliate%20Program%20Inquiry", active: false, badge: null },
      { icon: Tag, label: "Price", href: "/pricing", active: false, badge: "50% OFF" },
      { icon: Link2, label: "API", href: "/api", active: false, badge: null },
    ],
  },
];

const models = getModelsByTaskType("image-to-video");

const videoRatios = ["16:9", "9:16", "4:3", "3:4", "1:1", "21:9"];

const featureCards = [
  {
    title: "Turn Photos into Motion Visuals",
    desc: "With Image to Video, your still images become animated experiences. Simply upload a photo, and our AI adds dynamic camera movements, transitions, and cinematic effects — ideal for Photo Animation and storytelling.",
    image: "left",
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Image,
    iconColor: "#818CF8",
  },
  {
    title: "Studio-Quality Results from a Single Image",
    desc: "Achieve professional-quality visuals without any editing. Whether it's product shots, wedding photos, or illustrations, the system renders each frame with sharpness, lighting, and artistic detail.",
    image: "right",
    gradient: "linear-gradient(135deg, rgba(20,184,166,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Camera,
    iconColor: "#14B8A6",
  },
  {
    title: "Smart Audio Integration for Immersive Feel",
    desc: "Add ambient sound, music, or even generated narration that matches the theme of your visuals. With perfectly synced audio, your Photo-to-Video content feels complete and polished.",
    image: "left",
    gradient: "linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Music,
    iconColor: "#EC4899",
  },
  {
    title: "Style-Aware Scene Animation",
    desc: "The AI doesn't just animate — it understands visual mood and applies matching motion, tone, and pacing. Ideal for dramatic zooms, dreamy pans, or subtle movements based on the image's content.",
    image: "right",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Palette,
    iconColor: "#F59E0B",
  },
];

const howToSteps = [
  { step: 1, title: "Sign Up or Log In", desc: "Get started by creating a free account or logging in." },
  { step: 2, title: "Access Image to Video", desc: "Navigate to the Image to Video tool from your dashboard." },
  { step: 3, title: "Upload Your Image", desc: "Upload a JPG or PNG image. Portraits, landscapes, product shots, and illustrations are all supported." },
  { step: 4, title: "Write a Prompt", desc: "Enter a brief prompt describing the desired video — camera movements, style, mood, and duration." },
  { step: 5, title: "Generate & Export", desc: "Click Generate. AI interprets your prompt and transforms your image into a complete short-form video." },
];

const whoCanBenefit = [
  { icon: Palette, title: "Visual Storytellers & Artists", desc: "Bring creative visions to life by adding depth and movement to static scenes or illustrations." },
  { icon: Briefcase, title: "Social Media Creators", desc: "Upgrade your feed with animated image content that stands out in a crowded scroll." },
  { icon: User, title: "Educators & Presenters", desc: "Convert educational diagrams or slides into engaging visual aids that captivate attention." },
  { icon: Camera, title: "Product Designers & Brand Marketers", desc: "Turn product images into slick visual presentations for ads, landing pages, and ecommerce." },
  { icon: Heart, title: "Wedding & Portrait Photographers", desc: "Transform still portraits into animated memories — no editing skills required." },
  { icon: Layers2, title: "Content Agencies", desc: "Scale video production by converting image assets into motion content at scale." },
];

const faqs = [
  {
    q: "What is the Image to Video Generator?",
    a: "imgvex.AI Image to Video Generator is a powerful tool that transforms your images into dynamic videos using advanced AI technology. It's perfect for creating storytelling videos, product showcases, and social media content.",
  },
  {
    q: "Do I need any design skills to use the Image to Video tool?",
    a: "No design skills are required. Simply upload your images, enter your desired video effects, and let the Image to Video tool automatically generate a professional-quality video for you.",
  },
  {
    q: "Can I customize the style or look of the Image to Video results?",
    a: "Yes, you can write your own creative prompts or specify the style you want to achieve, giving you full control over the final video's appearance.",
  },
  {
    q: "What types of images work best for the Image to Video Generator?",
    a: "High-quality, clear images work best to produce stunning videos. You can use photos, artwork, AI-generated images, or any creative visuals.",
  },
  {
    q: "How long does it take to generate a video with the Image to Video tool?",
    a: "Videos are generated within minutes depending on the length and complexity of your input images and prompts.",
  },
  {
    q: "Can I use the Image to Video generated videos for commercial purposes?",
    a: "Yes, you can use the Image to Video tool output for commercial projects such as advertisements, social media campaigns, and presentations.",
  },
];

const discoverLinks = [
  { label: "Text to Video", href: "/tools/text-to-video" },
  { label: "Video to Video", href: "/tools/video-to-video" },
  { label: "Text to Image", href: "/tools/text-to-image" },
  { label: "Image to Image", href: "/tools/image-to-image" },
  { label: "Text to Speech", href: "/generate" },
  { label: "AI Avatar", href: "/generate" },
  { label: "Sora Pro 2K", href: "/generate" },
  { label: "Veo 3.1", href: "/generate" },
];

/* ─── Animation variants ─── */

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

export default function ImageToVideoPage() {
  const [selectedModel, setSelectedModel] = useState("seedance-2.0-r2v");
  const [channelVersion, setChannelVersion] = useState<"v1" | "v2">("v1");
  const [referenceMode, setReferenceMode] = useState("reference");
  const [videoRatio, setVideoRatio] = useState("16:9");
  const [prompt, setPrompt] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [inputUrl, setInputUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { refreshCredits } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([]);
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [genError, setGenError] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const providerRef = useRef("");
  const taskTypeRef = useRef("image-to-video");

  const etaSeconds = getEtaSeconds(selectedModel);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const handleGenerate = async () => {
    if (!user) {
      router.push(`/auth?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!prompt.trim()) {
      setGenError("Please enter a prompt");
      return;
    }
    setGenError("");
    setIsGenerating(true);
    setGeneratedVideos([]);
    setTaskStatus("Submitting...");
    setProgress(0);

    try {
      const body: Record<string, any> = {
        taskType: "text-to-video",
        model: selectedModel,
        prompt: prompt.trim(),
      };
      if (inputUrl) {
        body.inputUrls = [inputUrl];
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
      refreshCredits();
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

  const creditCost = getVideoCreditCost(selectedModel);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
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

      setInputUrl(data.downloadUrl);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
      setInputUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files].slice(0, 9));
      uploadToR2(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files].slice(0, 9));
      uploadToR2(files[0]);
    }
  }, []);

  const handleRemoveFiles = () => {
    setUploadedFiles([]);
    setInputUrl(null);
    setUploadError("");
  };

  const currentModel = models.find((m) => m.id === selectedModel);

  return (
    <div className="min-h-screen bg-[#0B0817]">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-[#6366F1]/20 via-[#8B5CF6]/20 to-[#6366F1]/20 border-b border-[#1E293B]">
        <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#F59E0B] text-[#0B0817] text-[10px] font-bold">SALE</span>
            <span className="text-[#CBD5E1] font-medium">The Unbeatable Lowest Price</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[#94A3B8]">
            <span>Seedance 2.0: As low as</span>
            <span className="text-[#F59E0B] font-semibold">$0.345</span>
            <span>per video</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[#94A3B8]">
            <span>Veo 3.1 Lite: As low as</span>
            <span className="text-[#F59E0B] font-semibold">$0.0575</span>
            <span>per video</span>
          </div>
        </div>
      </div>

      <Navbar variant="app" />

      {/* ─── Workbench ─── */}
      <div className="flex gap-4 py-4 pr-4">
        {/* Left Sidebar */}
        <aside className="sticky top-[60px] self-start h-[calc(100vh-60px)] w-[200px] flex-shrink-0 rounded-r-2xl border-y border-r border-[#1E293B] bg-[#0A0A12] hidden lg:flex flex-col mt-[-56px]">
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
                          ? "bg-[rgba(99,102,241,0.12)] text-[#6366F1] font-medium"
                          : "text-[#94A3B8] hover:bg-[rgba(148,163,184,0.06)] hover:text-[#F8FAFC]"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${item.active ? "text-[#6366F1]" : "text-[#64748B]"}`} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            item.badge === "Hot"
                              ? "bg-[#EF4444]/15 text-[#EF4444]"
                              : item.badge === "New"
                              ? "bg-[#14B8A6]/15 text-[#14B8A6]"
                              : "bg-[#F59E0B]/15 text-[#F59E0B]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div key={section.label} className="px-3 mb-1">
                <Link
                  href={section.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-full text-[13px] text-[#94A3B8] hover:bg-[rgba(148,163,184,0.06)] hover:text-[#F8FAFC] transition-colors"
                >
                  <section.icon className="w-4 h-4 text-[#64748B]" />
                  {section.label}
                </Link>
              </div>
            )
          )}
          </div>
          {/* Upgrade now button */}
          <div className="p-3 border-t border-[#1E293B]">
            <Button className="w-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F52E6] hover:to-[#7C4FE0] text-white font-semibold text-[13px] h-10 transition-all" asChild>
              <Link href="/pricing">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade now
              </Link>
            </Button>
          </div>
        </aside>

        {/* Center: Generation Panel */}
        <main className="flex-1 min-w-0">
          <div className="flex gap-6">
            <div className="flex-1 rounded-2xl border border-[#1E293B] bg-[#0A0A12] flex flex-col max-h-[calc(100vh-76px)] mt-[-56px]">
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {/* Model Selector */}
            <div>
              <Select value={selectedModel} onValueChange={(v) => v && setSelectedModel(v)}>
                <SelectTrigger className="h-12 rounded-xl bg-[#13101F] border-[#1E293B] text-sm text-[#F8FAFC] hover:border-[#475569] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white">
                      {currentModel?.logo}
                    </div>
                    <span className="text-sm text-[#F8FAFC]">{currentModel?.name}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#13101F] border-[#1E293B]">
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-sm text-[#CBD5E1] focus:bg-[#1E293B]">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-[10px] font-bold text-white">
                          {m.logo}
                        </div>
                        {m.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Channel Version Toggle */}
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC] mb-3">Channel</p>
              <div className="flex gap-3">
                {[
                  { key: "v1" as const, label: "Ver.1 (Not Support Real People)" },
                  { key: "v2" as const, label: "Ver.2 (Support Real People)" },
                ].map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setChannelVersion(v.key)}
                    className={`flex-1 h-12 rounded-xl text-sm font-medium transition-all border ${
                      channelVersion === v.key
                        ? "bg-[rgba(99,102,241,0.12)] border-[#6366F1]/50 text-[#F8FAFC]"
                        : "bg-[#13101F] border-[#1E293B] text-[#64748B] hover:border-[#475569] hover:text-[#CBD5E1]"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Media */}
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC] mb-3">Upload Media</p>
              <Select value={referenceMode} onValueChange={(v) => v && setReferenceMode(v)}>
                <SelectTrigger className="h-11 rounded-xl bg-[#13101F] border-[#1E293B] text-sm text-[#CBD5E1] mb-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#13101F] border-[#1E293B]">
                  <SelectItem value="reference" className="text-sm text-[#CBD5E1]">Reference</SelectItem>
                  <SelectItem value="first-last" className="text-sm text-[#CBD5E1]">First & Last Frame</SelectItem>
                  <SelectItem value="style" className="text-sm text-[#CBD5E1]">Style Reference</SelectItem>
                </SelectContent>
              </Select>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                  isDragging
                    ? "border-[#6366F1] bg-[rgba(99,102,241,0.08)]"
                    : "border-[#334155] bg-[#13101F] hover:border-[#475569]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3 py-10 px-6">
                  {uploadedFiles.length > 0 ? (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {uploadedFiles.map((file, i) => (
                          <div
                            key={i}
                            className="w-16 h-16 rounded-xl bg-[#1E293B] flex items-center justify-center text-xs text-[#64748B] border border-[#334155]"
                          >
                            {file.type.startsWith("image/") ? (
                              <Image className="w-5 h-5 text-[#818CF8]" />
                            ) : file.type.startsWith("video/") ? (
                              <Video className="w-5 h-5 text-[#EC4899]" />
                            ) : (
                              <Music className="w-5 h-5 text-[#14B8A6]" />
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-[#64748B]">
                        {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} uploaded
                      </p>
                      <p className="text-xs text-[#475569]">
                        Click or drag to add more
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-[#1E293B] flex items-center justify-center">
                        <Upload className="w-5 h-5 text-[#64748B]" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-[#CBD5E1]">Drag or Upload</p>
                        <p className="text-xs text-[#64748B] mt-1">
                          image(0/9) · video(0/3) · audio(0/3)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {isUploading && (
                <div className="flex items-center gap-2 text-[#CBD5E1] mt-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-xs">Uploading...</span>
                </div>
              )}
              {uploadError && (
                <p className="text-xs text-red-400 mt-2">{uploadError}</p>
              )}
              {uploadedFiles.length > 0 && (
                <button
                  onClick={handleRemoveFiles}
                  disabled={isUploading}
                  className="text-xs text-[#64748B] hover:text-[#F8FAFC] mt-2 disabled:opacity-50"
                >
                  Remove all files
                </button>
              )}

              {/* Select Creations hint */}
              <button className="flex items-center gap-2 mx-auto mt-3 text-sm text-[#64748B] hover:text-[#CBD5E1] transition-colors">
                <Clock className="w-4 h-4" />
                <span className="underline">Select Creations</span>
              </button>
            </div>

            {/* Prompt */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-[#F8FAFC]">Prompt</p>
                <button className="flex items-center gap-1.5 text-sm text-[#818CF8] hover:text-[#6366F1] transition-colors">
                  <Wand2 className="w-3.5 h-3.5" />
                  Translate
                </button>
              </div>
              <div className="relative rounded-2xl border border-[#1E293B] bg-[#13101F] overflow-hidden focus-within:border-[#6366F1] focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] transition-all">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Reference Mode: Upload 1-12 references, enter text, freely combine images, text, audio, and video.&#10;E.g.: @image1 imitate @video1 motion, tone reference @audio1&#10;&#10;First & Last Frame Mode: Upload 1-2 images and prompt to generate a video."
                  className="w-full min-h-[140px] p-4 pb-14 bg-transparent text-sm text-[#CBD5E1] placeholder:text-[#475569] resize-none outline-none"
                />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <button className="flex items-center gap-1.5 text-sm text-[#818CF8] hover:text-[#6366F1] transition-colors">
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate With AI
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-md text-[#475569] hover:text-[#94A3B8] transition-colors" title="Copy">
                      <Layers className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#64748B] mt-2">
                If you're not satisfied, you can generate again or enter prompt for your own.
              </p>
            </div>

            {/* Video Ratio */}
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC] mb-3">Video Ratio</p>
              <div className="flex flex-wrap gap-2">
                {videoRatios.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setVideoRatio(ratio)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                      videoRatio === ratio
                        ? "bg-[rgba(99,102,241,0.15)] border-[#6366F1]/40 text-[#F8FAFC]"
                        : "bg-[#13101F] border-[#1E293B] text-[#64748B] hover:border-[#475569] hover:text-[#CBD5E1]"
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

          </div>
          <div className="px-6 py-4 border-t border-[#1E293B] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-[#64748B]">
              <Layers className="w-4 h-4 text-[#818CF8]" />
              <span>Required credits:</span>
              <span className="font-semibold text-[#F8FAFC]">{creditCost}</span>
              {isGenerating && (
                <span className="text-xs text-[#64748B] ml-auto">{progress}%</span>
              )}
            </div>
            {isGenerating && (
              <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full transition-all duration-500 ease-out"
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
              className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E0] hover:to-[#7C4FE0] text-white font-semibold text-[15px] transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {authLoading
                ? "Checking..."
                : !user
                ? "Sign in to Generate"
                : isGenerating
                ? "Generating..."
                : "Generate"}
            </Button>
            {!user && !authLoading && (
              <p className="text-xs text-center text-[#64748B]">
                Please{" "}
                <Link href="/auth" className="text-[#818CF8] hover:underline">
                  sign in
                </Link>{" "}
                to generate videos
              </p>
            )}
          </div>
        </div>
        <div className="flex-1">

        {/* Right: Preview Panel */}
        <aside className="flex-1 rounded-2xl border border-[#1E293B] bg-[#0A0A12] flex flex-col">
          <div className="p-4 border-b border-[#1E293B]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Sample Video</h3>
              <span className="px-2.5 py-1 rounded-full bg-[rgba(99,102,241,0.12)] border border-[#6366F1]/30 text-[11px] text-[#818CF8]">
                {currentModel?.name}: Fast Generation, No Queue
              </span>
            </div>
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
                  <div className="absolute inset-0 opacity-30" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(20,184,166,0.2) 100%)" }} />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[rgba(99,102,241,0.2)] border border-[#6366F1]/30 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#818CF8] border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-xs text-[#64748B]">{taskStatus || "Generating..."}</p>
                  </div>
                </>
              ) : (
                <>
                  {/* Video thumbnail placeholder */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: "linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(20,184,166,0.2) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[rgba(99,102,241,0.2)] border border-[#6366F1]/30 flex items-center justify-center cursor-pointer hover:bg-[rgba(99,102,241,0.3)] transition-colors">
                      <Play className="w-6 h-6 text-[#818CF8] ml-1" />
                    </div>
                    <p className="text-xs text-[#64748B]">Sample preview will appear here</p>
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E293B]">
                    <div className="h-full w-1/3 bg-[#6366F1] rounded-full" />
                  </div>
                  {/* Controls */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <span className="text-[10px] text-[#64748B]">0:00 / 0:05</span>
                    <div className="flex items-center gap-3">
                  <button className="text-[#64748B] hover:text-[#CBD5E1] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  </button>
                  <button className="text-[#64748B] hover:text-[#CBD5E1] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                  </button>
                  <button className="text-[#64748B] hover:text-[#CBD5E1] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside></div></div>

      {/* ─── Marketing Content ─── */}
      <div className="border-t border-[#1E293B]">
        {/* Features */}
        <section className="py-20 px-6 md:px-12">
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-col gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
                The Features of AI Video Generator for Image to Video
              </h2>
            </motion.div>

            {featureCards.map((card, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`flex flex-col ${card.image === "right" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 items-center`}
              >
                <div className="flex-1 flex flex-col gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${card.iconColor}15` }}
                  >
                    <card.icon className="w-6 h-6" style={{ color: card.iconColor }} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#F8FAFC]">{card.title}</h3>
                  <p className="text-base text-[#94A3B8] leading-relaxed">{card.desc}</p>
                </div>
                <div
                  className="flex-1 w-full aspect-[16/10] rounded-3xl border border-[#1E293B] flex items-center justify-center relative overflow-hidden"
                  style={{ background: card.gradient }}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <card.icon className="w-8 h-8 text-white/80" />
                    </div>
                    <p className="text-sm text-white/60">Feature Preview</p>
                  </div>
                  {/* Play button overlay */}
                  <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

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
              How to Use the AI Video Generator for Image to Video
            </motion.h2>

            <motion.div variants={fadeInUp} className="flex flex-col gap-0">
              {howToSteps.map((s, i) => (
                <div key={i} className="flex gap-6 relative">
                  {/* Connector line */}
                  {i < howToSteps.length - 1 && (
                    <div className="absolute left-[19px] top-[48px] w-px h-[calc(100%-24px)] bg-[#1E293B]" />
                  )}
                  <div className="w-10 h-10 rounded-full bg-[#6366F1]/15 border border-[#6366F1]/30 flex items-center justify-center text-sm font-bold text-[#818CF8] shrink-0">
                    {s.step}
                  </div>
                  <div className="pb-8 flex-1">
                    <h4 className="text-base font-semibold text-[#F8FAFC]">{s.title}</h4>
                    <p className="text-sm text-[#94A3B8] mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Who Can Benefit */}
        <section className="py-20 px-6 md:px-12">
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-col gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#F8FAFC] text-center">
              Who Can Benefit from AI Video Generator for Image to Video
            </motion.h2>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {whoCanBenefit.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 p-6 rounded-2xl bg-[#0F0F1A] border border-[#1E293B] hover:border-[#475569] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[rgba(99,102,241,0.12)] flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#818CF8]" />
                  </div>
                  <h4 className="text-base font-semibold text-[#F8FAFC]">{item.title}</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{item.desc}</p>
                </div>
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
              Frequently Asked Questions About AI Video Generator for Image to Video
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

        {/* Discover More */}
        <section className="py-16 px-6 md:px-12">
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-col gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-[#F8FAFC] text-center">
              Discover More
            </motion.h2>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              {discoverLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#13101F] border border-[#1E293B] text-sm text-[#64748B] hover:border-[#475569] hover:text-[#CBD5E1] transition-colors"
                >
                  {link.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 md:px-12 bg-[#06060A]">
          <motion.div
            className="max-w-[800px] mx-auto text-center flex flex-col items-center gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
              Get Started with AI Video Generator for Image to Video
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base text-[#94A3B8] max-w-[520px]">
              Whether you're creating product ads, animated portraits, or social content — this AI-powered tool makes it fast and effortless.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-8 h-12"
                asChild
              >
                <Link href="/generate">
                  Get Premium
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        <Footer />
      </div>
      </main>
      </div>
    </div>
  );
}
