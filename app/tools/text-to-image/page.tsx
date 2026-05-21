"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getModelsByTaskType, getEtaSeconds } from "@/lib/providers/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
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
  Wand2,
  Download,
  Share2,
  Star,
  Check,
  CheckCircle2,
  Trash2,
  Files,
  Maximize2,
  X,
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
      { icon: Image, label: "Image to Video", href: "/tools/image-to-video", active: false, badge: null },
      { icon: Video, label: "Text to Video", href: "/tools/text-to-video", active: false, badge: null },
      { icon: Layers, label: "Video to Video", href: "/tools/video-to-video", active: false, badge: null },
    ],
  },
  {
    category: "AI Image",
    items: [
      { icon: Type, label: "Text to Image", href: "/tools/text-to-image", active: true, badge: null },
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

const models = getModelsByTaskType("text-to-image");

const supportedModelTags = [
  { name: "Nano Banana", color: "#F59E0B" },
  { name: "Nano Banana Pro", color: "#14B8A6" },
  { name: "Nano Banana 2", color: "#EC4899" },
  { name: "GPT Image 2.0", color: "#6366F1" },
  { name: "GPT Image 1.5", color: "#8B5CF6" },
  { name: "Grok", color: "#EF4444" },
  { name: "Ideogram", color: "#06B6D4" },
  { name: "Flux", color: "#10B981" },
  { name: "Midjourney", color: "#F97316" },
];

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"];

const imageExamples = [
  { id: "1", title: "Cyberpunk City", style: "Cinematic", aspect: "16:9" },
  { id: "2", title: "Fantasy Portrait", style: "Anime", aspect: "3:4" },
  { id: "3", title: "Product Shot", style: "Realistic", aspect: "1:1" },
  { id: "4", title: "Abstract Art", style: "Oil Painting", aspect: "1:1" },
  { id: "5", title: "Space Explorer", style: "3D Render", aspect: "9:16" },
  { id: "6", title: "Nature Scene", style: "Cinematic", aspect: "16:9" },
  { id: "7", title: "Character Design", style: "Anime", aspect: "3:4" },
  { id: "8", title: "Architectural", style: "Realistic", aspect: "4:3" },
  { id: "9", title: "Retro Poster", style: "Pop Art", aspect: "2:3" },
];

const featureCards = [
  {
    title: "Turn Words Into Stunning Visuals",
    desc: "Describe any scene, character, or concept — our AI transforms your text into photorealistic or stylized images in seconds. From product photography to fantasy art, anything is possible.",
    image: "left",
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Sparkles,
    iconColor: "#818CF8",
  },
  {
    title: "Multiple Art Styles at Your Fingertips",
    desc: "Choose from 50+ predefined styles including anime, oil painting, 3D render, pixel art, cinematic, and more. Each style is fine-tuned to deliver consistent, high-quality results.",
    image: "right",
    gradient: "linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Palette,
    iconColor: "#EC4899",
  },
  {
    title: "Fine-Grained Control with Negative Prompts",
    desc: "Specify exactly what you don't want in your image. Exclude elements, adjust composition, and refine outputs with precision controls like CFG scale and seed values.",
    image: "left",
    gradient: "linear-gradient(135deg, rgba(20,184,166,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Wand2,
    iconColor: "#14B8A6",
  },
  {
    title: "Commercial-Ready High Resolution",
    desc: "Generate images up to 4K resolution with full commercial usage rights. Perfect for marketing materials, social media, presentations, and print media.",
    image: "right",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Maximize2,
    iconColor: "#F59E0B",
  },
];

const howToSteps = [
  { step: 1, title: "Enter Your Prompt", desc: "Describe the image you want to create in detail. The more specific, the better the results." },
  { step: 2, title: "Select Style & Settings", desc: "Choose your preferred art style, aspect ratio, and image count. Use negative prompts to exclude unwanted elements." },
  { step: 3, title: "Generate & Download", desc: "Click Generate and watch the AI create your image. Download in your preferred resolution." },
];

const relatedTools = [
  { name: "Image to Image", desc: "Restyle & transform", href: "#" },
  { name: "AI Photo Editor", desc: "Smart editing tools", href: "#" },
  { name: "Background Remover", desc: "Clean cutouts", href: "#" },
  { name: "AI Avatar", desc: "Digital personas", href: "#" },
];

const faqs = [
  {
    q: "What is Text to Image AI?",
    a: "Text to Image AI is a technology that converts written descriptions into high-quality images using artificial intelligence. Simply describe what you want to see, and the AI generates a matching image.",
  },
  {
    q: "How long does it take to generate an image?",
    a: "Most images are generated within 10-30 seconds depending on the model, resolution, and complexity. Higher resolution outputs may take slightly longer.",
  },
  {
    q: "What image resolutions are supported?",
    a: "We support 512x512, 1024x1024, 2048x2048, and up to 4K resolution depending on your subscription plan and the model you choose.",
  },
  {
    q: "Can I use the generated images commercially?",
    a: "Yes, all images generated on paid plans come with full commercial usage rights. Free plan images include a watermark and are for personal use only.",
  },
  {
    q: "What is a negative prompt?",
    a: "A negative prompt lets you specify what you don't want in the image. For example, you can exclude 'blurry, distorted, low quality' to get cleaner results.",
  },
  {
    q: "How many styles are available?",
    a: "We offer 50+ visual styles including realistic, anime, 3D render, oil painting, sketch, pop art, pixel art, cinematic, and more. New styles are added regularly.",
  },
];

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

export default function TextToImagePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("nano-banana-pro");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1K");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [genError, setGenError] = useState("");
  const [progress, setProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const providerRef = useRef("");
  const taskTypeRef = useRef("text-to-image");

  const etaSeconds = getEtaSeconds(selectedModel);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
    });
  }, []);

  const currentModel = models.find((m) => m.id === selectedModel);
  const creditCost = 2;

  const getAspectClass = (ratio: string) => {
    switch (ratio) {
      case "16:9": return "aspect-video";
      case "9:16": return "aspect-[9/16]";
      case "4:3": return "aspect-[4/3]";
      case "3:4": return "aspect-[3/4]";
      case "21:9": return "aspect-[21/9]";
      default: return "aspect-square";
    }
  };

  const mapResolution = (res: string) => {
    switch (res) {
      case "1K": return "1024x1024";
      case "2K": return "2048x2048";
      case "4K": return "4096x4096";
      default: return "1024x1024";
    }
  };

  const handleGenerate = async () => {
    console.log("[frontend-v2] handleGenerate called. user:", !!user);
    if (!user) {
      router.push(`/auth?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!prompt.trim()) {
      setGenError("Please enter a prompt");
      return;
    }
    setIsGenerating(true);
    setGenError("");
    setGeneratedImages([]);
    setTaskStatus("Submitting...");
    setProgress(0);

    try {
      // 1. Create task
      console.log("[frontend] Sending POST /api/generate");
      const createRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: "text-to-image",
          model: selectedModel,
          prompt: prompt.trim(),
          size: mapResolution(resolution),
          aspectRatio: aspectRatio,
          n: 1,
        }),
      });
      console.log("[frontend] Response status:", createRes.status);

      const createData = await createRes.json();
      console.log("[frontend] Response body:", createData);
      if (!createRes.ok) {
        throw new Error(createData.error || "Failed to create task");
      }

      const taskId = createData.data?.task_id;
      const provider = createData.data?.provider || "";
      const attempts = createData.data?.attempts || 1;
      providerRef.current = provider;
      taskTypeRef.current = "text-to-image";
      console.log("[frontend] Got taskId:", taskId, "provider:", provider, "attempts:", attempts);
      if (!taskId) {
        throw new Error("No task ID returned");
      }

      // 2. Poll for result
      const etaSeconds = getEtaSeconds(selectedModel);
      const startTime = Date.now();
      let pollAttempts = 0;
      const maxAttempts = 120;

      const poll = async () => {
        try {
          if (pollAttempts >= maxAttempts) {
            throw new Error("Generation timed out");
          }
          pollAttempts++;

          // Update progress based on elapsed time / ETA (cap at 95% until confirmed)
          const elapsed = (Date.now() - startTime) / 1000;
          const rawProgress = Math.min((elapsed / etaSeconds) * 100, 95);
          setProgress(Math.round(rawProgress));

          const statusRes = await fetch(`/api/generate/status?taskId=${taskId}&provider=${providerRef.current}&taskType=${taskTypeRef.current}`);
          const statusData = await statusRes.json();

          if (!statusRes.ok) {
            throw new Error(statusData.error || `Status query failed: ${statusRes.status}`);
          }

          const status = statusData.data?.status || statusData.status;
          const remaining = Math.max(0, Math.ceil(etaSeconds - elapsed));
          const statusText =
            status === "pending"
              ? `Queued... ~${remaining}s`
              : status === "processing"
              ? `Generating... ~${remaining}s`
              : status;
          setTaskStatus(statusText);

          if (status === "completed") {
            const urls = statusData.data?.result || statusData.result || [];
            setGeneratedImages(urls);
            setProgress(100);
            setIsGenerating(false);
            setTaskStatus("");
            setGenError("");

            // Auto-save to user assets
            if (urls.length > 0 && user) {
              fetch("/api/assets/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  url: urls[0],
                  filename: `generated-${selectedModel}-${Date.now()}.png`,
                }),
              }).catch((err) => console.error("[auto-save] Failed:", err));
            }
            return;
          }

          if (status === "failed") {
            throw new Error(statusData.data?.error || "Generation failed");
          }

          // Faster polling: 1.5s initially, then 3s, then 5s
          const delay = attempts < 3 ? 1500 : attempts < 10 ? 3000 : 5000;
          setTimeout(() => poll().catch((e) => {
            setGenError(e instanceof Error ? e.message : "Generation failed");
            setIsGenerating(false);
            setTaskStatus("");
            setProgress(0);
          }), delay);
        } catch (e) {
          setGenError(e instanceof Error ? e.message : "Generation failed");
          setIsGenerating(false);
          setTaskStatus("");
          setProgress(0);
        }
      };

      await poll();
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed");
      setIsGenerating(false);
      setTaskStatus("");
    }
  };

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
                          ? "bg-[rgba(99,102,241,0.12)] text-[#6366F1] font-medium"
                          : "text-[#94A3B8] hover:bg-[rgba(148,163,184,0.06)] hover:text-[#F8FAFC]"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${item.active ? "text-[#6366F1]" : "text-[#64748B]"}`} />
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
            <Button className="w-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F52E6] hover:to-[#7C4FE0] text-white font-semibold text-[13px] h-10 transition-all" asChild>
              <Link href="/pricing">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade now
              </Link>
            </Button>
          </div>
        </aside>

        {/* Center: Generation Panel */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-[640px] mx-auto flex flex-col gap-5">
            {/* Title */}
            <div>
              <p className="text-lg font-bold text-[#F8FAFC] mb-1">Text to Image</p>
              <p className="text-sm text-[#64748B]">Generate stunning images from text prompts</p>
            </div>

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
                  placeholder="Please enter the prompt for your creation"
                  className="w-full min-h-[140px] p-4 pb-16 bg-transparent text-sm text-[#CBD5E1] placeholder:text-[#475569] resize-none outline-none"
                />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <button className="flex items-center gap-1.5 text-sm text-[#818CF8] hover:text-[#6366F1] transition-colors">
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate With AI
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigator.clipboard.writeText(prompt)}
                      className="p-1.5 rounded-md text-[#475569] hover:text-[#94A3B8] hover:bg-[rgba(148,163,184,0.08)] transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPrompt("")}
                      className="p-1.5 rounded-md text-[#475569] hover:text-red-400 hover:bg-red-500/5 transition-colors"
                      title="Clear"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigator.clipboard.readText().then(t => setPrompt(t)).catch(() => {})}
                      className="p-1.5 rounded-md text-[#475569] hover:text-[#94A3B8] hover:bg-[rgba(148,163,184,0.08)] transition-colors"
                      title="Paste"
                    >
                      <Files className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 rounded-md text-[#475569] hover:text-[#14B8A6] hover:bg-[rgba(20,184,166,0.08)] transition-colors"
                      title="Optimize"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#64748B] mt-2">
                If you&apos;re not satisfied, you can generate again or enter prompt for your own.
              </p>
            </div>

            {/* Image Dimensions */}
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC] mb-1">Image Dimensions</p>
              <p className="text-xs text-[#64748B] mb-3">Select the aspect ratio for your image</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { ratio: "1:1", w: 20, h: 20 },
                  { ratio: "16:9", w: 28, h: 16 },
                  { ratio: "9:16", w: 16, h: 28 },
                  { ratio: "4:3", w: 24, h: 18 },
                  { ratio: "3:4", w: 18, h: 24 },
                  { ratio: "21:9", w: 32, h: 12 },
                ].map(({ ratio, w, h }) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      aspectRatio === ratio
                        ? "border-[#8B5CF6] bg-[rgba(139,92,246,0.1)]"
                        : "border-[#1E293B] bg-[#13101F] hover:border-[#475569]"
                    }`}
                  >
                    <div
                      className={`border-2 rounded-sm ${aspectRatio === ratio ? "border-[#F8FAFC]" : "border-[#64748B]"}`}
                      style={{ width: `${w}px`, height: `${h}px` }}
                    />
                    <span className={`text-xs font-medium ${aspectRatio === ratio ? "text-[#F8FAFC]" : "text-[#64748B]"}`}>
                      {ratio}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC] mb-3">Resolution</p>
              <div className="grid grid-cols-3 gap-2">
                {["1K", "2K", "4K"].map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`h-11 rounded-xl text-sm font-medium transition-all border ${
                      resolution === res
                        ? "bg-[rgba(139,92,246,0.15)] border-[#8B5CF6]/40 text-[#F8FAFC]"
                        : "bg-[#13101F] border-[#1E293B] text-[#64748B] hover:border-[#475569] hover:text-[#CBD5E1]"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {genError && (
              <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl">{genError}</div>
            )}

            {/* Credit Cost & Generate */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <svg className="w-4 h-4 text-[#8B5CF6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span>Required credits:</span>
                <span className="font-semibold text-[#F8FAFC]">{creditCost}</span>
                {isGenerating && (
                  <span className="text-xs text-[#64748B] ml-auto">{progress}%</span>
                )}
              </div>
              {isGenerating && (
                <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || authLoading}
                className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C4FE0] hover:to-[#D4377E] text-white font-semibold text-[15px] transition-all disabled:opacity-50"
              >
                {authLoading
                  ? "Checking..."
                  : isGenerating
                  ? taskStatus || "Generating..."
                  : user
                  ? "Generate"
                  : "Sign in to Generate"}
              </Button>
              {!user && !authLoading && (
                <p className="text-xs text-[#64748B] text-center">
                  You need to{" "}
                  <Link href="/auth" className="text-[#818CF8] hover:underline">
                    sign in
                  </Link>{" "}
                  before generating images
                </p>
              )}
            </div>
          </div>
        </main>

        {/* Right: Preview Panel */}
        <aside className="w-[440px] 2xl:w-[480px] flex-shrink-0 border-l border-[#1E293B] bg-[#0A0A12] hidden xl:flex flex-col">
          {/* Header */}
          <div className="px-5 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Generated Images</h3>
            <span className="px-2.5 py-1 rounded-full bg-[rgba(99,102,241,0.12)] border border-[#6366F1]/30 text-[11px] text-[#818CF8]">
              {currentModel?.name}: Fast Generation
            </span>
          </div>
          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center px-5 pb-5">
            <div className={`w-full ${getAspectClass(aspectRatio)} max-h-full rounded-2xl bg-[#13101F] border border-[#1E293B] flex flex-col items-center justify-center gap-4 relative overflow-hidden cursor-pointer group`}
              onClick={() => generatedImages.length > 0 && setPreviewImage(generatedImages[0])}
            >
              {isGenerating ? (
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[rgba(99,102,241,0.2)] border border-[#6366F1]/30 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-6 h-6 text-[#818CF8] animate-spin" />
                  </div>
                  <p className="text-sm text-[#818CF8]">{taskStatus || "Generating..."}</p>
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="relative z-10 w-full h-full p-3">
                  <img
                    src={generatedImages[0]}
                    alt="Generated"
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {/* Floating actions */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={generatedImages[0]}
                      download
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-white hover:bg-black/80 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-white hover:bg-black/80 transition-colors"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Share
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 opacity-30" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(20,184,166,0.2) 100%)" }} />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[rgba(99,102,241,0.2)] border border-[#6366F1]/30 flex items-center justify-center">
                      <Image className="w-6 h-6 text-[#818CF8]" />
                    </div>
                    <p className="text-xs text-[#64748B]">Your generated images will appear here</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ─── Marketing Content ─── */}
      <div className="border-t border-[#1E293B]">
        {/* Supported Models */}
        <section className="py-12 px-6 md:px-12 bg-[#06060A]">
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-col gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[#F8FAFC]">
                All-in-One AI Image Generator
              </h2>
              <p className="text-sm text-[#94A3B8] max-w-[520px] mx-auto">
                Access the world's top image models from a single platform
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              {supportedModelTags.map((tag) => (
                <div
                  key={tag.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#13101F] border border-[#1E293B] hover:border-[#475569] transition-colors cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span className="text-sm text-[#CBD5E1] font-medium">{tag.name}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Showcase Gallery */}
        <section className="py-20 px-6 md:px-12">
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-col gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center flex flex-col gap-3">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
                Turn Words Into Stunning Images
              </h2>
              <p className="text-base text-[#94A3B8] max-w-[640px] mx-auto">
                Explore the endless possibilities of AI image generation. From photorealistic scenes to artistic masterpieces.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imageExamples.map((img) => (
                <div
                  key={img.id}
                  className={`relative rounded-2xl bg-[#13101F] border border-[#1E293B] overflow-hidden group cursor-pointer hover:border-[#475569] transition-all ${
                    img.aspect === "3:4" || img.aspect === "9:16" ? "aspect-[3/4]" : img.aspect === "16:9" ? "aspect-video" : "aspect-square"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-[#EC4899]/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[rgba(99,102,241,0.2)] border border-[#6366F1]/30 flex items-center justify-center group-hover:bg-[rgba(99,102,241,0.3)] transition-colors">
                      <Image className="w-4 h-4 text-[#818CF8]" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-xs text-white/80 font-medium">{img.title}</p>
                    <p className="text-[10px] text-white/50">{img.style}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 md:px-12 bg-[#06060A]">
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-col gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
                The Features of AI Image Generator for Text to Image
              </h2>
            </motion.div>
            {featureCards.map((card, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`flex flex-col ${card.image === "right" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 items-center`}
              >
                <div className="flex-1 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${card.iconColor}15` }}>
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
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How to Use */}
        <section className="py-20 px-6 md:px-12">
          <motion.div
            className="max-w-[1000px] mx-auto flex flex-col gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#F8FAFC] text-center">
              How to Use the AI Image Generator for Text to Image
            </motion.h2>
            <motion.div variants={fadeInUp} className="flex flex-col gap-0">
              {howToSteps.map((s, i) => (
                <div key={i} className="flex gap-6 relative">
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

        {/* Related Tools */}
        <section className="py-16 px-6 md:px-12 bg-[#06060A]">
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-col gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-[#F8FAFC] text-center">
              Discover More AI Image Tools
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
        <section className="py-20 px-6 md:px-12">
          <motion.div
            className="max-w-[800px] mx-auto flex flex-col gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#F8FAFC] text-center">
              Frequently Asked Questions About AI Image Generator for Text to Image
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
        <section className="py-20 px-6 md:px-12 bg-[#06060A]">
          <motion.div
            className="max-w-[800px] mx-auto text-center flex flex-col items-center gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
              Start Creating Stunning Images Today
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base text-[#94A3B8] max-w-[520px]">
              Whether you need product photos, concept art, or social media visuals — our AI makes it effortless.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button className="rounded-full bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:from-[#D4377E] hover:to-[#7C4FE0] text-white font-semibold text-sm px-8 h-12 transition-all" asChild>
                <Link href="/generate">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try Text to Image AI Free
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        <Footer />
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between"
            >
              <h3 className="text-lg font-semibold text-[#F8FAFC]"
              >Sample Image</h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 rounded-lg bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
