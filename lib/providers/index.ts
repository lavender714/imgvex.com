import { getProvidersForModel, ModelProviderMapping } from "./config";
import { apipodProvider } from "./apipod";
import { kieProvider } from "./kie";

export interface GenerateOptions {
  model: string;
  prompt: string;
  size?: string;
  n?: number;
  quality?: string;
  style?: string;
  duration?: number;
  aspect_ratio?: string;
  resolution?: string;
  input_urls?: string[];
  callback_url?: string;
  [key: string]: unknown;
}

export interface ProviderStatusResult {
  status: "pending" | "processing" | "completed" | "failed" | "error" | "unknown";
  result?: string[];
  error?: string;
}

export interface Provider {
  readonly id: string;
  readonly name: string;
  readonly timeoutMs: number;
  createImageTask(options: GenerateOptions): Promise<{ task_id: string }>;
  createVideoTask(options: GenerateOptions): Promise<{ task_id: string }>;
  queryImageTask(taskId: string): Promise<ProviderStatusResult>;
  queryVideoTask(taskId: string): Promise<ProviderStatusResult>;
}

const providerMap: Record<string, Provider> = {
  apipod: apipodProvider,
  kie: kieProvider,
};

export function getProviderInstance(id: string): Provider {
  const p = providerMap[id];
  if (!p) throw new Error(`Unknown provider: ${id}`);
  return p;
}

export function getAllProviderIds(): string[] {
  return Object.keys(providerMap);
}

export interface FailoverResult {
  task_id: string;
  provider: string;
  attempts: number;
  eta_seconds: number;
  errors: string[];
}

export async function createTaskWithFailover(
  modelId: string,
  type: "image" | "video",
  options: GenerateOptions
): Promise<FailoverResult> {
  const mappings = getProvidersForModel(modelId);
  if (mappings.length === 0) {
    throw new Error(`No provider available for model: ${modelId}`);
  }

  const errors: string[] = [];

  for (let i = 0; i < mappings.length; i++) {
    const mp = mappings[i];
    const provider = getProviderInstance(mp.providerId);

    try {
      const createFn = type === "image" ? provider.createImageTask : provider.createVideoTask;

      const result = await Promise.race([
        createFn({ ...options, model: mp.providerModelId }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), provider.timeoutMs)
        ),
      ]);

      return {
        task_id: result.task_id,
        provider: mp.providerId,
        attempts: i + 1,
        eta_seconds: mp.etaSeconds,
        errors,
      };
    } catch (err: any) {
      const msg = `[${mp.providerId}] ${err?.message || "Failed"}`;
      errors.push(msg);
      console.log(`[failover] ${msg} for model ${modelId}, trying next...`);

      // 429 特殊处理：重试一次同一家供应商
      if (err?.message?.includes("429") || err?.status === 429) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const createFn = type === "image" ? provider.createImageTask : provider.createVideoTask;
          const result = await Promise.race([
            createFn({ ...options, model: mp.providerModelId }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), provider.timeoutMs)
            ),
          ]);
          return {
            task_id: result.task_id,
            provider: mp.providerId,
            attempts: i + 1,
            eta_seconds: mp.etaSeconds,
            errors,
          };
        } catch (retryErr: any) {
          errors.push(`[${mp.providerId}] Retry after 429 failed: ${retryErr?.message || "Failed"}`);
        }
      }

      continue;
    }
  }

  throw new Error(`All providers failed for model ${modelId}: ${errors.join("; ")}`);
}

export async function queryTask(
  providerId: string,
  taskId: string,
  type: "image" | "video"
): Promise<ProviderStatusResult> {
  const provider = getProviderInstance(providerId);
  const queryFn = type === "image" ? provider.queryImageTask : provider.queryVideoTask;
  return queryFn(taskId);
}

