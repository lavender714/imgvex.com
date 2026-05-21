"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ModelCard } from "@/components/model-card";
import { FeatureCard } from "@/components/feature-card";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

const models = [
  { id: "kling-2", name: "Kling 2.0", type: "video" as const, logo: "K", logoColor: "#818CF8", specs: "Video • 1080p • 10s" },
  { id: "runway-gen4", name: "Runway Gen-4", type: "video" as const, logo: "R", logoColor: "#F59E0B", specs: "Video • 1080p • 16s" },
  { id: "pika-2", name: "Pika 2.0", type: "video" as const, logo: "P", logoColor: "#14B8A6", specs: "Video • 720p • 3s" },
  { id: "luma-dream", name: "Luma Dream Machine", type: "video" as const, logo: "L", logoColor: "#EF4444", specs: "Video • 1080p • 5s" },
  { id: "stable-video", name: "Stable Video", type: "video" as const, logo: "S", logoColor: "#EC4899", specs: "Video • 720p • 4s" },
  { id: "midjourney-v7", name: "Midjourney v7", type: "image" as const, logo: "M", logoColor: "#8B5CF6", specs: "Image • 2048px" },
  { id: "flux-pro", name: "Flux Pro", type: "image" as const, logo: "F", logoColor: "#06B6D4", specs: "Image • 2048px" },
  { id: "dalle-4", name: "DALL-E 4", type: "image" as const, logo: "D", logoColor: "#F97316", specs: "Image • 1024px" },
];

const features = [
  { icon: "A", iconColor: "#818CF8", title: "Multi-Model Aggregation", description: "Compare outputs side-by-side from different models. Pick the best result every time." },
  { icon: "B", iconColor: "#14B8A6", title: "Unified Prompting", description: "One prompt works across all models. Our system adapts parameters automatically." },
  { icon: "C", iconColor: "#F59E0B", title: "Batch Generation", description: "Queue up to 10 generations and let them run in the background while you work." },
  { icon: "D", iconColor: "#EC4899", title: "Asset Management", description: "Organize, tag, and export your generations. Full version history included." },
];

const exploreTabs = [
  {
    key: "img2vid",
    label: "Image to Video",
    title: "Bring photos to life",
    description: "Turn any image into a dynamic 5–15s video. Add motion, camera moves, and ambience — no editing skills needed.",
    models: ["Veo 3", "Kling 3.0", "Runway Gen-4", "Seedance 2.0"],
    href: "/tools/image-to-video",
    samples: [
      { src: "https://lh3.googleusercontent.com/BXf7nFeF8HLOvRUH3C0Gm7vCGyIRUhaZ8oMkb_oFKW5RxrDWnsFx8wD-1kDG8z4vuwMgqDOmMn1YU9CxAewIKclglhcuUc_8RUfcfy7YaNTB03Sc3w=w800-h600-n-nu", label: "Portrait motion" },
      { src: "https://lh3.googleusercontent.com/r8GdFVkzQUZJUavR472wZA4NsdM5CarlMf4xFW1tafuLyRPbbhDxU1MeIanCWYjgfrgoqNTHBa94wo0kyCVQHuxvvcwfcRIAwW0o1xJgFocg5Ple=w800-h600-n-nu", label: "Drone shot" },
      { src: "https://lh3.googleusercontent.com/mIY1prcEmuW-VvXFj1VkQMVjz8YgeAFIeTstI5pgsWxxNFy0iSGhPV8z2jw5oE-r6czEKoTc7T2F1SiIb5mOo4L-hZjaOpv0I9pSF-fKl3RBye1a=w800-h600-n-nu", label: "Action scene" },
    ],
  },
  {
    key: "txt2vid",
    label: "Text to Video",
    title: "Words become moving images",
    description: "Describe what you want and watch ideas turn into captivating videos. Perfect for storytelling and ads.",
    models: ["Sora 2", "Veo 3", "Kling 3.0", "Hailuo 2.3"],
    href: "/tools/text-to-video",
    samples: [
      { src: "https://lh3.googleusercontent.com/ZiwH_wa1LfkkOwklJ874qQBiNdhxukLDOasXDAOIvj_myLyX8RgewbtrCiB-GYYeGHwV54tZ8M8CY3bBmqZ3qikQliW7hpIfotfdgiQXSUOgR79s8VE=w800-h600-n-nu", label: "Story scene" },
      { src: "https://lh3.googleusercontent.com/7Ha4silSl6FaygQ5eOxK0DnVHSgdeRp-pyH0A9u8SnxjG32FPyuYzW9NIVAkq0v2QBm7nafnZUvxvKYJvD30niCBEWdtxdu92mDZYjukkcNRumaZ7A=w800-h600-n-nu", label: "Character" },
      { src: "https://lh3.googleusercontent.com/givG_8BNQzZcq5W98Nojwwk2QHIokeZnhFXXN7VaF5LJMhiVn7QZUJWCMc052h36I6RsRkosi-hKnR-QAOXSxmLLtJsbxzv5cb4l9XkfjcatO1MfwA=w800-h600-n-nu", label: "Cinematic" },
    ],
  },
  {
    key: "img2img",
    label: "Image to Image",
    title: "Remix any image",
    description: "Transform style, change subject, generate variations. Powered by the latest editing models.",
    models: ["Nano Banana 2", "Flux Pro", "Seedream 4.5", "GPT Image 2"],
    href: "/tools/image-to-image",
    samples: [
      { src: "https://lh3.googleusercontent.com/r7N2n0PAnoTXEEKQQTsXyKOrQD0Ii_3EC33JHpcw16NPlqu3jes7QVu1GFm9mz4KBCLCC9fdpBcpPzBooK6R_TWdBJmbrqTy0f5mo59j-Tl2ayHTWsQ=w800-h600-n-nu", label: "Outpainting" },
      { src: "https://lh3.googleusercontent.com/ZKEikt9YR-ZnojBscdjdW0SzWN40c_g_y_omFFytmPFNayOiMHizBbwV3kWDuo1-2rQbN7_hGcq0uNpcwJtIpBUVfV3CL6qKeEn01A9H4GEmVtZ7=w800-h600-n-nu", label: "Add object" },
      { src: "https://lh3.googleusercontent.com/cay9WFD-AQyIamJuhRxJcrVBoo7zoNjzmLjYR2xZLFOOVAnLeoiC24YvB9UmQKm9qXfTAtxBVS25XfynlvVJvTzOvjkz_9LrWE-Auyf-ZwtXTP-PDA=w800-h600-n-nu", label: "Remove object" },
    ],
  },
  {
    key: "txt2img",
    label: "Text to Image",
    title: "Create visuals from words",
    description: "From quick illustrations to photoreal product shots. Pick the model that matches your style.",
    models: ["Midjourney v7", "Flux Pro", "DALL-E 4", "Imagen"],
    href: "/tools/text-to-image",
    samples: [
      { src: "https://lh3.googleusercontent.com/drrHfIaeqeQm4kXlnH7VdB-NCjnUEz5rEufAZrUZHNOGmJE1tLsfHHG2J1lEI3yhCNEJI46rF4H5uxSyV8HQx6loLUppd8sjn8ZHeLz1rpXsJoBCfQ=w800-h600-n-nu", label: "Style transfer" },
      { src: "https://lh3.googleusercontent.com/y8iwNOFG7VdNI_X_nGNrLjnLFJGkKJoqQFMw6to6C5l-qmfj9V5of64jwyFF8wRsVliq1jD5GhIkvNmD0KFK2AiX_WJGeC6ehVu3O_rac9hvK6PEBoM=w800-h600-n-nu", label: "Photoreal" },
      { src: "https://lh3.googleusercontent.com/p_qu1p6DigEfZWOmRCXSnBJ5jIoPrDcz782l4UQetzrGyVwbpKUmdtJDIPVU83IEwtOlZ8ITL8NAnmLJvhBdkpKeFZd3TATQzWXmCbLDBy4T3rlelw=w800-h600-n-nu", label: "Concept art" },
    ],
  },
] as const;

const madeWithExamples = [
  {
    category: "Marketing",
    prompt: "A sleek smartphone rotating in a minimal studio with soft rim light, product shot, 16:9, ultra detailed",
    model: "Veo 3",
    src: "https://lh3.googleusercontent.com/IoSfcitEGPD3GGM8rZ3rz8ILUz_b1ejr_cYUT6iY8hpM2YYtVGO94k2_gdQQYwbfS8d1A5Gqw1YgBAB51ji8hgMcBkCcY_aSBtid6stjZdbCl-zreg=w1200-h675-n-nu",
  },
  {
    category: "Cinematic",
    prompt: "Vintage convertible cruising along a coastal highway at golden hour, palm trees swaying, smooth tracking shot",
    model: "Sora 2",
    src: "https://lh3.googleusercontent.com/stmB5d1VCdgmMUXrluAQEOFjc7KnAh1HEZpEa9roUUaZSs7l959ccPVuXeQfeosk0UnsVN28A2Qtb5ztq4qzCnonUoq4php6fFogQ7zRBYnu1rdNusY=w1200-h675-n-nu",
  },
  {
    category: "Social Media",
    prompt: "Cute corgi wearing tiny sunglasses on a beach, slow motion, bokeh background, 9:16 vertical",
    model: "Kling 3.0",
    src: "https://lh3.googleusercontent.com/C5f9YIk6GF97QgXDqWujm9XjiJORVdN_Q_EGIdpd-WmNYHEka5WQDwjEobpzReQrqaAQntWX4ZYOXD4wxdPrNeufuMbvf47nWO49pu5u5cliFYnu=w1200-h675-n-nu",
  },
  {
    category: "E-commerce",
    prompt: "Premium leather watch on a marble surface, soft daylight, slow 360-degree rotation, luxury aesthetic",
    model: "Veo 3",
    src: "https://lh3.googleusercontent.com/kcTPNUSoyUi4RKL-N3eAWw-5hEZK4MfN9LDVa5k8MEsiZS9qSnhs__qmDQqOuPuYPL4lBARA2mXoK_biTv8u9zkecNP1ndUHBgLf5YNjJI3tx17MIw=w1200-h675-n-nu",
  },
];

const exploreTags = [
  "AI Video Generator", "Text to Video AI", "Image to Video", "AI Photo Editor",
  "AI Video Extender", "Mimic Motion", "Earth Zoom", "Polaroid Selfie",
  "AI Walking Video", "AI Selfie", "Face Swap", "Animate Picture",
  "Remove Object", "AI Dance", "Restyle Video", "AI Sound Effect",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  const [exploreKey, setExploreKey] = useState<typeof exploreTabs[number]["key"]>("img2vid");
  const [exampleIndex, setExampleIndex] = useState(0);
  const explore = exploreTabs.find((t) => t.key === exploreKey)!;
  const example = madeWithExamples[exampleIndex];

  return (
    <div className="min-h-full bg-[#0B0817]">
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="relative pt-[72px] flex flex-col items-center px-6 pb-16">
        {/* Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)" }}
          />
        </div>

        <motion.div
          className="relative flex flex-col items-center gap-6 max-w-[1100px] w-full text-center mt-12"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Title */}
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-[64px] font-bold text-[#F8FAFC] leading-[1.1] tracking-[-0.03em]">
            Create at the Speed of Thought
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeInUp} className="text-2xl md:text-[26px] text-[#CBD5E1] font-medium max-w-[700px]">
            All-in-one AI Video &amp; Image Generator
          </motion.p>

          {/* Model Strip */}
          <motion.div variants={fadeInUp} className="flex items-center gap-1 text-base text-[#94A3B8] font-medium">
            <span>Veo 3 · Sora 2 · Kling · Runway Gen-4 · Midjourney · Flux Pro</span>
            <span className="text-[#A78BFA] font-semibold ml-2">+ 15 more</span>
          </motion.div>

          {/* Announcement Pill */}
          <motion.div variants={fadeInUp}>
            <Link
              href="/tools/text-to-video"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#13101F] border border-[#1E293B] hover:border-[#475569] transition-colors"
            >
              <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white text-[11px] font-bold">
                New
              </span>
              <span className="text-sm text-[#F8FAFC] font-medium">Seedance 2.0 Launched</span>
              <span className="text-sm text-[#64748B] font-medium">Try Now →</span>
            </Link>
          </motion.div>

          {/* 2 CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-5 mt-2">
            <Link
              href="/tools/text-to-video"
              className="inline-flex items-center justify-center min-w-[200px] h-14 px-10 rounded-2xl text-white text-lg font-bold tracking-wide shadow-lg shadow-[#6366F1]/40 hover:shadow-xl hover:shadow-[#7C3AED]/50 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/30"
              style={{ background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 50%, #A855F7 100%)" }}
            >
              Create Video
            </Link>
            <Link
              href="/tools/text-to-image"
              className="inline-flex items-center justify-center min-w-[200px] h-14 px-10 rounded-2xl text-white text-lg font-bold tracking-wide shadow-lg shadow-[#6366F1]/40 hover:shadow-xl hover:shadow-[#7C3AED]/50 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/30"
              style={{ background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 50%, #A855F7 100%)" }}
            >
              Create Image
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Explore What You Can Create */}
      <section className="py-16 px-6 md:px-12">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] tracking-[-0.02em]">
              Explore What You Can Create
            </h2>
            <p className="text-base text-[#94A3B8]">
              Pick a mode. Pick a model. See it come to life.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-2">
            {exploreTabs.map((tab) => {
              const isActive = tab.key === exploreKey;
              return (
                <button
                  key={tab.key}
                  onClick={() => setExploreKey(tab.key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "text-white shadow-lg shadow-[#6366F1]/30 ring-1 ring-inset ring-white/20"
                      : "text-[#94A3B8] bg-[#13101F] border border-[#1E293B] hover:border-[#475569] hover:text-[#F8FAFC]"
                  }`}
                  style={isActive ? { background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 50%, #A855F7 100%)" } : undefined}
                >
                  {tab.label}
                </button>
              );
            })}
          </motion.div>

          {/* Content: left text + right thumbnails */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-[1fr,1.4fr] gap-8 lg:gap-12 items-center">
            {/* Left */}
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-[-0.02em] mb-3">
                  {explore.title}
                </h3>
                <p className="text-base text-[#94A3B8] leading-relaxed">
                  {explore.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {explore.models.map((m) => (
                  <span key={m} className="px-3 py-1 rounded-full bg-[#13101F] border border-[#1E293B] text-xs font-medium text-[#CBD5E1]">
                    {m}
                  </span>
                ))}
              </div>
              <Link
                href={explore.href}
                className="inline-flex items-center justify-center w-fit h-12 px-8 rounded-2xl text-white text-base font-bold tracking-wide shadow-lg shadow-[#6366F1]/30 hover:shadow-xl hover:shadow-[#7C3AED]/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/20"
                style={{ background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 50%, #A855F7 100%)" }}
              >
                Try {explore.label}
              </Link>
            </div>

            {/* Right thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {explore.samples.map((s, i) => (
                <Link
                  key={i}
                  href={explore.href}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer ring-1 ring-inset ring-white/5 hover:ring-white/20 hover:-translate-y-1 transition-all duration-300 bg-[#13101F]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.src}
                    alt={s.label}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-white uppercase tracking-wider drop-shadow-md">{s.label}</span>
                    <ChevronRight className="w-4 h-4 text-white/80 group-hover:text-white transition-colors drop-shadow-md" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Attribution */}
          <motion.p variants={fadeInUp} className="text-[11px] text-[#475569] text-center">
            Example previews via{" "}
            <a href="https://deepmind.google/models/veo/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#94A3B8]">
              Google Veo
            </a>
            {" "}official showcase. Synapse provides unified access to 20+ models.
          </motion.p>
        </motion.div>
      </section>

      {/* Made with Synapse */}
      <section className="py-16 px-6 md:px-12 bg-[#0A0712]/50">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] tracking-[-0.02em]">
              Made with Synapse
            </h2>
            <p className="text-base text-[#94A3B8]">
              Real prompts from real creators. Use them as a starting point.
            </p>
          </motion.div>

          {/* Category tabs */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-2">
            {madeWithExamples.map((ex, idx) => {
              const isActive = idx === exampleIndex;
              return (
                <button
                  key={ex.category}
                  onClick={() => setExampleIndex(idx)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#13101F] text-[#F8FAFC] border border-[#475569]"
                      : "text-[#64748B] hover:text-[#CBD5E1]"
                  }`}
                >
                  {ex.category}
                </button>
              );
            })}
          </motion.div>

          {/* Example showcase */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-[1fr,1.2fr] gap-6 items-stretch">
            {/* Left: prompt card */}
            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[#13101F] border border-[#1E293B]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#6366F1]/15 text-[#A78BFA] text-xs font-bold tracking-wide">
                  {example.category.toUpperCase()}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#1E293B] text-[#CBD5E1] text-xs font-semibold">
                  {example.model}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs uppercase tracking-wider text-[#64748B] font-bold">Prompt</span>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  {example.prompt}
                </p>
              </div>
              <div className="flex-1" />
              <Link
                href={`/tools/text-to-video?prompt=${encodeURIComponent(example.prompt)}`}
                className="inline-flex items-center justify-center gap-2 w-fit h-11 px-6 rounded-xl bg-[#6366F1] hover:bg-[#7C3AED] text-white text-sm font-semibold transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Try with this prompt
              </Link>
            </div>

            {/* Right: video preview placeholder */}
            <div className="relative aspect-video md:aspect-auto rounded-2xl overflow-hidden ring-1 ring-inset ring-white/5 bg-[#13101F]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={example.src}
                alt={`${example.category} example by ${example.model}`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30 shadow-xl">
                  <div className="w-0 h-0 border-l-[14px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[10px] text-white/70 font-medium">
                via Veo 3
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Models */}
      <section id="models" className="py-12 px-6 md:px-12">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp} className="text-xl font-bold text-[#F8FAFC]">
            Models
          </motion.h2>
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {models.map((model) => (
              <ModelCard key={model.id} {...model} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Explore More */}
      <section className="py-12 px-6 md:px-12">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp} className="text-xl font-bold text-[#F8FAFC]">
            Explore More AI Features
          </motion.h2>
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
            {exploreTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-[#13101F] border border-[#1E293B] text-sm text-[#64748B] hover:border-[#475569] hover:text-[#CBD5E1] cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-[100px] px-6 md:px-12">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col items-center gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center max-w-[700px] flex flex-col gap-3">
            <h2 className="text-4xl font-bold text-[#F8FAFC]">Built for Serious Creators</h2>
            <p className="text-base text-[#94A3B8] leading-relaxed">
              Everything you need to streamline your AI content workflow.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
