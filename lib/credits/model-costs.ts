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

  // --- Image-to-Image ---
  "flux-2": 7,
  "wan2.7-image-edit": 6,
  "nano-banana-edit": 6,
  "gpt-image-2-image": 3,
  "gpt-image-1-5-image": 2,

  // --- Text-to-Video (per 5-second generation) ---
  "runway-gen4": 6,
  "hailuo-02": 15,
  "hailuo-02-pro": 23,
  "kling-3": 35,
  "kling-2.6-motion-control": 35,
  "veo3-1-lite": 75,
  "sora-2-vip": 75,
  "sora-2-pro": 165,
  "seedance-2.0-fast-t2v": 50,
  "seedance-2.0-t2v": 155,
  "veo3-1-fast": 163,
  "veo3-1-quality": 163,
  "grok-imagine-t2v": 50,

  // --- Image-to-Video ---
  "seedance-2.0-r2v": 155,
};

export function getModelCreditCost(modelId: string): number {
  return MODEL_CREDIT_COSTS[modelId] ?? 10;
}

/** Adjust cost for video resolution overrides */
export function getVideoCreditCost(modelId: string, resolution?: string): number {
  const base = getModelCreditCost(modelId);

  if (modelId === "runway-gen4" && resolution === "1080p") return 15;
  if (modelId === "kling-3" && resolution === "1080p") return 45;
  if (modelId === "kling-2.6-motion-control" && resolution === "1080p") return 45;

  return base;
}
