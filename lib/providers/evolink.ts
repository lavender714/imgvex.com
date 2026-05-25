import { ProviderAdapter, ProviderStatusResult, TaskOptions, TaskType } from "./index";

function loadEnv(key: string, defaultValue?: string): string {
  const envValue = process.env[key];
  if (envValue) return envValue;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`[provider:evolink] Missing env var: ${key}`);
}

const baseUrl = loadEnv("EVOLINK_BASE_URL", "https://api.evolink.ai");
const apiKey = loadEnv("EVOLINK_API_KEY", "");

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

function pickEndpoint(taskType: TaskType): string {
  if (taskType === "text-to-video" || taskType === "image-to-video") {
    return `${baseUrl}/v1/videos/generations`;
  }
  return `${baseUrl}/v1/images/generations`;
}

/**
 * Midjourney V7 on EvoLink uses a different request shape than other models:
 * - No top-level aspect_ratio / quality / n / image_urls fields
 * - All parameters injected into the `prompt` as MJ flags (--ar, --iw, etc.)
 * - Image-to-image: URLs prepended to the prompt
 * - Speed mode in model_params.speed (draft | fast | turbo)
 */
function buildMidjourneyRequest(options: TaskOptions): Record<string, unknown> {
  let prompt = options.prompt;

  // Image-to-image / blend: prepend reference URLs
  if (options.inputUrls?.length) {
    prompt = `${options.inputUrls.join(" ")} ${prompt}`;
  }

  // Inject MJ flags from generic options
  const flags: string[] = [];
  if (options.aspectRatio) flags.push(`--ar ${options.aspectRatio}`);
  if (flags.length > 0) prompt = `${prompt} ${flags.join(" ")}`;

  return {
    model: "mj-v7",
    prompt,
    model_params: { speed: "fast" },
  };
}

function buildEvolinkRequest(taskType: TaskType, options: TaskOptions, providerModelId: string): unknown {
  // Midjourney V7 needs its own shape — flags go in the prompt, not as fields
  if (providerModelId === "mj-v7") {
    return buildMidjourneyRequest(options);
  }

  const body: Record<string, unknown> = {
    model: providerModelId,
    prompt: options.prompt,
  };

  // Image generation params
  if (taskType === "text-to-image" || taskType === "image-to-image") {
    if (options.size) body.size = options.size;
    if (options.resolution) body.resolution = options.resolution;
    if (options.quality) body.quality = options.quality;
    if (options.n) body.n = options.n;
    if (options.aspectRatio && !options.size) body.size = options.aspectRatio;
    if (taskType === "image-to-image" && options.inputUrls?.length) {
      body.image_urls = options.inputUrls;
    }
  }

  // Video generation params
  if (taskType === "text-to-video" || taskType === "image-to-video") {
    if (options.duration) body.duration = options.duration;
    if (options.resolution) {
      body.quality = options.resolution;
    } else if (options.quality) {
      body.quality = options.quality;
    }
    if (options.aspectRatio) body.aspect_ratio = options.aspectRatio;
    if (taskType === "image-to-video" && options.inputUrls?.length) {
      body.image_urls = options.inputUrls;
    }
  }

  return body;
}

function normalizeResult(raw: any): ProviderStatusResult {
  const rawStatus = raw?.status ?? "unknown";
  const statusMap: Record<string, ProviderStatusResult["status"]> = {
    pending: "pending",
    processing: "processing",
    completed: "completed",
    failed: "failed",
  };
  const status = statusMap[String(rawStatus).toLowerCase()] || (rawStatus as ProviderStatusResult["status"]);

  const results = Array.isArray(raw?.results) ? raw.results.filter((u: unknown) => typeof u === "string") : [];

  const error = raw?.error?.message ?? raw?.error?.code ?? undefined;

  return { status, result: results, error };
}

export const evolinkAdapter: ProviderAdapter = {
  id: "evolink",
  name: "EvoLink",
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
    return buildEvolinkRequest(taskType, options, providerModelId);
  },

  async sendRequest(body: unknown, taskType: TaskType): Promise<{ taskId: string; rawResponse: unknown }> {
    const res = await fetch(pickEndpoint(taskType), {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    const rawText = await res.text();
    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = rawText;
    }

    if (!res.ok) {
      const msg = data?.error?.message ?? data?.message ?? rawText;
      if (res.status === 402 || data?.error?.code === "insufficient_quota") {
        throw new Error(`EvoLink quota exhausted, please top up: ${msg}`);
      }
      throw new Error(`EvoLink task creation failed: ${res.status} ${msg}`);
    }

    const taskId = data?.id;
    if (!taskId) throw new Error(`No task id returned from EvoLink. Body: ${rawText}`);

    return { taskId: String(taskId), rawResponse: data };
  },

  async queryStatus(taskId: string): Promise<unknown> {
    const res = await fetch(`${baseUrl}/v1/tasks/${encodeURIComponent(taskId)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const rawText = await res.text();
    let raw: any;
    try {
      raw = JSON.parse(rawText);
    } catch {
      raw = rawText;
    }

    if (!res.ok) {
      const msg = raw?.error?.message ?? raw?.message ?? rawText;
      throw new Error(`EvoLink query failed: ${res.status} ${msg}`);
    }

    return raw;
  },

  parseResponse(raw: unknown): ProviderStatusResult {
    return normalizeResult(raw);
  },
};
