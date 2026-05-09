"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { ModelCard } from "@/components/model-card";
import { FeatureCard } from "@/components/feature-card";
import { motion } from "framer-motion";
import { Sparkles, Play, Image, Wand2, ChevronRight, Video, Upload } from "lucide-react";

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

const footerLinks: Record<string, { label: string; href: string }[]> = {
  "Creative Tools": [
    { label: "AI Video Generator", href: "/generate" },
    { label: "Text to Video AI", href: "/generate" },
    { label: "Image to Video AI", href: "/tools/image-to-video" },
    { label: "AI Photo Editor", href: "#" },
    { label: "AI Video Extender", href: "#" },
    { label: "Mimic Motion", href: "#" },
  ],
  "Video Models": [
    { label: "Pollo 2.5", href: "#" },
    { label: "Veo 3", href: "#" },
    { label: "Sora 2", href: "#" },
    { label: "Kling 3.0", href: "#" },
    { label: "Seanceance 2.0", href: "#" },
    { label: "Runway", href: "#" },
  ],
  "Image Models": [
    { label: "GPT Image 2", href: "#" },
    { label: "Nano Banana 2", href: "#" },
    { label: "Recraft", href: "#" },
    { label: "Ideogram", href: "#" },
    { label: "Stable Diffusion", href: "#" },
    { label: "Flux AI", href: "#" },
  ],
  "Apps": [
    { label: "Clone Viral Video", href: "#" },
    { label: "UGC Video Ads", href: "#" },
    { label: "Anime Video", href: "#" },
    { label: "Story Video", href: "#" },
    { label: "Music Video", href: "#" },
    { label: "News Video", href: "#" },
  ],
  "Company": [
    { label: "About Us", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Pricing", href: "/pricing" },
    { label: "API", href: "#" },
    { label: "What's New", href: "#" },
    { label: "Download App", href: "#" },
  ],
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  const [heroTab, setHeroTab] = useState<"video" | "image" | "agent">("video");

  return (
    <div className="min-h-full bg-[#0B0817]">
      <Navbar variant="landing" />

      {/* Hero Section - Pollo Style */}
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
            <h1 className="text-4xl md:text-[52px] font-bold text-[#F8FAFC] leading-[1.1] tracking-[-0.02em]">
              Create at the Speed of Thought
            </h1>
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          </motion.div>

          {/* Hero Tabs */}
          <motion.div variants={fadeInUp} className="flex items-center gap-1 p-1 rounded-full bg-[#13101F] border border-[#1E293B]">
            {([
              { key: "video", label: "Video", icon: Play },
              { key: "image", label: "Image", icon: Image },
              { key: "agent", label: "Agent", icon: Wand2 },
            ] as const).map((t) => {
              const Icon = t.icon;
              const isActive = heroTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setHeroTab(t.key as typeof heroTab)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    isActive ? "text-white" : "text-[#64748B] hover:text-[#CBD5E1]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="heroTab"
                      className="absolute inset-0 rounded-full bg-[#6366F1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{t.label}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Big Generator Card */}
          <motion.div variants={fadeInUp} className="w-full max-w-[900px]">
            <div className="rounded-[20px] bg-[#13101F] border border-[#1E293B] p-5 flex flex-col gap-4">
              {/* Input Row */}
              <div className="relative">
                <div className="flex items-start gap-3">
                  <button className="mt-3 w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center text-[#64748B] hover:bg-[#334155] transition-colors shrink-0">
                    <Upload className="w-4 h-4" />
                  </button>
                  <textarea
                    placeholder="Enter your idea to generate..."
                    className="flex-1 min-h-[80px] bg-transparent text-base text-[#CBD5E1] placeholder:text-[#475569] resize-none outline-none py-3"
                    defaultValue="A cinematic drone shot flying over a misty mountain valley at golden hour..."
                  />
                </div>
              </div>

              {/* Param Pills Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-xs font-medium text-[#818CF8]">
                  <Video className="w-3 h-3" />
                  Video
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#0F0F1A] border border-[#1E293B] text-xs text-[#64748B]">
                  Text/Image to Video
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#0F0F1A] border border-[#1E293B] text-xs text-[#64748B]">
                  Pollo 2.0
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#0F0F1A] border border-[#1E293B] text-xs text-[#64748B]">
                  5s
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#0F0F1A] border border-[#1E293B] text-xs text-[#64748B]">
                  480p
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#0F0F1A] border border-[#1E293B] text-xs text-[#64748B]">
                  16:9
                </span>
                <div className="flex-1" />
                <Button className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-5 h-9">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Generate 10
                </Button>
              </div>
            </div>
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

      {/* Bottom Generator */}
      <section className="py-16 px-6 md:px-12">
        <motion.div
          className="max-w-[900px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="rounded-[20px] bg-[#13101F] border border-[#1E293B] p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Enter your idea to generate..."
                className="w-full h-12 bg-[#0F0F1A] border border-[#1E293B] rounded-xl px-4 text-sm text-[#CBD5E1] placeholder:text-[#475569] outline-none focus:border-[#475569]"
              />
            </div>
            <Button className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-6 h-11 w-full sm:w-auto">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Generate
            </Button>
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

      {/* Footer */}
      <footer className="py-16 px-6 md:px-12 bg-[#040408]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-10">
            <div className="max-w-[280px]">
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">imgvex.AI</h3>
              <p className="text-[13px] text-[#64748B] leading-relaxed">
                The unified console for AI video and image generation. Built for creators who demand precision.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} className="flex flex-col gap-2.5">
                  <h4 className="text-[13px] font-semibold text-[#F8FAFC]">{title}</h4>
                  {links.map((link) => (
                    <Link key={link.label} href={link.href} className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">{link.label}</Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="h-px bg-[#1E293B] mb-6" />
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs text-[#475569]">
            <span>© 2026 imgvex.AI. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#64748B] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#64748B] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#64748B] transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
