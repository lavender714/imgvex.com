# KIE 供应商模型目录

> 数据来源：KIE 后台模型库（截至 2026-05-19）
> 总模型数：约 306 个（Chat 39 + Video 175 + Image 72 + Music 20）

## 当前网站已接入的模型

### 文生图（text-to-image）
| 前端模型ID | KIE 模型ID | 状态 |
|---|---|---|
| flux | `flux-2/flex-text-to-image` | 已上线 |
| nano-banana | `google/nano-banana` | 已上线 |
| nano-banana-pro | `nano-banana-pro` | 已上线 |
| nano-banana-2 | `nano-banana-2` | 已上线 |
| gpt-image-2 | `gpt-image-2-text-to-image` | 已上线 |
| gpt-image-1-5 | `gpt-image/1.5-text-to-image` | 即将上线 |
| grok-imagine | `grok-imagine/text-to-image` | 即将上线 |
| ideogram | `ideogram/v3-text-to-image` | 即将上线 |
| flux-kontext | `flux1-kontext` | 已上线 |

### 图生图（image-to-image）
| 前端模型ID | KIE 模型ID | 状态 |
|---|---|---|
| flux-2 | `flux-2/flex-image-to-image` | 即将上线 |
| wan2.7-image-edit | `wan/2-7-image` | 已上线 |
| nano-banana-edit | `google/nano-banana-edit` | 已上线 |
| gpt-image-2-image | `gpt-image-2-image-to-image` | 已上线 |
| gpt-image-1-5-image | `gpt-image/1.5-image-to-image` | 即将上线 |

## KIE 模型库主要系列（未全部接入）

### 视频生成（Video ~175 个模型）
主要系列包括：
- **wan 2.6 / wan 2.7** — 视频生成、图生视频、视频编辑
  - `wan/2-6-video`, `wan/2-7-video` 等系列
  - 支持 text-to-video, image-to-video, video-to-video
- **Seedance 1.0 / 1.5 / 2.0** — 字节跳动视频生成
  - `bytedance/seedance-1.0-pro`, `bytedance/seedance-1.5-pro`, `bytedance/seedance-2.0`
  - 支持 T2V, I2V, R2V
- **Sora 2** — OpenAI 视频生成
  - `openai/sora-2-vip`, `openai/sora-2-pro`
- **Kling** — 快手可灵
  - `kling/kling-2.1`, `kling/kling-2.5`, `kling/kling-2.6`, `kling/kling-3.0`
  - 支持 text-to-video, image-to-video, video-to-video, motion-control
- **Veo 3.1** — Google 视频生成
  - `google/veo-3.1-lite`, `google/veo-3.1-fast`, `google/veo-3.1-quality`
- **Grok Imagine** — xAI
  - `xai/grok-imagine-t2v`, `xai/grok-imagine-extend`
- **Hailuo** — 海螺视频
  - `hailuo/hailuo-02`, `hailuo/hailuo-02-pro`, `hailuo/hailuo-2.3`
- **Runway** — Gen 系列
  - `runway/runway-gen4`, `runway/runway-aleph`

### 图片生成（Image ~72 个模型）
主要系列包括：
- **Flux** — Black Forest Labs
  - `flux/flux-1-dev`, `flux/flux-2/flex-text-to-image`, `flux/flux-2/flex-image-to-image`, `flux/flux-2-pro`
- **Nano Banana** — Google
  - `google/nano-banana`, `google/nano-banana-pro`, `google/nano-banana-2`
  - 支持 text-to-image, image-to-image
- **GPT Image** — OpenAI
  - `openai/gpt-image-2`, `openai/gpt-image-1.5`
  - 支持 text-to-image, image-to-image
- **Ideogram** — v3 系列
  - `ideogram/v3-text-to-image`, `ideogram/v3-remix`, `ideogram/v3-edit`
  - 支持 text-to-image, image-to-image
- **Grok Imagine** — xAI
  - `xai/grok-imagine`
- **Google Imagen** — Google
  - `google/imagen-4`
- **Qwen Image** — 阿里巴巴
  - `alibaba/qwen-image`
- **Wan 2.7 Image** — 阿里
  - `wan/2-7-image`, `wan/2-7-image-pro`
- **Seedream** — 字节跳动
  - `bytedance/seedream-5.0-lite`

### 音乐/音频（Music ~20 个模型）
- **Suno** — 音乐生成
  - `suno/generate-music`, `suno/extend-music`, `suno/vocal-separation` 等
- **Elevenlabs** — 语音合成
  - `elevenlabs/v3`, `elevenlabs/text-to-speech` 等

### 大语言模型（Chat ~39 个模型）
- **Claude** — `anthropic/claude-opus-4.7`, `anthropic/claude-sonnet-4.6`
- **GPT** — `openai/gpt-4o`, `openai/gpt-4o-mini`, `openai/gpt-5`
- **Grok** — `xai/grok-4.20`
- **Gemini** — `google/gemini-1.5-pro`, `google/gemini-2.0-flash`

## 接入新模型的流程

1. 在本文档"已接入"部分添加记录
2. 在 `lib/providers/config.ts` 的 `MODEL_REGISTRY` 中添加注册项
3. 确认 `kieAdapter.supports(taskType)` 包含该任务类型
4. 确认 `kieAdapter.buildRequest` 能正确处理该模型的参数
5. 前端页面通过 `getModelsByTaskType()` 自动获取新模型

## 注意事项

- KIE 的视频模型命名规则：`{厂商}/{系列}-{版本}-{能力}`
  - 能力后缀：`t2v`(文生视频), `r2v`(参考生视频/图生视频), `i2v`(图生视频), `edit`(编辑)
- KIE 的图片模型命名类似，注意区分 text-to-image 和 image-to-image 的不同模型ID
