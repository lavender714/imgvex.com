const baseUrl = process.env.APIPOD_BASE_URL || "https://api.apipod.ai/v1";
const apiKey = process.env.APIPOD_API_KEY!;

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
