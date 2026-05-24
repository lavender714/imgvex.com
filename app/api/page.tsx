"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Sparkles,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Workflow,
  Repeat,
  Cpu,
  Coins,
  ArrowRight,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  API_CATALOG,
  PROVIDER_NAMES,
  type ApiTaskFilter,
} from "@/lib/api/model-catalog";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ─── Static content ─── */

const TASK_TABS: { id: ApiTaskFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "text-to-image", label: "Text → Image" },
  { id: "image-to-image", label: "Image → Image" },
  { id: "text-to-video", label: "Text → Video" },
  { id: "image-to-video", label: "Image → Video" },
];

const VALUE_PROPS = [
  {
    icon: Workflow,
    title: "Unified API",
    desc: "One endpoint, one auth scheme, one response shape for 20+ image and video models from OpenAI, Google, ByteDance, BFL, and more.",
    color: "#818CF8",
  },
  {
    icon: Coins,
    title: "Same credits, no extra fee",
    desc: "API generations draw from the same credit pool as your web subscription. No double billing, no separate top-ups.",
    color: "#14B8A6",
  },
  {
    icon: Repeat,
    title: "Auto-refund on failure",
    desc: "If a model errors out or times out, credits are returned to your account automatically within minutes.",
    color: "#F59E0B",
  },
  {
    icon: Zap,
    title: "Async + webhook callbacks",
    desc: "Long-running video jobs return immediately with a task ID. We POST the result to your webhook when ready.",
    color: "#EC4899",
  },
  {
    icon: ShieldCheck,
    title: "Stable endpoints",
    desc: "We commit to 6 months of backward compatibility on any GA model. Deprecations announced 90 days in advance.",
    color: "#6366F1",
  },
  {
    icon: Cpu,
    title: "Production-grade infra",
    desc: "Multi-region failover, automatic provider switching, and observability dashboards. Built for serious workloads.",
    color: "#8B5CF6",
  },
];

const FAQS = [
  {
    q: "How does authentication work?",
    a: "Send your API key in the Authorization header as a Bearer token. Get a key from your dashboard once you're on a paid plan. Keys can be scoped and rotated per-project.",
  },
  {
    q: "What are the rate limits?",
    a: "Limits scale with your plan: Lite gets 60 requests/min, Pro 200/min, Ultra unlimited. Long-running video jobs don't count against your synchronous limit — they run async via task queues.",
  },
  {
    q: "How do async generations and webhooks work?",
    a: "Video and slow image jobs return a 202 with a task_id. You can either poll GET /v1/tasks/{id} or register a webhook URL when creating the request — we'll POST the completed result to your endpoint, signed with HMAC-SHA256.",
  },
  {
    q: "What happens if a generation fails?",
    a: "Failed generations (provider errors, timeouts, content-policy blocks) trigger an automatic credit refund within a few minutes. You'll see the refund in /dashboard/billing and a webhook event will fire if you've subscribed.",
  },
  {
    q: "Do you offer volume discounts or enterprise pricing?",
    a: "Yes. For teams generating > 100k credits/month, we offer custom pricing, SLAs (99.9% uptime), dedicated capacity, and direct-line support. Contact sales@imgvex.com to discuss.",
  },
  {
    q: "Which model should I pick?",
    a: "For images: Nano Banana for speed, GPT Image 2.0 for general quality, Flux for cinematic detail, Midjourney for artistic style. For video: Veo 3.1 for premium quality with audio, Sora 2 for general-purpose, Seedance 2.0 Fast for cost-efficient short clips, Kling for natural motion. See model cards above for details.",
  },
];

const CODE_SAMPLES = {
  curl: `curl https://api.imgvex.com/v1/generate \\
  -H "Authorization: Bearer $IMGVEX_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "sora-2-pro",
    "prompt": "A cinematic shot of waves crashing on a black sand beach at sunset",
    "duration": 5,
    "resolution": "1080p"
  }'`,
  node: `// SDK coming soon — use fetch() until then
const res = await fetch("https://api.imgvex.com/v1/generate", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.IMGVEX_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "sora-2-pro",
    prompt: "A cinematic shot of waves crashing on a black sand beach at sunset",
    duration: 5,
    resolution: "1080p",
  }),
});

const { task_id } = await res.json();
// Poll GET /v1/tasks/{task_id} or register a webhook`,
  python: `# SDK coming soon — use requests until then
import os
import requests

res = requests.post(
    "https://api.imgvex.com/v1/generate",
    headers={
        "Authorization": f"Bearer {os.environ['IMGVEX_API_KEY']}",
        "Content-Type": "application/json",
    },
    json={
        "model": "sora-2-pro",
        "prompt": "A cinematic shot of waves crashing on a black sand beach at sunset",
        "duration": 5,
        "resolution": "1080p",
    },
)

task_id = res.json()["task_id"]
# Poll GET /v1/tasks/{task_id} or register a webhook`,
} as const;

/* ─── Page ─── */

export default function ApiPage() {
  const [activeTask, setActiveTask] = useState<ApiTaskFilter>("all");
  const [activeCode, setActiveCode] = useState<"curl" | "node" | "python">("curl");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSample, setCopiedSample] = useState(false);

  const filteredModels = useMemo(() => {
    if (activeTask === "all") return API_CATALOG;
    return API_CATALOG.filter((m) => m.taskType === activeTask);
  }, [activeTask]);

  const copyModelId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard may fail on insecure contexts — silently no-op
    }
  };

  const copyCodeSample = async () => {
    try {
      await navigator.clipboard.writeText(CODE_SAMPLES[activeCode]);
      setCopiedSample(true);
      setTimeout(() => setCopiedSample(false), 1500);
    } catch {
      // no-op
    }
  };

  return (
    <div className="min-h-full bg-[#0B0817]">
      <Navbar variant="landing" />

      {/* 1. Hero */}
      <section className="pt-[72px]">
        <div className="px-6 md:px-12 py-20 md:py-28">
          <motion.div
            className="max-w-[1200px] mx-auto flex flex-col items-center gap-10 text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13101F] border border-[#1E293B]">
              <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" />
              <span className="text-xs font-medium text-[#CBD5E1]">imgvex API · Public preview</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-[#F8FAFC] tracking-[-0.02em] max-w-[860px] leading-[1.1]"
            >
              All the top AI image &amp; video models.{" "}
              <span className="bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#EC4899] bg-clip-text text-transparent">
                One unified API.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-[#94A3B8] max-w-[640px]">
              20+ models from OpenAI, Google, ByteDance, Anthropic, Black Forest Labs, and more — accessed through a single endpoint with one auth scheme and one response shape.
            </motion.p>

            {/* Code preview */}
            <motion.div variants={fadeInUp} className="w-full max-w-[820px] rounded-2xl bg-[#0F0F1A] border border-[#1E293B] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E293B]">
                <div className="flex items-center gap-1">
                  {(["curl", "node", "python"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveCode(tab)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        activeCode === tab
                          ? "bg-[#1E293B] text-[#F8FAFC]"
                          : "text-[#64748B] hover:text-[#CBD5E1]"
                      }`}
                    >
                      {tab === "curl" ? "cURL" : tab === "node" ? "Node.js" : "Python"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={copyCodeSample}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#64748B] hover:text-[#CBD5E1] transition-colors"
                  aria-label="Copy code"
                >
                  {copiedSample ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#14B8A6]" />
                      <span className="text-[#14B8A6]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="px-5 py-4 text-[13px] text-[#CBD5E1] overflow-x-auto font-mono leading-relaxed text-left">
                <code>{CODE_SAMPLES[activeCode]}</code>
              </pre>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-6 h-11"
                asChild
              >
                <Link href="mailto:support@imgvex.com?subject=API%20Access%20Request">
                  Get API Access
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="text-sm font-medium text-[#818CF8] hover:text-[#818CF8] hover:bg-transparent"
                asChild
              >
                <Link href="/pricing">View Pricing →</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Provider logo strip */}
      <section className="px-6 md:px-12 py-12 border-t border-[#1E293B]/50">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-6">
          <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium">
            Models from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {PROVIDER_NAMES.map((name) => (
              <span key={name} className="text-base font-semibold text-[#475569] hover:text-[#94A3B8] transition-colors">
                {name}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-[#475569] text-center max-w-[720px] mt-2 leading-relaxed">
            Independent service · imgvex.AI is not affiliated with, endorsed by, or sponsored by the model providers shown.
            Models are accessed through our unified interface to enhance usability and provide additional features.
          </p>
        </div>
      </section>

      {/* 3. Why imgvex API */}
      <section className="px-6 md:px-12 py-20 md:py-24">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">Why imgvex API</h2>
            <p className="text-base text-[#94A3B8] max-w-[560px]">
              Built for teams that ship to production — not for prototypes that never leave the demo.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUE_PROPS.map((prop) => (
              <div
                key={prop.title}
                className="flex flex-col gap-3 p-6 rounded-2xl bg-[#0F0F1A] border border-[#1E293B] hover:border-[#334155] transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${prop.color}1a`, border: `1px solid ${prop.color}33` }}
                >
                  <prop.icon className="w-5 h-5" style={{ color: prop.color }} />
                </div>
                <h3 className="text-base font-semibold text-[#F8FAFC]">{prop.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 4. Model Catalog */}
      <section className="px-6 md:px-12 py-16 border-t border-[#1E293B]/50">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">Model catalog</h2>
            <p className="text-base text-[#94A3B8] max-w-[560px]">
              Every model below is available behind the same endpoint. Pass the model ID, get a result.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-2">
            {TASK_TABS.map((tab) => {
              const isActive = activeTask === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTask(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#6366F1] text-white"
                      : "bg-[#13101F] border border-[#1E293B] text-[#CBD5E1] hover:border-[#334155]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </motion.div>

          {/* Cards grid */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                copied={copiedId === model.id}
                onCopy={() => copyModelId(model.id)}
              />
            ))}
          </motion.div>

          {filteredModels.length === 0 && (
            <p className="text-center text-sm text-[#64748B] py-12">
              No models in this category yet — more coming soon.
            </p>
          )}
        </motion.div>
      </section>

      {/* 5. Enterprise CTA banner */}
      <section className="px-6 md:px-12 py-12">
        <motion.div
          className="max-w-[1000px] mx-auto p-8 md:p-10 rounded-3xl border border-[#1E293B] bg-gradient-to-r from-[#1E1B4B]/40 via-[#0F0F1A] to-[#831843]/30"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
                Need volume pricing or SLAs?
              </h3>
              <p className="text-sm text-[#94A3B8] max-w-[480px]">
                Teams running &gt; 100k credits/month get custom pricing, 99.9% uptime SLA, dedicated capacity, and direct-line support.
              </p>
            </div>
            <Button
              className="rounded-full bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0B0817] font-semibold text-sm px-6 h-11 shrink-0"
              asChild
            >
              <Link href="mailto:sales@imgvex.com?subject=Enterprise%20Inquiry">
                Talk to sales
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* 6. Pricing pointer */}
      <section className="px-6 md:px-12 py-16">
        <motion.div
          className="max-w-[800px] mx-auto flex flex-col items-center gap-6 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
            Pricing
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-base text-[#94A3B8] max-w-[560px]">
            The API draws from the same credits as your web subscription. Pick a plan on the pricing page — no separate API fees, no per-call markup.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button
              className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-6 h-11"
              asChild
            >
              <Link href="/pricing">
                See plans
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* 7. FAQ */}
      <section className="px-6 md:px-12 py-20 border-t border-[#1E293B]/50">
        <motion.div
          className="max-w-[720px] mx-auto flex flex-col gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">Frequently asked questions</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border border-[#1E293B] rounded-2xl overflow-hidden bg-[#0F0F1A]">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-sm font-medium text-[#F8FAFC]">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#64748B] shrink-0 ml-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5"
                    >
                      <p className="text-sm text-[#94A3B8] leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* 8. Footer CTA */}
      <section className="px-6 md:px-12 py-20">
        <motion.div
          className="max-w-[800px] mx-auto text-center flex flex-col items-center gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">Start building today</h2>
            <p className="text-base text-[#94A3B8] max-w-[440px] mx-auto">
              Get API access in your inbox within one business day. No demo calls required.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Button
              className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-6 h-11"
              asChild
            >
              <Link href="mailto:support@imgvex.com?subject=API%20Access%20Request">
                Get API Access
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

/* ─── ModelCard ─── */

function ModelCard({
  model,
  copied,
  onCopy,
}: {
  model: (typeof API_CATALOG)[number];
  copied: boolean;
  onCopy: () => void;
}) {
  const taskLabel: Record<string, string> = {
    "text-to-image": "Text → Image",
    "image-to-image": "Image → Image",
    "text-to-video": "Text → Video",
    "image-to-video": "Image → Video",
    "video-to-video": "Video → Video",
  };

  return (
    <div className="group flex flex-col rounded-2xl bg-[#0F0F1A] border border-[#1E293B] overflow-hidden hover:border-[#334155] transition-colors">
      {/* Banner */}
      <div className="relative h-[180px] overflow-hidden">
        {model.banner.kind === "image" ? (
          <img
            src={model.banner.src}
            alt={model.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${model.banner.from} 0%, ${model.banner.to} 100%)`,
            }}
          >
            {model.banner.emoji && (
              <span className="text-6xl font-bold text-white/90 select-none">
                {model.banner.emoji}
              </span>
            )}
          </div>
        )}
        {/* Provider badge top-right */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
          <span className="text-[11px] font-semibold text-white">{model.providerName}</span>
        </div>
        {/* Coming soon overlay */}
        {model.comingSoon && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#F59E0B]/90 border border-[#F59E0B]">
            <span className="text-[10px] font-bold text-[#0B0817] uppercase tracking-wider">Coming Soon</span>
          </div>
        )}
        {model.badge && !model.comingSoon && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#6366F1]/90 border border-[#6366F1]">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{model.badge}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-[#F8FAFC]">{model.name}</h3>
          <span className="px-2 py-0.5 rounded-md bg-[#13101F] border border-[#1E293B] text-[10px] font-medium text-[#64748B] shrink-0">
            {taskLabel[model.taskType]}
          </span>
        </div>

        {/* Model ID with copy */}
        <button
          onClick={onCopy}
          className="group/copy flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#0B0817] border border-[#1E293B] hover:border-[#334155] transition-colors text-left w-fit"
          aria-label={`Copy model ID ${model.id}`}
        >
          <span className="text-xs font-mono text-[#94A3B8]">{model.id}</span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#14B8A6]" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-[#64748B] group-hover/copy:text-[#CBD5E1]" />
          )}
        </button>

        <p className="text-sm text-[#94A3B8] leading-relaxed">{model.description}</p>

        <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Clock className="w-3.5 h-3.5" />
            <span>~{model.etaSeconds}s</span>
          </div>
          <Link
            href={`/models/${model.id}`}
            className="flex items-center gap-1 text-xs font-medium text-[#818CF8] hover:text-[#A5B4FC] transition-colors"
          >
            View docs
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
