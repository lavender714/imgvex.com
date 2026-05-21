# 竞品拆解：Pollo.ai vs Viddo.ai

> 用途：Synapse 设计稿（pencil-new.pen）的设计参考依据
> 范围：首页 / 模型详情 / Pricing / 生成工作台
> 方法：WebFetch + WebSearch（Pollo.ai 直接被 Cloudflare 403，部分通过第三方评测站补全）
> 日期：2026-05-08

---

## 0. 速览：两站定位差异

| 维度 | Pollo.ai | Viddo.ai |
|---|---|---|
| **核心叙事** | "Universal remote for video models"（统一遥控器） | "All-in-one AI Video & Image Generator" |
| **首页 Hero 是否内嵌生成器** | 否（先展示价值，CTA 引流到 /app） | **是**（Hero 下方直接是完整生成器面板） |
| **模型规模** | 10+ 视频 + 12+ 图像 | 26+ 模型 chip 滚动展示 |
| **特色功能** | 100+ 效果模板（AI Kissing/Hug/Inflate/Muscle 等病毒向） | 4 大模态聚合（视频 + 图像 + 语音 + 音乐 + 编辑器） |
| **定价模式** | 三档订阅 + Add-on 信用包 + API 独立计费 | 三种周期切换（Annual/Month/One-time），按视频单价宣传 |
| **价格锚点** | $29/月 Pro = $0.36/video | Seedance 2.0 = $0.345/video, Veo3.1 Lite = $0.0575/video |
| **风格倾向** | SaaS 工具站（清爽、左侧菜单导航） | 内容创作者站（视觉重、海报+长滚动） |

**对 Synapse 的核心启示：**
- Synapse 用户偏中级/高级（25–40 岁、付费意愿强），更接近 **Pollo 的克制 SaaS 风格**，不要走 Viddo 的"病毒向 + 长滚动 + 多模态全包"路线
- 但 **Viddo 的 Hero 内嵌生成器**模式值得借鉴：能让访客立即理解产品价值，无需点 CTA 跳转
- 两站都把"模型聚合 + 一键比对"作为差异化卖点 — Synapse 的 SPEC 已对齐这点

---

## 1. Pollo.ai 拆解

### 1.1 首页（pollo.ai/ 与 /home）

**Hero**
- 主标题（语义大致为）："Turn text and images into high-quality videos in minutes."
- 副标题："Use Pollo AI video generator to craft cinematic landscapes, viral social content, and lifelike avatars, for free."
- CTA："Create"（主），"Start for Free"（次）
- Hero 视觉：模型 logo 列（Veo 3 / Kling / Hailuo / Pixverse 等）平铺，强调多模型聚合
- 不内嵌生成器（点 CTA 跳到 /app）

**导航**
- 左侧主菜单（dashboard 模式）：AI Video / AI Image / AI Audio / AI Tools / Home / Pricing
- 顶部右上：语言选择器、"Start for Free" / "Upgrade Now"
- AI Video 子项：Video Generator / Video Editor (New) / Lip Sync / Video Swap (30%) / Motion Control (Hot) / Video Extender (New) / Reference To Video / Action Figure / Video Effects

**模型展示**
- 列表 + Logo 卡片
- 视频：Pollo 2.5、Veo 3、Sora 2、Kling、Luma、PixVerse、Pika、Vidu、Hailuo、Runway
- 图像：Recraft、Ideogram、Stable Diffusion、Flux、DALL-E、Imagen、GPT-4o

**特性卡片**
- "Generate captivating anime and cartoon videos in various styles"
- "Create lifelike video avatars from a single photo. Edit videos instantly with simple text prompts."
- "Create and clone viral videos with zero editing"
- "Turn your ideas to appealing and believable AI images in any style."

**模板/效果库**
- 30–37 个视频模板，分类：Interaction / Appearance / Emotions / Entertainment / Hero–Villain / Horror–Fantasy / Xmas
- 100+ AI 视频效果（Synapse 不做这块）

**Footer / 路由可见**
- `/pricing` `/api-platform/pricing` `/app/ai-video` `/app/ai-image` `/v/<id>`（生成结果分享页）

---

### 1.2 模型详情页（/veo-3 等模型 landing）

无法直接抓取（403），但从 Viddo 的 Sora2 页 + Pollo 评测可以归纳通用模式：
- Hero：模型名 + 短 tagline + 内嵌生成器或 "Try Now" CTA
- Specs：分辨率 / 时长 / 输入模式 / 单次扣费 credits
- "Pollo's signature feature is model selection. Within one interface, you can choose which underlying AI model generates your video — Kling for dynamic motion, Runway for cinematic quality, Pika for social media effects."（评测原文）
- 模型间一键切换，**保留同一 prompt + 参数**复跑 — 这是 Pollo 的核心 UX 卖点
- 例子轮播 + Examples 链接到分享 URL（`/v/<id>`）
- "Model Comparison" 链接（重要交互）

---

### 1.3 Pricing 页（pollo.ai/pricing）

**三档订阅 + Add-on**

| 档位 | 月费 | 年费 | Credits/月 | 视频估算 | 关键特性 |
|---|---|---|---|---|---|
| **Free** | $0 | — | 10 | 1–2 个 | 带水印；无信用卡注册；可用全部生成模式（评测体验用） |
| **Lite** | $15/月 | — | 300 | ~30 个 | 去水印；私密可见；标准生成 |
| **Pro** | $29/月 | $25/月（年付，5 折促销） | 800 | ~80 个 | 3 并发；优先队列；高分辨率；版权保护；私密；优先支持；包含 Lite 全部 |
| **API** | 自定义 | — | 按生成计费 | — | 例：Kling 2.1 Master 10s = 40 credits ≈ $2.40；与 Fal/Replicate 同档定价 |

**信用包（Add-on）**
- 滑块选择 2K–50K credits
- **不过期**，订阅取消后仍可用，**不退款**
- 与订阅 credits 独立但合并消费

**单次扣费规则**
- text-to-image: **4 credits**
- text-to-video: **20 credits**
- image-to-video: **45 credits**
- 高级模型（Kling 2.1 Master / Veo 3）扣费显著更高

**信用周期**
- 月度信用 **不滚存**（plan 期内用完）
- Add-on 不过期

**退款**
- 首次购买后 3 天内、且使用少于 50 credits 可全额退

**对 Synapse 的启示**
- 三档结构（Free / Starter / Pro）对齐 SPEC 已规划的 $0/$19/$49，但 Pollo 的 $29 Pro 更贴近实际市场水位 — 可考虑把 Pro 价定到 $29 试水
- **信用包独立购买**（不过期）这一项 SPEC 暂未规划，建议补；高 ARPU 用户会需要
- Add-on credits 的"不退款 + 不过期"组合是行业标准做法
- 退款条款（3 天 + <50 credits）可直接复用

---

### 1.4 生成工作台（pollo.ai/app/...）

> **数据来源更新（2026-05-08）：用户提供 3 张实截图，以下内容为截图直拆，非评测合成。**

**整体布局：经典 SaaS Dashboard，与 Viddo 完全不同**

```
┌─ Logo ────┬───── Top Bar ───────────────────── Project ▾ │ History │ 10▣ │ 💰 │ 🔔 │ 👤 ─┐
│           │                                                                                │
│ + Create  │   ┌─ Tabs: [AI Video] [AI Image] [Video Agent Beta] ──────────────────────┐   │
│   New     │   │                                                                         │   │
│           │   │  ┌─ Hero Input ─────────────────────────────────────────────────────┐  │   │
│ Home      │   │  │ ┌──┐                                                             │  │   │
│ Assets    │   │  │ │+ │ Enter your idea to generate...                              │  │   │
│           │   │  │ └──┘                                                             │  │   │
│ Creation  │   │  └────────────────────────────────────────────────────────────────────┘  │   │
│ • AI Video│   │  [🎬 AI Video ▾] [Text/Image to Video] [P Pollo 2.0] [⏱ 5s] [480p] [16:9] [...] │   │
│ • AI Image│   │                                                              [✨ Generate ⓘ 10] │   │
│ • Agent   │   │                                                                         │   │
│ • Avatar  │   │  [↻] [Saiyan Transformation] [Rainy Night Couple] [Family Talk Show 🎤] │   │
│ • Apps    │   │                                                                         │   │
│ • Pro Fx  │   │  ┌─ Featured Cards Carousel ──────────────────────────────────────┐    │   │
│           │   │  │ [60% OFF SEEDANCE 2.0] [Pollo 3.0]   [KLING 3.0 MOTION CTRL]   │    │   │
│ Entmt.    │   │  └─────────────────────────────────────────────────────────────────┘    │   │
│ • Fun Fx  │   │                                                                         │   │
│ • Photo Fx│   └───────────────────────────────────────────────────────────────────────┘   │
│ • AI Tools│                                                                                │
└───────────┴────────────────────────────────────────────────────────────────────────────────┘
```

**左侧 Persistent Sidebar（关键设计）**
- 顶部 Logo："Pollo.ai"
- **"+ Create New"** 主 CTA（粉/红色实心按钮，最高视觉权重）
- **导航分组：**
  - 全局：Home / Assets
  - **Creation**：AI Video / AI Image / Video Agent <Beta> / AI Avatar / Apps / Pro Effects
  - **Entertainment**：Fun Effects / Photo Effects
  - 工具：AI Tools

**Top Bar 右上角**
- "Default Project ▾" — 多项目隔离（B2B 友好，SPEC 当前没有这一层）
- "History" — 历史入口
- "10 ▣" — 信用余额 pill（数字 + 信用图标）
- 💰 充值入口
- 🔔 通知
- 用户头像

**主区：Top-Tab 切换 + 极简 Hero Input（这是 Pollo 与 Viddo 最大的 UI 差异）**
- 三个顶部标签（**渐变高亮**）：
  - **AI Video**（紫粉渐变）
  - **AI Image**（绿青渐变）
  - **Video Agent <Beta>**（紫色）
- Hero 只有**一个大输入框** "Enter your idea to generate"，左侧 `+` 上传图片
- 输入框下方一行 **参数 pills**（chip-style 横排）：
  - Mode dropdown（AI Video / AI Image，对应当前 tab）
  - 工作流 dropdown（"Text/Image to Video"、"1:1" 等）
  - **模型 selector**（"P Pollo 2.0"）
  - 时长（"5s"）
  - 分辨率（"480p"）
  - 比例（"16:9"）
  - "..." 溢出（更多参数藏在这）
  - 右端：**"✨ Generate ⓘ 10"** 主 CTA（信用消耗实时显示在按钮上）
- 输入框下方有 **Quick Prompts** chips："Saiyan Transformation"、"Rainy Night Couple"、"Family Talk Show 🎤"（带 ↻ 刷新按钮换一批）

**AI Image tab 参数差异（不同模态的 pills 自适应）**
- 模型："P Pollo Image 1.6"
- 比例："1:1"
- 数量："1"（生成几张）
- "Auto"（质量预设？）
- 右端 Generate ⓘ **4**（图像扣费比视频少：4 vs 10）

**Featured Cards Carousel（输入框下方）**
- 横向滚动卡片，左右箭头切换
- 内容：新模型/促销 banner，每卡有醒目大字（"SEEDANCE 2.0"、"Pollo 3.0"、"KLING 3.0 MOTION CONTROL"）+ 短描述（"Multi-Shot Made Easy" / "Dynamic Capture Upgraded to the Max"）
- AI Image tab 也有：NANO BANANA 2 / Seedream 5.0 Lite / Kling 3.0 & 3.0 Omni Image Model

**视觉风格（截图直读）**
- 暗色基调（接近纯黑 navy `#0A0A12` 推测）
- Sidebar 背景比主区更深一档（双层暗色分层）
- **品牌色：玫红/品红**（≈ `#FF0066` / `#E91E63` 系），用于 Create New / Generate 数字 / 当前激活 sidebar 项的左侧 indicator
- Tab 高亮用**渐变**而非纯色（紫粉 / 绿青 / 紫），点缀感强但不喧宾夺主
- 圆角偏大（卡片 ~16–20px，pill ~999px）
- "Beta"、"60% OFF" 徽标用红粉色

**生成结果页**
- 共享 URL 模式 `/v/<id>` —— 每个生成结果有独立可分享链接（评测来源，截图未覆盖）
- 评测：单图生成后可二次精修：背景去除、Inpainting（"Remove Objects"）、Outpainting（"Uncrop"）

**SPEC 对齐建议**
- Pollo 的 **Top-Tab 切换 + 单输入框** 比 Viddo 的左控件 + 右预览**更适合 Synapse 的「中级用户」定位**：上手即懂，参数收纳到 pills 不噪
- "+ Create New" 作为 sidebar 顶部最高权重 CTA，比 SPEC 的 "+ New Generation"（藏在 Dashboard 内）更易达
- 信用余额 pill `10 ▣` 显示在全局 Top Bar，比 SPEC 的 CreditBadge 在 Dashboard 露出更主动 — 建议提到 Navbar 全局
- "Default Project ▾" 项目隔离 SPEC 没有 — 是 B2B / 多客户场景刚需，可放 v1.2 backlog
- "Auto" 质量预设是个好 UX：用户不用学 Steps/Quality 参数，新手友好；建议 Synapse ParamGrid 加一个 Auto 模式
- Generate 按钮上**实时显示信用消耗**（"Generate ⓘ 10"）— SPEC 暂无，强烈建议加

---

### 1.5 Video Agent — 战略级差异点（Pollo Beta，2026 新增）

> **这是 SPEC v1.0 完全没有的功能维度。**

**Pollo Agent 页面结构（截图直拆）**
- 居中大标题 "Pollo Agent"
- 副标："Go from idea to post-ready video instantly. Clone viral trends, make high-converting ads, and more. Built for creators, marketers, and brands."
- 一个**大型对话式输入框**："Share your vision or drop any assets/links, and let our AI handle the rest"
- 输入框下方控制按钮：`+`（资源上传） / `↻ Auto` / `🪄 Style` / 右侧发送箭头
- 输入框下方 **7 个预设模板卡**（带缩略图）：
  - **CLONE VIRAL VIDEO** — 复刻爆款视频
  - **UGC ADS** — 仿真 UGC 广告
  - **CLONE VIDEO ADS** — 复刻视频广告
  - **STORY VIDEO** — 故事型视频
  - **MUSIC VIDEO** — 音乐视频
  - **NEWS VIDEO** — 新闻播报视频
  - **EXPLAINER VIDEO** — 讲解视频

**Agent 与普通 Workspace 的本质区别**
- 普通 Workspace：用户**显式选模型 + 写 prompt + 配参数 + 生成单条**
- Agent：用户**描述意图或丢素材**，系统**自动**完成多步骤工作流（脚本拆解 → 分镜 → 多模型选用 → 拼接 → 配音 → 输出 post-ready 完整视频）

**目标用户切换**
- 普通工作台 = 创作者（按提示创作）
- Agent = 营销 / market / influencer / 自媒体（要的是「一条能直接发的视频」，不是单个生成）

**对 Synapse 的策略级提问**
SPEC v1.0 把 Synapse 定位为**模型聚合工作台**，目标用户是「中级创作者」。Pollo 的 Video Agent 暗示了一个**新增产品形态**：

| 维度 | SPEC v1.0 现状 | 加入 Agent 后 |
|---|---|---|
| 定位 | 模型聚合 + 统一 Prompt | 模型聚合 + Agent 工作流 |
| 目标用户 | 25–40 岁中级创作者 | + 营销 / 自媒体 / 品牌 |
| 复杂度 | 标准 SaaS（已规划） | 需 Agent engineering（多步推理、模型编排、状态机） |
| 单价 | $0 / $19 / $49 | 可拉高 Pro / 增设 Agent 专属 tier ($79+/月) |
| 工期 | 已估 10 天 MVP | Agent 至少 +2 周 |

**建议**
1. **MVP 不做 Agent**，但在 SPEC §2.1 功能矩阵里**预留 v1.2 槽位**（重要：影响信息架构 — sidebar 要预留 "Agent" 入口）
2. 定价层级里**预留 "Studio" 或 "Team" tier**（$79–$99）作为 Agent 解锁档，不要把 Pro 顶到天花板
3. Agent 是「Lovart、即梦、Pollo 都在做」的趋势 — 早做架构预留，晚做实现

---

## 2. Viddo.ai 拆解

### 2.1 首页（viddo.ai/）

**Hero**
- 主标题：**"All-in-one AI Video & Image Generator"**
- 副标题（管道分隔的模型清单）："Sora 2 Pro | Veo3.1 | Nano Banana 2 | Hailuo 2.3 | Seedance | Runway | Kling | Midjourney | GPT 4o"
- 描述："Create stunning AI-generated videos with Veo3, Runway, Kling, and Hailuo etc. Turn text or image into high-quality videos using powerful generative AI."
- CTA：`Create Video` → `/image-to-video`，`Create Image` → `/image-to-image`，`One-Click Video Creator (180s)` → `/one-click-video-creator`
- 顶部促销 chip：`NewSeedance 2.0 Officially Launched`、`HotCreate Unlimited-Length Videos`

**Hero 内嵌生成器（关键设计选择）**
首页 Hero 下方就是完整工作台，不需要跳转：
- Tabs：`Image to Video / Text to Video / Image to Image / Text to Image`
- Model selector：默认 Seedance V2.0，含 Ver.1/Ver.2 切换
- Upload Media：`image(0/9) · video(0/3) · audio(0/3)` 多资产计数器
- Prompt 工具栏：Translate / Generate With AI / Copy / Clear / Paste / Expand
- Video Ratio：`16:9 / 9:16 / 4:3 / 3:4 / 1:1 / 21:9`（**6 选项**，比 Pollo 多 1 个 21:9）
- Resolution：`480p / 720p / 1080p`（**比 Pollo 多 480p 低端选项**）
- Video Length：`5s / 15s`
- Web Search 开关："Enable Web Search to generate creations based on real-time information"
- 信用计数 + Generate 按钮

**导航**
- Logo 在左
- 主菜单：AI Video / AI Image / AI Voice / AI Music / Video Editor / **Price (badge: 50% OFF)** / Affiliate
- 大型 Mega Menu，按"工具 + 模型族"分组
- 模型族：Google Veo / Grok / Seedance / Kling / Wan / Runway / Hailuo / Midjourney / OpenAI Sora

**模型 Marquee**
- 横向无限滚动 chip ticker（源码里复制了一份做无缝 loop）
- ~26 个模型 chip 显示

**Explore 区**
- 4 卡网格：Image to Video / Text to Video / Image to Image / Text to Image
- 每卡：标题 + 副标 + 描述 + Create CTA + 4–6 个生成示例缩略图

**Example Videos 区**
- 标签切换：Ad Creative / Short Film / Wedding Video / Social Media Video
- 每例：Prompt 文本 + 模型 badge（"Google Veo 3"）+ 海报缩略图

**Why Choose Viddo AI（4 卡）**
- "Unified Platform for Video and Music Creation"
- "Powered by Leading AI Models"
- "Effortless Text-to-Content Workflows"
- "Built for Modern Creative Workflows"

**How-it-works**
- 4 步：Select Model → Enter Prompt / AI Assist → Choose Parameters → Generate
- 配两段演示视频

**Stats（社会证明）**
- 1.5M+ Users · 70+ Countries · 20+ AI Models · 100+ AI Effects
- 6 个 testimonial 卡（含视频海报 + 头像 + 名字 + 角色 + 引用）

**FAQ：9 题**

**Footer：4 列**
- AI Video / AI Image / Video Effects / Company

---

### 2.2 模型详情页（viddo.ai/sora2 为代表）

**Hero**
- Tagline："Sora 2:Next-Gen Video Creation Powered by OpenAI"
- 底部 CTA 区标题："Sora 2-Redefining AI Video Storytelling Powered by OpenAI"
- 副标："Create cinematic videos with synchronized dialogue, sound effects, and physics-aware motion in stunning 1080P."
- 主 CTA："Generate"
- **Hero 即生成器**：左控件 + 右预览，预览空态文案 "Waiting for your creations!"

**模型 Specs（在生成器面板内暴露）**
- Modes：Basic / Pro（"Pro mode has higher quality and longer video length"）
- Lengths：10s / 15s / 25s
- Aspect Ratios：Landscape / Portrait
- 输入模式：Image to Video / Text to Video
- 上传：JPEG/PNG/WebP，≤10MB，1 张
- Frame Mode、Translate、Generate With AI、Watermark Removal toggle、Select From Your Creations
- Credits 实时显示

**页面节奏**
1. Hero + 内嵌生成器
2. **3 个特性块**：Identity Consistency & Smart Voice / World Knowledge & Logical Storytelling / Cinematic Movement & Engaging Immersion
3. **6 个用例**：Advertising / Education / Film Pre-vis / Game Storytelling / E-commerce / Personalized Content
4. **6 条 testimonial**
5. **6 题 FAQ**
6. 底部 CTA banner（无独立按钮，引导回 Hero 生成器）

**关键 UX 模式**
- 生成器 **above-the-fold 即可用**，不藏在 CTA 后
- Mode toggle（Basic/Pro）在 UI 层把同模型多变种合并
- Watermark removal 作为开关暴露（付费用户才能开）
- 每节"短段落 + 单 webp 海报"，非自动播放网格 — 性能优先

---

### 2.3 Pricing 页（viddo.ai/price）

**Page Header**
- 主标："Join 1.5M+ users of Viddo AI"
- 副标："Worried about the effectiveness?"
- 解释："No problem, Watch the video to see the effectiveness."
- 强保障："Also, if creation fails, you can request refund or get your used credits back"
- 紧迫感 banner："Price rising come soon! Buy now to lock in lowest prices!"

**计费切换**
- `Annual` / `Month` / `One-time`（**三种周期**，比 Pollo 多 One-time 单买）
- 折扣："Annual 50% OFF"
- 货币：USD 选择器

**价格锚点（首页/Pricing 头通用）**
- "Seedance 2.0: As low as $0.345 per video"
- "Veo3.1 Lite: As low as $0.0575 per video"
- "Save 80%" vs 市场平均

**信用规则**
> "Credits are deducted depending on several factors such as the specific tool or model selected, the length of the video, the number of outputs requested, and the resolution of the generated content."

**FAQ（6 题）**
1. Can I work on multiple projects at the same time?
2. If I make a payment on Viddo AI, will my payment information be exposed?
3. Are there any hidden fees?
4. Can I request a refund?
5. Can I cancel my subscription at any time?
6. How are credits consumed when generating images or videos?

**关键文案**
- 无隐藏费："the price you see is the price you pay. There are no any other additional hidden charges."
- 取消政策："You will still have access to use the remaining credits."
- 失败退款："if creation fails, you can request a refund or get your used credits back"

**支付方式（icons）**
Mastercard, Visa, Amex, Apple Pay, China UnionPay, Google Pay, JCB, Discover, PayPal, Click to Pay, Bancontact, SEPA Direct Debit, Link, iDEAL, Diners Club, TrueLayer, Cash App Pay, Eftpos, Revolut Pay + "More"

**对 Synapse 的启示**
- "失败退款/返还信用"是低风险承诺，强烈建议加入
- 三种计费周期（Annual/Month/One-time）比 SPEC 的"月费 + 年费"更灵活，One-time 适合不愿订阅的轻度用户
- 价格锚点不应是"$/月"，而是 **$/视频**（市场对比更直观）

---

### 2.4 生成工作台（viddo.ai/image-to-video 为代表）

**整体布局：经典 2 列**
- Header：Logo + 主菜单 + Price(50% OFF) + Affiliate + Sign In
- 主体：左控件，右预览
- **没有持久底部队列条** —— 历史通过 "Select Creations" 选择器或独立 "My Creations" 页访问
- 下方还有营销内容（why / how / testimonials / FAQ）— 工作台和落地页是同一个长页

**左控件（Control Panel）**

| 区块 | 控件 |
|---|---|
| Model Selector | 当前 "Seedance V2.0" + Channel / Ver.1（30% 便宜）/ Ver.2（30% 贵，支持真人）|
| Upload Media | "Reference" + 拖拽区，多资产计数器 `image(0/9) · video(0/3) · audio(0/3)` |
| | "Select Creations"（从历史选） |
| Prompt | 多行 textarea + 工具栏（Translate / Generate With AI / Copy / Clear / Paste / Expand）|
| | 提示文案："If you're not satisfied, you can generate again or enter prompt for your own." |
| Video Ratio | 6 chip：`16:9` `9:16` `4:3` `3:4` `1:1` `21:9` |
| Resolution | 3 段切换：`480p` / `720p` / `1080p` |
| Video Length | `5s` / `15s` |
| Web Search | 开关 + 微文案 |
| Credits + CTA | "Required credits: 0" + Generate 主按钮 |

**右预览**
- 空态："Waiting for your creations!"
- 生成中 / 完成 / 错误状态在源码里没暴露完整文案，需以 SPEC 的 PreviewCanvas 状态机自定义

**徽章风格**
- "Hot"（Video Extend）
- "New"（One-Click Video Creator）
- "50% OFF"（Price 入口）

**对 Synapse 的启示**
- SPEC 的 ParamGrid（Duration/Aspect/Quality/Steps）方向正确，但 **Aspect Ratio 至少给 6 选项**（包含 21:9），别只给 4 个
- Resolution 区间 SPEC 写的是 "low/medium/high"，建议改成具体规格 `480p / 720p / 1080p` 或 `720p / 1080p / 4K`，用户更易理解
- Prompt 工具栏可借鉴 Viddo 的 6 个 helper 按钮（Translate / Enhance / Copy / Clear / Paste / Expand）
- "Select From Creations"（从历史选）是个好交互，SPEC 没明确，可加到 PromptInput 或 PreviewCanvas
- Hero 内嵌生成器适合 Synapse 的 Landing 页：能让访客直接体验，提升匿名转化（SPEC 的 2 次匿名试用流程会更顺）

---

## 3. Synapse 设计稿对照建议（按 SPEC 章节）

### 3.1 Landing Page（SPEC §3.2）
- **Hero 改造**：在 Hero 区下方嵌入生成器面板（Viddo 模式），让访客 0 跳转就能用
- 模型展示用 marquee chip ticker（Viddo）+ 卡片网格（Pollo）混合
- 不要用 Viddo 的"100+ AI Effects"路线 — 偏离 SPEC 的中级用户定位

### 3.2 Generate 工作台（SPEC §4 / §11）
- 2 列布局对齐 Viddo
- Aspect Ratio 选项扩到 6 个：16:9 / 9:16 / 4:3 / 3:4 / 1:1 / 21:9
- Resolution 用具体规格：720p / 1080p / 4K（按 plan 解锁）
- Prompt 工具栏加 6 个 helper：Translate / Enhance / Copy / Clear / Paste / Expand
- 加 "Select From Creations"（历史选择）入口
- 模型选择器要支持**保留 prompt+参数切换模型**（Pollo 的核心 UX）

### 3.3 模型详情页（SPEC 暂未规划路由 `/models/[id]`）
- 建议补一个 `/models/[id]`：Hero + 内嵌生成器（同模型）+ 3 特性 + 4–6 用例 + 6 testimonial + 6 FAQ + bottom CTA
- 这是 SEO 重镇 — 每个模型独立页能命中 "kling 2 review"、"runway gen-4 demo" 等长尾词

### 3.4 Pricing 页（SPEC §16.2）
- 三档 $0 / $19 / $49 偏低，参考 Pollo 调整为 $0 / $15 / $29 更贴近市场
- 价格锚点改为 **$/video** 而非 $/month（Viddo 模式）
- 加 One-time credit pack（不过期）
- 加"失败退款/返还信用"承诺
- 退款条款：3 天 + <50 credits 已使用 = 全退（Pollo 模式）
- Pricing 页要展示完整支付方式 icon 组（建立信任）

### 3.5 生成结果页（SPEC 隐含在 Dashboard）
- Pollo 用 `/v/<id>` 独立分享 URL，建议 SPEC 补 `/share/[generation_id]` 路由
- 二次精修（inpaint/uncrop）放进 v1.1 backlog（SPEC §2.1 没列）

---

## 4. 数据来源

### 直接抓取（成功）
- Viddo 首页：[viddo.ai](https://viddo.ai/)
- Viddo Pricing：[viddo.ai/price](https://viddo.ai/price)
- Viddo 模型详情（Sora 2）：[viddo.ai/sora2](https://viddo.ai/sora2)
- Viddo 工作台（Image to Video）：[viddo.ai/image-to-video](https://viddo.ai/image-to-video)

### Pollo.ai（被 Cloudflare 403 拦截，从评测站合成）
- [Plans & Pricing | Pollo AI](https://pollo.ai/pricing)（无法抓取，仅链接）
- [Pollo AI Pricing 2026 - Flowith Blog](https://flowith.io/blog/pollo-ai-pricing-2026-free-credits-vs-pro/)
- [Pollo AI: Definition, Features & How the AI Video Generator Works | Skywork](https://skywork.ai/blog/pollo-ai-definition-ai-video-generator-explained/)
- [Try Pollo.ai Free | media.io](https://www.media.io/ai-video-generator/pollo-ai-video.html)
- [Pollo AI Video Generator | monet.vision](https://monet.vision/pollo-ai)
- [Pollo.ai Pricing | SaaSworthy](https://www.saasworthy.com/product/pollo-ai/pricing)

### 推荐手动截图（设计阶段对照用）
本文档无法替代真实截图。建议用 Chrome / Brave 手动访问下列 URL，用浏览器自带截图（F12 → Cmd/Ctrl+Shift+P → "Capture full size screenshot"）：

| 页面类型 | Pollo.ai | Viddo.ai |
|---|---|---|
| 首页 | [pollo.ai/home](https://pollo.ai/home) | [viddo.ai](https://viddo.ai/) |
| 模型详情 | [pollo.ai/veo-3](https://pollo.ai/veo-3) | [viddo.ai/sora2](https://viddo.ai/sora2) |
| Pricing | [pollo.ai/pricing](https://pollo.ai/pricing) | [viddo.ai/price](https://viddo.ai/price) |
| 工作台 | [pollo.ai/app/ai-video](https://pollo.ai/app/ai-video) | [viddo.ai/image-to-video](https://viddo.ai/image-to-video) |
| 分享结果 | `pollo.ai/v/<id>` 模式 | （Viddo 无独立分享 URL） |

### Mobbin 补充建议
按用户备注：去 [mobbin.com](https://mobbin.com/) 搜 "AI video generator"，重点关注：
- Runway / Pika / Luma 的工作台（直接对手，设计成熟）
- Midjourney 的网页版（高端定位 + 极简 UI 参考）
- Krea AI / Recraft（统一面板 + 模型切换 UX）
