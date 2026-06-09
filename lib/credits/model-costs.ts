// Credits cost per generation, based on KIE cost benchmark: 1 credit = $0.01

export const MODEL_CREDIT_COSTS: Record<string, number> = {
  // --- Text-to-Image ---
  // Base prices assume 1K resolution; higher resolutions are upcharged in
  // calculateGenerationCost via applyImageSizeCost.
  "nano-banana": 3,
  "gpt-image-1-5": 2,
  "gpt-image-2": 3,
  "nano-banana-2": 4,
  "grok-imagine": 3,
  "ideogram": 4,
  "flux-kontext": 6,
  "flux": 7,
  "nano-banana-pro": 10,
  "midjourney": 12,
  "wan2.7-text-to-image": 10,

  // --- Image-to-Image ---
  "flux-2": 12,
  "wan2.7-image-edit": 12,
  "nano-banana-edit": 6,
  "gpt-image-2-image": 3,
  "gpt-image-1-5-image": 2,
  "nano-banana-2-image": 4,
  "flux-kontext-image": 5,

  // --- Text-to-Video (per 5-second generation) ---
  // Keys MUST match MODEL_REGISTRY id, not providerModelId
  // Prices set to cover highest-cost provider (KIE) at 720p with healthy margin.
  "runway-gen4": 50,
  "hailuo-02": 25,
  "hailuo-02-pro": 35,
  "kling-3.0": 45,
  "kling-2.6-motion": 45,
  "kling-o3": 50,
  "veo-3.1-lite": 75,
  "sora-2": 75,
  "sora-2-pro": 200,
  "seedance-2.0": 180,
  "seedance-2.0-fast": 100,
  "veo-3.1-fast": 163,
  "veo-3.1-quality": 170,
  "grok-video": 50,
  "veo-3.1-lite-4k": 120,
  "veo-3.1-fast-4k": 130,
  "veo-3.1-quality-4k": 280,

  // --- Image-to-Video ---
  // Keys MUST match MODEL_REGISTRY id, not providerModelId
  "seedance-2.0-image-video": 180,
  "seedance-2.0-fast-image-video": 90,
  "wan-2.7-image-video": 65,
  "veo-3.1-fast-ref": 75,
  "veo-3.1-lite-image-video": 75,
  "veo-3.1-fast-image-video": 163,
  "veo-3.1-quality-image-video": 170,
  "sora-2-image-video": 75,
  "sora-2-pro-image-video": 200,
  "runway-gen4-image-video": 50,
  "kling-3.0-image-video": 45,
  "kling-2.6-motion-image-video": 45,
  "hailuo-02-image-video": 30,
  "hailuo-02-pro-image-video": 45,
  "grok-image-video": 50,
  "kling-o3-image-video": 50,
};

export function getModelCreditCost(modelId: string): number {
  return MODEL_CREDIT_COSTS[modelId] ?? 10;
}

/** Adjust cost for video resolution overrides */
export function getVideoCreditCost(modelId: string, resolution?: string): number {
  const base = getModelCreditCost(modelId);

  // 1080p overrides — costs scale significantly at higher resolutions
  if (resolution === "1080p") {
    if (modelId === "runway-gen4") return 75;
    if (modelId === "kling-3.0") return 45;
    if (modelId === "kling-2.6-motion") return 45;
    // KIE seedance-2 1080p no-video-input costs $0.51/sec vs $0.205/sec at 720p
    if (modelId === "seedance-2.0") return 280;
    if (modelId === "seedance-2.0-image-video") return 260;
    // KIE seedance-2 fast 1080p no-video-input costs ~$0.165/sec vs $0.10/sec at 720p
    if (modelId === "seedance-2.0-fast" || modelId === "seedance-2.0-fast-image-video") return 140;
  }

  return base;
}

// NOTE: Model↔cost consistency is validated at build time via
// `npm run prebuild` → scripts/validate-model-costs.ts
// Do NOT add a runtime IIFE here — it can break ESM bundlers.
