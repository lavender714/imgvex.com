import type { TaskType } from "@/lib/providers/index";

export type ApiTaskFilter = "all" | "text-to-image" | "image-to-image" | "text-to-video" | "image-to-video" | "video-to-video";

export interface ApiCatalogModel {
  id: string;
  name: string;
  taskType: TaskType;
  providerName: string;
  description: string;
  etaSeconds: number;
  banner:
    | { kind: "image"; src: string }
    | { kind: "gradient"; from: string; to: string; emoji?: string };
  badge?: "Popular" | "Fast" | "Premium" | "New";
  comingSoon?: boolean;
}

const VEO_DEMO = "https://lh3.googleusercontent.com/IoSfcitEGPD3GGM8rZ3rz8ILUz_b1ejr_cYUT6iY8hpM2YYtVGO94k2_gdQQYwbfS8d1A5Gqw1YgBAB51ji8hgMcBkCcY_aSBtid6stjZdbCl-zreg=w800-h600-n-nu";
const VEO_DEMO_2 = "https://lh3.googleusercontent.com/BXf7nFeF8HLOvRUH3C0Gm7vCGyIRUhaZ8oMkb_oFKW5RxrDWnsFx8wD-1kDG8z4vuwMgqDOmMn1YU9CxAewIKclglhcuUc_8RUfcfy7YaNTB03Sc3w=w800-h600-n-nu";
const VEO_DEMO_3 = "https://lh3.googleusercontent.com/r8GdFVkzQUZJUavR472wZA4NsdM5CarlMf4xFW1tafuLyRPbbhDxU1MeIanCWYjgfrgoqNTHBa94wo0kyCVQHuxvvcwfcRIAwW0o1xJgFocg5Ple=w800-h600-n-nu";
const FLUX_DEMO = "https://cdn.sanity.io/images/2gpum2i6/production/c8a6972790ddfc1f07e6ace855517a9ad03e035d-1162x1774.png?w=800&h=1067&fit=crop&auto=format";
const FLUX_DEMO_2 = "https://cdn.sanity.io/images/2gpum2i6/production/5d563b7e80a4544e78cb389bd863d9f26da636a5-1072x1920.png?w=800&h=1067&fit=crop&auto=format";
const FLUX_DEMO_3 = "https://cdn.sanity.io/images/2gpum2i6/production/b352b23898d0662cac2946c6506e8c6c19996fdb-1024x1280.png?w=800&h=1067&fit=crop&auto=format";

const GRADIENTS = {
  indigo: { from: "#6366F1", to: "#1E1B4B" },
  pink: { from: "#EC4899", to: "#831843" },
  teal: { from: "#14B8A6", to: "#134E4A" },
  amber: { from: "#F59E0B", to: "#78350F" },
  violet: { from: "#8B5CF6", to: "#4C1D95" },
  cyan: { from: "#06B6D4", to: "#164E63" },
  rose: { from: "#F43F5E", to: "#881337" },
  emerald: { from: "#10B981", to: "#064E3B" },
  orange: { from: "#F97316", to: "#7C2D12" },
  slate: { from: "#475569", to: "#0F172A" },
};

export const API_CATALOG: ApiCatalogModel[] = [
  // ─── Text-to-Image ───
  {
    id: "nano-banana",
    name: "Nano Banana",
    taskType: "text-to-image",
    providerName: "Google",
    description: "Google's lightweight image model — fast, natural-language-driven generation and editing.",
    etaSeconds: 18,
    banner: { kind: "gradient", emoji: "🍌", ...GRADIENTS.amber },
    badge: "Fast",
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    taskType: "text-to-image",
    providerName: "Google",
    description: "Higher-fidelity variant of Nano Banana with sharper details and better prompt adherence.",
    etaSeconds: 22,
    banner: { kind: "gradient", emoji: "🍌", ...GRADIENTS.teal },
  },
  {
    id: "nano-banana-2",
    name: "Nano Banana 2",
    taskType: "text-to-image",
    providerName: "Google",
    description: "Next-generation Nano Banana with improved typography and complex scene composition.",
    etaSeconds: 18,
    banner: { kind: "gradient", emoji: "🍌", ...GRADIENTS.pink },
  },
  {
    id: "gpt-image-2",
    name: "GPT Image 2.0",
    taskType: "text-to-image",
    providerName: "OpenAI",
    description: "OpenAI's flagship image model with photoreal quality and reliable text rendering.",
    etaSeconds: 25,
    banner: { kind: "gradient", emoji: "✨", ...GRADIENTS.indigo },
    badge: "Popular",
  },
  {
    id: "gpt-image-1-5",
    name: "GPT Image 1.5",
    taskType: "text-to-image",
    providerName: "OpenAI",
    description: "Cost-efficient OpenAI image model for everyday generation needs.",
    etaSeconds: 25,
    banner: { kind: "gradient", emoji: "✨", ...GRADIENTS.violet },
    comingSoon: true,
  },
  {
    id: "grok-imagine",
    name: "Grok",
    taskType: "text-to-image",
    providerName: "xAI",
    description: "xAI's image model with strong creative interpretation and stylized output.",
    etaSeconds: 25,
    banner: { kind: "gradient", emoji: "✦", ...GRADIENTS.rose },
    comingSoon: true,
  },
  {
    id: "ideogram",
    name: "Ideogram",
    taskType: "text-to-image",
    providerName: "Ideogram",
    description: "Best-in-class typography and poster-style layouts with embedded text.",
    etaSeconds: 20,
    banner: { kind: "gradient", emoji: "✎", ...GRADIENTS.cyan },
    comingSoon: true,
  },
  {
    id: "flux",
    name: "Flux",
    taskType: "text-to-image",
    providerName: "Black Forest Labs",
    description: "BFL's open-weights model line — cinematic detail and reliable composition.",
    etaSeconds: 15,
    banner: { kind: "image", src: FLUX_DEMO },
    badge: "Popular",
  },
  {
    id: "flux-kontext",
    name: "Flux Kontext",
    taskType: "text-to-image",
    providerName: "Black Forest Labs",
    description: "Context-aware Flux variant for in-context editing and consistent character generation.",
    etaSeconds: 20,
    banner: { kind: "image", src: FLUX_DEMO_2 },
  },
  {
    id: "midjourney",
    name: "Midjourney",
    taskType: "text-to-image",
    providerName: "Midjourney",
    description: "Distinctive artistic style with rich color and painterly aesthetics.",
    etaSeconds: 30,
    banner: { kind: "gradient", emoji: "M", ...GRADIENTS.orange },
    badge: "Premium",
  },

  // ─── Image-to-Image ───
  {
    id: "flux-2",
    name: "Flux 2",
    taskType: "image-to-image",
    providerName: "Black Forest Labs",
    description: "Next-gen Flux with deeper conditioning controls for style transfer and edits.",
    etaSeconds: 18,
    banner: { kind: "image", src: FLUX_DEMO_3 },
    comingSoon: true,
  },
  {
    id: "wan2.7-image-edit",
    name: "Wan 2.7",
    taskType: "image-to-image",
    providerName: "Alibaba",
    description: "Alibaba's editing model — precise local edits driven by natural-language prompts.",
    etaSeconds: 20,
    banner: { kind: "gradient", emoji: "W", ...GRADIENTS.cyan },
  },
  {
    id: "nano-banana-edit",
    name: "Nano Banana Edit",
    taskType: "image-to-image",
    providerName: "Google",
    description: "Editing variant of Nano Banana — restyle, restore, and refine existing images.",
    etaSeconds: 22,
    banner: { kind: "gradient", emoji: "🍌", ...GRADIENTS.emerald },
  },
  {
    id: "gpt-image-2-image",
    name: "GPT Image 2.0 Edit",
    taskType: "image-to-image",
    providerName: "OpenAI",
    description: "OpenAI's flagship image editor — same fidelity as GPT Image 2.0 in image-conditioning mode.",
    etaSeconds: 25,
    banner: { kind: "gradient", emoji: "✨", ...GRADIENTS.indigo },
  },
  {
    id: "gpt-image-1-5-image",
    name: "GPT Image 1.5 Edit",
    taskType: "image-to-image",
    providerName: "OpenAI",
    description: "Cost-efficient image editing from OpenAI for batch workflows.",
    etaSeconds: 25,
    banner: { kind: "gradient", emoji: "✨", ...GRADIENTS.violet },
    comingSoon: true,
  },

  // ─── Text-to-Video ───
  {
    id: "sora-2-pro",
    name: "Sora 2 Pro",
    taskType: "text-to-video",
    providerName: "OpenAI",
    description: "OpenAI's premium video model — best-in-class motion, physics, and audio sync.",
    etaSeconds: 90,
    banner: { kind: "gradient", emoji: "✨", ...GRADIENTS.indigo },
    badge: "Premium",
    comingSoon: true,
  },
  {
    id: "sora-2-vip",
    name: "Sora 2",
    taskType: "text-to-video",
    providerName: "OpenAI",
    description: "Sora 2 — high-quality general-purpose video generation from text.",
    etaSeconds: 90,
    banner: { kind: "gradient", emoji: "✨", ...GRADIENTS.violet },
  },
  {
    id: "veo3-1-quality",
    name: "Veo 3.1 Quality",
    taskType: "text-to-video",
    providerName: "Google",
    description: "DeepMind's flagship video model with audio. Best quality, longest render time.",
    etaSeconds: 90,
    banner: { kind: "image", src: VEO_DEMO },
    badge: "Premium",
  },
  {
    id: "veo3-1-fast",
    name: "Veo 3.1 Fast",
    taskType: "text-to-video",
    providerName: "Google",
    description: "Quality-tier Veo 3.1 with optimized inference for faster turnaround.",
    etaSeconds: 45,
    banner: { kind: "image", src: VEO_DEMO_2 },
    badge: "Fast",
  },
  {
    id: "veo3-1-lite",
    name: "Veo 3.1 Lite",
    taskType: "text-to-video",
    providerName: "Google",
    description: "Lightweight Veo 3.1 for quick previews and high-volume generation.",
    etaSeconds: 60,
    banner: { kind: "image", src: VEO_DEMO_3 },
  },
  {
    id: "seedance-2.0-t2v",
    name: "Seedance 2.0",
    taskType: "text-to-video",
    providerName: "ByteDance",
    description: "ByteDance's flagship video model — strong motion coherence and cinematic shots.",
    etaSeconds: 75,
    banner: { kind: "gradient", emoji: "S", ...GRADIENTS.pink },
    badge: "Popular",
  },
  {
    id: "seedance-2.0-fast-t2v",
    name: "Seedance 2.0 Fast",
    taskType: "text-to-video",
    providerName: "ByteDance",
    description: "Optimized Seedance 2.0 inference — half the wait, similar quality.",
    etaSeconds: 45,
    banner: { kind: "gradient", emoji: "S", ...GRADIENTS.rose },
    badge: "Fast",
  },
  {
    id: "kling-3",
    name: "Kling 3.0",
    taskType: "text-to-video",
    providerName: "Kling",
    description: "Kling's third-gen video model — natural motion and rich expression.",
    etaSeconds: 60,
    banner: { kind: "gradient", emoji: "K", ...GRADIENTS.violet },
  },
  {
    id: "kling-2.6-motion-control",
    name: "Kling V2.6",
    taskType: "text-to-video",
    providerName: "Kling",
    description: "Kling 2.6 with motion-control primitives for camera and subject choreography.",
    etaSeconds: 60,
    banner: { kind: "gradient", emoji: "K", ...GRADIENTS.indigo },
  },
  {
    id: "runway-gen4",
    name: "Runway Gen-4",
    taskType: "text-to-video",
    providerName: "Runway",
    description: "Runway's Gen-4 — character consistency and director-level scene control.",
    etaSeconds: 60,
    banner: { kind: "gradient", emoji: "R", ...GRADIENTS.slate },
  },
  {
    id: "hailuo-02",
    name: "Hailuo 02",
    taskType: "text-to-video",
    providerName: "MiniMax",
    description: "MiniMax's video model with strong character action and dialogue.",
    etaSeconds: 60,
    banner: { kind: "gradient", emoji: "H", ...GRADIENTS.teal },
    comingSoon: true,
  },
  {
    id: "hailuo-02-pro",
    name: "Hailuo 02 Pro",
    taskType: "text-to-video",
    providerName: "MiniMax",
    description: "Pro tier of Hailuo 02 with higher resolution and longer duration.",
    etaSeconds: 60,
    banner: { kind: "gradient", emoji: "H", ...GRADIENTS.emerald },
    comingSoon: true,
  },
  {
    id: "grok-imagine-t2v",
    name: "Grok Imagine",
    taskType: "text-to-video",
    providerName: "xAI",
    description: "xAI's video generation model with bold creative interpretation.",
    etaSeconds: 60,
    banner: { kind: "gradient", emoji: "✦", ...GRADIENTS.rose },
  },

  // ─── Image-to-Video ───
  {
    id: "seedance-2.0-r2v",
    name: "Seedance 2.0 R2V",
    taskType: "image-to-video",
    providerName: "ByteDance",
    description: "Reference-to-video — animate any still image with prompt-driven motion.",
    etaSeconds: 75,
    banner: { kind: "gradient", emoji: "S", ...GRADIENTS.pink },
    badge: "Popular",
  },
];

export const PROVIDER_NAMES = [
  "OpenAI",
  "Google",
  "Black Forest Labs",
  "ByteDance",
  "Anthropic",
  "Alibaba",
  "MiniMax",
  "Kling",
  "Runway",
  "xAI",
  "Ideogram",
  "Midjourney",
] as const;
