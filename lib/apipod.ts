import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv(key: string, defaultValue?: string): string {
  // 1. Try process.env first
  const envValue = process.env[key];
  if (envValue) return envValue;

  // 2. Try reading from .env.local in various locations
  const possiblePaths = [
    resolve(process.cwd(), ".env.local"),
    resolve(process.cwd(), "..", ".env.local"),
    resolve(__dirname, "..", ".env.local"),
    resolve(__dirname, "..", "..", ".env.local"),
    resolve(__dirname, "..", "..", "..", ".env.local"),
  ];

  const searchLog: string[] = [];
  for (const envPath of possiblePaths) {
    const exists = existsSync(envPath);
    searchLog.push(`${exists ? "[FOUND]" : "[MISS]"} ${envPath}`);
    if (exists) {
      try {
        const content = readFileSync(envPath, "utf-8");
        const match = content.match(new RegExp(`^${key}=(.+)$`, "m"));
        if (match) return match[1].trim();
      } catch (e) {
        searchLog.push(`  read error: ${(e as Error).message}`);
      }
    }
  }

  if (defaultValue) return defaultValue;
  throw new Error(
    `[apipod-v2] Could not load ${key}. cwd=${process.cwd()} __dirname=${__dirname}. Searched:\n${searchLog.join("\n")}`
  );
}

const baseUrl = loadEnv("APIPOD_BASE_URL", "https://api.apipod.ai/v1");
const apiKey = loadEnv("APIPOD_API_KEY");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
};

interface GenerateOptions {
  model: string;
  prompt: string;
  size?: string;
  n?: number;
  quality?: string;
  style?: string;
  duration?: number;
  aspect_ratio?: string;
  callback_url?: string;
  [key: string]: unknown;
}

export async function createImageTask(options: GenerateOptions) {
  const res = await fetch(`${baseUrl}/images/generations`, {
    method: "POST",
    headers,
    body: JSON.stringify(options),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`APIPod image generation failed: ${res.status} ${err}`);
  }

  return res.json();
}

export async function createVideoTask(options: GenerateOptions) {
  const res = await fetch(`${baseUrl}/videos/generations`, {
    method: "POST",
    headers,
    body: JSON.stringify(options),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`APIPod video generation failed: ${res.status} ${err}`);
  }

  return res.json();
}

export async function queryImageTask(taskId: string) {
  const res = await fetch(`${baseUrl}/images/status/${taskId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`APIPod query failed: ${res.status} ${err}`);
  }

  return res.json();
}

export async function queryVideoTask(taskId: string) {
  const res = await fetch(`${baseUrl}/videos/status/${taskId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`APIPod query failed: ${res.status} ${err}`);
  }

  return res.json();
}
