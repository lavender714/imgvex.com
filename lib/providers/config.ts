export interface ProviderConfig {
  id: string;
  name: string;
  baseUrlEnv: string;
  apiKeyEnv: string;
  timeoutMs: number;
  defaultBaseUrl: string;
}

export interface ModelProviderMapping {
  providerId: string;
  providerModelId: string;
  priority: number;
  etaSeconds: number;
}

export const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    id: "apipod",
    name: "APIPod",
    baseUrlEnv: "APIPOD_BASE_URL",
    apiKeyEnv: "APIPOD_API_KEY",
    timeoutMs: 10000,
    defaultBaseUrl: "https://api.apipod.ai/v1",
  },
  {
    id: "kie",
    name: "KIE",
    baseUrlEnv: "KIE_BASE_URL",
    apiKeyEnv: "KIE_API_KEY",
    timeoutMs: 10000,
    defaultBaseUrl: "https://kie.ai/api/v1",
  },
];

// 模型 → 供应商映射（按 priority 排序，priority 越小越优先）
// 注意：providerModelId 是供应商内部的模型 ID，和前端展示的 model id 不同
export const MODEL_PROVIDER_MAP: Record<string, ModelProviderMapping[]> = {
  // 图片模型
  "flux": [
    { providerId: "apipod", providerModelId: "flux-pro", priority: 1, etaSeconds: 18 },
  ],
  "gpt-image-2": [
    { providerId: "apipod", providerModelId: "gpt-image-2", priority: 1, etaSeconds: 25 },
  ],
  "nano-banana-2": [
    { providerId: "apipod", providerModelId: "nano-banana-2", priority: 1, etaSeconds: 18 },
  ],
  "nano-banana-pro": [
    { providerId: "apipod", providerModelId: "nano-banana-pro", priority: 1, etaSeconds: 22 },
  ],
  "nano-banana": [
    { providerId: "apipod", providerModelId: "nano-banana", priority: 1, etaSeconds: 18 },
  ],
  "gpt-image-1-5": [
    { providerId: "apipod", providerModelId: "gpt-image-1-5", priority: 1, etaSeconds: 25 },
  ],
  "grok-imagine": [
    { providerId: "apipod", providerModelId: "grok-imagine", priority: 1, etaSeconds: 25 },
  ],
  "ideogram": [
    { providerId: "apipod", providerModelId: "ideogram", priority: 1, etaSeconds: 20 },
  ],
  "flux-2": [
    { providerId: "apipod", providerModelId: "flux-2", priority: 1, etaSeconds: 18 },
  ],
  "flux-kontext": [
    { providerId: "apipod", providerModelId: "flux-kontext", priority: 1, etaSeconds: 20 },
  ],
  "wan2.7-image-edit": [
    { providerId: "apipod", providerModelId: "wan2.7-image-edit", priority: 1, etaSeconds: 20 },
  ],
  "midjourney": [
    { providerId: "apipod", providerModelId: "midjourney", priority: 1, etaSeconds: 30 },
  ],

  // 视频模型
  "seedance-2.0-t2v": [
    { providerId: "apipod", providerModelId: "seedance-2.0-t2v", priority: 1, etaSeconds: 75 },
  ],
  "seedance-2.0-fast-t2v": [
    { providerId: "apipod", providerModelId: "seedance-2.0-fast-t2v", priority: 1, etaSeconds: 45 },
  ],
  "seedance-2.0-r2v": [
    { providerId: "apipod", providerModelId: "seedance-2.0-r2v", priority: 1, etaSeconds: 75 },
  ],
  "veo3-1-lite": [
    { providerId: "apipod", providerModelId: "veo3-1-lite", priority: 1, etaSeconds: 60 },
  ],
  "veo3-1-fast": [
    { providerId: "apipod", providerModelId: "veo3-1-fast", priority: 1, etaSeconds: 45 },
  ],
  "veo3-1-quality": [
    { providerId: "apipod", providerModelId: "veo3-1-quality", priority: 1, etaSeconds: 90 },
  ],
  "sora-2-vip": [
    { providerId: "apipod", providerModelId: "sora-2-vip", priority: 1, etaSeconds: 90 },
  ],
  "sora-2-pro": [
    { providerId: "apipod", providerModelId: "sora-2-pro", priority: 1, etaSeconds: 90 },
  ],
  "runway-gen4": [
    { providerId: "apipod", providerModelId: "runway-gen4", priority: 1, etaSeconds: 60 },
  ],
  "kling-3": [
    { providerId: "apipod", providerModelId: "kling-3", priority: 1, etaSeconds: 60 },
  ],
  "kling-2.6-motion-control": [
    { providerId: "apipod", providerModelId: "kling-2.6-motion-control", priority: 1, etaSeconds: 60 },
  ],
  "hailuo-02": [
    { providerId: "apipod", providerModelId: "hailuo-02", priority: 1, etaSeconds: 60 },
  ],
  "hailuo-02-pro": [
    { providerId: "apipod", providerModelId: "hailuo-02-pro", priority: 1, etaSeconds: 60 },
  ],
  "grok-imagine-t2v": [
    { providerId: "apipod", providerModelId: "grok-imagine-t2v", priority: 1, etaSeconds: 60 },
  ],
};

export function getProvidersForModel(modelId: string): ModelProviderMapping[] {
  const mappings = MODEL_PROVIDER_MAP[modelId];
  if (!mappings || mappings.length === 0) {
    return [];
  }
  return [...mappings].sort((a, b) => a.priority - b.priority);
}
