# Synapse — AI Video & Image 聚合生成平台

## 技术规格文档（SPEC）

> 版本：v1.0.1（基于 Pollo / Viddo 竞品研究调整）  
> 日期：2026-05-08  
> 状态：Ready for Implementation  
> 设计稿：pencil-new.pen（Pencil MCP）  
> 设计令牌：design-tokens.md  
> 调研依据：competitor-research.md

---

## 1. 项目概述

### 1.1 产品定位

Synapse 是一个 AI Video + Image 多模型聚合生成平台。用户在一个统一控制台中，可以调用 20+ 个主流 AI 生成模型（Kling、Runway、Pika、Midjourney、Flux 等），无需在各个官方站点之间切换。

**核心价值：** 为已经理解 AI 视频价值的中级创作者（25-40 岁）节省「切换平台、比价、管理账号」的时间成本。

**不做的事情：**
- 不做 Voice / Music / Editor 功能
- 不做纯小白用户的「一键魔法」简化
- 不做价格敏感型用户的「最便宜单次生成」比价

### 1.2 目标用户

| 属性 | 描述 |
|---|---|
| 地域 | 美国、欧洲为主 |
| 年龄 | 18-45 岁，核心 25-40 岁 |
| 设备 | Desktop-first（70% 流量），1440px 基准 |
| AI 认知 | 60% 中级用户（用过 Runway/Kling），40% 高级玩家 |
| 付费意愿 | 愿为效率付费，不理解「免费午餐」 |

### 1.3 技术栈

| 层级 | 技术 |
|---|---|
| 框架 | Next.js 15 (App Router) + React 19 + TypeScript |
| 样式 | Tailwind CSS v4 + shadcn/ui + Radix Primitives |
| 字体 | Plus Jakarta Sans + JetBrains Mono (next/font/google) |
| 图标 | Lucide React |
| 动效 | Framer Motion |
| 国际化 | next-intl |
| 后端 | Supabase (Auth + Postgres + RLS) |
| 存储 | Cloudflare R2 |
| 部署 | Vercel |
| 性能目标 | Lighthouse > 70 |

---

## 2. 功能规格（Feature Spec）

### 2.1 功能矩阵

| 功能模块 | 优先级 | MVP | v1.1 | v1.2 | 说明 |
|---|---|---|---|---|---|
| **Landing 首页** | P0 | ✅ | — | — | 品牌展示、Hero 内嵌 mini 生成器、模型聚合、定价、Footer |
| **Generate 工作台** | P0 | ✅ | — | — | Top-Tab(AI Video/AI Image) + Hero Input + 参数 pills |
| **匿名试用** | P0 | ✅ | — | — | 免费 2 次生成后引导注册 |
| **Auth 登录/注册** | P0 | ✅ | — | — | Email + OAuth (Google/GitHub) |
| **Dashboard 仪表盘** | P0 | ✅ | — | — | 统计、历史记录、资产管理 |
| **多模型聚合** | P0 | ✅ | — | — | 支持 8+ 模型（MVP） |
| **统一 Prompt** | P0 | ✅ | — | — | 一键适配不同模型参数；保留 prompt + 参数切换模型(Pollo 核心 UX) |
| **Auto 质量预设** | P0 | ✅ | — | — | 新手友好；不暴露 Steps/Quality，让系统自动选 |
| **Generate 信用实时显示** | P0 | ✅ | — | — | Generate 按钮实时显示当前配置的扣费数 (e.g. "Generate ⓘ 10") |
| **生成结果分享 URL** | P0 | ✅ | — | — | `/share/[id]` 独立可分享页面 |
| **失败退款 / 返还信用** | P0 | ✅ | — | — | 生成失败自动返还信用，3 天内首购 < 50 credits 全额退款 |
| **批量生成** | P1 | — | ✅ | — | 队列 10 个任务 |
| **资产管理** | P1 | ✅ | — | — | 组织、标签、导出、版本历史 |
| **Batch 队列** | P1 | ✅ | — | — | 后台运行、状态追踪 |
| **Pricing & Billing** | P1 | ✅ | — | — | 3 档订阅 + One-time 信用包 (不过期)、Stripe 支付 |
| **Credit 系统** | P1 | ✅ | — | — | 月度信用按生成扣费 (不滚存) + 一次性 add-on 包 (永久有效) |
| **二次精修** | P1 | — | ✅ | — | 图像 inpaint / uncrop / 背景去除 (Pollo 同款) |
| **API 访问** | P2 | — | ✅ | — | Pro 套餐专享 |
| **Webhooks** | P2 | — | ✅ | — | Pro 套餐专享 |
| **多语言** | P2 | — | ✅ | — | next-intl 框架预留 |
| **Video Agent** | P2 | — | — | ✅ | 多步骤工作流(意图 → 脚本 → 分镜 → 多模型编排 → 拼接)；解锁 Studio tier |
| **多项目隔离** | P2 | — | — | ✅ | "Default Project ▾" 切换；B2B / 多客户场景 |

### 2.2 用户旅程

```
[匿名用户]
  ↓ 访问首页
  ↓ 点击 "Start Creating Free"
  ↓ 进入 Generate 页面（匿名会话）
  ↓ 选择模型 → 输入 Prompt → 配置参数 → 点击 Generate
  ↓ 第 1-2 次：直接生成
  ↓ 第 3 次+：弹出注册引导（Modal）
  ↓ 注册/登录（Email 或 OAuth）
  ↓ 进入 Dashboard

[已登录用户]
  ↓ 登录后默认进入 Dashboard
  ↓ 点击 "+ New Generation" → Generate 页面
  ↓ 选择模型 → 输入 Prompt → 配置参数 → 点击 Generate
  ↓ 扣除 Credits，进入队列
  ↓ 完成后 Toast 通知 + Dashboard 自动更新
  ↓ 在 Dashboard 查看/下载/分享历史生成
```

---

## 3. 页面与路由结构

### 3.1 路由表

| 路由 | 页面名称 | 访问权限 | 设计稿 |
|---|---|---|---|
| `/` | Landing 首页 | 公开 | 01 - Landing Page |
| `/generate` | 生成工作台 | 公开（匿名限额） | 02 - Generate Page |
| `/models/[id]` | 模型详情页 | 公开 | 02b - Model Detail (SEO 落地，每个模型独立页) |
| `/share/[id]` | 生成结果分享页 | 公开 | 02c - Share Page (独立 URL，可外发) |
| `/auth` | 登录/注册 | 公开 | 03 - Auth Page |
| `/dashboard` | 用户仪表盘 | 需登录 | 04 - Dashboard |
| `/dashboard/assets` | 资产管理 | 需登录 | — |
| `/dashboard/billing` | 账单管理 | 需登录 | — |
| `/dashboard/settings` | 账户设置 | 需登录 | — |
| `/pricing` | 定价页 | 公开 | Landing 中 Pricing Section 独立页（可选） |
| `/agent` | Video Agent (v1.2) | 需登录 | — (Studio tier 解锁) |

### 3.2 布局结构

```
App Layout (RootLayout)
├── fonts (Plus Jakarta Sans + JetBrains Mono)
├── ThemeProvider (暗色默认)
├── I18nProvider (next-intl 预留)
│
├── / (Landing)
│   └── Navbar (透明→滚动固底) + Hero + Models + Features + Pricing + Footer
│
├── /generate
│   └── GenerateNav + TopTabSwitcher(Video/Image) + HeroInput + ParamPills + FeaturedCarousel + ResultsArea
│       (Pollo 风格：极简单输入框，参数收纳到一行 pills；非 Viddo 的左控件+右预览)
│
├── /auth
│   └── 分屏布局(左侧品牌区 + 右侧表单卡片)
│
└── /dashboard
    └── DashNav + Sidebar + ContentArea
```

---

## 4. 组件清单

### 4.1 shadcn/ui 组件（安装列表）

```bash
npx shadcn@latest add \
  button \
  card \
  input \
  textarea \
  select \
  dialog \
  dropdown-menu \
  tabs \
  tooltip \
  badge \
  avatar \
  toast \
  sonner \
  progress \
  skeleton \
  separator \
  accordion \
  scroll-area
```

### 4.2 自定义共享组件

| 组件 | 路径 | 用途 | 复杂度 |
|---|---|---|---|
| `Navbar` | `components/navbar.tsx` | 顶部导航（Landing 变体 / App 变体）；App 变体右上角包含 CreditPill + History + Avatar | 中 |
| `Sidebar` | `components/sidebar.tsx` | Dashboard 侧边栏导航 | 低 |
| `TopTabSwitcher` | `components/top-tab-switcher.tsx` | /generate 顶部 tab 切换（AI Video / AI Image），渐变高亮 | 低 |
| `HeroInput` | `components/hero-input.tsx` | 大单输入框 "Enter your idea to generate" + 上传 `+` 按钮 + Quick Prompts chips | 中 |
| `ParamPills` | `components/param-pills.tsx` | 参数 pills 行（Mode / 模型 / Duration / Resolution / AspectRatio / Auto / 溢出 ...）；模态自适应（Video 显时长/分辨率，Image 显数量/比例） | 中 |
| `GenerateButton` | `components/generate-button.tsx` | Generate CTA + **实时信用消耗显示** ("Generate ⓘ 10")；状态：idle / loading / disabled (信用不足) | 中 |
| `AutoToggle` | `components/auto-toggle.tsx` | Auto 质量预设切换（关闭时暴露 Steps/Quality 高级参数） | 低 |
| `ModelCard` | `components/model-card.tsx` | 模型展示卡片（Logo + 名称 + 标签） | 低 |
| `GenerationCard` | `components/generation-card.tsx` | 生成结果卡片（预览图 + 信息 + 状态） | 中 |
| `FeaturedCarousel` | `components/featured-carousel.tsx` | 工作台新模型/促销横向卡片轮播（"60% OFF SEEDANCE 2.0" 风格） | 中 |
| `QueueItem` | `components/queue-item.tsx` | 生成队列单项（完成/生成中/排队） | 中 |
| `QueueStrip` | `components/queue-strip.tsx` | 底部生成队列条 | 中 |
| `PricingCard` | `components/pricing-card.tsx` | 定价方案卡片（含 4 档：free / starter / pro / studio） | 低 |
| `CreditPackCard` | `components/credit-pack-card.tsx` | One-time 信用包卡片（slider 选 2K–50K credits，不过期标签） | 中 |
| `FeatureCard` | `components/feature-card.tsx` | 功能特性卡片 | 低 |
| `ModelSelector` | `components/model-selector.tsx` | 模型下拉选择器（**保留 prompt + 参数切换模型** 是核心 UX） | 中 |
| `PromptInput` | `components/prompt-input.tsx` | Prompt 文本域（max 2000 字符）+ 6 工具按钮（Translate / Enhance / Copy / Clear / Paste / Expand）+ 字符计数 | 中 |
| `PreviewCanvas` | `components/preview-canvas.tsx` | 视频预览画布（上传态/预览态/生成中/成功/失败）+ 完成态控件（Download / Share / Regenerate / Inpaint v1.1） | 高 |
| `ShareLink` | `components/share-link.tsx` | 生成结果分享 URL 复制 + 社交分享按钮 | 低 |
| `StatsCard` | `components/stats-card.tsx` | 仪表盘统计卡片 | 低 |
| `AuthForm` | `components/auth-form.tsx` | 登录/注册表单（含社交登录） | 中 |
| `CreditPill` | `components/credit-pill.tsx` | 全局 Top Bar 信用余额 pill（数字 + ▣ 图标）；click → /dashboard/billing | 低 |
| `AnimatedSection` | `components/animated-section.tsx` | Framer Motion 滚动入场包装器 | 中 |
| `GlowBackground` | `components/glow-background.tsx` | Hero 区域装饰性 Indigo 光晕 | 低 |

### 4.3 组件接口定义

#### ModelCard
```typescript
interface ModelCardProps {
  id: string;
  name: string;           // e.g. "Kling 2.0"
  type: 'video' | 'image';
  logo: string;           // 单字母或图标名
  logoColor: string;      // hex color
  specs: string;          // e.g. "1080p • 10s"
  isNew?: boolean;
  isPopular?: boolean;
  onSelect?: () => void;
}
```

#### GenerationCard
```typescript
interface GenerationCardProps {
  id: string;
  title: string;
  modelName: string;
  resolution: string;
  duration?: string;
  thumbnailUrl?: string;
  status: 'completed' | 'generating' | 'queued' | 'failed';
  progress?: number;      // 0-100
  createdAt: Date;
  creditCost: number;
  onDownload?: () => void;
  onShare?: () => void;
  onRetry?: () => void;
}
```

#### QueueItem
```typescript
interface QueueItemProps {
  id: string;
  title: string;
  status: 'completed' | 'generating' | 'queued';
  progress?: number;
  modelName: string;
  estimatedTime?: number; // seconds
}
```

#### PricingCard
```typescript
interface PricingCardProps {
  tier: 'free' | 'starter' | 'pro' | 'studio';   // studio = v1.2 Agent 解锁档
  name: string;
  price: number;
  period: 'month' | 'year' | 'one-time';          // one-time = 信用包永久
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
  onSelect?: () => void;
}
```

---

## 5. 状态管理

### 5.1 状态分层

| 层级 | 技术 | 用途 |
|---|---|---|
| **Server State** | Supabase + React Query / SWR | 用户数据、生成历史、模型列表、定价信息 |
| **Global Client State** | React Context | 用户认证状态、主题模式、积分余额 |
| **Local UI State** | useState / useReducer | 表单输入、下拉展开、Modal 开关、Tab 切换 |
| **URL State** | Next.js App Router | 当前页面、筛选参数、模型 ID |

### 5.2 Context 定义

#### AuthContext
```typescript
interface AuthState {
  user: User | null;
  session: Session | null;
  isAnonymous: boolean;
  anonymousGenerationsLeft: number;  // 2 → 1 → 0
  isLoading: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
}
```

#### GenerationContext
```typescript
interface GenerationState {
  selectedModel: Model | null;
  prompt: string;
  parameters: GenerationParameters;
  queue: QueueItem[];
  isGenerating: boolean;
  currentGeneration: Generation | null;
}

interface GenerationParameters {
  duration: 3 | 5 | 10 | 15 | 16;                          // seconds (Sora2 用 15)
  aspectRatio: '16:9' | '9:16' | '4:3' | '3:4' | '1:1' | '21:9';  // 6 个，含影院 21:9
  resolution: '480p' | '720p' | '1080p' | '4K';            // 具体规格替代 low/med/high
  auto: boolean;                                            // true 时系统自动选 quality+steps
  quality?: 'low' | 'medium' | 'high';                      // auto=false 时暴露
  steps?: number;                                           // 20-50；auto=false 时暴露
}
```

---

## 6. 数据库 Schema（Supabase Postgres）

### 6.1 表结构

```sql
-- 用户扩展表（Supabase Auth 管理核心用户）
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  plan tier default 'free',
  credits integer default 5,
  credits_used_monthly integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 生成任务表
create table public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  model_id text not null,
  prompt text not null,
  parameters jsonb default '{}',
  status text default 'queued' check (status in ('queued', 'generating', 'completed', 'failed', 'cancelled')),
  progress integer default 0 check (progress >= 0 and progress <= 100),
  result_url text,
  thumbnail_url text,
  credit_cost integer default 2,
  error_message text,
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- AI 模型表
create table public.models (
  id text primary key,
  name text not null,
  provider text not null,
  type text check (type in ('video', 'image')),
  description text,
  specs jsonb default '{}',
  logo_color text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- 定价方案表
create table public.pricing_tiers (
  id text primary key,
  name text not null,
  price_monthly integer not null,       -- cents
  price_yearly integer,                 -- cents
  generation_limit integer,             -- null = unlimited
  max_resolution text,
  features jsonb default '[]',
  is_active boolean default true
);

-- 积分交易记录
create table public.credit_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  amount integer not null,              -- positive = 充值, negative = 消费
  type text check (type in ('purchase', 'generation', 'refund', 'bonus')),
  description text,
  generation_id uuid references public.generations(id),
  created_at timestamptz default now()
);

-- 匿名会话表（追踪匿名用户的生成次数）
create table public.anonymous_sessions (
  id uuid default gen_random_uuid() primary key,
  fingerprint text unique,
  generations_used integer default 0,
  max_free_generations integer default 2,
  created_at timestamptz default now(),
  last_used_at timestamptz default now()
);
```

### 6.2 Row Level Security（RLS）

```sql
-- profiles: 用户只能读写自己的资料
alter table public.profiles enable row level security;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- generations: 用户只能看到自己的生成记录
alter table public.generations enable row level security;
create policy "Users can view own generations"
  on public.generations for select using (auth.uid() = user_id);
create policy "Users can create own generations"
  on public.generations for insert with check (auth.uid() = user_id);

-- credit_transactions: 用户只能看到自己的交易
alter table public.credit_transactions enable row level security;
create policy "Users can view own transactions"
  on public.credit_transactions for select using (auth.uid() = user_id);

-- models: 公开只读
alter table public.models enable row level security;
create policy "Models are publicly viewable"
  on public.models for select to anon, authenticated using (true);

-- pricing_tiers: 公开只读
alter table public.pricing_tiers enable row level security;
create policy "Pricing is publicly viewable"
  on public.pricing_tiers for select to anon, authenticated using (true);
```

### 6.3 索引

```sql
create index idx_generations_user_status on public.generations(user_id, status);
create index idx_generations_created_at on public.generations(created_at desc);
create index idx_credit_transactions_user on public.credit_transactions(user_id, created_at desc);
create index idx_anonymous_sessions_fingerprint on public.anonymous_sessions(fingerprint);
```

---

## 7. API 规范

### 7.1 API 路由（Next.js App Router Route Handlers）

| 路由 | 方法 | 认证 | 说明 |
|---|---|---|---|
| `/api/generate` | POST | 可选 | 提交生成任务（匿名/已登录） |
| `/api/generate/[id]/status` | GET | 可选 | 查询生成任务状态 |
| `/api/generate/[id]/cancel` | POST | 可选 | 取消生成任务 |
| `/api/models` | GET | 否 | 获取可用模型列表 |
| `/api/user/credits` | GET | 是 | 获取用户积分余额 |
| `/api/user/history` | GET | 是 | 获取生成历史 |
| `/api/webhook/generation` | POST | 否 | 上游模型回调（webhook） |

### 7.2 生成任务提交

```typescript
// POST /api/generate
interface GenerateRequest {
  modelId: string;
  prompt: string;
  parameters: {
    duration?: number;
    aspectRatio?: string;
    quality?: string;
    steps?: number;
  };
  // 匿名用户携带 fingerprint
  fingerprint?: string;
}

interface GenerateResponse {
  generationId: string;
  status: 'queued' | 'generating' | 'completed';
  estimatedTime: number;    // seconds
  queuePosition: number;
  creditsRemaining: number;
}
```

### 7.3 匿名生成限额检查

```typescript
// 服务端逻辑
async function checkGenerationLimit(
  userId: string | null,
  fingerprint: string | null
): Promise<{ allowed: boolean; reason?: string }> {
  if (userId) {
    // 已登录用户：检查积分余额
    const credits = await getUserCredits(userId);
    return { allowed: credits > 0 };
  }
  
  // 匿名用户：检查会话限额
  if (!fingerprint) return { allowed: false, reason: 'fingerprint_required' };
  
  const session = await getAnonymousSession(fingerprint);
  if (session.generations_used >= session.max_free_generations) {
    return { allowed: false, reason: 'free_limit_reached' };
  }
  
  return { allowed: true };
}
```

---

## 8. 认证流程

### 8.1 认证方式

| 方式 | 优先级 | 说明 |
|---|---|---|
| Email + Password | P0 | 标准邮箱密码登录 |
| Google OAuth | P0 | 一键登录/注册 |
| GitHub OAuth | P0 | 开发者友好 |
| Magic Link | P1 | 无密码登录（可选） |

### 8.2 匿名试用流程

```
1. 用户首次访问 /generate
   → 前端生成 fingerprint（Canvas + UserAgent + 时间戳哈希）
   → 存入 localStorage

2. 用户点击 Generate
   → POST /api/generate (携带 fingerprint)
   → 服务端检查 anonymous_sessions 表
   → generations_used < 2: 允许生成，计数+1
   → generations_used >= 2: 返回 403 { reason: 'free_limit_reached' }

3. 前端收到 403
   → 显示注册引导 Modal
   → "You've used your 2 free generations. Create an account to continue."
   → 提供 Sign Up / Sign In 按钮
   → 提供 "Maybe later"（返回首页）

4. 用户注册/登录后
   → Supabase Auth 创建用户
   → 触发 webhook: 创建 profiles 记录
   → 匿名生成记录迁移到用户名下（可选）
   → 刷新页面，继续生成
```

### 8.3 Supabase Auth 配置

```typescript
// supabase/config.toml (或 Dashboard 配置)
[auth]
enabled = true
site_url = "https://synapse.app"
additional_redirect_urls = ["https://synapse.app/auth/callback"]

[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = true

[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"
redirect_uri = "https://synapse.app/auth/callback"

[auth.external.github]
enabled = true
client_id = "env(GITHUB_CLIENT_ID)"
secret = "env(GITHUB_CLIENT_SECRET)"
redirect_uri = "https://synapse.app/auth/callback"
```

---

## 9. 国际化（i18n）

### 9.1 架构

使用 `next-intl` + App Router 集成。

```
app/
├── [locale]/
│   ├── page.tsx           # Landing
│   ├── generate/
│   │   └── page.tsx
│   ├── auth/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── layout.tsx         # LocaleLayout
├── layout.tsx             # RootLayout (fonts)
└── not-found.tsx

messages/
├── en.json                # 默认语言（美国英语）
└── de.json                # v1.1: 德语
```

### 9.2 语言配置

| 属性 | 值 |
|---|---|
| 默认语言 | `en` (US English) |
| 支持语言 | `en`, `de` (v1.1) |
| 路由前缀 | `/en/...`, `/de/...`（可选，也可用域名区分） |
| 回退 | 缺失翻译回退到 `en` |
| 日期格式 | 美国: "May 8, 2026" / 欧洲: "8 May 2026" |
| 数字格式 | 千位逗号分隔，小数点 |
| 货币 | USD 为主，v1.1 支持 EUR |

### 9.3 next-intl 配置

```typescript
// i18n.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
  timeZone: 'UTC',
  now: new Date(),
}));

// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'de'],
  defaultLocale: 'en',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

---

## 10. 文件存储（Cloudflare R2）

### 10.1 存储结构

```
r2-bucket: synapse-assets
├── generations/
│   ├── {user_id}/
│   │   ├── {generation_id}.mp4       # 视频输出
│   │   ├── {generation_id}.jpg       # 图片输出
│   │   └── {generation_id}_thumb.jpg # 缩略图
│   └── anonymous/
│       └── {fingerprint}/
│           └── ...
├── avatars/
│   └── {user_id}.jpg
└── model-previews/
    └── {model_id}.jpg
```

### 10.2 上传策略

- 预签名 URL 上传（服务端生成临时 URL，客户端直传 R2）
- 文件大小限制：视频 ≤ 100MB，图片 ≤ 10MB
- 自动缩略图生成（通过 R2 Workers 或 Supabase Edge Functions）

---

## 11. 性能规范

### 11.1 性能预算

| 指标 | 目标 | 最低可接受 |
|---|---|---|
| Lighthouse Performance | ≥ 85 | ≥ 70 |
| First Contentful Paint (FCP) | < 1.2s | < 1.8s |
| Largest Contentful Paint (LCP) | < 2.5s | < 4.0s |
| Time to Interactive (TTI) | < 3.5s | < 5.0s |
| Cumulative Layout Shift (CLS) | < 0.05 | < 0.1 |
| Total Blocking Time (TBT) | < 200ms | < 500ms |
| Bundle Size (首屏) | < 200KB (gzip) | < 350KB |

### 11.2 优化策略

| 策略 | 实施方式 |
|---|---|
| 字体优化 | `next/font` + `display: swap` + 预连接 |
| 图片优化 | `next/image` + WebP/AVIF + 懒加载 |
| 代码分割 | 页面级自动分割 + 动态导入重型组件 |
| 预加载 | `<link rel="preload">` 关键资源 |
| 缓存 | Vercel Edge Cache + SWR stale-while-revalidate |
| 骨架屏 | 所有数据区域加载前显示 Skeleton |
| 减少重绘 | `will-change` 仅用于动画元素 |

### 11.3 Core Web Vitals 监控

```typescript
// 使用 Vercel Analytics 或自定义上报
import { webVitals } from '@/lib/analytics';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  webVitals.track(metric);
}
```

---

## 12. 可访问性（a11y）

### 12.1 硬性要求

| 要求 | 实现 |
|---|---|
| WCAG 2.1 AA | 全站通过 axe-core 扫描 |
| 键盘导航 | 所有交互元素可通过 Tab 到达 |
| 焦点管理 | `focus-visible` ring 样式，Modal 焦点陷阱 |
| 屏幕阅读器 | 所有图标按钮 `aria-label`，表单关联 `label` |
| 色彩对比 | 正文 ≥ 4.5:1，大字 ≥ 3:1 |
| 动效 | `prefers-reduced-motion` 支持，所有动画可关闭 |
| 跳过链接 | 页面左上角 "Skip to content" |

### 12.2 焦点环样式

```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px hsl(var(--surface)), 0 0 0 4px hsl(var(--primary));
}
```

---

## 13. 安全规范

### 13.1 输入验证

| 输入 | 验证规则 |
|---|---|
| Email | Zod email schema + 服务端二次验证 |
| Password | 最小 8 位，包含字母+数字 |
| Prompt | 最大 500 字符，XSS 过滤（DOMPurify） |
| File Upload | 类型白名单（jpg/png/mp4），大小限制 |
| API Rate Limit | 匿名 10 req/min，已登录 60 req/min |

### 13.2 安全措施

- **CSP**: `Content-Security-Policy` 头，限制脚本来源
- **CSRF**: Supabase 自动处理
- **XSS**: React 默认转义 + DOMPurify 处理富文本
- **SQL Injection**: Supabase RLS + 参数化查询
- **Sensitive Data**: 环境变量管理，不提交到 Git

---

## 14. 环境变量

```bash
# .env.local

# Next.js
NEXT_PUBLIC_APP_URL=https://synapse.app
NEXT_PUBLIC_APP_NAME=Synapse

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx

# OAuth
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
GITHUB_CLIENT_ID=xxxx
GITHUB_CLIENT_SECRET=xxxx

# Cloudflare R2
R2_ENDPOINT=xxxx
R2_ACCESS_KEY_ID=xxxx
R2_SECRET_ACCESS_KEY=xxxx
R2_BUCKET_NAME=synapse-assets

# Stripe (v1.1)
STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# Upstream AI Models API Keys
KLING_API_KEY=xxxx
RUNWAY_API_KEY=xxxx
PIKA_API_KEY=xxxx
MIDJOURNEY_API_KEY=xxxx
FLUX_API_KEY=xxxx
# ... etc
```

---

## 15. 实现里程碑

### Milestone 1: 项目骨架（Day 1-2）
- [ ] Next.js + shadcn/ui 初始化
- [ ] Tailwind 配置（完整 design-tokens）
- [ ] 字体加载（Plus Jakarta Sans + JetBrains Mono）
- [ ] 全局 CSS 变量 + 暗色模式
- [ ] 目录结构搭建
- [ ] 基础布局组件（Navbar 变体）

### Milestone 2: 首页 Landing（Day 3-4）
- [ ] Hero Section
- [ ] Model Showcase（8 模型卡片）
- [ ] Features Section（4 功能卡片）
- [ ] Pricing Section（3 定价卡片）
- [ ] Footer
- [ ] Framer Motion 入场动画

### Milestone 3: 生成工作台（Day 5-6）
- [ ] 左右分栏布局
- [ ] 模型选择器组件
- [ ] Prompt 输入框（含 Enhance 按钮）
- [ ] 参数配置网格
- [ ] 生成按钮 + 积分提示
- [ ] 预览画布（多状态：空/生成中/完成/失败）
- [ ] 底部生成队列

### Milestone 4: 认证系统（Day 7）
- [ ] Supabase Auth 集成
- [ ] 登录/注册页面（分屏布局）
- [ ] Google OAuth
- [ ] GitHub OAuth
- [ ] 匿名试用（fingerprint + 2 次限额）
- [ ] 注册引导 Modal

### Milestone 5: 仪表盘（Day 8）
- [ ] 侧边栏导航
- [ ] 统计卡片（4 个）
- [ ] 最近生成列表
- [ ] 快速操作卡片
- [ ] 数据获取（Supabase client）

### Milestone 6:  polish & 部署（Day 9-10）
- [ ] 响应式适配（桌面/平板/移动）
- [ ] 动效系统完整实现
- [ ] 可访问性扫描（axe-core）
- [ ] Lighthouse 性能优化
- [ ] Vercel 部署
- [ ] 端到端测试

---

## 16. 附录

### 16.1 模型列表（MVP）

| ID | 名称 | 提供商 | 类型 | 规格 | Logo 色 |
|---|---|---|---|---|---|
| `kling-2` | Kling 2.0 | 快手 | video | 1080p • 10s | #818CF8 |
| `runway-gen4` | Runway Gen-4 | Runway | video | 1080p • 16s | #F59E0B |
| `pika-2` | Pika 2.0 | Pika | video | 720p • 3s | #14B8A6 |
| `luma-dream` | Luma Dream Machine | Luma | video | 1080p • 5s | #EF4444 |
| `stable-video` | Stable Video | Stability | video | 720p • 4s | #EC4899 |
| `midjourney-v7` | Midjourney v7 | Midjourney | image | 2048px | #8B5CF6 |
| `flux-pro` | Flux Pro | Black Forest | image | 2048px | #06B6D4 |
| `dalle-4` | DALL-E 4 | OpenAI | image | 1024px | #F97316 |

### 16.2 定价方案

> **v1.0.1 调整说明：基于 Pollo / Viddo 竞品研究（详见 `competitor-research.md`），将原 $0/$19/$49 三档调整为更贴近市场水位的结构。**

#### 订阅档（月费 / 年费 9 折）

| 方案 | 月费 | 年付月均 | Credits/月 | 视频估算 | 分辨率 | 其他 |
|---|---|---|---|---|---|---|
| **Free** | $0 | — | 10 | 1–2 个 (带水印) | 480p | 2 个模型；评估用 |
| **Starter** | $15/月 | $13/月 | 300 | ~30 个 | 1080p | 全部模型、批量、优先队列、去水印 |
| **Pro** | $29/月 | $25/月 | 800 | ~80 个 | 4K | 3 并发；版权保护；API 访问；Webhooks |
| **Studio** (v1.2) | $79/月 | $65/月 | 2500 | ~250 个 + Agent | 4K | Pro 全功能 + Video Agent + 多项目隔离 + 优先支持 |

#### 一次性信用包（One-time，**不过期**）

| 包大小 | 价格 | 备注 |
|---|---|---|
| 2K credits | $19 | 试用包 |
| 10K credits | $79 | 中等创作者 |
| 50K credits | $349 | 团队/重度用户 |

> 信用包独立于订阅，订阅取消后仍可用；不可退款；与月度信用合并消费。

#### 单次扣费规则（参考 Pollo）

| 模式 | 默认信用 | 备注 |
|---|---|---|
| Text-to-Image | 4 | 1024px |
| Text-to-Video (低端模型 5s 720p) | 10 | Auto 预设 |
| Text-to-Video (高端模型 10s 1080p) | 20 | Veo3 / Sora2 等 |
| Image-to-Video (10s 1080p) | 45 | 高端模型成本 |
| 高级模型加成 | +20–60 | Kling 2.1 Master / Veo 3 等 |

#### 退款 & 信任

- **失败自动返还**：生成失败 (status='failed') 自动返还该次扣费
- **首购退款**：3 天内、累计使用 < 50 credits 可全额退款
- **取消订阅**：随时取消；剩余月度信用在当前周期内仍可用
- **价格透明**：无隐藏费用，年付折扣 ~17%

### 16.3 命名约定

| 类型 | 约定 | 示例 |
|---|---|---|
| 组件文件 | PascalCase | `ModelCard.tsx` |
| 页面文件 | kebab-case | `page.tsx`（Next.js 约定） |
| Hooks | camelCase + use 前缀 | `useAuth.ts` |
| Utils | camelCase | `formatCurrency.ts` |
| 类型 | PascalCase | `GenerationStatus` |
| 常量 | UPPER_SNAKE_CASE | `MAX_FREE_GENERATIONS` |
| CSS 类 | kebab-case | `generation-card` |

### 16.4 提交规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

| Type | 说明 |
|---|---|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `style` | 样式调整（无逻辑变化）|
| `refactor` | 重构 |
| `docs` | 文档更新 |
| `chore` | 构建/工具链 |
| `test` | 测试 |

---

> 本文档与 design-tokens.md、Pencil 设计稿（pencil-new.pen）共同构成完整的产品交付物。开发团队应以本文档为唯一 truth source，任何设计/技术偏差需经产品负责人确认后方可修改。
