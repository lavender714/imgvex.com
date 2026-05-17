import { GenerateOptions, Provider, ProviderStatusResult } from "./types";

function loadEnv(key: string, defaultValue?: string): string {
  const envValue = process.env[key];
  if (envValue) return envValue;
  if (defaultValue) return defaultValue;
  throw new Error(`[provider:kie] Missing env var: ${key}`);
}

const baseUrl = loadEnv("KIE_BASE_URL", "https://kie.ai/api/v1");
const apiKey = loadEnv("KIE_API_KEY");

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
  const input: Record<string, any> = {
    prompt: options.prompt,
  };

  if (options.input_urls && options.input_urls.length > 0) {
    input.input_urls = options.input_urls;
  }

  if (options.aspect_ratio) {
    input.aspect_ratio = options.aspect_ratio;
  }

  if (options.resolution) {
    input.resolution = options.resolution;
  } else if (options.size) {
    input.resolution = sizeToResolution(options.size);
  }

  return {
    model: options.model,
    input,
  };
}

function normalizeResult(raw: any): ProviderStatusResult {
  const status = raw.data?.status || raw.status || "unknown";
  const result = raw.data?.result || raw.result || [];
  const error = raw.data?.error || raw.error || raw.msg || raw.message;

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
