import { TaskType } from "./index";

export interface ProviderConfig {
  id: string;
  name: string;
  baseUrlEnv: string;
  apiKeyEnv: string;
  timeoutMs: number;
  defaultBaseUrl: string;
}

export interface ModelRegistrationProviderMapping {
  providerId: string;
  providerModelId: string;
  priority: number;
  etaSeconds: number;
}

export interface ModelRegistration {
  id: string;
  name: string;
  taskType: TaskType;
  logo?: string;
  comingSoon?: boolean;
  providers: ModelRegistrationProviderMapping[];
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
    defaultBaseUrl: "https://api.kie.ai/api/v1",
  },
  {
    id: "evolink",
    name: "EvoLink",
    baseUrlEnv: "EVOLINK_BASE_URL",
    apiKeyEnv: "EVOLINK_API_KEY",
    timeoutMs: 10000,
    defaultBaseUrl: "https://api.evolink.ai",
  },
];

// 模型注册表 — 每个模型明确声明 taskType 和支持的供应商
export const MODEL_REGISTRY: ModelRegistration[] = [
  // 文生图
  {
    id: "nano-banana",
    name: "Nano Banana",
    taskType: "text-to-image",
    logo: "N",
    providers: [
      { providerId: "kie", providerModelId: "google/nano-banana", priority: 1, etaSeconds: 18 },
      { providerId: "apipod", providerModelId: "nano-banana", priority: 2, etaSeconds: 18 },
      { providerId: "evolink", providerModelId: "nano-banana-beta", priority: 3, etaSeconds: 18 },
    ],
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    taskType: "text-to-image",
    logo: "N+",
    providers: [
      { providerId: "kie", providerModelId: "nano-banana-pro", priority: 1, etaSeconds: 22 },
      { providerId: "apipod", providerModelId: "nano-banana-pro", priority: 2, etaSeconds: 22 },
      { providerId: "evolink", providerModelId: "nano-banana-pro-beta", priority: 3, etaSeconds: 22 },
    ],
  },
  {
    id: "nano-banana-2",
    name: "Nano Banana 2",
    taskType: "text-to-image",
    logo: "N",
    providers: [
      { providerId: "kie", providerModelId: "nano-banana-2", priority: 1, etaSeconds: 18 },
      { providerId: "apipod", providerModelId: "nano-banana-2", priority: 2, etaSeconds: 18 },
      { providerId: "evolink", providerModelId: "nano-banana-2-beta", priority: 3, etaSeconds: 18 },
    ],
  },
  {
    id: "gpt-image-2",
    name: "GPT Image 2.0",
    taskType: "text-to-image",
    logo: "G",
    providers: [
      { providerId: "kie", providerModelId: "gpt-image-2-text-to-image", priority: 1, etaSeconds: 25 },
      { providerId: "apipod", providerModelId: "gpt-image-2", priority: 2, etaSeconds: 25 },
      { providerId: "evolink", providerModelId: "gpt-image-2", priority: 3, etaSeconds: 25 },
    ],
  },
  {
    id: "gpt-image-1-5",
    name: "GPT Image 1.5",
    taskType: "text-to-image",
    logo: "G",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "gpt-image/1.5-text-to-image", priority: 1, etaSeconds: 25 },
      { providerId: "apipod", providerModelId: "gpt-image-1-5", priority: 2, etaSeconds: 25 },
      { providerId: "evolink", providerModelId: "gpt-image-1.5", priority: 3, etaSeconds: 25 },
    ],
  },
  {
    id: "grok-imagine",
    name: "Grok",
    taskType: "text-to-image",
    logo: "G",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "grok-imagine/text-to-image", priority: 1, etaSeconds: 25 },
      { providerId: "apipod", providerModelId: "grok-imagine", priority: 2, etaSeconds: 25 },
    ],
  },
  {
    id: "ideogram",
    name: "Ideogram",
    taskType: "text-to-image",
    logo: "I",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "ideogram/v3-text-to-image", priority: 1, etaSeconds: 20 },
      { providerId: "apipod", providerModelId: "ideogram", priority: 2, etaSeconds: 20 },
    ],
  },
  {
    id: "flux",
    name: "Flux",
    taskType: "text-to-image",
    logo: "F",
    providers: [
      { providerId: "kie", providerModelId: "flux-2/flex-text-to-image", priority: 1, etaSeconds: 15 },
    ],
  },
  {
    id: "flux-kontext",
    name: "Flux Kontext",
    taskType: "text-to-image",
    logo: "F",
    providers: [
      { providerId: "kie", providerModelId: "flux-kontext-pro", priority: 1, etaSeconds: 20 },
      { providerId: "apipod", providerModelId: "flux-kontext", priority: 2, etaSeconds: 20 },
    ],
  },
  {
    id: "midjourney",
    name: "Midjourney",
    taskType: "text-to-image",
    logo: "M",
    providers: [
      { providerId: "apipod", providerModelId: "midjourney", priority: 1, etaSeconds: 30 },
      { providerId: "evolink", providerModelId: "mj-v7", priority: 2, etaSeconds: 45 },
    ],
  },
  {
    id: "wan2.7-text-to-image",
    name: "Wan 2.7",
    taskType: "text-to-image",
    logo: "W",
    providers: [
      { providerId: "apipod", providerModelId: "wan2.7-image", priority: 1, etaSeconds: 20 },
    ],
  },

  // 图生图
  {
    id: "flux-2",
    name: "Flux 2",
    taskType: "image-to-image",
    logo: "F",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "flux-2/flex-image-to-image", priority: 1, etaSeconds: 18 },
      { providerId: "apipod", providerModelId: "flux-2", priority: 2, etaSeconds: 18 },
    ],
  },
  {
    id: "wan2.7-image-edit",
    name: "Wan 2.7",
    taskType: "image-to-image",
    logo: "W",
    providers: [
      { providerId: "kie", providerModelId: "wan/2-7-image", priority: 1, etaSeconds: 20 },
      { providerId: "apipod", providerModelId: "wan2.7-image-edit", priority: 2, etaSeconds: 20 },
    ],
  },
  {
    id: "nano-banana-edit",
    name: "Nano Banana Edit",
    taskType: "image-to-image",
    logo: "N+",
    providers: [
      { providerId: "kie", providerModelId: "google/nano-banana-edit", priority: 1, etaSeconds: 22 },
    ],
  },
  {
    id: "nano-banana-2-image",
    name: "Nano Banana 2",
    taskType: "image-to-image",
    logo: "N",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "nano-banana-2", priority: 1, etaSeconds: 18 },
      { providerId: "apipod", providerModelId: "nano-banana-2-image", priority: 2, etaSeconds: 18 },
      { providerId: "evolink", providerModelId: "nano-banana-2-image", priority: 3, etaSeconds: 18 },
    ],
  },
  {
    id: "gpt-image-2-image",
    name: "GPT Image 2.0",
    taskType: "image-to-image",
    logo: "G",
    providers: [
      { providerId: "kie", providerModelId: "gpt-image-2-image-to-image", priority: 1, etaSeconds: 25 },
      { providerId: "evolink", providerModelId: "gpt-image-2", priority: 3, etaSeconds: 25 },
    ],
  },
  {
    id: "gpt-image-1-5-image",
    name: "GPT Image 1.5",
    taskType: "image-to-image",
    logo: "G",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "gpt-image/1.5-image-to-image", priority: 1, etaSeconds: 25 },
      { providerId: "evolink", providerModelId: "gpt-image-1.5", priority: 3, etaSeconds: 25 },
    ],
  },
  {
    id: "flux-kontext-image",
    name: "Flux Kontext",
    taskType: "image-to-image",
    logo: "F",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "flux-kontext-pro", priority: 1, etaSeconds: 20 },
      { providerId: "apipod", providerModelId: "flux-kontext-image", priority: 2, etaSeconds: 20 },
    ],
  },

  // 文生视频
  {
    id: "seedance-2.0-t2v",
    name: "Seedance 2.0",
    taskType: "text-to-video",
    logo: "S",
    providers: [
      { providerId: "kie", providerModelId: "bytedance/seedance-2", priority: 1, etaSeconds: 75 },
      { providerId: "apipod", providerModelId: "seedance-2.0-t2v", priority: 2, etaSeconds: 75 },
      { providerId: "evolink", providerModelId: "seedance-2.0-text-to-video", priority: 3, etaSeconds: 75 },
    ],
  },
  {
    id: "seedance-2.0-fast-t2v",
    name: "Seedance 2.0 Fast",
    taskType: "text-to-video",
    logo: "S",
    providers: [
      { providerId: "kie", providerModelId: "bytedance/seedance-2-fast", priority: 1, etaSeconds: 45 },
      { providerId: "apipod", providerModelId: "seedance-2.0-fast-t2v", priority: 2, etaSeconds: 45 },
      { providerId: "evolink", providerModelId: "seedance-2.0-fast-text-to-video", priority: 3, etaSeconds: 45 },
    ],
  },
  {
    id: "seedance-2.0-r2v",
    name: "Seedance 2.0",
    taskType: "image-to-video",
    logo: "S",
    providers: [
      { providerId: "kie", providerModelId: "bytedance/seedance-2", priority: 1, etaSeconds: 75 },
      { providerId: "apipod", providerModelId: "seedance-2.0-r2v", priority: 2, etaSeconds: 75 },
      { providerId: "evolink", providerModelId: "seedance-2.0-image-to-video", priority: 3, etaSeconds: 75 },
    ],
  },
  {
    id: "seedance-2.0-fast-r2v",
    name: "Seedance 2.0 fast",
    taskType: "image-to-video",
    logo: "S",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "bytedance/seedance-2-fast", priority: 1, etaSeconds: 45 },
      { providerId: "apipod", providerModelId: "seedance-2.0-fast-r2v", priority: 2, etaSeconds: 45 },
      { providerId: "evolink", providerModelId: "seedance-2.0-fast-image-to-video", priority: 3, etaSeconds: 45 },
    ],
  },
  {
    id: "veo3-1-lite-i2v",
    name: "Veo 3.1 Lite",
    taskType: "image-to-video",
    logo: "V",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "veo3_lite", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "veo3-1-lite-i2v", priority: 2, etaSeconds: 60 },
    ],
  },
  {
    id: "veo3-1-fast-i2v",
    name: "Veo 3.1 Fast",
    taskType: "image-to-video",
    logo: "V",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "veo3_fast", priority: 1, etaSeconds: 45 },
      { providerId: "apipod", providerModelId: "veo3-1-fast-i2v", priority: 2, etaSeconds: 45 },
      { providerId: "evolink", providerModelId: "veo-3.1-fast-image-to-video", priority: 3, etaSeconds: 45 },
    ],
  },
  {
    id: "veo3-1-quality-i2v",
    name: "Veo 3.1 Quality",
    taskType: "image-to-video",
    logo: "V",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "veo3", priority: 1, etaSeconds: 90 },
      { providerId: "apipod", providerModelId: "veo3-1-quality-i2v", priority: 2, etaSeconds: 90 },
      { providerId: "evolink", providerModelId: "veo-3.1-generate-image-to-video", priority: 3, etaSeconds: 90 },
    ],
  },
  {
    id: "sora-2-vip-i2v",
    name: "Sora 2",
    taskType: "image-to-video",
    logo: "S",
    comingSoon: true,
    providers: [
      { providerId: "apipod", providerModelId: "sora-2-vip-i2v", priority: 1, etaSeconds: 90 },
      { providerId: "evolink", providerModelId: "sora-2-image-to-video", priority: 2, etaSeconds: 90 },
    ],
  },
  {
    id: "sora-2-pro-i2v",
    name: "Sora 2 Pro",
    taskType: "image-to-video",
    logo: "S",
    comingSoon: true,
    providers: [
      { providerId: "apipod", providerModelId: "sora-2-pro-i2v", priority: 1, etaSeconds: 90 },
      { providerId: "evolink", providerModelId: "sora-2-pro-image-to-video", priority: 2, etaSeconds: 90 },
    ],
  },
  {
    id: "runway-gen4-i2v",
    name: "Runway",
    taskType: "image-to-video",
    logo: "R",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "runway", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "runway-gen4-i2v", priority: 2, etaSeconds: 60 },
    ],
  },
  {
    id: "kling-3-i2v",
    name: "Kling 3.0",
    taskType: "image-to-video",
    logo: "K",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "kling-3.0/video", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "kling-3-i2v", priority: 2, etaSeconds: 60 },
      { providerId: "evolink", providerModelId: "kling-v3-image-to-video", priority: 3, etaSeconds: 60 },
    ],
  },
  {
    id: "kling-2.6-motion-control-i2v",
    name: "Kling V2.6",
    taskType: "image-to-video",
    logo: "K",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "kling-2.6/image-to-video", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "kling-2.6-motion-control-i2v", priority: 2, etaSeconds: 60 },
      { providerId: "evolink", providerModelId: "kling-v3-motion-control-image", priority: 3, etaSeconds: 60 },
    ],
  },
  {
    id: "hailuo-02-i2v",
    name: "Hailuo 02",
    taskType: "image-to-video",
    logo: "H",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "hailuo/2-3-image-to-video-standard", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "hailuo-02-i2v", priority: 2, etaSeconds: 60 },
      { providerId: "evolink", providerModelId: "MiniMax-Hailuo-02-image", priority: 3, etaSeconds: 60 },
    ],
  },
  {
    id: "hailuo-02-pro-i2v",
    name: "Hailuo 02 Pro",
    taskType: "image-to-video",
    logo: "H",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "hailuo/2-3-image-to-video-pro", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "hailuo-02-pro-i2v", priority: 2, etaSeconds: 60 },
      { providerId: "evolink", providerModelId: "MiniMax-Hailuo-2.3-image", priority: 3, etaSeconds: 60 },
    ],
  },
  {
    id: "grok-imagine-i2v",
    name: "Grok",
    taskType: "image-to-video",
    logo: "G",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "grok-imagine/image-to-video", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "grok-imagine-i2v", priority: 2, etaSeconds: 60 },
      { providerId: "evolink", providerModelId: "grok-imagine-image-to-video-beta", priority: 3, etaSeconds: 60 },
    ],
  },
  {
    id: "veo3-1-lite",
    name: "Veo 3.1 Lite",
    taskType: "text-to-video",
    logo: "V",
    providers: [
      { providerId: "kie", providerModelId: "veo3_lite", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "veo3-1-lite", priority: 2, etaSeconds: 60 },
    ],
  },
  {
    id: "veo3-1-fast",
    name: "Veo 3.1 Fast",
    taskType: "text-to-video",
    logo: "V",
    providers: [
      { providerId: "kie", providerModelId: "veo3_fast", priority: 1, etaSeconds: 45 },
      { providerId: "apipod", providerModelId: "veo3-1-fast", priority: 2, etaSeconds: 45 },
      { providerId: "evolink", providerModelId: "veo-3.1-fast", priority: 3, etaSeconds: 45 },
    ],
  },
  {
    id: "veo3-1-quality",
    name: "Veo 3.1 Quality",
    taskType: "text-to-video",
    logo: "V",
    providers: [
      { providerId: "kie", providerModelId: "veo3", priority: 1, etaSeconds: 90 },
      { providerId: "apipod", providerModelId: "veo3-1-quality", priority: 2, etaSeconds: 90 },
      { providerId: "evolink", providerModelId: "veo-3.1-generate-preview", priority: 3, etaSeconds: 90 },
    ],
  },
  {
    id: "sora-2-vip",
    name: "Sora 2",
    taskType: "text-to-video",
    logo: "S",
    providers: [
      { providerId: "apipod", providerModelId: "sora-2-vip", priority: 1, etaSeconds: 90 },
      { providerId: "evolink", providerModelId: "sora-2-preview", priority: 2, etaSeconds: 90 },
    ],
  },
  {
    id: "sora-2-pro",
    name: "Sora 2 Pro",
    taskType: "text-to-video",
    logo: "S",
    comingSoon: true,
    providers: [
      { providerId: "apipod", providerModelId: "sora-2-pro", priority: 1, etaSeconds: 90 },
      { providerId: "evolink", providerModelId: "sora-2-pro-preview", priority: 2, etaSeconds: 90 },
    ],
  },
  {
    id: "runway-gen4",
    name: "Runway",
    taskType: "text-to-video",
    logo: "R",
    providers: [
      { providerId: "kie", providerModelId: "runway", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "runway-gen4", priority: 2, etaSeconds: 60 },
    ],
  },
  {
    id: "kling-3",
    name: "Kling 3.0",
    taskType: "text-to-video",
    logo: "K",
    providers: [
      { providerId: "kie", providerModelId: "kling-3.0/video", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "kling-3", priority: 2, etaSeconds: 60 },
      { providerId: "evolink", providerModelId: "kling-v3-text-to-video", priority: 3, etaSeconds: 60 },
    ],
  },
  {
    id: "kling-2.6-motion-control",
    name: "Kling V2.6",
    taskType: "text-to-video",
    logo: "K",
    providers: [
      { providerId: "kie", providerModelId: "kling-2.6/text-to-video", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "kling-2.6-motion-control", priority: 2, etaSeconds: 60 },
      { providerId: "evolink", providerModelId: "kling-v3-motion-control", priority: 3, etaSeconds: 60 },
    ],
  },
  {
    id: "hailuo-02",
    name: "Hailuo 02",
    taskType: "text-to-video",
    logo: "H",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "hailuo/02-text-to-video-standard", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "hailuo-02", priority: 2, etaSeconds: 60 },
      { providerId: "evolink", providerModelId: "MiniMax-Hailuo-02", priority: 3, etaSeconds: 60 },
    ],
  },
  {
    id: "hailuo-02-pro",
    name: "Hailuo 02 Pro",
    taskType: "text-to-video",
    logo: "H",
    comingSoon: true,
    providers: [
      { providerId: "kie", providerModelId: "hailuo/02-text-to-video-pro", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "hailuo-02-pro", priority: 2, etaSeconds: 60 },
      { providerId: "evolink", providerModelId: "MiniMax-Hailuo-2.3", priority: 3, etaSeconds: 60 },
    ],
  },
  {
    id: "grok-imagine-t2v",
    name: "Grok",
    taskType: "text-to-video",
    logo: "G",
    providers: [
      { providerId: "kie", providerModelId: "grok-imagine/text-to-video", priority: 1, etaSeconds: 60 },
      { providerId: "apipod", providerModelId: "grok-imagine-t2v", priority: 2, etaSeconds: 60 },
      { providerId: "evolink", providerModelId: "grok-imagine-text-to-video-beta", priority: 3, etaSeconds: 60 },
    ],
  },
];

const modelRegistryMap: Record<string, ModelRegistration> = {};
for (const m of MODEL_REGISTRY) {
  modelRegistryMap[m.id] = m;
}

export function getModelRegistration(modelId: string): ModelRegistration | undefined {
  return modelRegistryMap[modelId];
}

// 兼容旧接口：获取模型支持的供应商（不区分 taskType 过滤，由调用方过滤）
export function getProvidersForModel(modelId: string): ModelRegistrationProviderMapping[] {
  const reg = getModelRegistration(modelId);
  if (!reg) return [];
  return [...reg.providers].sort((a, b) => a.priority - b.priority);
}

// 按任务类型获取前端模型列表（用于替换页面中硬编码的 models 数组）
export function getModelsByTaskType(taskType: TaskType): ModelRegistration[] {
  return MODEL_REGISTRY.filter((m) => m.taskType === taskType);
}

// 获取模型预估耗时（取最高优先级 provider 的 etaSeconds）
export function getEtaSeconds(modelId: string): number {
  const reg = getModelRegistration(modelId);
  if (!reg || reg.providers.length === 0) return 20;
  const sorted = [...reg.providers].sort((a, b) => a.priority - b.priority);
  return sorted[0].etaSeconds;
}

// 按供应商获取其支持的所有模型注册项
export function getModelsByProvider(providerId: string): ModelRegistration[] {
  return MODEL_REGISTRY.filter((m) => m.providers.some((p) => p.providerId === providerId));
}
