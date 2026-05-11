"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { PricingCard } from "@/components/pricing-card";
import { CreditPackCard } from "@/components/credit-pack-card";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  Check,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Users,
  CreditCard,
  Wallet,
  Banknote,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const pricingTiersMonthly = [
  {
    tier: "free" as const,
    name: "Free",
    price: 0,
    period: "/month",
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
    period: "/month",
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
    period: "/month",
    features: [
      "800 credits / month",
      "4K output",
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
    period: "/month",
    features: [
      "2,500 credits / month",
      "Video Agent",
      "Multi-project workspace",
      "Priority support",
      "Everything in Pro",
    ],
  },
];

const pricingTiersYearly = [
  {
    tier: "free" as const,
    name: "Free",
    price: 0,
    period: "/month",
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
    price: 12,
    period: "/month",
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
    price: 24,
    period: "/month",
    features: [
      "800 credits / month",
      "4K output",
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
    price: 66,
    period: "/month",
    features: [
      "2,500 credits / month",
      "Video Agent",
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

const faqs = [
  {
    q: "What are credits and how do they work?",
    a: "Credits are our platform currency. Each generation consumes a specific amount of credits based on the model and resolution. Video generations typically cost 10-20 credits, while image generations cost 2-4 credits. Unused credits from subscriptions expire at the end of the billing cycle, but one-time credit packs never expire.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Yes! You can upgrade or downgrade your plan at any time. When you upgrade, you'll be charged a prorated amount for the remainder of your billing cycle. When you downgrade, the new rate takes effect at the start of your next billing cycle.",
  },
  {
    q: "Do credits from credit packs expire?",
    a: "No. One-time credit packs never expire. You can use them whenever you want, even if you cancel your subscription. They remain in your account until you use them.",
  },
  {
    q: "What happens if a generation fails?",
    a: "Failed generations are automatically refunded. The credits will be returned to your account within a few minutes. If you experience repeated failures, our support team is here to help.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes, we offer a 3-day money-back guarantee on all paid plans. If you're not satisfied, contact us within 3 days of your purchase for a full refund. Credit packs are non-refundable once credits have been used.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Alipay. For Enterprise plans, we also support wire transfers and invoicing.",
  },
];

const comparisonFeatures = [
  { name: "Credits per month", free: "10", starter: "300", pro: "800", studio: "2,500" },
  { name: "Video resolution", free: "480p", starter: "1080p", pro: "4K", studio: "4K" },
  { name: "Image resolution", free: "1024px", starter: "2048px", pro: "4096px", studio: "4096px" },
  { name: "Available models", free: "2", starter: "20+", pro: "20+", studio: "20+" },
  { name: "Concurrent jobs", free: "1", starter: "1", pro: "3", studio: "10" },
  { name: "Batch generation", free: false, starter: true, pro: true, studio: true },
  { name: "No watermark", free: false, starter: true, pro: true, studio: true },
  { name: "Priority queue", free: false, starter: true, pro: true, studio: true },
  { name: "API access", free: false, starter: false, pro: true, studio: true },
  { name: "Video Agent", free: false, starter: false, pro: false, studio: true },
  { name: "Copyright protection", free: false, starter: false, pro: true, studio: true },
  { name: "Support", free: "Community", starter: "Email", pro: "Priority", studio: "Dedicated" },
];

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-[#1E293B] rounded-2xl overflow-hidden bg-[#0F0F1A]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-sm font-medium text-[#F8FAFC]">{q}</span>
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
          <p className="text-sm text-[#94A3B8] leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tiers = isYearly ? pricingTiersYearly : pricingTiersMonthly;

  return (
    <div className="min-h-full bg-[#0B0817]">
      <Navbar variant="landing" />

      {/* Promotional Banner */}
      <div className="pt-[72px]">
        <div className="bg-gradient-to-r from-[#6366F1]/10 via-[#14B8A6]/10 to-[#6366F1]/10 border-b border-[#1E293B]">
          <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-[#CBD5E1]">
              Save up to <span className="text-[#F59E0B] font-semibold">20%</span> with annual billing
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 px-6 md:px-12">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col items-center gap-8 text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            <h1 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] tracking-[-0.02em]">
              Plans &amp; Pricing
            </h1>
            <p className="text-base text-[#94A3B8] max-w-[520px] mx-auto">
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </p>
          </motion.div>

          {/* Toggle */}
          <motion.div variants={fadeInUp} className="flex items-center gap-3">
            <span className={`text-sm font-medium ${!isYearly ? "text-[#F8FAFC]" : "text-[#64748B]"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-12 h-7 rounded-full bg-[#1E293B] border border-[#334155] transition-colors"
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-[#6366F1] shadow-md"
                animate={{ left: isYearly ? "22px" : "4px" }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.3 }}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? "text-[#F8FAFC]" : "text-[#64748B]"}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="px-2 py-0.5 rounded-full bg-[#14B8A6]/15 text-[#14B8A6] text-[10px] font-bold">
                Save 20%
              </span>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 md:px-12 pb-16">
        <motion.div
          className="max-w-[1200px] mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tiers.map((tier) => (
              <PricingCard key={tier.tier} {...tier} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="px-6 md:px-12 pb-16">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: Shield, label: "Secure Payments", desc: "256-bit SSL encryption" },
            { icon: Clock, label: "Auto Refund", desc: "Failed generations refunded" },
            { icon: Users, label: "12K+ Users", desc: "Trust imgvex.AI daily" },
            { icon: CreditCard, label: "Flexible Billing", desc: "Monthly or yearly" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#13101F] border border-[#1E293B] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#818CF8]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#F8FAFC]">{label}</p>
                <p className="text-xs text-[#64748B]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-6 md:px-12">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-2xl font-bold text-[#F8FAFC]">Compare Plans</h2>
            <p className="text-sm text-[#64748B] mt-1">Find the perfect plan for your workflow</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  <th className="text-left py-4 px-4 text-sm font-medium text-[#64748B]">Feature</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-[#F8FAFC]">Free</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-[#818CF8]">Starter</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-[#F8FAFC]">Pro</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-[#F8FAFC]">Studio</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, i) => (
                  <tr key={i} className="border-b border-[#1E293B]/50">
                    <td className="py-3.5 px-4 text-sm text-[#CBD5E1]">{feature.name}</td>
                    {["free", "starter", "pro", "studio"].map((tier) => {
                      const value = feature[tier as keyof typeof feature];
                      return (
                        <td key={tier} className="text-center py-3.5 px-4">
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="w-4 h-4 text-[#14B8A6] mx-auto" />
                            ) : (
                              <span className="text-[#334155] text-sm">—</span>
                            )
                          ) : (
                            <span className="text-sm text-[#CBD5E1]">{value as string}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </section>

      {/* Credit Packs */}
      <section className="py-16 px-6 md:px-12 bg-[#06060A]">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-[#F8FAFC]">One-Time Credit Packs</h2>
            <p className="text-sm text-[#64748B] max-w-[480px] mx-auto">
              Need more credits? Buy packs that never expire. Use them anytime, even after canceling your subscription.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[800px] mx-auto w-full">
            {creditPacks.map((pack) => (
              <CreditPackCard key={pack.credits} {...pack} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 md:px-12">
        <motion.div
          className="max-w-[720px] mx-auto flex flex-col gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="text-2xl font-bold text-[#F8FAFC]">Frequently Asked Questions</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                q={faq.q}
                a={faq.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Payment Methods */}
      <section className="py-12 px-6 md:px-12 border-t border-[#1E293B]">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4">
          <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium">Accepted Payment Methods</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#13101F] border border-[#1E293B]">
              <CreditCard className="w-4 h-4 text-[#64748B]" />
              <span className="text-xs text-[#94A3B8]">Visa</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#13101F] border border-[#1E293B]">
              <CreditCard className="w-4 h-4 text-[#64748B]" />
              <span className="text-xs text-[#94A3B8]">Mastercard</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#13101F] border border-[#1E293B]">
              <CreditCard className="w-4 h-4 text-[#64748B]" />
              <span className="text-xs text-[#94A3B8]">Amex</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#13101F] border border-[#1E293B]">
              <Wallet className="w-4 h-4 text-[#64748B]" />
              <span className="text-xs text-[#94A3B8]">PayPal</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#13101F] border border-[#1E293B]">
              <Banknote className="w-4 h-4 text-[#64748B]" />
              <span className="text-xs text-[#94A3B8]">Alipay</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-12">
        <motion.div
          className="max-w-[800px] mx-auto text-center flex flex-col items-center gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["bg-[#6366F1]", "bg-[#14B8A6]", "bg-[#F59E0B]", "bg-[#EC4899]"].map((color, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${color} border-2 border-[#0B0817] flex items-center justify-center text-[10px] font-bold text-white`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm text-[#64748B]">Join 12,000+ creators</span>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
              Ready to Create?
            </h2>
            <p className="text-base text-[#94A3B8] max-w-[440px] mx-auto">
              Start with our free plan and upgrade when you need more power. No credit card required.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-6 h-11"
              asChild
            >
              <Link href="/generate">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Start Creating Free
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="text-sm font-medium text-[#818CF8] hover:text-[#818CF8] hover:bg-transparent"
              asChild
            >
              <Link href="/dashboard">View Dashboard →</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-[#1E293B]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#475569]">
          <span>© 2026 imgvex.AI. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[#64748B] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#64748B] transition-colors">Terms</Link>
            <Link href="#" className="hover:text-[#64748B] transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
