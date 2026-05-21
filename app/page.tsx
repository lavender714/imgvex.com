"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ModelCard } from "@/components/model-card";
import { motion } from "framer-motion";
import { ChevronRight, Boxes, Sparkles, Wand2, Lightbulb } from "lucide-react";

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

const whyChoose = [
  {
    icon: Boxes,
    iconColor: "#818CF8",
    title: "Unified Console for Video & Image",
    description: "From quick promos to cinematic shorts, imgvex.AI gives you a complete generation toolkit. No platform switching, no juggling credentials.",
  },
  {
    icon: Sparkles,
    iconColor: "#A78BFA",
    title: "Powered by Leading AI Models",
    description: "Access Veo 3, Sora 2, Kling, Runway, Midjourney, Flux and 15+ others — seamlessly integrated for maximum creative flexibility.",
  },
  {
    icon: Wand2,
    iconColor: "#14B8A6",
    title: "Effortless Text-to-Content Workflows",
    description: "Turn prompts into professional content. AI-enhanced prompting, smart defaults, one-click model switching, batch queues.",
  },
  {
    icon: Lightbulb,
    iconColor: "#F59E0B",
    title: "Built for Modern Creative Workflows",
    description: "Whether you're creating ads, social shorts, e-commerce visuals or storytelling — imgvex.AI adapts to your goals.",
  },
];

const easySteps = [
  {
    number: "1",
    title: "Select the Appropriate Model",
    description: "Choose a model that best fits your creative needs — from cinematic Veo 3 to viral-ready Kling.",
  },
  {
    number: "2",
    title: "Enter a Prompt or Use AI Assistance",
    description: "Write a prompt or upload an image. Use Generate With AI to turn simple keywords into a full prompt.",
  },
  {
    number: "3",
    title: "Choose the Right Parameter Settings",
    description: "Adjust aspect ratio, resolution, duration — or use the Auto preset for instant defaults.",
  },
  {
    number: "4",
    title: "Click Generate and Wait for Your Creations",
    description: "Hit Generate and let AI do the work. Images take seconds; videos may take a few minutes.",
  },
];

const stepDemos = [
  {
    src: "https://lh3.googleusercontent.com/IoSfcitEGPD3GGM8rZ3rz8ILUz_b1ejr_cYUT6iY8hpM2YYtVGO94k2_gdQQYwbfS8d1A5Gqw1YgBAB51ji8hgMcBkCcY_aSBtid6stjZdbCl-zreg=w800-h600-n-nu",
    label: "Veo 3",
  },
  {
    src: "https://cdn.sanity.io/images/2gpum2i6/production/c8a6972790ddfc1f07e6ace855517a9ad03e035d-1162x1774.png?w=800&h=1067&fit=crop&auto=format",
    label: "Flux Pro",
  },
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
      { src: "https://cdn.sanity.io/images/2gpum2i6/production/a8548b6a1df6ea698a6fc5c6a377436e98d5d4c1-1073x1600.jpg?w=800&h=1067&fit=crop&auto=format", label: "Concept art" },
      { src: "https://cdn.sanity.io/images/2gpum2i6/production/5d563b7e80a4544e78cb389bd863d9f26da636a5-1072x1920.png?w=800&h=1067&fit=crop&auto=format", label: "Cinematic" },
      { src: "https://cdn.sanity.io/images/2gpum2i6/production/b352b23898d0662cac2946c6506e8c6c19996fdb-1024x1280.png?w=800&h=1067&fit=crop&auto=format", label: "Illustration" },
    ],
  },
] as const;


const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  const [exploreKey, setExploreKey] = useState<typeof exploreTabs[number]["key"]>("img2vid");
  const explore = exploreTabs.find((t) => t.key === exploreKey)!;

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
          className="relative flex flex-col items-center gap-6 max-w-[1100px] w-full text-center mt-20"
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
            {" & "}
            <a href="https://bfl.ai/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#94A3B8]">
              Flux Pro
            </a>
            {" "}official showcases. imgvex.AI provides unified access to 20+ models.
          </motion.p>
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
      {/* Why Choose imgvex.AI */}
      <section id="features" className="py-[100px] px-6 md:px-12">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col items-center gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center max-w-[820px] flex flex-col gap-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[#F8FAFC] tracking-[-0.02em]">
              Why Choose imgvex.AI
            </h2>
            <p className="text-base text-[#94A3B8] leading-relaxed">
              imgvex.AI integrates leading generative models like Veo 3, Sora 2, Kling, Runway, Midjourney, and Flux to empower creators with a unified platform for both video and image. Whether you&apos;re crafting cinematic shorts or product visuals, our advanced workflow helps bring creative ideas to life — faster and better.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {whyChoose.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col gap-4 p-7 rounded-2xl bg-[#13101F] border border-[#1E293B] hover:border-[#475569] transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.iconColor}1A` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.iconColor }} />
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] tracking-[-0.01em]">{item.title}</h3>
                  <p className="text-[15px] text-[#94A3B8] leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Create with imgvex.AI in Easy Steps */}
      <section className="py-[100px] px-6 md:px-12 bg-[#0A0712]/60">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col items-center gap-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center max-w-[820px] flex flex-col gap-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[#F8FAFC] tracking-[-0.02em]">
              Create with imgvex.AI in Easy Steps
            </h2>
            <p className="text-base text-[#94A3B8]">
              No editing skills needed — just pick, type, and generate using AI video and image tools.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start w-full">
            {/* Left: 2 compact demo previews stacked */}
            <div className="flex flex-col gap-5 w-full max-w-[380px] md:shrink-0">
              {stepDemos.map((d, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-inset ring-white/5 bg-[#13101F]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.src}
                    alt={`${d.label} demo`}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[10px] text-white/70 font-medium">
                    via {d.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: numbered steps */}
            <div className="flex-1 w-full flex flex-col gap-7 md:pt-12">
              {easySteps.map((step, i) => (
                <div key={i} className="flex gap-5">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold shadow-lg shadow-[#6366F1]/30 ring-1 ring-inset ring-white/20"
                      style={{ background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 50%, #A855F7 100%)" }}
                    >
                      {step.number}
                    </div>
                    {i < easySteps.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-[#6366F1]/40 to-transparent mt-2 min-h-[24px]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 pb-4">
                    <h3 className="text-lg font-bold text-[#F8FAFC]">{step.title}</h3>
                    <p className="text-[15px] text-[#94A3B8] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
