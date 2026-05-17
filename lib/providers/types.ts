export interface GenerateOptions {
  model: string;
  prompt: string;
  size?: string;
  n?: number;
  quality?: string;
  style?: string;
  duration?: number;
  aspect_ratio?: string;
  resolution?: string;
  input_urls?: string[];
  callback_url?: string;
  [key: string]: unknown;
}

export interface ProviderStatusResult {
  status: "pending" | "processing" | "completed" | "failed" | "error" | "unknown";
  result?: string[];
  error?: string;
}

export interface Provider {
  readonly id: string;
  readonly name: string;
  readonly timeoutMs: number;
  createImageTask(options: GenerateOptions): Promise<{ task_id: string }>;
  createVideoTask(options: GenerateOptions): Promise<{ task_id: string }>;
  queryImageTask(taskId: string): Promise<ProviderStatusResult>;
  queryVideoTask(taskId: string): Promise<ProviderStatusResult>;
}
