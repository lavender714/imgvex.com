# APIPod 供应商模型目录

> 数据来源：APIPod 后台模型库
> 注意：APIPod 模型库较 KIE 精简，部分模型与 KIE 重叠

## 当前网站已接入的模型

### 文生图（text-to-image）
| 前端模型ID | APIPod 模型ID | 状态 |
|---|---|---|
| nano-banana | `nano-banana` | 已上线（KIE 兜底） |
| nano-banana-pro | `nano-banana-pro` | 已上线（KIE 兜底） |
| nano-banana-2 | `nano-banana-2` | 已上线（KIE 兜底） |
| gpt-image-2 | `gpt-image-2` | 已上线（KIE 兜底） |
| gpt-image-1-5 | `gpt-image-1-5` | 即将上线 |
| grok-imagine | `grok-imagine` | 即将上线 |
| ideogram | `ideogram` | 即将上线 |
| flux-kontext | `flux-kontext` | 已上线（KIE 兜底） |
| flux-2 | `flux-2` | 即将上线（图生图） |
| midjourney | `midjourney` | 即将上线 |
| wan2.7-image-edit | `wan2.7-image-edit` | 已上线（KIE 兜底） |

### 文生视频（text-to-video）
| 前端模型ID | APIPod 模型ID | 状态 |
|---|---|---|
| seedance-2.0-t2v | `seedance-2.0-t2v` | 已上线 |
| seedance-2.0-fast-t2v | `seedance-2.0-fast-t2v` | 已上线 |
| seedance-2.0-r2v | `seedance-2.0-r2v` | 已上线（图生视频） |
| veo3-1-lite | `veo3-1-lite` | 已上线 |
| veo3-1-fast | `veo3-1-fast` | 已上线 |
| veo3-1-quality | `veo3-1-quality` | 已上线 |
| sora-2-vip | `sora-2-vip` | 已上线 |
| sora-2-pro | `sora-2-pro` | 即将上线 |
| runway-gen4 | `runway-gen4` | 已上线 |
| kling-3 | `kling-3` | 已上线 |
| kling-2.6-motion-control | `kling-2.6-motion-control` | 已上线 |
| hailuo-02 | `hailuo-02` | 即将上线 |
| hailuo-02-pro | `hailuo-02-pro` | 即将上线 |
| grok-imagine-t2v | `grok-imagine-t2v` | 已上线 |

## APIPod 能力说明

### 支持的任务类型
- `text-to-image` ✅
- `text-to-video` ✅
- `image-to-image` ❌（当前不支持，buildRequest 中不处理 inputUrls）
- `image-to-video` ❌（当前不支持）

### 请求端点
- 图片：`POST /images/generations`
- 视频：`POST /videos/generations`
- 状态查询图片：`GET /images/status/{taskId}`
- 状态查询视频：`GET /videos/status/{taskId}`

### 参数支持
APIPod `buildRequest` 只包含以下字段：
- `model`
- `prompt`
- `size`
- `n`
- `quality`
- `style`
- `aspect_ratio`
- `duration`

**注意**：`inputUrls` 暂不被 APIPod adapter 处理。当 APIPod 支持图生图/图生视频时，需修改 `lib/providers/apipod.ts` 中的 `buildApiPodRequest` 函数。

## 接入新模型的流程

1. 在本文档"已接入"部分添加记录
2. 在 `lib/providers/config.ts` 的 `MODEL_REGISTRY` 中添加注册项
3. 确认 `apipodAdapter.supports(taskType)` 包含该任务类型
4. 确认 `apipodAdapter.buildRequest` 能正确处理该模型的参数
5. 前端页面通过 `getModelsByTaskType()` 自动获取新模型

## APIPod vs KIE 模型命名对比

APIPod 的模型命名通常比 KIE 更简洁：

| 模型 | APIPod ID | KIE ID |
|---|---|---|
| Flux 文生图 | `flux` | `flux-2/flex-text-to-image` |
| Nano Banana | `nano-banana` | `google/nano-banana` |
| GPT Image 2.0 | `gpt-image-2` | `gpt-image-2-text-to-image` |
| Seedance 2.0 | `seedance-2.0-t2v` | `bytedance/seedance-2.0` |
| Veo 3.1 | `veo3-1-lite` | `google/veo-3.1-lite` |

**关键区别**：APIPod 的模型 ID 通常不含厂商前缀，KIE 的模型 ID 通常带 `{厂商}/` 前缀。
