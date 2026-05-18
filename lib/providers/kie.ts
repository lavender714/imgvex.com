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
    ...(options.n ? { n: options.n } : {}),
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

function normalizeResult(raw: any): ProviderStatusResult {
  // Log full raw response for debugging (visible in Vercel function logs)
  console.log("[KIE] raw response:", JSON.stringify(raw, null, 2));

  // KIE may return nested data or flat structures — probe multiple paths
  const d = raw?.data ?? raw;

  const rawStatus =
    d?.status ??
    d?.state ??
    d?.taskStatus ??
    d?.task_status ??
    raw?.status ??
    "unknown";

  // KIE puts URLs inside a JSON string field named resultJson
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

  // Sometimes result is nested under data.data
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

  // "success" in msg field is not an error
  if (error === "success" || error === "SUCCESS") error = undefined;

  // If still no result array found, recursively scan the entire raw object for URLs
  let urls: string[] = [];
  if (result && (Array.isArray(result) || isHttpUrl(result))) {
    urls = extractUrls(result);
  }
  if (urls.length === 0) {
    urls = extractUrls(raw);
    if (urls.length > 0) {
      console.log("[KIE] URLs found via deep scan:", urls);
    }
  }

  // Map KIE status values to unified status
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
      throw new Error(`KIE image generation failed: ${res.status} ${msg}`);
    }

    // KIE may return taskId under various field names
    const taskId =
      data.data?.taskId ??
      data.data?.task_id ??
      data.data?.id ??
      data.data?.taskId ??
      data.taskId ??
      data.task_id ??
      data.id ??
      data.taskId;
    if (!taskId) throw new Error(`No task_id returned from KIE. Body: ${rawText}`);
    return { task_id: String(taskId) };
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
      throw new Error(`KIE video generation failed: ${res.status} ${msg}`);
    }

    const taskId =
      data.data?.taskId ??
      data.data?.task_id ??
      data.data?.id ??
      data.data?.taskId ??
      data.taskId ??
      data.task_id ??
      data.id ??
      data.taskId;
    if (!taskId) throw new Error(`No task_id returned from KIE. Body: ${rawText}`);
    return { task_id: String(taskId) };
  },

  async queryImageTask(taskId: string) {
    const res = await fetch(`${baseUrl}/jobs/recordInfo?taskId=${taskId}`, {
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

    return normalizeResult(raw);
  },

  async queryVideoTask(taskId: string) {
    return this.queryImageTask(taskId);
  },
};
