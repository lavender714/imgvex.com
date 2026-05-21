"use client";

import Link from "next/link";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getModelsByTaskType, getEtaSeconds } from "@/lib/providers/config";
import { getModelCreditCost } from "@/lib/credits/model-costs";
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
import { motion, AnimatePresence } from "framer-motion";
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
  Maximize2,
  Upload,
  X,
  Settings,
  Sun,
  Moon,
  Flame,
  Globe,
  ShoppingBag,
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
      { icon: Type, label: "Text to Image", href: "/tools/text-to-image", active: false, badge: null },
      { icon: Copy, label: "Image to Image", href: "/tools/image-to-image", active: true, badge: null },
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

const models = getModelsByTaskType("image-to-image");

const supportedModelTags = [
  { name: "Nano Banana 2", color: "#EC4899" },
  { name: "Nano Banana Edit", color: "#14B8A6" },
  { name: "Flux 2", color: "#06B6D4" },
  { name: "GPT Image 2.0", color: "#6366F1" },
  { name: "GPT Image 1.5", color: "#8B5CF6" },
  { name: "Flux Kontext", color: "#10B981" },
  { name: "Wan 2.7", color: "#F97316" },
];

const loraStyles = [
  { id: "ghibli", name: "Ghibli Art", color: "#14B8A6" },
  { id: "anime", name: "Anime", color: "#EC4899" },
  { id: "realistic", name: "Realistic", color: "#6366F1" },
  { id: "oil", name: "Oil Painting", color: "#F59E0B" },
  { id: "sketch", name: "Sketch", color: "#64748B" },
  { id: "3d", name: "3D Render", color: "#8B5CF6" },
  { id: "pixel", name: "Pixel Art", color: "#06B6D4" },
  { id: "cinematic", name: "Cinematic", color: "#EF4444" },
  { id: "pop", name: "Pop Art", color: "#F97316" },
  { id: "watercolor", name: "Watercolor", color: "#3B82F6" },
  { id: "cyberpunk", name: "Cyberpunk", color: "#A855F7" },
  { id: "vintage", name: "Vintage", color: "#B45309" },
];

const beforeAfterExamples = [
  { id: "1", title: "Portrait Style Transfer", desc: "Transform portraits into artistic styles" },
  { id: "2", title: "Product Photography", desc: "Enhance product shots with professional lighting" },
  { id: "3", title: "Scene Reimagining", desc: "Change the mood and atmosphere of any scene" },
];

const featureCards = [
  {
    title: "AI-Powered Image Transformation",
    desc: "Upload any image and describe the transformation you want. Our AI analyzes the original composition, colors, and subject, then reimagines it in your chosen style while preserving the core elements.",
    image: "left",
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Sparkles,
    iconColor: "#818CF8",
  },
  {
    title: "Creative Style Transfer with Text Prompts",
    desc: "Simply describe how you want to change an image. Add colors, change the art style, or create entirely new looks. Our AI interprets your words to craft stunning images that resonate with your vision.",
    image: "right",
    gradient: "linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Palette,
    iconColor: "#EC4899",
  },
  {
    title: "Seamless AI Editing — No Experience Needed",
    desc: "No design skills required. Upload your image, type what you want to change, and let the AI handle the rest. From subtle retouching to complete artistic overhauls.",
    image: "left",
    gradient: "linear-gradient(135deg, rgba(20,184,166,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Wand2,
    iconColor: "#14B8A6",
  },
  {
    title: "Versatile Output for Marketing, E-commerce, and Concept Art",
    desc: "Generate multiple variations for A/B testing, create consistent brand imagery, or explore creative concepts. Each output maintains high fidelity to your original while introducing the desired changes.",
    image: "right",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(15,15,26,0.9) 100%)",
    icon: Briefcase,
    iconColor: "#F59E0B",
  },
];

const audienceTabs = [
  { key: "photographers", label: "Photographers", icon: Camera },
  { key: "creators", label: "Content Creators", icon: User },
  { key: "marketers", label: "Marketing Teams", icon: Briefcase },
  { key: "hobbyists", label: "Hobbyists", icon: Heart },
];

const audienceContent: Record<string, { title: string; desc: string; stat: string }> = {
  photographers: { title: "Reduce Editing Time by 70%", desc: "Save up to 70% of your editing time. Quickly restyle or enhance photos to match your creative vision, without hours of manual adjustments.", stat: "70% faster" },
  creators: { title: "Endless Content Variations", desc: "Create multiple versions of a single image for different platforms and audiences. One photo, infinite possibilities — perfect for maintaining a consistent feed.", stat: "50+ styles" },
  marketers: { title: "A/B Test Visuals at Scale", desc: "Generate multiple creative variants for ad campaigns without photoshoot costs. Test different styles, backgrounds, and compositions to find what converts best.", stat: "10x more variants" },
  hobbyists: { title: "Explore Your Creativity", desc: "Turn everyday photos into art. Experiment with different styles, create personalized gifts, or simply have fun seeing your images reimagined.", stat: "100% free to try" },
};

const howToSteps = [
  { step: 1, title: "Upload Your Image", desc: "Upload any JPG or PNG image. Portraits, products, landscapes, and illustrations all work great." },
  { step: 2, title: "Choose a Style and Enter Your Prompt", desc: "Select a LoRA style or describe the transformation you want. Be specific about colors, mood, and artistic direction." },
  { step: 3, title: "Generate and Download", desc: "Click Generate and watch the AI transform your image. Download your favorites in high resolution." },
];

const relatedTools = [
  { name: "Text to Image", desc: "Create from scratch", href: "/tools/text-to-image" },
  { name: "AI Photo Editor", desc: "Smart editing tools", href: "#" },
  { name: "Background Remover", desc: "Clean cutouts", href: "#" },
  { name: "AI Avatar", desc: "Digital personas", href: "#" },
];

const faqs = [
  {
    q: "What is Image to Image AI?",
    a: "Image to Image AI is a technology that transforms existing images into new versions based on your instructions. Upload any image, describe the changes you want, and the AI generates a modified version while preserving the original composition.",
  },
  {
    q: "How does Image to Image AI work?",
    a: "Our AI analyzes your uploaded image and applies specific algorithms to modify it based on your prompts. You can describe desired changes — such as colors, styles, or artistic directions — and the AI generates a new image reflecting those ideas.",
  },
  {
    q: "What is LoRA?",
    a: "LoRA (Low-Rank Adaptation) is a technique for adapting image models to specific styles. Our platform offers 2,000+ LoRAs for different artistic styles, themes, and applications. You can select and combine LoRAs for personalized results.",
  },
  {
    q: "Is Image to Image AI free to use?",
    a: "Yes, you can try Image to Image AI for free. We offer 5 free generations daily. After that, each generation costs 2 credits. Paid plans offer more generations and higher resolutions.",
  },
  {
    q: "Can I use the generated images commercially?",
    a: "Yes, all images generated on paid plans come with full commercial usage rights. Free plan images include a watermark and are for personal use only.",
  },
  {
    q: "What types of images work best?",
    a: "High-quality, clear images with good lighting work best. Portraits, product shots, landscapes, illustrations, and architecture photos all produce excellent results.",
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

function AspectIcon({ ratio }: { ratio: string }) {
  const dims: Record<string, { w: number; h: number }> = {
    "1:1": { w: 20, h: 20 },
    "16:9": { w: 28, h: 16 },
    "9:16": { w: 16, h: 28 },
    "4:3": { w: 24, h: 18 },
    "3:4": { w: 18, h: 24 },
    "21:9": { w: 32, h: 12 },
  };
  const d = dims[ratio] || dims["1:1"];
  return (
    <div
      className="border-2 border-current rounded-sm"
      style={{ width: `${d.w}px`, height: `${d.h}px` }}
    />
  );
}

/* ─── Page ─── */

export default function ImageToImagePage() {
  const [selectedModel, setSelectedModel] = useState("nano-banana-2");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1K");
  const [selectedStyle, setSelectedStyle] = useState("ghibli");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeAudience, setActiveAudience] = useState("photographers");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [taskStatus, setTaskStatus] = useState("");
  const [genError, setGenError] = useState("");
  const [progress, setProgress] = useState(0);
  const providerRef = useRef("");
  const taskTypeRef = useRef("image-to-image");
  const [inputImageUrl, setInputImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const etaSeconds = getEtaSeconds(selectedModel);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
    });
  }, []);

  const currentModel = models.find((m) => m.id === selectedModel);
  const creditCost = getModelCreditCost(selectedModel);

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

      setInputImageUrl(data.downloadUrl);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
      setInputImageUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      const url = URL.createObjectURL(files[0]);
      setUploadedImage(url);
      uploadToR2(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      const url = URL.createObjectURL(files[0]);
      setUploadedImage(url);
      uploadToR2(files[0]);
    }
  }, []);

  const handleRemoveImage = () => {
    if (uploadedImage) URL.revokeObjectURL(uploadedImage);
    setUploadedImage(null);
    setInputImageUrl(null);
    setUploadError("");
  };

  const handleGenerate = async () => {
    if (!user) {
      router.push(`/auth?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!prompt.trim()) {
      setGenError("Please enter a prompt");
      return;
    }
    if (!inputImageUrl) {
      setGenError("Please upload an image first");
      return;
    }
    setIsGenerating(true);
    setGenError("");
    setProgress(0);
    setGeneratedImages([]);
    setTaskStatus("Submitting...");

    try {
      const createRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: "image-to-image",
          model: selectedModel,
          prompt: prompt.trim(),
          size: resolution === "1K" ? "1024x1024" : resolution === "2K" ? "2048x2048" : "4096x4096",
          n: 1,
          inputUrls: [inputImageUrl],
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createData.error || "Failed to create task");
      }

      const taskId = createData.data?.task_id;
      const provider = createData.data?.provider || "";
      providerRef.current = provider;
      taskTypeRef.current = "image-to-image";
      if (!taskId) {
        throw new Error("No task ID returned");
      }

      const etaSeconds = getEtaSeconds(selectedModel);
      const startTime = Date.now();
      let attempts = 0;
      const maxAttempts = 120;

      const poll = async () => {
        try {
          if (attempts >= maxAttempts) {
            throw new Error("Generation timed out");
          }
          attempts++;

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
            return;
          }

          if (status === "failed") {
            throw new Error(statusData.data?.error || "Generation failed");
          }

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

        {/* Center: Generation Panel */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-[640px] mx-auto flex flex-col gap-5">
            {/* Title */}
            <div>
              <p className="text-lg font-bold text-[#F8FAFC] mb-1">Image to Image</p>
              <p className="text-sm text-[#64748B]">Transform any image with AI-powered style transfer</p>
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

            {/* Upload Image */}
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC] mb-3">Upload Image</p>
              {uploadedImage ? (
                <div className="relative rounded-2xl border border-[#1E293B] bg-[#13101F] overflow-hidden">
                  <img src={uploadedImage} alt="Uploaded" className="w-full max-h-[200px] object-contain" />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleRemoveImage}
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
                    isDragging
                      ? "border-[#8B5CF6] bg-[rgba(139,92,246,0.08)]"
                      : "border-[#334155] bg-[#13101F] hover:border-[#475569]"
                  }`}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  <div className="flex flex-col items-center gap-3 py-10 px-6">
                    <div className="w-12 h-12 rounded-xl bg-[#1E293B] flex items-center justify-center">
                      <Upload className="w-5 h-5 text-[#64748B]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-[#CBD5E1]">Upload image or drag and drop</p>
                      <p className="text-xs text-[#64748B] mt-1">JPG, PNG supported (max 10 MB)</p>
                    </div>
                  </div>
                </div>
              )}
              {uploadError && (
                <p className="text-xs text-red-400 mt-2">{uploadError}</p>
              )}
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
                  placeholder="Describe how you want to transform the image... For example: Turn this into a Ghibli-style animation with soft pastel colors..."
                  className="w-full min-h-[100px] p-4 pb-14 bg-transparent text-sm text-[#CBD5E1] placeholder:text-[#475569] resize-none outline-none"
                />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <button className="flex items-center gap-1.5 text-sm text-[#818CF8] hover:text-[#6366F1] transition-colors">
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate With AI
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-md text-[#475569] hover:text-[#94A3B8] transition-colors" title="Copy">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Style / LoRA */}
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC] mb-3">Style</p>
              <div className="grid grid-cols-4 gap-2">
                {loraStyles.slice(0, 8).map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all ${
                      selectedStyle === style.id ? "border-[#EC4899]" : "border-[#1E293B] hover:border-[#475569]"
                    }`}
                  >
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${style.color}20, ${style.color}08)` }} />
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-[10px] text-white font-medium text-center">{style.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Dimensions */}
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC] mb-1">Image Dimensions</p>
              <p className="text-xs text-[#64748B] mb-3">Select the aspect ratio for your image</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      aspectRatio === ratio
                        ? "border-[#8B5CF6] bg-[rgba(139,92,246,0.1)]"
                        : "border-[#1E293B] bg-[#13101F] hover:border-[#475569]"
                    }`}
                  >
                    <AspectIcon ratio={ratio} />
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
                  You need to <Link href="/auth" className="text-[#818CF8] hover:underline">sign in</Link> before generating images
                </p>
              )}
            </div>
          </div>
        </main>

        {/* Right: Preview Panel */}
        <aside className="w-[480px] flex-shrink-0 border-l border-[#1E293B] bg-[#0A0A12] hidden xl:flex flex-col">
          <div className="p-4 border-b border-[#1E293B]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Preview</h3>
              <span className="px-2.5 py-1 rounded-full bg-[rgba(99,102,241,0.12)] border border-[#6366F1]/30 text-[11px] text-[#818CF8]">
                {currentModel?.name}: Fast Generation
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-4">
              {/* Original Image */}
              <div>
                <p className="text-xs text-[#64748B] mb-2">Original</p>
                <div className="w-full aspect-square rounded-2xl bg-[#13101F] border border-[#1E293B] flex items-center justify-center relative overflow-hidden">
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Original" className="w-full h-full object-contain" />
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-30" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)" }} />
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <Image className="w-8 h-8 text-[#64748B]" />
                        <p className="text-xs text-[#64748B]">Upload an image to see preview</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Generated Results Grid */}
              <div>
                <p className="text-xs text-[#64748B] mb-2">Generated Results</p>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-xl bg-[#13101F] border border-[#1E293B] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.1) 100%)` }} />
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <Sparkles className="w-5 h-5 text-[#64748B]" />
                        <p className="text-[10px] text-[#64748B]">Result {i}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Toolbar */}
          <div className="p-4 border-t border-[#1E293B] flex items-center justify-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#13101F] border border-[#1E293B] text-sm text-[#64748B] hover:text-[#CBD5E1] hover:border-[#475569] transition-colors">
              <Download className="w-4 h-4" />
              Download All
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#13101F] border border-[#1E293B] text-sm text-[#64748B] hover:text-[#CBD5E1] hover:border-[#475569] transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
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
                All-in-One AI Image Generator from Image
              </h2>
              <p className="text-sm text-[#94A3B8] max-w-[520px] mx-auto">
                Access the world's top image models from a single platform
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              {supportedModelTags.map((tag) => (
                <div
                  key={tag.name}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13101F] border border-[#1E293B] hover:border-[#475569] transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: tag.color }}>
                    {tag.name.charAt(0)}
                  </div>
                  <span className="text-sm text-[#CBD5E1] font-medium">{tag.name}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Before/After Showcase */}
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
                Peerless AI Image to Image Generator
              </h2>
              <p className="text-base text-[#94A3B8] max-w-[640px] mx-auto">
                Transform your existing images with our AI image to image generator. Add color, change art style, or create entirely new looks.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {beforeAfterExamples.map((example) => (
                <div key={example.id} className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Before */}
                    <div className="aspect-square rounded-xl bg-[#13101F] border border-[#1E293B] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-transparent" />
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <Image className="w-5 h-5 text-[#64748B]" />
                        <span className="text-[10px] text-[#64748B]">Before</span>
                      </div>
                    </div>
                    {/* After */}
                    <div className="aspect-square rounded-xl bg-[#13101F] border border-[#1E293B] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/10 to-transparent" />
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <Sparkles className="w-5 h-5 text-[#EC4899]" />
                        <span className="text-[10px] text-[#64748B]">After</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F8FAFC]">{example.title}</p>
                    <p className="text-xs text-[#64748B]">{example.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* LoRA Style Gallery */}
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
                Different Styles for Every Need
              </h2>
              <p className="text-base text-[#94A3B8] max-w-[640px] mx-auto">
                Choose from 2,000+ LoRAs tailored to different artistic styles, themes, and applications.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {loraStyles.map((style) => (
                <button
                  key={style.id}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-full aspect-square rounded-2xl bg-[#13101F] border border-[#1E293B] overflow-hidden relative group-hover:border-[#475569] transition-all">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${style.color}20, ${style.color}08)` }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold" style={{ color: style.color }}>{style.name.charAt(0)}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#64748B] group-hover:text-[#CBD5E1] transition-colors">{style.name}</span>
                </button>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center">
              <Button className="rounded-full bg-[#13101F] hover:bg-[#1E293B] text-white font-semibold text-sm px-6 h-11 border border-[#1E293B]" asChild>
                <Link href="/generate">Explore All Styles</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

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
                The Features of AI Image Generator for Image to Image
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

        {/* Target Audience Tabs */}
        <section className="py-20 px-6 md:px-12 bg-[#06060A]">
          <motion.div
            className="max-w-[1000px] mx-auto flex flex-col gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center flex flex-col gap-3">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
                Pollo AI Image to Image Generator Is Built for All
              </h2>
              <p className="text-base text-[#94A3B8] max-w-[640px] mx-auto">
                Whether you're a photographer, an influencer, or simply want to transform your images for fun.
              </p>
            </motion.div>

            {/* Tabs */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-2">
              {audienceTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveAudience(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeAudience === tab.key
                      ? "bg-[rgba(139,92,246,0.15)] text-[#F8FAFC] border border-[#8B5CF6]/40"
                      : "text-[#64748B] hover:text-[#CBD5E1] border border-transparent"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <motion.div variants={fadeInUp}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAudience}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col lg:flex-row gap-8 items-center rounded-3xl bg-[#0F0F1A] border border-[#1E293B] p-8"
                >
                  <div className="flex-1 w-full aspect-video rounded-2xl bg-[#13101F] border border-[#1E293B] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-[#8B5CF6]/5" />
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-[rgba(99,102,241,0.2)] border border-[#6366F1]/30 flex items-center justify-center">
                        {(() => {
                          const TabIcon = audienceTabs.find((t) => t.key === activeAudience)?.icon || Camera;
                          return <TabIcon className="w-6 h-6 text-[#818CF8]" />;
                        })()}
                      </div>
                      <p className="text-xs text-[#64748B]">Audience Preview</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const TabIcon = audienceTabs.find((t) => t.key === activeAudience)?.icon || Camera;
                        return (
                          <div className="w-10 h-10 rounded-xl bg-[rgba(139,92,246,0.12)] flex items-center justify-center">
                            <TabIcon className="w-5 h-5 text-[#8B5CF6]" />
                          </div>
                        );
                      })()}
                      <span className="text-lg font-bold text-[#F8FAFC]">{audienceContent[activeAudience].title}</span>
                    </div>
                    <p className="text-base text-[#94A3B8] leading-relaxed">{audienceContent[activeAudience].desc}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[rgba(139,92,246,0.12)] border border-[#8B5CF6]/30 text-xs text-[#8B5CF6] font-medium">
                        {audienceContent[activeAudience].stat}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
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
              How to Use the AI Image Generator for Image to Image
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
              Frequently Asked Questions About AI Image Generator for Image to Image
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
              Join 10M+ Users Using imgvex.AI to Create and Inspire
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base text-[#94A3B8] max-w-[520px]">
              Start transforming your images today. Upload, describe, and let AI do the rest.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button className="rounded-full bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] hover:from-[#D4377E] hover:to-[#7C4FE0] text-white font-semibold text-sm px-8 h-12 transition-all" asChild>
                <Link href="/generate">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try Image to Image AI Free
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
