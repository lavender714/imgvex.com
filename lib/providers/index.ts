import { getModelRegistration, ModelRegistrationProviderMapping } from "./config";

// 显式任务类型，不再猜测
export type TaskType = "text-to-image" | "image-to-image" | "text-to-video" | "image-to-video";

// 前端统一的任务参数
export interface TaskOptions {
  model: string;
  prompt: string;
  size?: string;
  n?: number;
  quality?: string;
  style?: string;
  duration?: number;
  aspectRatio?: string;
  resolution?: string;
  inputUrls?: string[];
  videoUrls?: string[];
}

// 供应商响应的统一格式
export interface ProviderStatusResult {
  status: "pending" | "processing" | "completed" | "failed" | "error" | "unknown";
  result?: string[];
  error?: string;
}

// Provider Adapter 接口 — 每个供应商必须完整实现
export interface ProviderAdapter {
  readonly id: string;
  readonly name: string;
  readonly timeoutMs: number;

  // 能力声明：是否支持该任务类型
  supports(taskType: TaskType): boolean;

  // 请求构建：把统一参数转成供应商原生格式，禁止透传
  buildRequest(taskType: TaskType, options: TaskOptions, providerModelId: string): unknown;

  // 发送请求创建任务（接收 taskType 以便选择正确的端点）
  sendRequest(body: unknown, taskType: TaskType, providerModelId: string): Promise<{ taskId: string; rawResponse: unknown }>;

  // 查询任务状态（接收 taskType 以便选择正确的端点）
  queryStatus(taskId: string, taskType: TaskType): Promise<unknown>;

  // 解析供应商原始响应为统一格式
  parseResponse(raw: unknown): ProviderStatusResult;
}

export interface FailoverResult {
  task_id: string;
  provider: string;
  attempts: number;
  eta_seconds: number;
  errors: string[];
}

const adapterMap: Record<string, ProviderAdapter> = {};

export function registerProviderAdapter(adapter: ProviderAdapter): void {
  adapterMap[adapter.id] = adapter;
}

export function getProviderAdapter(id: string): ProviderAdapter {
  const adapter = adapterMap[id];
  if (!adapter) throw new Error(`Unknown provider adapter: ${id}`);
  return adapter;
}

export function getAllProviderIds(): string[] {
  return Object.keys(adapterMap);
}

export async function executeTaskWithFailover(
  modelId: string,
  taskType: TaskType,
  options: TaskOptions
): Promise<FailoverResult> {
  // 生成服务全局屏蔽（维护模式）
  throw new Error("生成服务暂时维护中，请稍后再试");

  const registration = getModelRegistration(modelId);
  if (!registration) {
    throw new Error(`Model not found: ${modelId}`);
  }

  // 过滤只支持该 taskType 的 provider，按 priority 排序
  const candidates: ModelRegistrationProviderMapping[] = [];
  for (const p of registration.providers) {
    const adapter = getProviderAdapter(p.providerId);
    if (adapter.supports(taskType)) {
      candidates.push(p);
    }
  }
  candidates.sort((a, b) => a.priority - b.priority);

  if (candidates.length === 0) {
    throw new Error(`No provider supports ${taskType} for model: ${modelId}`);
  }

  const errors: string[] = [];

  for (const candidate of candidates) {
    const adapter = getProviderAdapter(candidate.providerId);

    try {
      // 构建供应商原生请求
      const requestBody = adapter.buildRequest(taskType, options, candidate.providerModelId);

      // 带超时发送
      const result = await Promise.race([
        adapter.sendRequest(requestBody, taskType, candidate.providerModelId),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), adapter.timeoutMs)
        ),
      ]);

      return {
        task_id: result.taskId,
        provider: candidate.providerId,
        attempts: errors.length + 1,
        eta_seconds: candidate.etaSeconds,
        errors,
      };
    } catch (err: any) {
      const msg = `[${candidate.providerId}] ${err?.message || "Failed"}`;
      errors.push(msg);
      console.log(`[failover] ${msg} for model ${modelId}, trying next...`);

      // 429 特殊处理：等待 3 秒后重试一次同一家
      if (err?.message?.includes("429") || err?.status === 429) {
        try {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const requestBody = adapter.buildRequest(taskType, options, candidate.providerModelId);
          const retryResult = await Promise.race([
            adapter.sendRequest(requestBody, taskType, candidate.providerModelId),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), adapter.timeoutMs)
            ),
          ]);
          return {
            task_id: retryResult.taskId,
            provider: candidate.providerId,
            attempts: errors.length + 1,
            eta_seconds: candidate.etaSeconds,
            errors,
          };
        } catch (retryErr: any) {
          errors.push(`[${candidate.providerId}] Retry after 429 failed: ${retryErr?.message || "Failed"}`);
        }
      }

      continue;
    }
  }

  throw new Error(`All providers failed for model ${modelId}: ${errors.join("; ")}`);
}

export async function queryTaskStatus(
  providerId: string,
  taskId: string,
  taskType: TaskType
): Promise<ProviderStatusResult> {
  const adapter = getProviderAdapter(providerId);
  const raw = await adapter.queryStatus(taskId, taskType);
  return adapter.parseResponse(raw);
}

// 注册供应商 adapter（纯类型导入无运行时循环依赖风险）
import { kieAdapter } from "./kie";
import { apipodAdapter } from "./apipod";
import { evolinkAdapter } from "./evolink";

registerProviderAdapter(kieAdapter);
registerProviderAdapter(apipodAdapter);
registerProviderAdapter(evolinkAdapter);
