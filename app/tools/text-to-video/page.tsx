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
  Volume2,
  Star,
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
      { icon: Video, label: "Text to Video", href: "/tools/text-to-video", active: true, badge: null },
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

const models = getModelsByTaskType("text-to-video");

const videoExamples = [
  { id: "1", title: "Cat on moon", prompt: "A cute cat sleeping on a crescent moon among clouds" },
  { id: "2", title: "Foxes baking", prompt: "Cute fox family baking cookies together" },
  { id: "3", title: "Origami cranes", prompt: "Paper origami cranes flying through a storm" },
  { id: "4", title: "Cyberpunk city", prompt: "Neon-lit cyberpunk cityscape at night" },
  { id: "5", title: "Underwater world", prompt: "Vibrant coral reef with tropical fish" },
  { id: "6", title: "Lightning storm", prompt: "Dramatic lightning storm over mountains" },
];

const featureCards = [
  {
    title: "AI Powered Script-to-Screen Magic",
    desc: "Turn any text prompt into a fully realized video scene. Our AI interprets your descriptions, generates characters, sets, camera movements, and lighting — all from a single sentence.",
    image: "left",
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Sparkles,
    iconColor: "#818CF8",
  },
  {
    title: "Cinematic Quality with Zero Editing Skills",
    desc: "No need for complex editing software. The AI handles transitions, color grading, and pacing automatically. Just describe what you want, and get production-ready output.",
    image: "right",
    gradient: "linear-gradient(135deg, rgba(20,184,166,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Camera,
    iconColor: "#14B8A6",
  },
  {
    title: "Built-in Audio That Matches Your Message",
    desc: "Generate ambient soundscapes, background music, or sound effects that perfectly complement your visuals. The AI analyzes your scene and creates audio that enhances the mood.",
    image: "left",
    gradient: "linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Volume2,
    iconColor: "#EC4899",
  },
  {
    title: "Contextual Scene Generation with Human-Centric Focus",
    desc: "The AI understands narrative context, character emotions, and environmental storytelling. Create scenes where every element serves the story you're telling.",
    image: "right",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: User,
    iconColor: "#F59E0B",
  },
];

const modelLogos = [
  { name: "Seedance 2.0", color: "#14B8A6" },
  { name: "Seedance 2.0 fast", color: "#10B981" },
  { name: "Veo 3.1 Lite", color: "#F59E0B" },
  { name: "Veo 3.1 Fast", color: "#06B6D4" },
  { name: "Veo 3.1 Quality", color: "#8B5CF6" },
  { name: "Sora 2", color: "#EC4899" },
  { name: "Sora 2 Pro", color: "#D946EF" },
  { name: "Runway", color: "#10B981" },
  { name: "Kling 3.0", color: "#6366F1" },
  { name: "Kling V2.6", color: "#EF4444" },
  { name: "Hailuo 02", color: "#06B6D4" },
  { name: "Hailuo 02 Pro", color: "#3B82F6" },
  { name: "Grok", color: "#F97316" },
];

const masonryVideos = [
  { id: "m1", aspect: "tall", label: "Tokyo Night" },
  { id: "m2", aspect: "wide", label: "Champagne Toast" },
  { id: "m3", aspect: "tall", label: "Sports Car" },
  { id: "m4", aspect: "tall", label: "Neon City" },
  { id: "m5", aspect: "wide", label: "Coral Reef" },
  { id: "m6", aspect: "tall", label: "Butterfly" },
];

const howToSteps = [
  { step: 1, title: "Sign Up or Log In to imgvex.AI", desc: "Get started by creating a free account or logging in." },
  { step: 2, title: "Access the Text to Video Tool", desc: "Navigate to the Text to Video tool from your dashboard or sidebar." },
  { step: 3, title: "Type in Your Script or Prompt", desc: "Enter a detailed description of the video you want to create." },
  { step: 4, title: "Click Generate", desc: "The AI will process your prompt and generate a complete video within minutes." },
];

const relatedTools = [
  { name: "Image to Video", desc: "Animate any photo", href: "/tools/image-to-video" },
  { name: "Photo to Video", desc: "Bring stills to life", href: "/tools/image-to-video" },
  { name: "AI Video Generator", desc: "Full AI creation suite", href: "/generate" },
  { name: "Reference to Video", desc: "Style-based generation", href: "/tools/video-to-video" },
];

const faqs = [
  {
    q: "What is Text to Video AI?",
    a: "Text to Video AI is a technology that converts written descriptions into complete video clips using artificial intelligence. You simply type what you want to see, and the AI generates a matching video.",
  },
  {
    q: "How long does it take to generate a video?",
    a: "Most videos are generated within 1-3 minutes depending on the length, resolution, and complexity. Higher resolution outputs may take slightly longer.",
  },
  {
    q: "Can I use the generated videos commercially?",
    a: "Yes, all videos generated on paid plans come with full commercial usage rights. Free plan videos include a watermark and are for personal use only.",
  },
  {
    q: "What video resolutions are supported?",
    a: "We support 480p, 720p, 1080p, and 4K resolutions depending on your subscription plan and the model you choose.",
  },
  {
    q: "Do I need any video editing experience?",
    a: "No editing experience is required. The AI handles all aspects of video creation including transitions, pacing, and effects.",
  },
  {
    q: "Can I add my own audio or music?",
    a: "Yes, you can upload your own audio tracks or use our AI-generated audio features to create custom soundscapes for your videos.",
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

export default function TextToVideoPage() {
  const [selectedModel, setSelectedModel] = useState("seedance-2.0-t2v");
  const [prompt, setPrompt] = useState("");
  const [videoRatio, setVideoRatio] = useState("16:9");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { refreshCredits } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([]);
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [genError, setGenError] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const providerRef = useRef("");
  const taskTypeRef = useRef("text-to-video");

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
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: "text-to-video",
          model: selectedModel,
          prompt: prompt.trim(),
          aspectRatio: videoRatio,
        }),
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

  const currentModel = models.find((m) => m.id === selectedModel);
  const creditCost = getVideoCreditCost(selectedModel);

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
                  <p className="text-[11px] font-medium text-[#64748B] px-3 py-1.5">
                    {section.category}
                  </p>
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
            <Button className="w-full rounded-full bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:from-[#D4377E] hover:to-[#7C4FE0] text-white font-semibold text-[13px] h-10 transition-all" asChild>
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
                  placeholder="Describe your video idea... For example: A cinematic aerial shot of a futuristic city at sunset with flying cars and neon lights..."
                  className="w-full min-h-[160px] p-4 pb-14 bg-transparent text-sm text-[#CBD5E1] placeholder:text-[#475569] resize-none outline-none"
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
                {["16:9", "9:16", "4:3", "3:4", "1:1", "21:9"].map((ratio) => (
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

            {/* Credit Cost & Generate */}
            <div className="flex flex-col gap-3 pt-2">
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
        </main>

        {/* Right: Preview Panel */}
        <aside className="w-[400px] flex-shrink-0 border-l border-[#1E293B] bg-[#0A0A12] hidden xl:flex flex-col">
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
                  <div className="absolute inset-0 opacity-30" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(20,184,166,0.2) 100%)" }} />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[rgba(99,102,241,0.2)] border border-[#6366F1]/30 flex items-center justify-center cursor-pointer hover:bg-[rgba(99,102,241,0.3)] transition-colors">
                      <Play className="w-6 h-6 text-[#818CF8] ml-1" />
                    </div>
                    <p className="text-xs text-[#64748B]">Sample preview will appear here</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ─── Marketing Content ─── */}
      <div className="border-t border-[#1E293B]">
        {/* Video Examples Grid */}
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
                Text to Video of AI Video Generator
              </h2>
              <p className="text-base text-[#94A3B8]">
                Transform your ideas into cinematic videos — just by typing.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {videoExamples.map((video) => (
                <div
                  key={video.id}
                  className="relative rounded-2xl bg-[#13101F] border border-[#1E293B] overflow-hidden aspect-video group cursor-pointer hover:border-[#475569] transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-[#EC4899]/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[rgba(99,102,241,0.2)] border border-[#6366F1]/30 flex items-center justify-center group-hover:bg-[rgba(99,102,241,0.3)] transition-colors">
                      <Play className="w-5 h-5 text-[#818CF8] ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-xs text-white/80 font-medium truncate">{video.title}</p>
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
                The Features of AI Video Generator for Text to Video
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
                <div className="flex-1 w-full aspect-[16/10] rounded-3xl border border-[#1E293B] flex items-center justify-center relative overflow-hidden" style={{ background: card.gradient }}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <card.icon className="w-8 h-8 text-white/80" />
                    </div>
                    <p className="text-sm text-white/60">Feature Preview</p>
                  </div>
                  <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Model Showcase */}
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
                Meet Our All-in-One Text to Video AI
              </h2>
              <p className="text-base text-[#94A3B8] max-w-[640px] mx-auto">
                Try all top-tier video models on our text to video AI generator! More than just our own flagship Pollo 2.5, we also offer access to Kling AI, Veo 3, Hailuo AI and more.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              {modelLogos.map((model) => (
                <div key={model.name} className="flex flex-col items-center gap-2 px-4 py-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: model.color }}>
                    {model.name.charAt(0)}
                  </div>
                  <span className="text-xs text-[#64748B]">{model.name}</span>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <Link href="/generate" className="text-sm text-[#EC4899] hover:underline inline-flex items-center gap-1">
                More Models <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Masonry Gallery */}
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
                Visualize Any Ideas with Text to Video AI
              </h2>
              <p className="text-base text-[#94A3B8] max-w-[640px] mx-auto">
                Bring any text to life with imgvex.AI text to video generator! With it, you can create engaging videos of any style with just a simple text prompt.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {masonryVideos.map((video) => (
                <div
                  key={video.id}
                  className={`relative rounded-2xl bg-[#13101F] border border-[#1E293B] overflow-hidden group cursor-pointer hover:border-[#475569] transition-all ${
                    video.aspect === "tall" ? "aspect-[3/4]" : "aspect-video"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-[#EC4899]/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[rgba(99,102,241,0.2)] border border-[#6366F1]/30 flex items-center justify-center group-hover:bg-[rgba(99,102,241,0.3)] transition-colors">
                      <Play className="w-4 h-4 text-[#818CF8] ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-xs text-white/80 font-medium">{video.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Audio Feature */}
        <section className="py-20 px-6 md:px-12">
          <motion.div
            className="max-w-[1200px] mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row gap-8 items-center rounded-3xl bg-[#0F0F1A] border border-[#1E293B] p-8 lg:p-12">
              <div className="flex-1 w-full aspect-video rounded-2xl bg-[#13101F] border border-[#1E293B] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/10 to-[#6366F1]/5" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[rgba(236,72,153,0.2)] border border-[#EC4899]/30 flex items-center justify-center">
                    <Play className="w-6 h-6 text-[#EC4899] ml-1" />
                  </div>
                  <p className="text-xs text-[#64748B]">Audio Preview</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[rgba(236,72,153,0.15)] flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-[#EC4899]" />
                </div>
                <h3 className="text-2xl font-bold text-[#F8FAFC]">Text to Video AI with Seamless Audio</h3>
                <p className="text-base text-[#94A3B8] leading-relaxed">
                  imgvex.AI's text to video generator creates cinematic, immersive audio from simple text prompts — whether it's ambient sounds, music, or effects — perfectly synced to enhance your video's mood.
                </p>
                <Button className="w-fit rounded-full bg-[#13101F] hover:bg-[#1E293B] text-white font-semibold text-sm px-6 h-11 border border-[#1E293B]" asChild>
                  <Link href="/generate">Try Our Text to Video AI</Link>
                </Button>
              </div>
            </motion.div>
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
              How to Use the AI Video Generator for Text to Video
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
              Frequently Asked Questions About AI Video Generator for Text to Video
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
              Create Cinematic Videos with Just a Few Words
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base text-[#94A3B8] max-w-[520px]">
              Whether you're creating product ads, animated portraits, or social content — our AI-powered tool makes it fast and effortless.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-8 h-12" asChild>
                <Link href="/generate">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try Text to Video AI
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
