import { GenerateOptions, Provider, ProviderStatusResult } from "./index";

function loadEnv(key: string, defaultValue?: string): string {
  const envValue = process.env[key];
  if (envValue) return envValue;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`[provider:kie] Missing env var: ${key}`);
}

const baseUrl = loadEnv("KIE_BASE_URL", "https://kie.ai/api/v1");
const apiKey = loadEnv("KIE_API_KEY", "");

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

function sizeToResolution(size?: string): string {
  const map: Record<string, string> = {
    "1024x1024": "1K",
    "2048x2048": "2K",
    "4096x4096": "4K",
    "1K": "1K",
    "2K": "2K",
    "4K": "4K",
  };
  return map[size || ""] || "1K";
}

function buildKieImageBody(options: GenerateOptions): any {
  const modelId = options.model || "";
  const isImageToImage = modelId.includes("image-to-image");
  const isTextToImage = modelId.includes("text-to-image");

  const input: Record<string, any> = {
    prompt: options.prompt,
    aspect_ratio: options.aspect_ratio || (isImageToImage ? "auto" : "1:1"),
    resolution: options.resolution || sizeToResolution(options.size),
  };

  if (isImageToImage && options.input_urls && options.input_urls.length > 0) {
    input.input_urls = options.input_urls;
  }

  if (options.quality) {
    input.quality = options.quality;
  }

  if (options.style) {
    input.style = options.style;
  }

  return {
    model: modelId,
    input,
  };
}

function normalizeResult(raw: any): ProviderStatusResult {
  const rawStatus = raw.data?.status || raw.status || "unknown";
  const result = raw.data?.result || raw.result || [];
  const error = raw.data?.error || raw.error || raw.msg || raw.message;

  // Map KIE status values to unified status
  const statusMap: Record<string, ProviderStatusResult["status"]> = {
    success: "completed",
    completed: "completed",
    done: "completed",
    processing: "processing",
    running: "processing",
    pending: "pending",
    queued: "pending",
    failed: "failed",
    error: "failed",
    fail: "failed",
  };
  const status = statusMap[rawStatus] || (rawStatus as ProviderStatusResult["status"]);

  const urls = Array.isArray(result)
    ? result.map((r: any) => (typeof r === "string" ? r : r.url)).filter(Boolean)
    : [];

  return {
    status,
    result: urls,
    error,
  };
}

export const kieProvider: Provider = {
  id: "kie",
  name: "KIE",
  timeoutMs: 10000,

  async createImageTask(options: GenerateOptions) {
    const body = buildKieImageBody(options);
    const res = await fetch(`${baseUrl}/jobs/createTask`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`KIE image generation failed: ${res.status} ${err}`);
    }

    const data = await res.json();
    const taskId = data.data?.taskId || data.data?.task_id || data.taskId || data.task_id;
    if (!taskId) throw new Error("No task_id returned from KIE");
    return { task_id: taskId };
  },

  async createVideoTask(options: GenerateOptions) {
    const res = await fetch(`${baseUrl}/jobs/createTask`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        model: options.model,
        input: {
          prompt: options.prompt,
          ...(options.aspect_ratio ? { aspect_ratio: options.aspect_ratio } : {}),
          ...(options.duration ? { duration: options.duration } : {}),
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`KIE video generation failed: ${res.status} ${err}`);
    }

    const data = await res.json();
    const taskId = data.data?.taskId || data.data?.task_id || data.taskId || data.task_id;
    if (!taskId) throw new Error("No task_id returned from KIE");
    return { task_id: taskId };
  },

  async queryImageTask(taskId: string) {
    const res = await fetch(`${baseUrl}/jobs/recordInfo?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`KIE query failed: ${res.status} ${err}`);
    }

    const raw = await res.json();
    return normalizeResult(raw);
  },

  async queryVideoTask(taskId: string) {
    return this.queryImageTask(taskId);
  },
};
