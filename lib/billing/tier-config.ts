import type { PlanTier } from "./creem-products";

export type { PlanTier };

export interface TierPermissions {
  /** Maximum image resolution allowed */
  maxImageResolution: "1024x1024" | "2048x2048" | "4096x4096";
  /** Maximum video resolution allowed */
  maxVideoResolution: null | "720p" | "1080p" | "4K";
  /** Maximum video duration in seconds (0 = no video) */
  maxVideoDuration: number;
  /** Max concurrent generation jobs */
  maxConcurrentJobs: number;
  /** Whether outputs include watermark */
  hasWatermark: boolean;
  /** Whether commercial use is allowed */
  commercialLicense: boolean;
  /** Whether to use priority processing queue */
  priorityQueue: boolean;
  /** Whether video privacy controls are available */
  privacyControls: boolean;
  /** Whether copy protection is available */
  copyProtection: boolean;
  /** Support tier label */
  supportTier: "community" | "standard" | "priority";
}

/** Model ID mapping from display names to internal model-cost keys */
export const UNLIMITED_MODEL_MAP: Record<string, string | null> = {
  "Nano Banana Pro": "nano-banana-pro",
  "Kling 3.0": "kling-3.0",
  "GPT Image 2.0": "gpt-image-2",
  "Nano Banana 2": "nano-banana-2",
  "GPT Image 1.5": "gpt-image-1-5",
  "Grok Imagine": "grok-imagine",
  "Flux": "flux",
  "Seedream 4.5": null, // TODO: add model when available
  "Seedream 5.0 Lite": null, // TODO: add model when available
  "Nano Banana": "nano-banana",
};

/** Promo config for Ultra unlimited models */
export const ULTRA_PROMO = {
  /** Promotion end date — after this, new Ultra subs won't get unlimited */
  promoEndDate: "2026-07-10T23:59:59Z",
  /** Each unlimited model grant expires N days after subscription activation */
  grantDurationDays: 10,
  /** 10-Day unlimited models (high-value models) */
  tenDayModels: ["Nano Banana Pro", "Kling 3.0"] as const,
  /** 365-Day unlimited models (low-cost base models) */
  yearDayModels: [
    "GPT Image 2.0",
    "Nano Banana 2",
    "GPT Image 1.5",
    "Grok Imagine",
    "Flux",
    "Seedream 4.5",
    "Seedream 5.0 Lite",
    "Nano Banana",
  ] as const,
};

export const TIER_CONFIG: Record<PlanTier, TierPermissions> = {
  free: {
    maxImageResolution: "1024x1024",
    maxVideoResolution: null,
    maxVideoDuration: 0,
    maxConcurrentJobs: 1,
    hasWatermark: true,
    commercialLicense: false,
    priorityQueue: false,
    privacyControls: false,
    copyProtection: false,
    supportTier: "community",
  },
  lite: {
    maxImageResolution: "2048x2048",
    maxVideoResolution: "720p",
    maxVideoDuration: 10,
    maxConcurrentJobs: 2,
    hasWatermark: true,
    commercialLicense: true,
    priorityQueue: false,
    privacyControls: false,
    copyProtection: false,
    supportTier: "standard",
  },
  pro: {
    maxImageResolution: "4096x4096",
    maxVideoResolution: "1080p",
    maxVideoDuration: 15,
    maxConcurrentJobs: 3,
    hasWatermark: false,
    commercialLicense: true,
    priorityQueue: true,
    privacyControls: true,
    copyProtection: true,
    supportTier: "priority",
  },
  ultra: {
    maxImageResolution: "4096x4096",
    maxVideoResolution: "4K",
    maxVideoDuration: 60,
    maxConcurrentJobs: 6,
    hasWatermark: false,
    commercialLicense: true,
    priorityQueue: true,
    privacyControls: true,
    copyProtection: true,
    supportTier: "priority",
  },
};

// ─── Resolution helpers ───

const VIDEO_RES_ORDER = ["480p", "720p", "1080p", "4K"] as const;

export function isVideoResolutionAllowed(
  requested: string,
  maxAllowed: string | null,
): boolean {
  if (!maxAllowed) return false;
  const reqIdx = VIDEO_RES_ORDER.indexOf(requested as (typeof VIDEO_RES_ORDER)[number]);
  const maxIdx = VIDEO_RES_ORDER.indexOf(maxAllowed as (typeof VIDEO_RES_ORDER)[number]);
  if (reqIdx === -1 || maxIdx === -1) return false;
  return reqIdx <= maxIdx;
}

const IMAGE_RES_ORDER = ["1024x1024", "2048x2048", "4096x4096"] as const;

export function isImageResolutionAllowed(
  requested: string,
  maxAllowed: string,
): boolean {
  const reqIdx = IMAGE_RES_ORDER.indexOf(requested as (typeof IMAGE_RES_ORDER)[number]);
  const maxIdx = IMAGE_RES_ORDER.indexOf(maxAllowed as (typeof IMAGE_RES_ORDER)[number]);
  if (reqIdx === -1 || maxIdx === -1) return false;
  return reqIdx <= maxIdx;
}

// ─── Unlimited helpers ───

export interface UnlimitedEntry {
  type: "10-day" | "365-day";
  /** ISO timestamp when this unlimited grant expires */
  expires_at: string;
}

/** Build the unlimited_models JSONB for a new Ultra subscriber */
export function buildUltraUnlimitedModels(subscriptionStartDate: Date = new Date()): Record<string, UnlimitedEntry> {
  const now = subscriptionStartDate;
  const promoEnd = new Date(ULTRA_PROMO.promoEndDate);

  // If promo has ended, no unlimited models
  if (now > promoEnd) {
    return {};
  }

  const result: Record<string, UnlimitedEntry> = {};

  for (const name of ULTRA_PROMO.tenDayModels) {
    const modelId = UNLIMITED_MODEL_MAP[name];
    if (!modelId) continue;
    const expires = new Date(now);
    expires.setDate(expires.getDate() + ULTRA_PROMO.grantDurationDays);
    // Cap at promo end date
    const finalExpires = expires > promoEnd ? promoEnd : expires;
    result[modelId] = {
      type: "10-day",
      expires_at: finalExpires.toISOString(),
    };
  }

  for (const name of ULTRA_PROMO.yearDayModels) {
    const modelId = UNLIMITED_MODEL_MAP[name];
    if (!modelId) continue;
    const expires = new Date(now);
    expires.setDate(expires.getDate() + 365);
    // Cap at promo end date for year-day models too? Or let them run full year?
    // Per user intent: 365-day means 365 days from purchase, but promo ends 7/10
    // We'll let year-day run for 365 days even past promo date since it's already granted
    result[modelId] = {
      type: "365-day",
      expires_at: expires.toISOString(),
    };
  }

  return result;
}

/** Check if a model is currently unlimited for the user */
export function isModelUnlimited(
  modelId: string,
  unlimitedModels: Record<string, UnlimitedEntry> | null,
): boolean {
  if (!unlimitedModels) return false;
  const entry = unlimitedModels[modelId];
  if (!entry) return false;
  return new Date(entry.expires_at) > new Date();
}
