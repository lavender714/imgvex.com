// Credits cost per generation, based on KIE cost benchmark: 1 credit = $0.01

export const MODEL_CREDIT_COSTS: Record<string, number> = {
  // --- Text-to-Image ---
  "nano-banana": 2,
  "gpt-image-1-5": 2,
  "gpt-image-2": 3,
  "nano-banana-2": 4,
  "grok-imagine": 3,
  "ideogram": 4,
  "flux-kontext": 5,
  "flux": 7,
  "nano-banana-pro": 9,
  "midjourney": 10,
  "wan2.7-text-to-image": 10,

  // --- Image-to-Image ---
  "flux-2": 7,
  "wan2.7-image-edit": 6,
  "nano-banana-edit": 6,
  "gpt-image-2-image": 3,
  "gpt-image-1-5-image": 2,
  "nano-banana-2-image": 4,
  "flux-kontext-image": 5,

  // --- Text-to-Video (per 5-second generation) ---
  // Keys MUST match MODEL_REGISTRY id, not providerModelId
  "runway-gen4": 6,
  "hailuo-02": 15,
  "hailuo-02-pro": 23,
  "kling-3.0": 35,
  "kling-2.6-motion": 35,
  "kling-o3": 35,
  "veo-3.1-lite": 75,
  "sora-2": 75,
  "sora-2-pro": 165,
  "seedance-2.0": 155,
  "seedance-2.0-fast": 50,
  "veo-3.1-fast": 163,
  "veo-3.1-quality": 163,
  "grok-video": 50,
  "veo-3.1-lite-4k": 120,
  "veo-3.1-fast-4k": 120,
  "veo-3.1-quality-4k": 240,

  // --- Image-to-Video ---
  // Keys MUST match MODEL_REGISTRY id, not providerModelId
  "seedance-2.0-image-video": 155,
  "seedance-2.0-fast-image-video": 155,
  "wan-2.7-image-video": 60,
  "veo-3.1-fast-ref": 75,
  "veo-3.1-lite-image-video": 75,
  "veo-3.1-fast-image-video": 163,
  "veo-3.1-quality-image-video": 163,
  "sora-2-image-video": 75,
  "sora-2-pro-image-video": 165,
  "runway-gen4-image-video": 6,
  "kling-3.0-image-video": 35,
  "kling-2.6-motion-image-video": 35,
  "hailuo-02-image-video": 15,
  "hailuo-02-pro-image-video": 23,
  "grok-image-video": 50,
  "kling-o3-image-video": 35,
};

export function getModelCreditCost(modelId: string): number {
  return MODEL_CREDIT_COSTS[modelId] ?? 10;
}

/** Adjust cost for video resolution overrides */
export function getVideoCreditCost(modelId: string, resolution?: string): number {
  const base = getModelCreditCost(modelId);

  if (modelId === "runway-gen4" && resolution === "1080p") return 15;
  if (modelId === "kling-3.0" && resolution === "1080p") return 45;
  if (modelId === "kling-2.6-motion" && resolution === "1080p") return 45;

  return base;
}

// NOTE: Model↔cost consistency is validated at build time via
// `npm run prebuild` → scripts/validate-model-costs.ts
// Do NOT add a runtime IIFE here — it can break ESM bundlers.
