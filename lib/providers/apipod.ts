import { GenerateOptions, Provider, ProviderStatusResult } from "./index";

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

  // Map APIPod status values to unified status
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

export const apipodProvider: Provider = {
  id: "apipod",
  name: "APIPod",
  timeoutMs: 10000,

  async createImageTask(options: GenerateOptions) {
    const res = await fetch(`${baseUrl}/images/generations`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`APIPod image generation failed: ${res.status} ${err}`);
    }

    const data = await res.json();
    const taskId = data.data?.task_id || data.task_id;
    if (!taskId) throw new Error("No task_id returned from APIPod");
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
      throw new Error(`APIPod video generation failed: ${res.status} ${err}`);
    }

    const data = await res.json();
    const taskId = data.data?.task_id || data.task_id;
    if (!taskId) throw new Error("No task_id returned from APIPod");
    return { task_id: taskId };
  },

  async queryImageTask(taskId: string) {
    const res = await fetch(`${baseUrl}/images/status/${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`APIPod query failed: ${res.status} ${err}`);
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
      throw new Error(`APIPod query failed: ${res.status} ${err}`);
    }

    const raw = await res.json();
    return normalizeResult(raw);
  },
};
