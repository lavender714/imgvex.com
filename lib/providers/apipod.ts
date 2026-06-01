import { ProviderAdapter, ProviderStatusResult, TaskOptions, TaskType } from "./index";

function loadEnv(key: string, defaultValue?: string): string {
  const envValue = process.env[key];
  if (envValue) return envValue;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`[provider:apipod] Missing env var: ${key}`);
}

const baseUrl = loadEnv("APIPOD_BASE_URL", "https://api.apipod.ai/v1");
const apiKey = loadEnv("APIPOD_API_KEY", "");

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

function normalizeResult(raw: any): ProviderStatusResult {
  const rawStatus = raw.data?.status || raw.status || "unknown";
  const result = raw.data?.result || raw.result || [];
  const error = raw.data?.error || raw.error;

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

function buildApiPodRequest(taskType: TaskType, options: TaskOptions, providerModelId: string): unknown {
  // 只包含 APIPod 认识的字段，禁止透传未知字段
  const body: Record<string, any> = {
    model: providerModelId,
    prompt: options.prompt,
  };

  // Image generation params
  if (taskType === "text-to-image" || taskType === "image-to-image") {
    if (options.size) body.size = options.size;
    if (options.n) body.n = options.n;
    if (options.quality) body.quality = options.quality;
    if (options.style) body.style = options.style;
    if (options.aspectRatio) body.aspect_ratio = options.aspectRatio;
    if (options.resolution) body.resolution = options.resolution;
  }

  // Video generation params
  if (taskType === "text-to-video" || taskType === "image-to-video") {
    if (options.aspectRatio) body.aspect_ratio = options.aspectRatio;
    if (options.duration) body.duration = options.duration;
    if (options.quality) body.quality = options.quality;
    if (options.resolution) body.resolution = options.resolution;
  }

  // Image URLs for I2I and I2V
  if ((taskType === "image-to-image" || taskType === "image-to-video") && options.inputUrls?.length) {
    if (providerModelId === "sora-2-vip" || providerModelId === "sora-2-vip-i2v") {
      body.image_url = options.inputUrls[0];
    } else {
      body.image_urls = options.inputUrls;
    }
  }

  return body;
}

function getEndpoint(taskType: TaskType): string {
  if (taskType === "text-to-video" || taskType === "image-to-video") {
    return "videos";
  }
  return "images";
}

export const apipodAdapter: ProviderAdapter = {
  id: "apipod",
  name: "APIPod",
  timeoutMs: 10000,

  supports(taskType: TaskType): boolean {
    return (
      taskType === "text-to-image" ||
      taskType === "image-to-image" ||
      taskType === "text-to-video" ||
      taskType === "image-to-video"
    );
  },

  buildRequest(taskType: TaskType, options: TaskOptions, providerModelId: string): unknown {
    return buildApiPodRequest(taskType, options, providerModelId);
  },

  async sendRequest(body: unknown, taskType: TaskType, _providerModelId: string): Promise<{ taskId: string; rawResponse: unknown }> {
    const endpoint = getEndpoint(taskType);

    const res = await fetch(`${baseUrl}/${endpoint}/generations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`APIPod task creation failed: ${res.status} ${err}`);
    }

    const data = await res.json();
    const taskId = data.data?.task_id || data.task_id;
    if (!taskId) throw new Error("No task_id returned from APIPod");

    return { taskId, rawResponse: data };
  },

  async queryStatus(taskId: string, taskType: TaskType): Promise<unknown> {
    const endpoint = getEndpoint(taskType);

    const res = await fetch(`${baseUrl}/${endpoint}/status/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`APIPod query failed: ${res.status} ${err}`);
    }

    return await res.json();
  },

  parseResponse(raw: unknown): ProviderStatusResult {
    return normalizeResult(raw);
  },
};
