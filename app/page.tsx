"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ModelCard } from "@/components/model-card";
import { FeatureCard } from "@/components/feature-card";
import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, ChevronRight, Video } from "lucide-react";

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

const popularFeatures = [
  { title: "Video Tools", desc: "Professional editing suite", gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" },
  { title: "Video Effects", desc: "Cinematic transitions", gradient: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)" },
  { title: "AI Transition", desc: "Seamless scene changes", gradient: "linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)" },
  { title: "Mimic Motion", desc: "Clone any movement style", gradient: "linear-gradient(135deg, #F59E0B 0%, #B45309 100%)" },
];

const aiTools = [
  { name: "AI Video Editor", desc: "Edit like a pro with AI", tag: null, color: "#6366F1", href: "#" },
  { name: "Video To Video", desc: "Transform any footage", tag: "Hot", color: "#EC4899", href: "#" },
  { name: "Video Upscaler", desc: "4K quality enhancement", tag: null, color: "#14B8A6", href: "#" },
  { name: "Lip Sync AI", desc: "Perfect audio matching", tag: "New", color: "#F59E0B", href: "#" },
  { name: "AI Video Extender", desc: "Expand your scenes", tag: null, color: "#8B5CF6", href: "#" },
  { name: "Background Remover", desc: "Clean cutouts instantly", tag: null, color: "#06B6D4", href: "#" },
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
          <motion.div variants={fadeInUp} className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            <h1 className="text-4xl md:text-[64px] font-bold text-[#F8FAFC] leading-[1.1] tracking-[-0.03em]">
              Create at the Speed of Thought
            </h1>
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          </motion.div>

          {/* Subtitle */}
          <motion.p variants={fadeInUp} className="text-xl text-[#94A3B8] max-w-[600px]">
            All-in-one AI Video &amp; Image Generator
          </motion.p>

          {/* Model Strip */}
          <motion.div variants={fadeInUp} className="flex items-center gap-1 text-sm text-[#64748B] opacity-80">
            <span>Veo 3 · Sora 2 · Kling · Runway Gen-4 · Midjourney · Flux Pro</span>
            <span className="text-[#818CF8] font-semibold ml-1">+ 15 more</span>
          </motion.div>

          {/* Announcement Pill */}
          <motion.div variants={fadeInUp}>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#13101F] border border-[#1E293B] hover:border-[#475569] transition-colors"
            >
              <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white text-[11px] font-bold">
                New
              </span>
              <span className="text-sm text-[#F8FAFC] font-medium">Seedance 2.0 Launched</span>
              <span className="text-sm text-[#64748B] font-medium">Try Now →</span>
            </Link>
          </motion.div>

          {/* 2 CTA Cards */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-[720px]">
            {/* Create Video */}
            <Link
              href="/generate"
              className="flex flex-col gap-3 p-6 rounded-2xl bg-[#13101F] border border-[#1E293B] hover:border-[#475569] hover:-translate-y-1 transition-all duration-300 text-left h-[180px]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center">
                <Video className="w-5 h-5 text-[#818CF8]" />
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">Create Video</h3>
              <p className="text-sm text-[#64748B] leading-relaxed flex-1">Text or image to video with 20+ models</p>
              <span className="text-lg text-[#64748B]">→</span>
            </Link>

            {/* Create Image */}
            <Link
              href="/generate"
              className="flex flex-col gap-3 p-6 rounded-2xl bg-[#13101F] border border-[#1E293B] hover:border-[#475569] hover:-translate-y-1 transition-all duration-300 text-left h-[180px]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">Create Image</h3>
              <p className="text-sm text-[#64748B] leading-relaxed flex-1">Flux · MJ · DALL-E 4 and more</p>
              <span className="text-lg text-[#64748B]">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Popular Features */}
      <section className="py-12 px-6 md:px-12">
        <motion.div
          className="max-w-[1200px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp} className="text-xl font-bold text-[#F8FAFC] mb-6">
            Popular features
          </motion.h2>
          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularFeatures.map((f) => (
              <div
                key={f.title}
                className="relative rounded-2xl overflow-hidden h-[160px] cursor-pointer group hover:-translate-y-1 transition-transform duration-300"
                style={{ background: f.gradient }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-white/70">{f.desc}</p>
                </div>
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* AI Tools */}
      <section className="py-12 px-6 md:px-12">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#F8FAFC]">AI Tools</h2>
            <Link href="#" className="text-sm text-[#64748B] hover:text-[#818CF8] transition-colors">View more &gt;</Link>
          </motion.div>
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiTools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="relative rounded-2xl bg-[#13101F] border border-[#1E293B] overflow-hidden cursor-pointer hover:border-[#475569] hover:-translate-y-0.5 transition-all duration-300 group block"
              >
                {/* Image placeholder */}
                <div
                  className="h-[160px] w-full"
                  style={{ background: `linear-gradient(135deg, ${tool.color}20 0%, ${tool.color}08 100%)` }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                      style={{ backgroundColor: `${tool.color}20`, color: tool.color }}
                    >
                      {tool.name.charAt(0)}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#F8FAFC]">{tool.name}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">{tool.desc}</p>
                  </div>
                  {tool.tag && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EC4899]/15 text-[#EC4899] text-[10px] font-bold">
                      {tool.tag}
                    </span>
                  )}
                </div>
              </Link>
            ))}
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
