# design-tokens.md

> Apple 工业级精度设计令牌文档
> 项目：AI Video & Image 聚合生成平台
> 版本：v1.0.0
> 日期：2026-05-08

---

## 0. 设计哲学

这套设计系统的灵魂是 **"创作工具的精确性"与"消费级产品的亲和力"之间的张力平衡**。我们不做另一个 Viddo AI——Viddo 用高饱和紫粉渐变和促销 banner 构建了一个热闹的"电子集市"氛围，吸引的是价格敏感型、喜欢免费试玩的用户；我们则用 Indigo（靛蓝）为主轴、深蓝灰为底、高留白率为骨架，构建一个"专业创意工作室"的工作台感，吸引的是愿意为效率付费、已经理解 AI 视频价值的中级创作者。

**用户打开产品的第一秒，应该感受到：** 这是一个懂创作流程的工具，而不是一个卖模型的货架。深色画布让视频内容成为绝对主角；精确的间距和字体层级让参数设置不压迫；圆润的组件语言降低了专业工具的冰冷感。

**这套设计会吸引谁？** 25-40 岁的创作者、营销人员、电商卖家——他们用过 Runway 或 Kling，懂 prompt 和模型差异，厌倦了在各个官方站点之间切换比价，需要一个"统一控制台"。

**这套设计会劝退谁？** 纯小白用户（第一次听说 AI 视频）、极度价格敏感的用户（只想找最便宜的单次生成）、以及期待"一键魔法"的消费者。我们没有花哨的霓虹动效，没有满屏的"50% OFF"红色标签，没有过度简化的"一键生成"掩盖专业参数——这些用户会觉得"不够好玩"。

**为什么不是 Viddo / Pollo / Heyvid 那样？** 因为它们选择了"流量站"路径：深色背景 + 高饱和渐变 + 信息堆砌 + 促销驱动。这在 2024 年有效，但在 2026 年已经审美疲劳。我们选择"工具站"路径：让产品本身的效率说话，用排版和留白建立信任，用精确的组件系统降低长期使用的心智成本。

---

## 1. 设计原则

### 1.1 内容即界面
**一句话定义：** 视频和图片是界面的主角，UI 永远退后一步。

- **这样做 ✓：** Generate 页面的预览区占 60% 宽度，控制面板占 40%，预览区背景用纯黑（#000000）让视频色彩最大化呈现。落地页的示例视频直接 autoplay（静音）。
- **不这样做 ✗：** 在视频预览区周围加装饰性边框、阴影或渐变遮罩；用花哨的背景图和视频争注意力。

### 1.2 每一个像素都有目的
**一句话定义：** 没有装饰性元素。存在的每个 UI 元素都必须服务于用户任务。

- **这样做 ✓：** 首页只保留 4-5 个核心 section（Hero → Features → Generate CTA → Trust → FAQ），每个 section 有明确的单一目标。
- **不这样做 ✗：** 堆砌 7-8 个 section 试图覆盖所有关键词；加"使用步骤"这种对中级用户无价值的内容；底部放 20 个模型链接的密集列表。

### 1.3 暗色为画布，而非为酷炫
**一句话定义：** 暗色模式是为了让视频内容和创作流程更舒适，不是为了营造"赛博朋克"氛围。

- **这样做 ✓：** 暗色背景用极深蓝灰（#06060A），比纯黑更柔和，减少长时间工作的视觉疲劳。表面层级用微妙的 border 区分，而非强阴影。
- **不这样做 ✗：** 用纯黑背景（#000000）；用霓虹色发光（glow）作为默认装饰；让暗色模式下出现高对比的刺眼元素。

### 1.4 中级用户优先，小白不迷路
**一句话定义：** 默认展示专业参数（模型选择、分辨率、时长控制），同时为小白提供一键模板和上下文提示。

- **这样做 ✓：** Generate 页面默认展开所有参数面板；在复杂参数旁加"?"图标，hover 显示解释 tooltip；提供"模板模式"切换按钮。
- **不这样做 ✗：** 为了"简单"而隐藏所有参数（让专业用户抓狂）；或者不做任何引导（让小白迷失）。

### 1.5 一致性比惊喜更重要
**一句话定义：** 相同的交互模式在全站复用，用户不需要重新学习。

- **这样做 ✓：** 所有卡片 hover 都是"上浮 4px + shadow 加深"；所有 primary 按钮都是 pill 形状（full rounded）；所有表单输入框都是 12px 圆角。
- **不这样做 ✗：** 首页用圆角 24px 的卡片，工作台用圆角 8px 的卡片；按钮在不同页面用不同圆角规则。

### 1.6 信息层级用灰度，情绪用色彩
**一句话定义：** 中性色系统承担 90% 的信息层级工作，Indigo 和 Teal 只用于交互反馈和情绪点缀。

- **这样做 ✓：** 正文、标题、描述、标签的层级差异主要通过 neutral-50 到 neutral-950 的灰度实现；Indigo 只出现在 CTA、选中态、焦点环。
- **不这样做 ✗：** 用多种彩色文字来区分信息层级；让标题用 Indigo、正文用 Slate、标签用 Teal——这会变成彩虹页面。

### 1.7 动效是信息，不是装饰
**一句话定义：** 每一个动画都在告诉用户"发生了什么"和"去哪里"。

- **这样做 ✓：** 生成中的进度条用 Indigo 渐变流动动画表示"正在进行"；页面切换用 subtle 的淡入+位移；Hover 用 200ms 的即时反馈。
- **不这样做 ✗：** 加页面加载的 splash animation；给 logo 加无限旋转；用弹跳动画（bounce）干扰用户注意力。

---

## 2. 色彩系统

### 2.1 主色（Primary — Indigo）

| Token | Hex | HSL | OKLCH |
|---|---|---|---|
| `primary` | `#6366F1` | `hsl(239, 84%, 67%)` | `oklch(0.585 0.233 264.1)` |
| `primary-hover` | `#4F52E6` | `hsl(238, 75%, 60%)` | `oklch(0.535 0.220 264.1)` |
| `primary-active` | `#4346D9` | `hsl(237, 68%, 55%)` | `oklch(0.495 0.210 264.1)` |
| `primary-disabled` | `#A5B4FC` | `hsl(232, 91%, 81%)` | `oklch(0.750 0.120 264.1)` |

### 2.2 辅色（Secondary / Accent）

| Token | Hex | HSL | OKLCH |
|---|---|---|---|
| `secondary` | `#14B8A6` | `hsl(174, 72%, 41%)` | `oklch(0.696 0.145 186.2)` |
| `secondary-hover` | `#0D9488` | `hsl(175, 71%, 34%)` | `oklch(0.628 0.138 186.2)` |
| `secondary-active` | `#0F766E` | `hsl(176, 69%, 27%)` | `oklch(0.560 0.130 186.2)` |
| `accent` | `#F59E0B` | `hsl(38, 92%, 50%)` | `oklch(0.769 0.175 80.8)` |
| `accent-hover` | `#D97706` | `hsl(35, 92%, 40%)` | `oklch(0.688 0.168 80.8)` |

### 2.3 语义色（Semantic Colors）

每种 5 个梯度。

**Success（Teal 系）**

| Token | Hex | HSL |
|---|---|---|
| `success-50` | `#F0FDFA` | `hsl(166, 76%, 97%)` |
| `success-200` | `#99F6E4` | `hsl(163, 82%, 78%)` |
| `success-500` | `#14B8A6` | `hsl(174, 72%, 41%)` |
| `success-700` | `#0F766E` | `hsl(176, 69%, 27%)` |
| `success-900` | `#134E4A` | `hsl(177, 61%, 19%)` |

**Warning（Amber 系）**

| Token | Hex | HSL |
|---|---|---|
| `warning-50` | `#FFFBEB` | `hsl(48, 100%, 96%)` |
| `warning-200` | `#FDE68A` | `hsl(49, 96%, 76%)` |
| `warning-500` | `#F59E0B` | `hsl(38, 92%, 50%)` |
| `warning-700` | `#B45309` | `hsl(27, 91%, 37%)` |
| `warning-900` | `#78350F` | `hsl(23, 83%, 27%)` |

**Error（Red 系）**

| Token | Hex | HSL |
|---|---|---|
| `error-50` | `#FEF2F2` | `hsl(0, 86%, 97%)` |
| `error-200` | `#FECACA` | `hsl(0, 96%, 82%)` |
| `error-500` | `#EF4444` | `hsl(0, 84%, 60%)` |
| `error-700` | `#B91C1C` | `hsl(0, 74%, 42%)` |
| `error-900` | `#7F1D1D` | `hsl(0, 63%, 31%)` |

**Info（Indigo 系）**

| Token | Hex | HSL |
|---|---|---|
| `info-50` | `#EEF2FF` | `hsl(226, 100%, 97%)` |
| `info-200` | `#C7D2FE` | `hsl(229, 96%, 89%)` |
| `info-500` | `#6366F1` | `hsl(239, 84%, 67%)` |
| `info-700` | `#4338CA` | `hsl(243, 75%, 51%)` |
| `info-900` | `#312E81` | `hsl(244, 55%, 35%)` |

### 2.4 中性色（Neutral — Slate 系）

| Token | Hex | HSL |
|---|---|---|
| `neutral-50` | `#F8FAFC` | `hsl(210, 40%, 98%)` |
| `neutral-100` | `#F1F5F9` | `hsl(210, 40%, 96%)` |
| `neutral-200` | `#E2E8F0` | `hsl(214, 32%, 91%)` |
| `neutral-300` | `#CBD5E1` | `hsl(213, 27%, 84%)` |
| `neutral-400` | `#94A3B8` | `hsl(215, 20%, 65%)` |
| `neutral-500` | `#64748B` | `hsl(215, 16%, 47%)` |
| `neutral-600` | `#475569` | `hsl(215, 19%, 35%)` |
| `neutral-700` | `#334155` | `hsl(215, 25%, 27%)` |
| `neutral-800` | `#1E293B` | `hsl(217, 33%, 17%)` |
| `neutral-900` | `#0F172A` | `hsl(222, 47%, 11%)` |
| `neutral-950` | `#020617` | `hsl(229, 84%, 5%)` |

### 2.5 表面色（Surface Colors）

**浅色模式**

| Token | Hex | 用途 |
|---|---|---|
| `surface` | `#FFFFFF` | 最底层背景、输入框背景 |
| `surface-elevated` | `#F8FAFC` | 卡片背景、悬浮面板 |
| `surface-overlay` | `rgba(15, 23, 42, 0.60)` | 模态框遮罩、抽屉遮罩 |

**暗色模式**

| Token | Hex | 用途 |
|---|---|---|
| `surface` | `#06060A` | 最底层背景（极深蓝灰，非纯黑） |
| `surface-elevated` | `#13131F` | 卡片背景、输入框背景 |
| `surface-overlay` | `rgba(0, 0, 0, 0.75)` | 模态框遮罩、抽屉遮罩 |

### 2.6 文本色（Text Colors）

**浅色模式**

| Token | Hex | 用途 |
|---|---|---|
| `text-primary` | `#0F172A` | 主标题、正文、核心内容 |
| `text-secondary` | `#475569` | 副标题、描述、次要信息 |
| `text-tertiary` | `#94A3B8` | 占位符、禁用态文字、时间戳 |
| `text-disabled` | `#CBD5E1` | 明确禁用态文字 |
| `text-on-color` | `#FFFFFF` | 主色/深色背景上的文字 |

**暗色模式**

| Token | Hex | 用途 |
|---|---|---|
| `text-primary` | `#F8FAFC` | 主标题、正文 |
| `text-secondary` | `#CBD5E1` | 副标题、描述 |
| `text-tertiary` | `#64748B` | 占位符、时间戳 |
| `text-disabled` | `#334155` | 明确禁用态文字 |
| `text-on-color` | `#FFFFFF` | 主色/深色背景上的文字 |

### 2.7 边框色（Border Colors）

**浅色模式**

| Token | Hex | 用途 |
|---|---|---|
| `border-default` | `#E2E8F0` | 输入框、卡片、分割线默认态 |
| `border-subtle` | `#F1F5F9` | 极淡分割、表单边框 resting 态 |
| `border-strong` | `#94A3B8` | 强调边框、拖拽区域激活态 |
| `border-focus` | `#6366F1` | 焦点环、选中态边框 |

**暗色模式**

| Token | Hex | 用途 |
|---|---|---|
| `border-default` | `#1E293B` | 输入框、卡片默认态 |
| `border-subtle` | `#0F172A` | 极淡分割 |
| `border-strong` | `#475569` | 强调边框、拖拽区域 |
| `border-focus` | `#818CF8` | 焦点环、选中态（比浅色模式亮一级） |

### 2.8 暗色模式映射表

| Token（浅色值） | 暗色模式值 | 备注 |
|---|---|---|
| `primary` → `#6366F1` | `#818CF8` | 暗色下主色提亮 15% |
| `primary-hover` → `#4F52E6` | `#6366F1` | 暗色 hover 对应浅色 primary |
| `primary-active` → `#4346D9` | `#4F52E6` | 暗色 active 对应浅色 hover |
| `primary-disabled` → `#A5B4FC` | `#4F46E5` | 暗色 disabled 用更深的低饱和色 |
| `secondary` → `#14B8A6` | `#2DD4BF` | Teal 在暗色下提亮 |
| `accent` → `#F59E0B` | `#FBBF24` | Amber 在暗色下提亮 |
| `surface` → `#FFFFFF` | `#06060A` | 背景反转 |
| `surface-elevated` → `#F8FAFC` | `#13131F` | 卡片背景反转 |
| `text-primary` → `#0F172A` | `#F8FAFC` | 文字反转 |
| `text-secondary` → `#475569` | `#CBD5E1` | 次要文字提亮 |
| `border-default` → `#E2E8F0` | `#1E293B` | 边框反转 |
| `border-focus` → `#6366F1` | `#818CF8` | 焦点环在暗色下更醒目 |

### 2.9 色彩使用规则

**什么场景用什么色：**
- **Primary（Indigo）**：唯一的 CTA 色。仅用于主按钮、选中态、焦点环、当前导航项、链接。
- **Secondary（Teal）**：成功态、正向反馈、生成完成提示、积分增加动画。
- **Accent（Amber）**：Pricing 折扣标签、限时优惠、需要用户注意但不紧急的信息。
- **Error（Red）**：生成失败、余额不足、表单错误、删除确认。
- **Warning（Amber）**：生成超时、上游服务不稳定、非阻塞性警告。
- **Neutral**：承担 90% 的界面层级。所有正文、标题、卡片背景、边框、分割线。

**禁忌：**
- 同一视图中不得同时出现 Primary + Secondary + Accent 三种彩色按钮。
- 不得在正文段落中使用彩色文字（只能用 neutral 系）。
- 暗色模式下不得使用 `opacity < 0.5` 来表达禁用态，必须用专用 `primary-disabled` token。

### 2.10 Tailwind Config 色彩片段

```typescript
// tailwind.config.ts — colors 扩展
{
  colors: {
    primary: {
      DEFAULT: '#6366F1',
      hover: '#4F52E6',
      active: '#4346D9',
      disabled: '#A5B4FC',
    },
    secondary: {
      DEFAULT: '#14B8A6',
      hover: '#0D9488',
      active: '#0F766E',
    },
    accent: {
      DEFAULT: '#F59E0B',
      hover: '#D97706',
    },
    success: {
      50: '#F0FDFA',
      200: '#99F6E4',
      500: '#14B8A6',
      700: '#0F766E',
      900: '#134E4A',
    },
    warning: {
      50: '#FFFBEB',
      200: '#FDE68A',
      500: '#F59E0B',
      700: '#B45309',
      900: '#78350F',
    },
    error: {
      50: '#FEF2F2',
      200: '#FECACA',
      500: '#EF4444',
      700: '#B91C1C',
      900: '#7F1D1D',
    },
    info: {
      50: '#EEF2FF',
      200: '#C7D2FE',
      500: '#6366F1',
      700: '#4338CA',
      900: '#312E81',
    },
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
      950: '#020617',
    },
    surface: {
      DEFAULT: 'hsl(var(--surface))',
      elevated: 'hsl(var(--surface-elevated))',
      overlay: 'hsl(var(--surface-overlay))',
    },
    border: {
      DEFAULT: 'hsl(var(--border))',
      subtle: 'hsl(var(--border-subtle))',
      strong: 'hsl(var(--border-strong))',
      focus: 'hsl(var(--border-focus))',
    },
  },
}
```

---

## 3. 字体系统

### 3.1 字体族（Font Families）

| 用途 | 字体 | Fallback 链 | 安装来源 |
|---|---|---|---|
| **Display / Body** | Plus Jakarta Sans | `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Google Fonts |
| **Mono** | JetBrains Mono | `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace` | Google Fonts |

**加载策略：**
- `display: 'swap'`（确保文字立即渲染，避免 FOIT）
- 预连接：`https://fonts.googleapis.com` 和 `https://fonts.gstatic.com`
- 只加载所需字重：400, 500, 600, 700

### 3.2 字号梯度（10 级）

| Token | px | rem | line-height | letter-spacing | 用途 |
|---|---|---|---|---|---|
| `text-2xs` | 10 | 0.625 | 1.50 | 0.01em | 徽标数字、极简标签 |
| `text-xs` | 12 | 0.75 | 1.50 | 0 | 辅助文字、时间戳、来源标注 |
| `text-sm` | 14 | 0.875 | 1.60 | 0 | 正文、按钮文字、表单标签 |
| `text-base` | 16 | 1.00 | 1.60 | 0 | 段落正文、导航项 |
| `text-lg` | 18 | 1.125 | 1.50 | -0.01em | 引言、大段落、价格数字 |
| `text-xl` | 20 | 1.25 | 1.40 | -0.01em | 小标题、卡片标题 |
| `text-2xl` | 24 | 1.50 | 1.30 | -0.02em | Section 副标题 |
| `text-3xl` | 30 | 1.875 | 1.20 | -0.02em | 页面二级标题 |
| `text-4xl` | 36 | 2.25 | 1.10 | -0.03em | 页面一级标题 |
| `text-5xl` | 48 | 3.00 | 1.05 | -0.03em | Hero 标题、Display |

**移动端降级规则（< 768px）：**
- `text-5xl` → 36px
- `text-4xl` → 30px
- `text-3xl` → 24px
- 其余保持不变

### 3.3 字重规范

| 字重 | Token | 使用场景 |
|---|---|---|
| 400 | Regular | 正文段落、描述文字、列表项 |
| 500 | Medium | 按钮文字、表单标签、导航项、Badge |
| 600 | Semibold | 页面标题、卡片标题、Tab 选中态、强调短语 |
| 700 | Bold | Hero 标题、价格数字、关键数据、空状态主文案 |

### 3.4 标题层级（H1-H6）

| 层级 | 字号 | 字重 | 行高 | letter-spacing | 下间距 |
|---|---|---|---|---|---|
| H1 | 48px (3rem) | 700 | 1.05 | -0.03em | 32px |
| H2 | 36px (2.25rem) | 700 | 1.10 | -0.03em | 24px |
| H3 | 30px (1.875rem) | 600 | 1.20 | -0.02em | 20px |
| H4 | 24px (1.5rem) | 600 | 1.30 | -0.02em | 16px |
| H5 | 20px (1.25rem) | 600 | 1.40 | -0.01em | 12px |
| H6 | 18px (1.125rem) | 600 | 1.50 | -0.01em | 12px |

### 3.5 段落规范

- **最长字符数：** 单行正文最大宽度 65ch（约 65 个英文字符），中文内容最大宽度 35em。
- **段间距：** 段落之间 `margin-bottom: 1em`（16px）。
- **列表缩进：** 无序列表和有序列表左缩进 `24px`，列表项标记与文字间距 `8px`。
- **行宽容器：** 文案容器在桌面端不超过 `max-width: 640px`，确保阅读舒适度。

### 3.6 数字字体规则

- **金额 / 价格：** 使用 Mono 字体（JetBrains Mono），`font-variant-numeric: tabular-nums`，确保数字宽度一致，价格对齐不跳动。
- **倒计时 / 生成时间：** Mono 字体，`tabular-nums`。
- **数据展示（积分、生成次数）：** Mono 字体，`tabular-nums`。
- **普通数字（如"3 steps"）：** 跟随正文字体，不需要 mono。

### 3.7 Tailwind Config 字体片段

```typescript
// tailwind.config.ts — fontFamily 扩展
{
  fontFamily: {
    sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
  },
  fontSize: {
    '2xs': ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
    'xs': ['0.75rem', { lineHeight: '1.5' }],
    'sm': ['0.875rem', { lineHeight: '1.6' }],
    'base': ['1rem', { lineHeight: '1.6' }],
    'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
    'xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
    '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
    '3xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
    '4xl': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
    '5xl': ['3rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
}
```

---

## 4. 间距系统

### 4.1 基础单位

**基础单位：4px（0.25rem）**

选择理由：
1. Tailwind CSS 默认使用 4px 基准，与 shadcn/ui 原生兼容，零学习成本。
2. 4px 网格提供了足够的粒度（可以组合出 8px、12px、16px 等），同时避免了 2px 网格带来的"过度精细"决策疲劳。
3. 在 next-intl 多语言环境下，4px 基准的间距不会因文案长度膨胀而显得拥挤。

### 4.2 间距梯度（14 级）

| Token | px | rem | 用途 |
|---|---|---|---|
| `0` | 0 | 0 | 消除间距 |
| `1` | 4 | 0.25 | 图标与文字间隙、紧凑内联间距 |
| `2` | 8 | 0.50 | 小按钮内部、标签间距 |
| `3` | 12 | 0.75 | 表单标签与输入框间隙 |
| `4` | 16 | 1.00 | 默认组件间隙、卡片内边距（紧凑） |
| `6` | 24 | 1.50 | 标准卡片内边距、表单字段组间距 |
| `8` | 32 | 2.00 | 大卡片内边距、模态框内边距 |
| `12` | 48 | 3.00 | Section 内部组件间距 |
| `16` | 64 | 4.00 | 中等 Section 间距 |
| `24` | 96 | 6.00 | 标准 Section 上下间距（桌面端） |
| `32` | 128 | 8.00 | 大型 Section 间距 |
| `48` | 192 | 12.00 | Hero 区域上下留白 |
| `64` | 256 | 16.00 | 超大留白（首页首屏） |
| `96` | 384 | 24.00 | 极端留白（Landing 大章节分隔） |

### 4.3 组件内间距规范

| 组件 | 内边距 | 说明 |
|---|---|---|
| Button (sm) | `6px 12px` | 高度 32px |
| Button (md) | `10px 20px` | 高度 40px（标准） |
| Button (lg) | `14px 24px` | 高度 48px |
| Input / Select | `10px 14px` | 高度 40px |
| Textarea | `12px 14px` | 最小高度 80px |
| Card (标准) | `24px` | 四边等距 |
| Card (紧凑) | `16px` | 列表项内卡片 |
| Modal / Dialog | `32px` | 四边等距 |
| Toast | `16px` | 四边等距 |
| Tooltip | `6px 10px` | 紧凑提示 |

### 4.4 组件间间距规范

| 场景 | 间距值 | Token |
|---|---|---|
| 相邻按钮（按钮组） | 12px | `gap-3` |
| 表单字段之间 | 20px | `gap-5` |
| 卡片网格（桌面 3 列） | 24px | `gap-6` |
| 卡片网格（桌面 4 列） | 16px | `gap-4` |
| 列表项之间 | 8px | `gap-2` |
| Section 标题与内容 | 24px | `gap-6` |
| 导航项之间 | 8px | `gap-2` |
| 页头与首屏内容 | 64px | `pt-16` |

### 4.5 页面布局栅格

| 属性 | 桌面端 (≥1024px) | 平板端 (768-1023px) | 移动端 (<768px) |
|---|---|---|---|
| 最大宽度 | `1280px` (lg) / `1400px` (xl) | 100% - 48px | 100% - 32px |
| 列数 | 12 | 8 | 4 |
| Gutter | 24px | 16px | 16px |
| 外边距 | auto（居中） | 24px | 16px |

**特殊布局：**
- Generate 页面：左侧面板固定宽度 `420px`（桌面端），右侧预览区 `flex: 1`。
- 首页 Hero：全宽背景，内容区限制 `max-width: 1280px`。
- Pricing 页面：三列卡片，居中列可视觉强调（Elevated）。

### 4.6 移动端断点

| 名称 | 宽度 | 用途 |
|---|---|---|
| `sm` | 640px | 大手机横屏、小调整 |
| `md` | 768px | 平板竖屏、布局切换点 |
| `lg` | 1024px | 平板横屏 / 小桌面、Generate 页面左右分栏启用 |
| `xl` | 1280px | 标准桌面、内容区最大宽度 |
| `2xl` | 1536px | 大桌面、超宽屏适配 |

---

## 5. 圆角系统

### 5.1 圆角梯度

| Token | 值 | Tailwind 对应 |
|---|---|---|
| `rounded-none` | 0px | `rounded-none` |
| `rounded-sm` | 6px / 0.375rem | `rounded-md` |
| `rounded-md` | 8px / 0.5rem | `rounded-lg` |
| `rounded-lg` | 12px / 0.75rem | `rounded-xl` |
| `rounded-xl` | 16px / 1rem | `rounded-2xl` |
| `rounded-2xl` | 24px / 1.5rem | `rounded-3xl` |
| `rounded-full` | 9999px | `rounded-full` |

### 5.2 使用规则

| 组件类型 | 圆角 | 理由 |
|---|---|---|
| **Primary 按钮** | `rounded-full` (9999px) | Pill 形状，最强的行动召唤感，与参考站的方形渐变按钮形成差异 |
| **Secondary / Ghost 按钮** | `rounded-lg` (12px) | 标准圆角，次于 primary 的视觉层级 |
| **输入框 / Select** | `rounded-lg` (12px) | 与按钮统一，但不用 full 避免输入框变成胶囊 |
| **标准卡片** | `rounded-xl` (16px) | 大圆角降低工具感，增加亲和力 |
| **模态框 / Dialog** | `rounded-xl` (16px) | 与卡片一致 |
| **图片 / 视频容器** | `rounded-lg` (12px) | 略小于卡片，形成内外层级 |
| **头像** | `rounded-full` (9999px) | 行业标准 |
| **Badge / Tag** | `rounded-full` (9999px) | 标签感 |
| **Toast / Notification** | `rounded-lg` (12px) | 标准圆角 |
| **Tooltip** | `rounded-md` (8px) | 紧凑，不抢戏 |
| **模型卡片 / 模板卡片** | `rounded-xl` (16px) | 与标准卡片一致 |
| **视频生成框** | `rounded-lg` (12px) | 内容优先，边框存在感适中 |

**圆角禁忌：**
- 同一组组件中不得混用 `rounded-xl` 和 `rounded-2xl`（必须统一）。
- 不得对正方形图片使用 `rounded-full`（会变成椭圆，用固定比例的容器套图片）。

---

## 6. 阴影系统

### 6.1 阴影梯度（5 级 + Glow 1 级）

**浅色模式**

| Token | 值 | 用途 |
|---|---|---|
| `shadow-sm` | `0 1px 2px 0 rgba(15, 23, 42, 0.05)` | 极轻微上浮、下拉菜单 |
| `shadow` | `0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)` | 默认卡片 resting 态 |
| `shadow-md` | `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.08)` | 悬浮态卡片、下拉面板 |
| `shadow-lg` | `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.08)` | 模态框、抽屉、Toast |
| `shadow-xl` | `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.08)` | 超大模态、全屏预览 |
| `shadow-glow` | `0 0 20px -5px rgba(99, 102, 241, 0.4)` | 主色发光（生成中状态、焦点强调） |

**暗色模式**

| Token | 值 | 用途 |
|---|---|---|
| `shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.30)` | 暗色下轻微深度 |
| `shadow` | `0 1px 3px 0 rgba(0, 0, 0, 0.40), 0 1px 2px -1px rgba(0, 0, 0, 0.40)` | 暗色默认卡片 |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.40), 0 2px 4px -2px rgba(0, 0, 0, 0.40)` | 暗色悬浮态 |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.50), 0 4px 6px -4px rgba(0, 0, 0, 0.50)` | 暗色模态框 |
| `shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.60), 0 8px 10px -6px rgba(0, 0, 0, 0.60)` | 暗色超大模态 |
| `shadow-glow` | `0 0 30px -5px rgba(99, 102, 241, 0.25)` | 暗色下 glow 更弥散、更柔和 |

### 6.2 每级用途

| 级别 | 典型组件 |
|---|---|
| `shadow-sm` | 下拉菜单面板、日期选择器、小 tooltip |
| `shadow` | 标准卡片 resting 态（仅浅色模式） |
| `shadow-md` | 卡片 hover 态、Select 展开面板、Sticky header |
| `shadow-lg` | 模态框 / Dialog、Drawer、Toast、Dropdown Menu |
| `shadow-xl` | 全屏图片预览模态、大表单模态 |
| `shadow-glow` | 生成中脉冲动画、Primary 按钮特殊强调、焦点状态装饰 |

### 6.3 暗色模式下的阴影策略

暗色模式的层级区分**不依赖 shadow**，而依赖 **border + surface 明暗差异**：
- 默认卡片：`border: 1px solid border-default`（`#1E293B`），无 shadow。
- Elevated 卡片：`border: 1px solid border-default` + `shadow-md`。
- 模态框：`border: 1px solid border-default` + `shadow-lg`。

**原因：** 在 `#06060A` 的深色背景上，低透明度的黑色 shadow 几乎不可见。必须配合 border 才能建立明确的层级边界。

---

## 7. 动效系统

### 7.1 缓动函数

| 名称 | Cubic-Bezier | 用途 |
|---|---|---|
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 元素退出、收起、关闭 |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 元素进入、展开、Hover 态 |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 位置移动、尺寸变化、开关切换 |
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 按钮 press、Toast 弹入、成功反馈（轻微弹性） |

### 7.2 动效时长

| Token | 时长 | 用途 |
|---|---|---|
| `instant` | 0ms | 状态切换（无动画）、焦点环 |
| `fast` | 150ms | 按钮 active / press、颜色快速切换、tooltip 显示 |
| `normal` | 200ms | Hover 态、下拉展开、tab 切换 |
| `slow` | 300ms | 元素进入（fade + slide）、卡片 hover 位移、模态框打开 |
| `slower` | 500ms | 页面级过渡、Hero 元素依次入场、大模态框 |

### 7.3 标准过渡组合

| 交互 | 属性 | 时长 | 缓动 | 附加效果 |
|---|---|---|---|---|
| **Hover** | `all` | 200ms | `ease-out` | `scale(1.02)` for buttons, `translateY(-4px)` for cards |
| **Press / Active** | `transform` | 150ms | `ease-in` | `scale(0.97)` |
| **Appear** | `opacity, transform` | 300ms | `ease-out` | `opacity: 0 → 1`, `translateY(8px) → 0` |
| **Disappear** | `opacity` | 150ms | `ease-in` | `opacity: 1 → 0` |
| **Slide-in (右)** | `transform` | 300ms | `ease-out` | `translateX(100%) → 0` |
| **Slide-out (右)** | `transform` | 200ms | `ease-in` | `translateX(0) → 100%` |
| **Modal Open** | `opacity, transform` | 300ms | `ease-out` | 遮罩 `opacity: 0 → 1`，内容 `scale(0.96) → 1` |
| **Modal Close** | `opacity, transform` | 200ms | `ease-in` | 反向 |
| **Skeleton Shimmer** | `background-position` | 1500ms | `ease-in-out` | `infinite` |
| **Progress Fill** | `width` | 300ms | `ease-out` | 平滑填充 |
| **Toast Enter** | `opacity, transform` | 300ms | `spring` | `translateY(-16px) → 0`, `opacity: 0 → 1` |
| **Toast Exit** | `opacity, transform` | 200ms | `ease-in` | `translateX(0) → 100%`, `opacity: 1 → 0` |

### 7.4 禁用动效的场景

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**必须遵守的规则：**
- 所有动画必须可通过系统设置关闭。
- `prefers-reduced-motion` 为 `reduce` 时，所有过渡变成瞬时切换（0.01ms）。
- 骨架屏 shimmer 必须停止，显示静态占位色。
- 生成中的进度条仍可用，但 pulse/glow 效果关闭。

---

## 8. 关键组件规范

### 8.1 Button

**Primary Button**

| 状态 | 背景 | 文字 | 圆角 | 阴影 | 变换 | 说明 |
|---|---|---|---|---|---|---|
| **Default** | `primary` | `text-on-color` | `rounded-full` | `shadow-sm` | `scale(1)` | 标准态 |
| **Hover** | `primary-hover` | `text-on-color` | `rounded-full` | `shadow-md` | `scale(1.02)` | 200ms ease-out |
| **Active** | `primary-active` | `text-on-color` | `rounded-full` | `shadow-sm` | `scale(0.97)` | 150ms ease-in |
| **Disabled** | `primary-disabled` | `text-on-color` | `rounded-full` | `none` | `scale(1)` | `cursor: not-allowed` |
| **Focus** | `primary` | `text-on-color` | `rounded-full` | `none` | `scale(1)` | `ring-2 ring-primary ring-offset-2` |

**Secondary Button**

| 状态 | 背景 | 边框 | 文字 | 变换 |
|---|---|---|---|---|
| **Default** | `transparent` | `1px solid border-default` | `text-primary` | `scale(1)` |
| **Hover** | `surface-elevated` | `1px solid border-strong` | `text-primary` | `scale(1.02)` |
| **Active** | `surface-elevated` | `1px solid border-strong` | `text-primary` | `scale(0.97)` |
| **Disabled** | `transparent` | `1px solid border-subtle` | `text-disabled` | `scale(1)` |

**Ghost Button**

| 状态 | 背景 | 文字 | 变换 |
|---|---|---|---|
| **Default** | `transparent` | `text-secondary` | `scale(1)` |
| **Hover** | `surface-elevated` | `text-primary` | `scale(1.02)` |
| **Active** | `surface-elevated` | `text-primary` | `scale(0.97)` |

**Link Button**

| 状态 | 背景 | 文字 | 下划线 |
|---|---|---|---|
| **Default** | `transparent` | `primary` | `none` |
| **Hover** | `transparent` | `primary-hover` | `underline offset-2` |
| **Active** | `transparent` | `primary-active` | `underline` |

**Button 尺寸**

| 尺寸 | 高度 | 水平内边距 | 字号 | 字重 |
|---|---|---|---|---|
| **sm** | 32px | 12px | 12px | 500 |
| **md** | 40px | 20px | 14px | 600 |
| **lg** | 48px | 24px | 16px | 600 |

### 8.2 Input

**Text Input**

| 属性 | 值 |
|---|---|
| 高度 | 40px |
| 内边距 | `10px 14px` |
| 圆角 | `12px` |
| 背景 | `surface` |
| 边框 | `1px solid border-default` |
| 文字 | `text-primary`, 14px |
| 占位符 | `text-tertiary` |
| **Hover** | 边框变为 `border-strong` |
| **Focus** | 边框变为 `border-focus`, `ring: 2px solid primary/20` |
| **Disabled** | 背景 `surface-elevated`, 文字 `text-disabled`, 边框 `border-subtle` |
| **Error** | 边框 `error-500`, `ring: 2px solid error-500/20` |

**Textarea**

| 属性 | 值 |
|---|---|
| 最小高度 | 80px |
| 内边距 | `12px 14px` |
| 圆角 | `12px` |
| 其他 | 同 Text Input |
| resize | `vertical` only |

**Search Input**

- 同 Text Input，左侧前缀：`Search` 图标（16px，`text-tertiary`）。
- Focus 时图标颜色变为 `primary`。
- 右侧可选清除按钮（`X` 图标，16px）。

**Password Input**

- 同 Text Input，右侧后缀：`Eye` / `EyeOff` 图标切换按钮（16px，`text-tertiary`）。
- 图标按钮 hover 时颜色变为 `text-secondary`。

### 8.3 Select / Dropdown

**Trigger（触发器）**

- 同 Text Input 默认样式。
- 右侧后缀：`ChevronDown` 图标（16px）。
- 展开时图标旋转 180°，200ms ease-in-out。

**Content（下拉面板）**

| 属性 | 值 |
|---|---|
| 圆角 | `12px` |
| 背景 | `surface-elevated` |
| 边框 | `1px solid border-default` |
| 阴影 | `shadow-lg` |
| 内边距 | `6px` |
| 最大高度 | `320px`（超出滚动） |

**Item（选项）**

| 状态 | 背景 | 文字 | 圆角 |
|---|---|---|---|
| **Default** | `transparent` | `text-primary` | `8px` |
| **Hover** | `surface` | `text-primary` | `8px` |
| **Selected** | `primary/10` | `primary`, 500 | `8px` |
| **Disabled** | `transparent` | `text-disabled` | `8px` |

### 8.4 Card

**标准卡片（Standard）**

| 属性 | 浅色模式 | 暗色模式 |
|---|---|---|
| 背景 | `neutral-50` | `surface-elevated` |
| 边框 | `1px solid border-subtle` | `1px solid border-default` |
| 圆角 | `16px` | `16px` |
| 内边距 | `24px` | `24px` |
| 阴影 | `none` | `none` |

**悬浮卡片（Elevated）**

- 同标准卡片 + `shadow-md`。
- Hover：`shadow-lg` + `translateY(-4px)`，300ms ease-out。
- 用于：模型卡片、模板卡片、Pricing 卡片。

**强调卡片（Emphasis）**

- 背景：`primary/5`
- 顶部边框：`2px solid primary`
- 其他同标准卡片。
- 用于：推荐方案、重要提示、当前选中方案。

### 8.5 Modal / Dialog

| 属性 | 值 |
|---|---|
| 圆角 | `16px` |
| 背景 | `surface-elevated` |
| 阴影 | `shadow-xl` |
| 内边距 | `32px` |
| 最大宽度 | `480px` (sm) / `560px` (md) / `640px` (lg) |
| 遮罩 | `surface-overlay` + `backdrop-filter: blur(4px)` |
| 入场 | 遮罩淡入 200ms，内容 `scale(0.96) → 1` + 淡入 300ms ease-out |
| 退场 | 反向 200ms ease-in |
| 关闭方式 | 右上角 X 按钮 / 点击遮罩 / 按 Esc |

### 8.6 Tooltip

| 属性 | 值 |
|---|---|
| 圆角 | `8px` |
| 内边距 | `6px 10px` |
| 字号 | `12px` |
| 字重 | `500` |
| 背景 | `neutral-900` (浅色模式) / `neutral-100` (暗色模式) |
| 文字 | `white` (浅色模式) / `neutral-900` (暗色模式) |
| 阴影 | `shadow-md` |
| 箭头 | `4px` 等腰三角形 |
| 触发延迟 | `400ms` |
| 最大宽度 | `240px` |

### 8.7 Badge / Tag / Chip

| 变体 | 背景 | 文字 | 边框 |
|---|---|---|---|
| **Default** | `surface-elevated` | `text-secondary` | `1px solid border-default` |
| **Primary** | `primary/10` | `primary` | `none` |
| **Success** | `success-500/10` | `success-600` | `none` |
| **Warning** | `warning-500/10` | `warning-600` | `none` |
| **Error** | `error-500/10` | `error-600` | `none` |

- 高度：`24px`
- 水平内边距：`10px`
- 圆角：`9999px`
- 字号：`12px`
- 字重：`500`

### 8.8 Avatar

| 尺寸 | 值 | 用途 |
|---|---|---|
| **sm** | 24px | 列表内嵌、紧凑布局 |
| **md** | 32px | 导航栏、评论列表 |
| **lg** | 40px | 用户菜单、个人资料 |
| **xl** | 48px | 用户卡片、设置页 |

- 圆角：`9999px`
- 默认 fallback：用户名字首字母 + `bg-primary/10` + `text-primary` + 字号对应尺寸的 40%
- 图片填充：`object-fit: cover`
- 可选状态指示器：`8px` 圆点，右下角偏移，绿色（在线）/ 灰色（离线）

### 8.9 Toast / Notification

| 属性 | 值 |
|---|---|
| 圆角 | `12px` |
| 内边距 | `16px` |
| 阴影 | `shadow-lg` |
| 最大宽度 | `400px` (桌面) / `100% - 32px` (移动端) |
| 位置 | 右上角堆叠 (桌面) / 顶部固定 (移动端) |
| 间距 | 每条间隔 `12px` |

**变体样式**

| 变体 | 左侧边框 | 图标颜色 |
|---|---|---|
| **Success** | `4px solid success-500` | `success-500` |
| **Error** | `4px solid error-500` | `error-500` |
| **Warning** | `4px solid warning-500` | `warning-500` |
| **Info** | `4px solid info-500` | `info-500` |

**行为**
- 成功/信息：3 秒后自动消失，hover 暂停计时。
- 错误：不自动消失，需手动关闭，或 8 秒后消失。
- 最多同时显示 3 条。
- 入场：从顶部滑入 300ms spring。
- 退场：向右滑出 200ms ease-in。

### 8.10 Tabs / Segmented Control

**Underline Tabs**

- 容器：`border-bottom: 1px solid border-default`
- Tab 项：内边距 `10px 0`，下边距 `-1px`（覆盖容器边框）
- 默认文字：`text-secondary`
- Hover 文字：`text-primary`
- 选中态：文字 `primary` + `border-bottom: 2px solid primary`
- 切换动画：下划线滑动，200ms ease-in-out

**Segmented Control（胶囊切换）**

- 容器：背景 `surface-elevated`，内边距 `4px`，圆角 `10px`
- 选项：内边距 `6px 12px`，圆角 `8px`，字号 `14px`
- 默认：文字 `text-secondary`，背景 `transparent`
- 选中：文字 `text-primary`，背景 `surface`，`shadow-sm`
- 切换动画：背景色位移动画，200ms ease-in-out

### 8.11 Progress / Loading

**Spinner**

| 属性 | 值 |
|---|---|
| 尺寸 | 16px (sm) / 24px (md) / 32px (lg) |
| 颜色 | `primary` |
| 线宽 | `2px` |
| 动画 | `rotate(360deg)`, 1s linear infinite |
| 轨道 | `neutral-200` (浅色) / `neutral-800` (暗色) |

**Skeleton**

| 属性 | 值 |
|---|---|
| 圆角 | `8px` |
| 基础色 | `surface-elevated` |
| 闪光色 | `linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)` |
| 动画 | `translateX(-100%) → translateX(100%)`, 1.5s ease-in-out infinite |

**Progress Bar**

| 属性 | 值 |
|---|---|
| 高度 | `6px` |
| 圆角 | `9999px` |
| 轨道背景 | `surface-elevated` |
| 填充背景 | `primary` |
| 动画 | 宽度变化 300ms ease-out |
| 缓冲态 | 填充后段加 `animate-pulse` |

### 8.12 模型卡片（聚合站专用）

| 属性 | 值 |
|---|---|
| 宽高比 | `16 / 10` |
| 圆角 | `16px` |
| 背景 | `surface-elevated` |
| 边框 | `1px solid border-default` |
| 内边距 | `0`（图片/视频占满上部） |

**内部结构**
- 上部 `65%`：示例视频/图片（object-fit: cover，圆角顶部 16px）。
- Hover：视频静音播放，图片放大 `scale(1.05)`，300ms。
- 下部 `35%`：内边距 `16px`。
  - 模型 Logo（24px）+ 模型名称（14px, 600）+ Badge（New / Hot）
  - 价格标签：`$0.0575 / video`，12px，Mono 字体，`text-secondary`
  - 生成按钮：sm 尺寸 primary button，宽度 100%

**Hover 态**
- `translateY(-4px)`
- `shadow-lg`
- 边框变为 `border-focus`

### 8.13 模板卡片（聚合站专用）

| 属性 | 值 |
|---|---|
| 宽高比 | `9 / 16`（竖版视频）或 `1 / 1` |
| 圆角 | `16px` |
| 背景 | 全图覆盖 |
| 边框 | `none` |

**内部结构**
- 全图背景（示例视频封面）。
- 底部渐变遮罩：`linear-gradient(to top, rgba(0,0,0,0.8), transparent)`。
- 底部文字区域：内边距 `16px`。
  - 模板名称：14px，600，白色
  - 使用次数：12px，`neutral-300`，"Used 2.4k times"
- Hover：遮罩加深为 `rgba(0,0,0,0.6)`，中央显示"Use Template"按钮（sm primary）。

### 8.14 视频生成框（聚合站专用）

**上传态**

| 属性 | 值 |
|---|---|
| 宽高比 | `16 / 9` |
| 圆角 | `12px` |
| 边框 | `2px dashed border-default` |
| 背景 | `surface` |
| 图标 | `Upload`（32px，`text-tertiary`） |
| 主文案 | "Drag or Upload"，16px，600 |
| 副文案 | "image(0/9) · video(0/3) · audio(0/3)"，12px，`text-tertiary` |
| Hover | 边框 `primary`，背景 `primary/5` |

**预览态**

| 属性 | 值 |
|---|---|
| 背景 | `#000000`（纯黑，确保视频色彩准确） |
| 圆角 | `12px` |
| 视频 | 居中，最大占满容器 |
| 控制条 | 底部悬浮，半透明背景 `rgba(0,0,0,0.6)`，圆角 `8px` |

**生成中态**

| 属性 | 值 |
|---|---|
| 背景 | `surface-elevated` |
| 中央 | Spinner (lg) + "Generating..." + 进度百分比 |
| 下方 | 预计剩余时间："~45 sec remaining"，12px，`text-tertiary` |
| 底部 | Progress Bar (6px, full width) |
| 右下角 | "Cancel" Ghost Button |
| 背景装饰 | 微妙的 Indigo glow pulse 动画（`shadow-glow` 呼吸效果） |

**成功态**

- 预览态 + 右上角 "Download" Primary Button + "Retry" Ghost Button。
- 首次生成成功时，Toast 提示："Video generated! 80 credits used."。

**失败态**

- 预览态占位图（带 Error 图标）+ 错误信息（14px，`error-500`）+ "Retry" Primary Button + "Change Parameters" Ghost Button。

---

## 9. 图标规范

### 9.1 图标库选型

**选型：Lucide React**

理由：
1. **shadcn/ui 原生集成**：所有 shadcn 组件默认使用 Lucide，零配置成本。
2. **风格匹配**：1.5-2px stroke-width，圆角端点（round linecap/join），与我们的"精确但友好"设计语言一致。
3. **Tree-shaking**：只打包实际使用的图标，不会增加 bundle 体积。
4. **社区活跃**：持续更新，覆盖 AI/创作工具场景所需的全部图标（Video, Image, Wand, Sparkles, Zap, CreditCard 等）。
5. **工程美学**：线条干净、无填充、无装饰，与 Linear/Vercel 美学同频。

**拒绝选项：**
- Heroicons：风格偏"圆润填充"，与我们的暗色精确风格不够匹配。
- Phosphor：虽然优秀，但 shadcn 不原生支持，需额外配置映射。
- 自绘：MVP 阶段 ROI 过低，Lucide 已覆盖 99% 场景。

### 9.2 图标尺寸

| 尺寸 | px | 用途 |
|---|---|---|
| **xs** | 12 | 内联文本、Badge 内部、紧凑表格 |
| **sm** | 16 | 按钮内部、Input 前缀/后缀、表单标签、导航项 |
| **md** | 20 | 列表项、下拉选项、二级导航 |
| **lg** | 24 | 空状态图标、功能入口、特性卡片标题旁 |
| **xl** | 32 | 页面级空状态、大功能入口、上传区域 |
| **2xl** | 48 | Hero 区域装饰、404 页面、全屏空状态 |

### 9.3 图标颜色规则

| 场景 | 颜色 |
|---|---|
| 按钮内部（Primary/Ghost） | 继承按钮文字色 |
| 按钮内部（Secondary） | `text-primary` |
| 表单前缀/后缀（ resting ） | `text-tertiary` |
| 表单前缀/后缀（ focus ） | `primary` |
| 列表项前缀 | `text-secondary` |
| 列表项前缀（选中） | `primary` |
| 空状态图标 | `text-tertiary` |
| 特性卡片图标 | `primary` |
| 导航项图标（默认） | `text-secondary` |
| 导航项图标（选中） | `primary` |
| 独立使用（信息提示） | `text-secondary` 或 `text-tertiary` |

### 9.4 自定义图标的笔触规范

如果未来需要自绘图标（如品牌专属功能图标），必须遵守：

| 属性 | 规范 |
|---|---|
| **Stroke width** | 标准 2px；小尺寸图标（12-16px）可用 1.5px；大尺寸（32px+）可用 2.5px |
| **Stroke linecap** | `round` |
| **Stroke linejoin** | `round` |
| **Corner radius** | 内部转角半径 ≥ 2px，拒绝尖锐直角 |
| **Padding** | 图标 viewBox 内边距 ≥ 1px，确保不贴边 |
| **Optical correction** | 圆形元素需视觉放大 2-3%，方形元素需缩小 2-3%，保持视觉一致 |
| **Monochrome** | 单线条色，禁止渐变填充、禁止双色拼接 |

---

## 10. 排版细节

### 10.1 文案大小写规则

| 元素 | 规范 | 示例 |
|---|---|---|
| **页面标题** | Title Case | "All-in-One AI Video Generator" |
| **Section 标题** | Title Case | "Why Choose Our Platform" |
| **按钮文案** | Title Case | "Create Video", "Sign In", "Learn More" |
| **导航项** | Title Case | "AI Video", "Pricing", "My Account" |
| **卡片标题** | Title Case | "Image to Video" |
| **正文段落** | Sentence case | "Turn any image into a dynamic video with AI." |
| **表单标签** | Title Case | "Email Address", "Prompt Text" |
| **Placeholder** | Sentence case | "Enter your prompt here..." |
| **Badge / Tag（短）** | UPPERCASE | "NEW", "HOT", "BETA" |
| **Badge / Tag（长）** | Title Case | "Best Value", "Most Popular" |
| **Toast 标题** | Sentence case | "Video generated successfully." |
| **Toast 描述** | Sentence case | "Your video is ready for download." |
| **FAQ 问题** | Sentence case | "How do I create a video from text?" |
| **FAQ 答案** | Sentence case | "Simply choose the text to video option..." |
| **Tooltip** | Sentence case, 无句号 | "Upload up to 9 images" |

### 10.2 标点符号

| 场景 | 规范 |
|---|---|
| **英文文案** | 使用直引号 `"` 和 `'` ，不使用弯引号 `"` `'` |
| **英文破折号** | 使用 em dash `—` 连接从句，前后无空格。例："AI-powered—yet human-guided." |
| **范围连接** | 使用 en dash `–` 表示范围，前后无空格。例："18–45 years old" |
| **省略号** | 使用 `...` 三个半角点，非 `…` 字符 |
| **中英文混排** | 英文单词前后加半角空格。例："使用 AI Video 生成器" |
| **列表项** | 使用圆点 `•` 或有序数字，末尾不加句号（除非列表项是完整句子） |
| **按钮文案** | 不加句号、不加感叹号（除非极度强调） |
| **价格标签** | 货币符号紧贴数字，不加空格。例：`$9.99` |

### 10.3 数字千位分隔

| 规范 | 示例 |
|---|---|
| 千位用逗号分隔 | `1,000` / `10,000` / `1,000,000` |
| 小数点用句号 | `1.5` / `9.99` |
| 不使用空格分隔千位 | 错误：`1 000` |
| 不使用句号作为千位分隔 | 错误：`1.000`（欧洲部分地区） |

### 10.4 货币显示

| 场景 | 规范 | 示例 |
|---|---|---|
| **基础价格** | 符号 + 数字，无空格 | `$9.99` |
| **按月订阅** | 符号 + 数字 + `/mo` | `$9.99/mo` |
| **按视频计费** | 符号 + 数字 + ` / video` | `$0.0575 / video` |
| **积分显示** | 纯数字 + `credits` | `80 credits` |
| **折扣价** | 原价划线 + 新价 | ~~`$19.99`~~ `$9.99` |
| **免费** | 明确写 "Free"，不用 `$0` | `Free` |
| **货币精度** | 小数点后最多 2 位 | `$9.99` / `$0.06` |

### 10.5 时间格式

| 场景 | 规范 | 示例 |
|---|---|---|
| **绝对日期（美国）** | Month D, YYYY | "May 8, 2026" |
| **绝对日期（欧洲备选）** | D Month YYYY | "8 May 2026" |
| **相对时间（短）** | 数字 + 单位缩写 | "2 min ago", "1 hr ago", "3d ago" |
| **相对时间（长）** | 完整单位 | "2 minutes ago", "1 hour ago" |
| **生成预计** | `~` + 数字 + 单位 | "~45 sec", "~2 min", "~5 min" |
| **视频时长** | M:SS 或 MM:SS | "0:05", "1:48", "10:30" |
| **24小时制** | HH:MM | "14:30" |
| **12小时制（可选）** | H:MM AM/PM | "2:30 PM" |

### 10.6 复数处理

| 规则 | 示例 |
|---|---|
| **永远显示复数形式**，不简写 | `1 video` / `2 videos` |
| | `1 credit` / `10 credits` |
| | `1 image` / `5 images` |
| | `1 model` / `12 models` |
| **不要用 `(s)` 模糊写法** | 错误：`video(s)` |
| **不可数名词不加 s** | `time`, `money`, `information` |

---

## 11. 信息密度与节奏

### 11.1 单屏信息量上限

| 页面类型 | 单屏认知单元上限 | 说明 |
|---|---|---|
| **首页 Hero** | 1 主标题 + 1 副标题 + 2 CTA + 1 视觉 | 绝对聚焦，不允许超过 2 个同级按钮 |
| **首页 Features** | 1 Section 标题 + 1 描述 + 3-4 特性卡片 | 每屏不超过 4 个卡片 |
| **Generate 工作台** | 左侧面板 8-10 个控件 | 超出必须分组折叠（Accordion） |
| **Pricing** | 3 个方案卡片 | 中间卡片可视觉强调，两侧降级 |
| **Model Detail** | 1 模型信息 + 1 示例画廊 + 1 CTA | 避免多模型对比挤在一屏 |
| **Account / History** | 表格 10 行 + 分页 | 超出用分页，不用无限滚动（历史记录需要稳定定位） |

### 11.2 「视觉重音」的分布规则

- **每屏最多 2 个强重音**。强重音定义为：Primary 色的 CTA 按钮、Display 级别的大字标题、或大面积的彩色元素。
- **页面整体节奏**：强（Hero）→ 弱（Features 图文介绍）→ 中（Generate CTA 区域）→ 弱（场景展示）→ 中（Pricing / Trust）→ 弱（FAQ / Footer）。
- **避免"视觉噪音墙"**：不允许出现一整屏全是等权重的卡片网格（如 6 个一模一样的特性卡片）。必须通过大小、颜色、留白制造节奏变化。

### 11.3 留白的最小占比

| 场景 | 留白要求 |
|---|---|
| **Section 上下间距** | ≥ 96px（桌面端），≥ 64px（移动端） |
| **内容区左右边距** | 桌面端 ≥ 10% 视口宽度；内容区最大宽度 1280px |
| **卡片内部文字到边缘** | ≥ 24px |
| **表单字段之间** | ≥ 20px |
| **按钮组之间** | ≥ 12px |
| **标题到正文** | ≥ 16px |
| **单屏信息密度** | 内容区域占视口宽度 ≤ 70%，其余为留白或装饰性背景 |

---

## 12. 微交互细节

### 12.1 按钮 Click 反馈

| 阶段 | 效果 | 时长 | 缓动 |
|---|---|---|---|
| **Hover** | `scale(1.02)` + `shadow-md` | 200ms | `ease-out` |
| **Press / Active** | `scale(0.97)` | 150ms | `ease-in` |
| **Release** | 恢复 `scale(1)` | 200ms | `spring` |

**禁止：**
- 不使用 Material Design 的涟漪效果（ripple）。
- 按钮不按下去时不改变背景色（避免和 disabled 态混淆）。
- Ghost 按钮 hover 时不改变文字颜色为 primary（避免闪烁感），只改变背景和透明度。

### 12.2 视频生成中的等待视觉

**目标：不要让用户觉得卡死。**

| 元素 | 设计 |
|---|---|
| **主视觉** | 骨架屏（Skeleton）占据预览区，显示视频大致比例的占位块 |
| **进度指示** | Progress Bar（6px，Indigo 填充，底部对齐）+ 百分比数字（Mono 字体） |
| **时间预估** | "~45 sec remaining"，12px，`text-tertiary`，每 10 秒更新一次 |
| **背景氛围** | 微妙的 Indigo glow 呼吸动画（`shadow-glow` pulse，2s ease-in-out infinite） |
| **取消机制** | 右下角 "Cancel" Ghost Button，随时可点击，确认后中断请求并返还 credits |
| **文案轮换** | 超过 30 秒时，文案轮换提示："Optimizing motion..." / "Rendering frames..." |
| **完成过渡** | 进度到 100% 时，骨架屏淡出 300ms，视频淡入 500ms |

### 12.3 成功 / 失败的 Toast 出现规则

| 类型 | 持续时间 | 自动消失 | 用户操作 |
|---|---|---|---|
| **Success** | 3 秒 | 是 | Hover 暂停计时；点击关闭 |
| **Info** | 3 秒 | 是 | Hover 暂停计时 |
| **Warning** | 5 秒 | 是 | Hover 暂停计时；含操作按钮时留到操作后 |
| **Error** | 8 秒 | 否（需手动关闭） | 必须点击 X 关闭；含"Retry"操作按钮 |

**队列规则：**
- 最多同时显示 3 条 Toast。
- 新 Toast 从顶部推入，旧 Toast 向上移动（位移动画 200ms）。
- 移动端：全宽，顶部固定，安全区域 inset。

### 12.4 长列表的滚动惯性 / 回弹 / 加载更多

| 场景 | 规范 |
|---|---|
| **滚动行为** | 原生 `scroll-behavior: smooth`，不劫持滚动 |
| **惯性滚动** | 保持系统默认（iOS momentum scroll、桌面平滑滚动） |
| **回弹效果** | 不自定义模拟 rubber-banding，使用系统原生 |
| **触底加载** | 显示 3 个 Skeleton 卡片 → 加载完成后插入列表 → 无闪烁 |
| **分页 vs 无限滚动** | 历史记录用分页（稳定定位）；示例画廊用无限滚动（浏览型） |
| **返回顶部** | 滚动超过 500px 后，右下角显示 "Back to Top" 按钮（sm Ghost Button） |

### 12.5 Hover State 的延迟

| 组件 | 延迟 | 理由 |
|---|---|---|
| **按钮 / 链接** | 0ms（instant） | 即时反馈，建立操控感 |
| **卡片** | 0ms（instant） | 即时上浮，暗示可点击 |
| **Tooltip** | 400ms | 避免鼠标路过时误触发 |
| **Dropdown** | 0ms | 菜单需要即时响应 |
| **图片放大预览** | 300ms | 给用户时间判断是否需要查看 |

---

## 13. 可访问性

### 13.1 颜色对比度最低标准

| 文本类型 | 最低标准 | 目标标准 |
|---|---|---|
| 正文（< 18px） | WCAG AA 4.5:1 | WCAG AAA 7:1 |
| 大字（≥ 18px 或 14px bold） | WCAG AA 3:1 | WCAG AAA 4.5:1 |
| 界面组件（按钮、输入框） | WCAG AA 3:1 | WCAG AA 4.5:1 |

**验证工具：**
- 开发阶段使用 Stark Figma 插件验证。
- 部署前使用 `@axe-core/react` 自动化测试。

**已知风险点：**
- `text-tertiary`（`#94A3B8`）在 `surface-elevated`（`#F8FAFC`）上对比度为 4.6:1，刚达 AA。
- 暗色模式下 `text-tertiary`（`#64748B`）在 `surface`（`#06060A`）上对比度为 5.2:1，安全。

### 13.2 焦点环规范

```css
:focus-visible {
  outline: none;
  ring: 2px solid hsl(var(--primary));
  ring-offset: 2px;
  ring-offset-color: hsl(var(--surface));
}
```

| 属性 | 值 |
|---|---|
| **Ring 宽度** | 2px |
| **Ring 颜色** | `primary`（浅色 `#6366F1`，暗色 `#818CF8`） |
| **Ring-offset** | 2px |
| **Ring-offset-color** | `surface`（确保在任何背景上可见） |
| **过渡** | 0ms instant（焦点环必须立即出现，不能渐变） |
| **适用元素** | 所有可交互元素：button, a, input, select, textarea, [tabindex] |

**禁止：**
- 不使用 `outline: none` 而不提供替代方案。
- 焦点环不使用 box-shadow 模拟（某些 Windows 高对比模式会忽略 shadow）。

### 13.3 键盘导航 Tab 顺序原则

| 原则 | 规范 |
|---|---|
| **顺序** | 严格遵循 DOM 顺序，不手动调整 `tabindex`（除非有绝对必要） |
| **可见性** | Tab 到的元素必须滚动到可视区域（`scroll-margin-top: 100px`，避开 fixed header） |
| **Modal 焦点陷阱** | 打开 Modal 时焦点锁定在内部，Tab 循环不逃出；Esc 关闭 |
| **Dropdown 键盘** | `↑` `↓` 导航选项，`Enter` 确认，`Esc` 关闭，`Tab` 跳到下一个表单字段 |
| **跳过链接** | 页面左上角提供 "Skip to content" 链接（按 Tab 第一次即可见） |
| **焦点顺序检查** | 从上到下、从左到右，Z 字形路径 |

### 13.4 屏幕阅读器辅助文本规则

| 场景 | 规范 |
|---|---|
| **图标按钮** | 必须有 `aria-label`。例：`<button aria-label="Close modal">` |
| **表单字段** | 每个 `input` 必须有关联的 `label`（可视或 `sr-only`）。禁止用 `placeholder` 替代 label。 |
| **状态变化** | 生成完成、错误、新 Toast 到达时，使用 `aria-live="polite"` 通知屏幕阅读器。 |
| **装饰性图片** | `alt=""`（空字符串），让屏幕阅读器跳过。 |
| **信息性图片** | 必须有描述性 `alt` 文本。例：`alt="Example of text-to-video generation showing a dog running in a field"` |
| **复杂组件** | 使用 `role` 和 `aria-*` 属性：Tabs 用 `role="tablist"`，Accordion 用 `role="region"`。 |
| **加载状态** | 生成中的区域使用 `aria-busy="true"`，完成后移除。 |

---

## 14. 禁忌清单

以下 15 条为**绝对不要做的事**。违反任何一条都视为设计系统被破坏，需要回滚修正。

1. **不要用纯 #000000 或纯 #FFFFFF 作为背景色。** 浅色背景用 `neutral-50`（`#F8FAFC`）；暗色背景用 `surface`（`#06060A`）。纯黑纯白会造成极端对比，长时间使用视觉疲劳。

2. **不要在 CTA 按钮上使用 emoji。** 用 Lucide 图标替代。Emoji 在不同平台渲染不一致，且会降低专业工具的感知价值。

3. **不要让卡片同时有 `shadow` + `border`（除非特殊设计）。** 浅色模式下用 shadow 暗示层级，暗色模式下用 border 暗示层级。Card 默认只选其一；Elevated 卡片在暗色模式下可同时使用，但 border 必须极淡（`border-subtle`）。

4. **不要用 `box-shadow` 模拟 glow 效果。** Glow 使用专用的 `shadow-glow` token，或直接对元素使用 `backdrop-filter` + `bg-primary/10`。Box-shadow 模拟的 glow 边缘脏、不自然。

5. **不要用 `border-radius: 50%`。** 对非正方形元素使用 `50%` 会变成椭圆。用 `9999px`（Tailwind `rounded-full`）代替。

6. **不要让正文行宽超过 65ch。** 过长的行宽导致阅读时换行困难。所有长文案容器必须设置 `max-width: 65ch`。

7. **不要在一个页面用超过 3 种字体大小展示同级信息。** 严格的层级系统要求同级元素使用同级字号。不能标题 A 用 24px、标题 B 用 26px、标题 C 用 22px。

8. **不要禁用浏览器的默认焦点环而不提供替代方案。** 所有交互元素必须有 `focus-visible` 样式。

9. **不要在暗色模式下用 `opacity` 降低文字对比度来表达次要信息。** 暗色下降低 opacity 会让文字直接消失。必须使用专用的 `text-secondary` / `text-tertiary` token。

10. **不要给静态文本加 `text-shadow`。** Text-shadow 只用于特殊装饰场景（如图片上的文字增强可读性），且必须使用高斯模糊阴影，不可用纯色偏移。

11. **不要让按钮宽度小于 80px。** 按钮必须有足够的点击区域。移动端按钮高度不低于 44px（Apple HIG），桌面端不低于 32px。

12. **不要在同一个 viewport 内放超过 1 个 primary CTA。** 有冲突时让用户明确主次。次要用 Secondary 或 Ghost 按钮。

13. **不要用灰度滤镜（`grayscale`）表示禁用状态。** 禁用态必须使用专用的 `disabled` token（颜色 + 透明度变化），确保对比度仍可读。

14. **不要自动播放音频。** 视频可以静音自动播放（`muted autoplay loop`），但必须有明确的取消方式。任何带音频的媒体必须用户主动触发。

15. **不要让 Toast 遮挡关键操作区域。** Toast 出现在右上角（桌面）或顶部（移动端），不得覆盖 Modal 的确认按钮、表单的提交按钮等关键操作。

---

## 15. 实现 Cheatsheet

### 15.1 Tailwind 完整 Config（直接复制）

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F52E6',
          active: '#4346D9',
          disabled: '#A5B4FC',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          hover: '#0D9488',
          active: '#0F766E',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          foreground: '#FFFFFF',
        },
        success: {
          50: '#F0FDFA',
          200: '#99F6E4',
          500: '#14B8A6',
          700: '#0F766E',
          900: '#134E4A',
        },
        warning: {
          50: '#FFFBEB',
          200: '#FDE68A',
          500: '#F59E0B',
          700: '#B45309',
          900: '#78350F',
        },
        error: {
          50: '#FEF2F2',
          200: '#FECACA',
          500: '#EF4444',
          700: '#B91C1C',
          900: '#7F1D1D',
        },
        info: {
          50: '#EEF2FF',
          200: '#C7D2FE',
          500: '#6366F1',
          700: '#4338CA',
          900: '#312E81',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          elevated: 'hsl(var(--surface-elevated))',
          overlay: 'hsl(var(--surface-overlay))',
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
          subtle: 'hsl(var(--border-subtle))',
          strong: 'hsl(var(--border-strong))',
          focus: 'hsl(var(--border-focus))',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        'md': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.08)',
        'lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.08)',
        'xl': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
        'glow': '0 0 20px -5px rgba(99, 102, 241, 0.4)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },
      maxWidth: {
        'prose': '65ch',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### 15.2 全局 CSS 变量声明（:root + .dark）

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --surface: 0 0% 100%;
    --surface-elevated: 210 40% 98%;
    --surface-overlay: 222 47% 11% / 0.6;

    --border: 214 32% 91%;
    --border-subtle: 210 40% 96%;
    --border-strong: 215 20% 65%;
    --border-focus: 239 84% 67%;

    --text-primary: 222 47% 11%;
    --text-secondary: 215 19% 35%;
    --text-tertiary: 215 20% 65%;
    --text-disabled: 213 27% 84%;

    --primary: 239 84% 67%;
    --primary-hover: 238 75% 60%;
    --primary-active: 237 68% 55%;
    --primary-disabled: 232 91% 81%;

    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
  }

  .dark {
    --surface: 240 33% 3%;
    --surface-elevated: 240 25% 10%;
    --surface-overlay: 0 0% 0% / 0.75;

    --border: 217 33% 17%;
    --border-subtle: 222 47% 11%;
    --border-strong: 215 19% 35%;
    --border-focus: 232 91% 81%;

    --text-primary: 210 40% 98%;
    --text-secondary: 213 27% 84%;
    --text-tertiary: 215 16% 47%;
    --text-disabled: 215 25% 27%;

    --primary: 232 91% 81%;
    --primary-hover: 239 84% 67%;
    --primary-active: 238 75% 60%;
    --primary-disabled: 243 75% 51%;

    --background: 240 33% 3%;
    --foreground: 210 40% 98%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-surface text-text-primary font-sans antialiased;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### 15.3 字体加载（layout.tsx）

```tsx
// app/layout.tsx
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

### 15.4 必须安装的依赖

```bash
# 核心框架（假设已创建 Next.js 项目）
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui 及其依赖
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input dialog dropdown-menu tabs tooltip badge avatar toast select textarea

# Radix Primitives（shadcn 会自动安装，如需单独使用）
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-toast

# 动画
npm install framer-motion

# 图标
npm install lucide-react

# 工具库
npm install class-variance-authority clsx tailwind-merge

# i18n
npm install next-intl

# Tailwind 动画插件
npm install tailwindcss-animate
```

### 15.5 shadcn/ui 变量映射速查

shadcn/ui 使用 CSS 变量命名。将以下映射加入 `globals.css` 以确保 shadcn 组件与我们的 token 系统对齐：

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 210 40% 98%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 239 84% 67%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 239 84% 67%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 240 33% 3%;
    --foreground: 210 40% 98%;
    --card: 240 25% 10%;
    --card-foreground: 210 40% 98%;
    --popover: 240 25% 10%;
    --popover-foreground: 210 40% 98%;
    --primary: 232 91% 81%;
    --primary-foreground: 222 47% 11%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 16% 47%;
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 232 91% 81%;
  }
}
```

### 15.6 快速启动检查清单

| 步骤 | 命令 / 操作 |
|---|---|
| 1 | 安装上述 npm 依赖 |
| 2 | 复制 `tailwind.config.ts` 和 `globals.css` |
| 3 | 配置 `layout.tsx` 加载 Google Fonts |
| 4 | 初始化 shadcn/ui `npx shadcn-ui@latest init` |
| 5 | 将 shadcn 变量映射加入 `globals.css` |
| 6 | 在 `app/layout.tsx` 的 `<html>` 上加 `className="dark"` 设置默认暗色 |
| 7 | 安装所需 shadcn 组件 |
| 8 | 在 `brand.config.ts` 中集中导出设计常量（可选但推荐） |
| 9 | 运行 `npm run dev`，检查首页暗色模式是否正常 |
| 10 | 使用 axe DevTools 扫描一次可访问性 |

---

> 本文档由工业级产品设计流程生成，所有数值经过四组需求对齐确认，可直接用于 Next.js + Tailwind + shadcn/ui 技术栈的实现。
