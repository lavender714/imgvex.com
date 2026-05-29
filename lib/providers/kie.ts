import { ProviderAdapter, ProviderStatusResult, TaskOptions, TaskType } from "./index";

function loadEnv(key: string, defaultValue?: string): string {
  const envValue = process.env[key];
  if (envValue) return envValue;
  if (defaultValue !== undefined) return defaultValue;
  throw new Error(`[provider:kie] Missing env var: ${key}`);
}

const baseUrl = loadEnv("KIE_BASE_URL", "https://kie.ai/api/v1");
const apiKey = loadEnv("KIE_API_KEY", "");

// Track last used model ID for endpoint routing in queryStatus
let lastProviderModelId = "";

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

// ─── Endpoint routing per model family ───
function getEndpoint(providerModelId: string): string {
  if (providerModelId === "runway") return `${baseUrl}/runway/generate`;
  if (providerModelId.startsWith("flux-kontext")) return `${baseUrl}/flux/kontext/generate`;
  if (providerModelId.startsWith("veo3")) return `${baseUrl}/veo/generate`;
  return `${baseUrl}/jobs/createTask`;
}

function getQueryEndpoint(providerModelId: string): string {
  if (providerModelId === "runway") return `${baseUrl}/runway/record-detail`;
  return `${baseUrl}/jobs/recordInfo`;
}

// ─── Request builders ───

function buildUniversalRequest(taskType: TaskType, options: TaskOptions, providerModelId: string): unknown {
  const input: Record<string, any> = { prompt: options.prompt };

  if (taskType === "text-to-image" || taskType === "image-to-image") {
    input.aspect_ratio = options.aspectRatio || (taskType === "image-to-image" ? "auto" : "1:1");
    input.resolution = options.resolution || sizeToResolution(options.size);
    if (options.n) input.n = options.n;
    if (options.quality) input.quality = options.quality;
    if (options.style) input.style = options.style;

    if (taskType === "image-to-image" && options.inputUrls?.length) {
      if (providerModelId === "nano-banana-2") {
        input.image_input = options.inputUrls;
      } else {
        input.input_urls = options.inputUrls;
      }
    }
  }

  if (taskType === "text-to-video" || taskType === "image-to-video") {
    if (options.aspectRatio) input.aspect_ratio = options.aspectRatio;
    if (options.duration) input.duration = options.duration;

    if (taskType === "image-to-video" && options.inputUrls?.length) {
      if (providerModelId.startsWith("bytedance/seedance")) {
        input.reference_image_urls = options.inputUrls;
      } else if (providerModelId.startsWith("kling-2.6")) {
        input.image_urls = options.inputUrls;
      } else if (providerModelId.startsWith("hailuo/")) {
        input.image_url = options.inputUrls[0];
      } else {
        input.input_urls = options.inputUrls;
      }
    }
  }

  return { model: providerModelId, input };
}

function buildFluxKontextRequest(taskType: TaskType, options: TaskOptions, providerModelId: string): unknown {
  const body: Record<string, any> = {
    model: providerModelId,
    prompt: options.prompt,
    aspectRatio: options.aspectRatio || "16:9",
    outputFormat: "jpeg",
  };

  if (taskType === "image-to-image" && options.inputUrls?.length) {
    body.inputImage = options.inputUrls[0];
  }

  return body;
}

function buildVeoRequest(taskType: TaskType, options: TaskOptions, providerModelId: string): unknown {
  const body: Record<string, any> = {
    prompt: options.prompt,
    model: providerModelId,
    aspect_ratio: options.aspectRatio || "16:9",
    duration: options.duration || 8,
    resolution: options.resolution || "720p",
  };

  if (taskType === "text-to-video") {
    body.generationType = "TEXT_2_VIDEO";
  }

  if (taskType === "image-to-video" && options.inputUrls?.length) {
    body.generationType = "FIRST_AND_LAST_FRAMES_2_VIDEO";
    body.imageUrls = options.inputUrls;
  }

  return body;
}

function buildRunwayRequest(taskType: TaskType, options: TaskOptions): unknown {
  const body: Record<string, any> = {
    prompt: options.prompt,
    duration: options.duration || 5,
    quality: options.resolution || "720p",
    aspectRatio: options.aspectRatio || "16:9",
    waterMark: "",
  };

  if (taskType === "image-to-video" && options.inputUrls?.length) {
    body.imageUrl = options.inputUrls[0];
  }

  return body;
}

function isHttpUrl(value: any): boolean {
  return typeof value === "string" && value.startsWith("http");
}

function extractUrls(value: any): string[] {
  if (!value) return [];
  if (typeof value === "string" && value.startsWith("http")) return [value];
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => extractUrls(item))
      .filter((url): url is string => typeof url === "string" && url.startsWith("http"));
  }
  if (typeof value === "object") {
    const urls: string[] = [];
    for (const key of Object.keys(value)) {
      const v = value[key];
      if (typeof v === "string" && v.startsWith("http")) urls.push(v);
      else if (Array.isArray(v)) urls.push(...extractUrls(v));
      else if (typeof v === "object" && v !== null) urls.push(...extractUrls(v));
    }
    return urls;
  }
  return [];
}

function normalizeUniversalResult(raw: any): ProviderStatusResult {
  const d = raw?.data ?? raw;

  const rawStatus =
    d?.status ??
    d?.state ??
    d?.taskStatus ??
    d?.task_status ??
    raw?.status ??
    "unknown";

  let result: any = null;
  if (typeof d?.resultJson === "string") {
    try {
      const parsed = JSON.parse(d.resultJson);
      result = parsed?.resultUrls ?? parsed?.urls ?? parsed?.images ?? parsed?.result ?? [];
    } catch {
      result = d.resultJson;
    }
  }

  if (!result || (Array.isArray(result) && result.length === 0)) {
    result =
      d?.result ??
      d?.results ??
      d?.images ??
      d?.urls ??
      d?.output ??
      d?.imageUrls ??
      d?.image_url ??
      d?.imageUrl ??
      d?.url ??
      d?.output_url ??
      d?.outputUrl ??
      d?.file ??
      d?.files ??
      d?.media ??
      d?.medias ??
      d?.link ??
      d?.links ??
      d?.src ??
      d?.sources ??
      raw?.result ??
      [];
  }

  if (!Array.isArray(result) && !isHttpUrl(result) && raw?.data?.data) {
    result =
      raw.data.data.result ??
      raw.data.data.results ??
      raw.data.data.images ??
      raw.data.data.urls ??
      raw.data.data.output ??
      raw.data.data.imageUrls ??
      raw.data.data.image_url ??
      raw.data.data.imageUrl ??
      raw.data.data.url ??
      raw.data.data.output_url ??
      raw.data.data.outputUrl ??
      raw.data.data.file ??
      raw.data.data.files ??
      raw.data.data.media ??
      raw.data.data.medias ??
      raw.data.data.link ??
      raw.data.data.links ??
      raw.data.data.src ??
      raw.data.data.sources ??
      [];
  }

  let error =
    d?.error ??
    d?.errMsg ??
    d?.err_msg ??
    d?.message ??
    raw?.error ??
    raw?.msg ??
    raw?.message;

  if (error === "success" || error === "SUCCESS") error = undefined;

  let urls: string[] = [];
  if (result && (Array.isArray(result) || isHttpUrl(result))) {
    urls = extractUrls(result);
  }
  if (urls.length === 0) {
    urls = extractUrls(raw);
  }

  const statusMap: Record<string, ProviderStatusResult["status"]> = {
    success: "completed",
    completed: "completed",
    done: "completed",
    finish: "completed",
    finished: "completed",
    processing: "processing",
    running: "processing",
    in_progress: "processing",
    pending: "pending",
    queued: "pending",
    wait: "pending",
    failed: "failed",
    error: "failed",
    fail: "failed",
    refused: "failed",
  };

  const statusKey = String(rawStatus).toLowerCase();
  const status = statusMap[statusKey] || (rawStatus as ProviderStatusResult["status"]);

  return { status, result: urls, error };
}

function normalizeRunwayResult(raw: any): ProviderStatusResult {
  const d = raw?.data ?? raw;

  const rawStatus =
    d?.state ??
    d?.status ??
    raw?.status ??
    "unknown";

  let urls: string[] = [];
  const videoInfo = d?.videoInfo;
  if (videoInfo?.videoUrl) urls.push(videoInfo.videoUrl);

  if (urls.length === 0) {
    urls = extractUrls(raw);
  }

  let error =
    d?.failMsg ??
    d?.error ??
    d?.message ??
    raw?.error ??
    raw?.msg ??
    raw?.message;

  if (error === "success" || error === "SUCCESS") error = undefined;

  const statusMap: Record<string, ProviderStatusResult["status"]> = {
    success: "completed",
    completed: "completed",
    done: "completed",
    finished: "completed",
    processing: "processing",
    running: "processing",
    generating: "processing",
    in_progress: "processing",
    pending: "pending",
    queued: "pending",
    queueing: "pending",
    wait: "pending",
    waiting: "pending",
    failed: "failed",
    error: "failed",
    fail: "failed",
  };

  const statusKey = String(rawStatus).toLowerCase();
  const status = statusMap[statusKey] || (rawStatus as ProviderStatusResult["status"]);

  return { status, result: urls, error };
}

export const kieAdapter: ProviderAdapter = {
  id: "kie",
  name: "KIE",
  timeoutMs: 10000,

  supports(taskType: TaskType): boolean {
    return [
      "text-to-image",
      "image-to-image",
      "text-to-video",
      "image-to-video",
    ].includes(taskType);
  },

  buildRequest(taskType: TaskType, options: TaskOptions, providerModelId: string): unknown {
    if (providerModelId === "runway") {
      return buildRunwayRequest(taskType, options);
    }
    if (providerModelId.startsWith("flux-kontext")) {
      return buildFluxKontextRequest(taskType, options, providerModelId);
    }
    if (providerModelId.startsWith("veo3")) {
      return buildVeoRequest(taskType, options, providerModelId);
    }
    return buildUniversalRequest(taskType, options, providerModelId);
  },

  async sendRequest(body: unknown, _taskType: TaskType, providerModelId: string): Promise<{ taskId: string; rawResponse: unknown }> {
    lastProviderModelId = providerModelId;
    const endpoint = getEndpoint(providerModelId);

    const res = await fetch(endpoint, {
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
      const msg = data?.msg || data?.message || rawText;
      if (res.status === 402 || data?.code === 402) {
        throw new Error(`KIE 账户余额不足，请联系管理员充值`);
      }
      throw new Error(`KIE task creation failed: ${res.status} ${msg}`);
    }

    const taskId =
      data.data?.taskId ??
      data.data?.task_id ??
      data.data?.id ??
      data.taskId ??
      data.task_id ??
      data.id;

    if (!taskId) throw new Error(`No task_id returned from KIE. Body: ${rawText}`);
    return { taskId: String(taskId), rawResponse: data };
  },

  async queryStatus(taskId: string): Promise<unknown> {
    const endpoint = `${getQueryEndpoint(lastProviderModelId)}?taskId=${taskId}`;

    const res = await fetch(endpoint, {
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
      const msg = raw?.msg || raw?.message || rawText;
      if (res.status === 402 || raw?.code === 402) {
        throw new Error(`KIE 账户余额不足，请联系管理员充值`);
      }
      throw new Error(`KIE query failed: ${res.status} ${msg}`);
    }

    return raw;
  },

  parseResponse(raw: unknown): ProviderStatusResult {
    if (lastProviderModelId === "runway") {
      return normalizeRunwayResult(raw);
    }
    return normalizeUniversalResult(raw);
  },
};
