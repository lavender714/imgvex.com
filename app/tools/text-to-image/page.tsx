"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
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
  X,
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
  {
    category: "AI Video",
    items: [
      { icon: Image, label: "Image to Video", href: "/tools/image-to-video", active: false, badge: null },
      { icon: Video, label: "Text to Video", href: "/tools/text-to-video", active: false, badge: null },
      { icon: Layers, label: "Video to Video", href: "/tools/video-to-video", active: false, badge: null },
      { icon: Zap, label: "Video Transition", href: "#", active: false, badge: null },
      { icon: Clock, label: "Video Extend", href: "#", active: false, badge: "Hot" },
      { icon: Sparkles, label: "One-Click Video", href: "#", active: false, badge: "New" },
      { icon: Music, label: "Music to Video", href: "#", active: false, badge: "New" },
      { icon: User, label: "AI Avatar", href: "#", active: false, badge: null },
      { icon: Wand2, label: "Lip Sync", href: "#", active: false, badge: null },
      { icon: Eye, label: "Motion Control", href: "#", active: false, badge: null },
      { icon: Link2, label: "Reference To Video", href: "#", active: false, badge: null },
      { icon: Paintbrush, label: "Video Style Transform", href: "#", active: false, badge: null },
      { icon: Clapperboard, label: "Video Effects", href: "#", active: false, badge: null },
    ],
  },
  {
    category: "AI Image",
    items: [
      { icon: Copy, label: "Image to Image", href: "#", active: false, badge: null },
      { icon: Type, label: "Text to Image", href: "/tools/text-to-image", active: true, badge: null },
    ],
  },
  {
    category: "AI Voice",
    items: [
      { icon: Mic, label: "Text to Speech", href: "#", active: false, badge: null },
      { icon: Mic, label: "Voice Cloning", href: "#", active: false, badge: null },
      { icon: MessageSquare, label: "Text to Dialogue", href: "#", active: false, badge: null },
      { icon: VolumeX, label: "Noise Remover", href: "#", active: false, badge: null },
      { icon: Keyboard, label: "Speech to Text", href: "#", active: false, badge: null },
    ],
  },
  {
    category: "AI Music",
    items: [
      { icon: Headphones, label: "Suno", href: "#", active: false, badge: null },
    ],
  },
  {
    category: "",
    items: [
      { icon: Handshake, label: "Affiliate", href: "#", active: false, badge: null },
      { icon: FolderOpen, label: "My Creations", href: "#", active: false, badge: null },
      { icon: Tag, label: "Price", href: "/pricing", active: false, badge: "50% OFF" },
      { icon: Newspaper, label: "Blog", href: "#", active: false, badge: null },
    ],
  },
];

const models = [
  { id: "flux-pro", name: "Flux Pro", logo: "F" },
  { id: "midjourney-v7", name: "Midjourney v7", logo: "M" },
  { id: "dalle-4", name: "DALL-E 4", logo: "D" },
  { id: "ideogram-3", name: "Ideogram 3", logo: "I" },
  { id: "recraft-v3", name: "Recraft V3", logo: "R" },
  { id: "stable-xl", name: "Stable Diffusion XL", logo: "S" },
];

const supportedModelTags = [
  { name: "GPT Image 2", color: "#6366F1" },
  { name: "Ideogram 3", color: "#EC4899" },
  { name: "Recraft V3", color: "#14B8A6" },
  { name: "Midjourney", color: "#F59E0B" },
  { name: "Stable Diffusion", color: "#8B5CF6" },
  { name: "Flux AI", color: "#06B6D4" },
  { name: "DALL-E 4", color: "#10B981" },
  { name: "Imagen 4", color: "#EF4444" },
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

const footerLinks: Record<string, { label: string; href: string }[]> = {
  "Creative Tools": [
    { label: "AI Video Generator", href: "/generate" },
    { label: "Text to Video AI", href: "/tools/text-to-video" },
    { label: "Image to Video AI", href: "/tools/image-to-video" },
    { label: "Text to Image AI", href: "/tools/text-to-image" },
    { label: "AI Photo Editor", href: "#" },
    { label: "AI Video Extender", href: "#" },
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

export default function TextToImagePage() {
  const [selectedModel, setSelectedModel] = useState("flux-pro");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1K");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
        <aside className="w-[220px] flex-shrink-0 border-r border-[#1E293B] bg-[#0A0A12] overflow-y-auto hidden lg:flex flex-col py-4">
          {sidebarTools.map((section, idx) =>
            isCategory(section) ? (
              <div key={section.category || `bottom-${idx}`} className="px-3 mb-2">
                {idx > 0 && <div className="h-px bg-[#1E293B] mb-3" />}
                {section.category && (
                  <p className="text-[10px] font-semibold text-[#475569] tracking-[1.5px] px-3 py-2 uppercase">{section.category}</p>
                )}
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-colors ${
                        item.active
                          ? "bg-[rgba(99,102,241,0.15)] text-[#F8FAFC] font-medium border border-[#6366F1]/30"
                          : "text-[#64748B] hover:bg-[rgba(99,102,241,0.08)] hover:text-[#F8FAFC]"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${item.active ? "text-[#818CF8]" : "text-[#475569]"}`} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.badge === "Hot" ? "bg-[#EF4444]/15 text-[#EF4444]" : "bg-[#14B8A6]/15 text-[#14B8A6]"}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div key={section.label} className="px-3 mb-2">
                <Link href={section.href} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-[#64748B] hover:bg-[rgba(99,102,241,0.08)] hover:text-[#F8FAFC] transition-colors">
                  <section.icon className="w-4 h-4 text-[#475569]" />
                  {section.label}
                </Link>
              </div>
            )
          )}
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
                    <SelectValue />
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#64748B]" />
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
                  placeholder="Describe the image you want to create... For example: A majestic lion standing on a rocky cliff at golden hour, dramatic lighting, photorealistic..."
                  className="w-full min-h-[120px] p-4 pb-14 bg-transparent text-sm text-[#CBD5E1] placeholder:text-[#475569] resize-none outline-none"
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
              <p className="text-xs text-[#64748B] mt-2">
                Be specific for better results. Include details about lighting, style, mood, and composition.
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
              </div>
              <Button className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C4FE0] hover:to-[#D4377E] text-white font-semibold text-[15px] transition-all">
                Generate
              </Button>
            </div>
          </div>
        </main>

        {/* Right: Preview Panel */}
        <aside className="w-[480px] flex-shrink-0 border-l border-[#1E293B] bg-[#0A0A12] hidden xl:flex flex-col">
          <div className="p-4 border-b border-[#1E293B]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#F8FAFC]">Generated Images</h3>
              <span className="px-2.5 py-1 rounded-full bg-[rgba(99,102,241,0.12)] border border-[#6366F1]/30 text-[11px] text-[#818CF8]">
                {currentModel?.name}: Fast Generation
              </span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className={`w-full ${getAspectClass(aspectRatio)} max-h-full rounded-2xl bg-[#13101F] border border-[#1E293B] flex flex-col items-center justify-center gap-4 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-30" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(20,184,166,0.2) 100%)" }} />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[rgba(99,102,241,0.2)] border border-[#6366F1]/30 flex items-center justify-center">
                  <Image className="w-6 h-6 text-[#818CF8]" />
                </div>
                <p className="text-xs text-[#64748B]">Your generated images will appear here</p>
              </div>
            </div>
          </div>
          {/* Toolbar */}
          <div className="p-4 border-t border-[#1E293B] flex items-center justify-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#13101F] border border-[#1E293B] text-sm text-[#64748B] hover:text-[#CBD5E1] hover:border-[#475569] transition-colors">
              <Download className="w-4 h-4" />
              Download
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
