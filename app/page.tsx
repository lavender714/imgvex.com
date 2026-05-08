"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { ModelCard } from "@/components/model-card";
import { FeatureCard } from "@/components/feature-card";
import { PricingCard } from "@/components/pricing-card";
import { CreditPackCard } from "@/components/credit-pack-card";
import { motion } from "framer-motion";

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

const pricingTiers = [
  {
    tier: "free" as const,
    name: "Free",
    price: 0,
    period: "forever",
    features: [
      "10 credits / month",
      "480p output (watermarked)",
      "2 starter models",
      "Community support",
    ],
  },
  {
    tier: "starter" as const,
    name: "Starter",
    price: 15,
    features: [
      "300 credits / month",
      "1080p output",
      "All 20+ models",
      "Batch generation",
      "Priority queue",
      "No watermark",
    ],
  },
  {
    tier: "pro" as const,
    name: "Pro · Most Popular",
    price: 29,
    features: [
      "800 credits / month + 4K",
      "3 concurrent jobs",
      "Copyright protection",
      "API access + Webhooks",
      "Everything in Starter",
    ],
    isPopular: true,
  },
  {
    tier: "studio" as const,
    name: "Studio",
    price: 79,
    features: [
      "2,500 credits + Video Agent",
      "Multi-project workspace",
      "Priority support",
      "Everything in Pro",
    ],
  },
];

const creditPacks = [
  { credits: 2000, price: 19 },
  { credits: 10000, price: 79 },
  { credits: 50000, price: 349 },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  return (
    <div className="min-h-full bg-[#0B0817]">
      <Navbar variant="landing" />

      {/* Hero Section */}
      <section className="relative pt-[72px] flex flex-col items-center justify-center min-h-[720px] px-6">
        {/* Glow Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
          />
        </div>

        <motion.div
          className="relative flex flex-col items-center gap-6 max-w-[900px] text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-[56px] font-bold text-[#F8FAFC] leading-[1.1] tracking-[-0.03em]"
          >
            One Console. Every AI Model.
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-[#94A3B8] max-w-[720px] leading-relaxed"
          >
            Generate stunning videos and images with 20+ leading AI models — all from a single, powerful workspace. No more switching tabs. No more comparing prices.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-2">
            <Button
              className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold px-6 py-3 h-auto text-sm"
              asChild
            >
              <Link href="/generate">Start Creating Free</Link>
            </Button>
            <Button
              className="rounded-full bg-[#13131F] border border-[#1E293B] text-[#F8FAFC] hover:bg-[#1E293B] font-semibold px-6 py-3 h-auto text-sm"
              asChild
            >
              <Link href="#models">View Models</Link>
            </Button>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-2">
            {["Trusted by 12,000+ creators", "No credit card required", "Free 2 generations"].map((text, i) => (
              <span key={i} className="flex items-center gap-4 text-[13px] text-[#64748B]">
                {text}
                {i < 2 && <span className="text-[#475569]">•</span>}
              </span>
            ))}
          </motion.div>

          {/* Mini Generator Card */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 w-full max-w-[720px]"
          >
            <div className="rounded-[20px] bg-[#13101F] border border-[#1E293B] p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#6366f11f] flex items-center justify-center text-sm font-bold text-[#818CF8]">
                  K
                </div>
                <span className="text-sm font-medium text-[#CBD5E1]">Kling 2.0</span>
                <span className="text-xs text-[#64748B]">Video • 1080p</span>
              </div>
              <div className="relative">
                <textarea
                  readOnly
                  className="w-full h-[80px] rounded-xl bg-[#0F0F1A] border border-[#1E293B] p-4 text-sm text-[#CBD5E1] resize-none outline-none"
                  value="A cinematic drone shot flying over a misty mountain valley at golden hour..."
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className="text-[11px] text-[#64748B]">0 / 500</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-[#13131F] border border-[#1E293B] text-xs text-[#CBD5E1]">5s</span>
                  <span className="px-3 py-1.5 rounded-full bg-[#13131F] border border-[#1E293B] text-xs text-[#CBD5E1]">16:9</span>
                  <span className="px-3 py-1.5 rounded-full bg-[#13131F] border border-[#1E293B] text-xs text-[#CBD5E1]">1080p</span>
                </div>
                <Button className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-5 h-9">
                  Generate — 10 credits
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Model Showcase */}
      <section id="models" className="py-[100px] px-6 md:px-12">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col items-center gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center max-w-[700px] flex flex-col gap-3">
            <h2 className="text-4xl font-bold text-[#F8FAFC]">All Your Models. One Place.</h2>
            <p className="text-base text-[#94A3B8] leading-relaxed">
              Access the world&apos;s best video and image generation models without juggling multiple subscriptions.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {models.map((model) => (
              <ModelCard key={model.id} {...model} />
            ))}
          </motion.div>
          <motion.div variants={fadeInUp} className="flex items-center gap-2">
            <span className="text-sm text-[#64748B]">And 15+ more models</span>
            <Link href="#" className="text-sm font-medium text-[#818CF8] hover:underline">See Full List →</Link>
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

      {/* Pricing Section */}
      <section id="pricing" className="py-[100px] px-6 md:px-12">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col items-center gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center max-w-[700px] flex flex-col gap-3">
            <h2 className="text-4xl font-bold text-[#F8FAFC]">Simple, Transparent Pricing</h2>
            <p className="text-base text-[#94A3B8] leading-relaxed">Start free. Scale when you&apos;re ready. No hidden fees.</p>
          </motion.div>

          {/* Subscription Tiers */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.tier} {...tier} />
            ))}
          </motion.div>

          {/* Credit Packs */}
          <motion.div variants={fadeInUp} className="w-full flex flex-col gap-6">
            <div className="text-center flex flex-col gap-1">
              <h3 className="text-xl font-semibold text-[#F8FAFC]">One-Time Credit Packs</h3>
              <p className="text-sm text-[#94A3B8]">Buy credits that never expire. Use them anytime, even after canceling your subscription.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[800px] mx-auto w-full">
              {creditPacks.map((pack) => (
                <CreditPackCard key={pack.credits} {...pack} />
              ))}
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#64748B]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
              Failed generations auto-refunded
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
              3-day money-back guarantee
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
              Cancel anytime
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 md:px-12 bg-[#040408]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-8">
            <div className="max-w-[300px]">
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">Synapse</h3>
              <p className="text-[13px] text-[#64748B] leading-relaxed">The unified console for AI video and image generation. Built for creators who demand precision.</p>
            </div>
            <div className="flex gap-16">
              {[
                { title: "Product", links: ["Features", "Pricing", "Models"] },
                { title: "Resources", links: ["Documentation", "API Reference", "Changelog"] },
                { title: "Company", links: ["About", "Blog", "Contact"] },
              ].map((col) => (
                <div key={col.title} className="flex flex-col gap-2.5">
                  <h4 className="text-[13px] font-semibold text-[#F8FAFC]">{col.title}</h4>
                  {col.links.map((link) => (
                    <a key={link} href="#" className="text-[13px] text-[#64748B] hover:text-[#94A3B8] transition-colors">{link}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="h-px bg-[#1E293B] mb-6" />
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs text-[#475569]">
            <span>© 2026 Synapse. All rights reserved.</span>
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
