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

function normalizeResult(raw: any): ProviderStatusResult {
  // KIE 的响应格式可能与 APIPod 不同，这里需要根据实际格式调整
  // 当前先假设与 APIPod 格式一致，后续联调时修正
  const status = raw.data?.status || raw.status || "unknown";
  const result = raw.data?.result || raw.result || [];
  const error = raw.data?.error || raw.error || raw.msg;

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
    const res = await fetch(`${baseUrl}/images/generations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`KIE image generation failed: ${res.status} ${err}`);
    }

    const data = await res.json();
    const taskId = data.data?.task_id || data.task_id;
    if (!taskId) throw new Error("No task_id returned from KIE");
    return { task_id: taskId };
  },

  async createVideoTask(options: GenerateOptions) {
    const res = await fetch(`${baseUrl}/videos/generations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`KIE video generation failed: ${res.status} ${err}`);
    }

    const data = await res.json();
    const taskId = data.data?.task_id || data.task_id;
    if (!taskId) throw new Error("No task_id returned from KIE");
    return { task_id: taskId };
  },

  async queryImageTask(taskId: string) {
    const res = await fetch(`${baseUrl}/images/status/${taskId}`, {
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
    const res = await fetch(`${baseUrl}/videos/status/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`KIE query failed: ${res.status} ${err}`);
    }

    const raw = await res.json();
    return normalizeResult(raw);
  },
};
