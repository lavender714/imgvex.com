"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PricingCard } from "@/components/pricing-card";
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
    tier: "lite" as const,
    name: "Lite",
    price: 15,
    originalPrice: 15,
    period: "/month",
    features: [
      "300 credits / month",
      "720p output",
      "Starter models only",
      "2 concurrent jobs",
      "Watermarked outputs",
      "Community support",
    ],
  },
  {
    tier: "pro" as const,
    name: "Pro",
    price: 29,
    originalPrice: 29,
    period: "/month",
    features: [
      "800 credits / month",
      "1080p output",
      "All 20+ models",
      "4 concurrent jobs",
      "No watermark",
      "Commercial license",
      "Priority support",
    ],
  },
  {
    tier: "ultra" as const,
    name: "Ultra",
    price: 139,
    originalPrice: 139,
    period: "/month",
    features: [
      "5,000 credits / month",
      "4K output",
      "All 20+ models + Unlimited",
      "6 concurrent jobs",
      "No watermark",
      "Commercial license",
      "Dedicated support",
    ],
  },
];

const pricingTiersYearly = [
  {
    tier: "lite" as const,
    name: "Lite",
    price: 10,
    originalPrice: 15,
    period: "/month",
    features: [
      "300 credits / month",
      "720p output",
      "Starter models only",
      "2 concurrent jobs",
      "Watermarked outputs",
      "Community support",
    ],
  },
  {
    tier: "pro" as const,
    name: "Pro",
    price: 14.5,
    originalPrice: 29,
    period: "/month",
    features: [
      "800 credits / month",
      "1080p output",
      "All 20+ models",
      "4 concurrent jobs",
      "No watermark",
      "Commercial license",
      "Priority support",
    ],
    discountLabel: "-50%",
  },
  {
    tier: "ultra" as const,
    name: "Ultra",
    price: 109,
    originalPrice: 139,
    period: "/month",
    features: [
      "5,000 credits / month",
      "4K output",
      "All 20+ models + Unlimited",
      "6 concurrent jobs",
      "No watermark",
      "Commercial license",
      "Dedicated support",
    ],
    discountLabel: "-22%",
  },
];

const faqs = [
  {
    q: "What are credits and how do they work?",
    a: "Credits are our platform currency. Each generation consumes a specific amount of credits based on the model. Images cost 2-9 credits, videos cost 6-165 credits depending on the model. Unused credits from subscriptions expire at the end of the billing cycle.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Yes! You can upgrade or downgrade your plan at any time. When you upgrade, you'll be charged a prorated amount for the remainder of your billing cycle. When you downgrade, the new rate takes effect at the start of your next billing cycle.",
  },
  {
    q: "What happens if a generation fails?",
    a: "Failed generations are automatically refunded. The credits will be returned to your account within a few minutes. If you experience repeated failures, contact our support team at support@imgvex.com.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes, we offer a 3-day money-back guarantee on all paid plans. If you're not satisfied, contact us within 3 days of your purchase for a full refund.",
  },
  {
    q: "Why do some models cost more credits?",
    a: "Different models have different compute costs. High-end video models like Seedance 2.0 and Sora 2 Pro require significantly more GPU resources than image models like GPT Image 2.0. We pass these costs through transparently so you only pay for what you use.",
  },
];

const comparisonFeatures = [
  { name: "Credits per month", lite: "300", pro: "800", ultra: "5,000" },
  { name: "Video resolution", lite: "720p", pro: "1080p", ultra: "4K" },
  { name: "Image resolution", lite: "1024px", pro: "2048px", ultra: "4096px" },
  { name: "Available models", lite: "Starter only", pro: "All 20+", ultra: "All 20+ + Unlimited" },
  { name: "Concurrent jobs", lite: "2", pro: "4", ultra: "6" },
  { name: "No watermark", lite: false, pro: true, ultra: true },
  { name: "Commercial license", lite: false, pro: true, ultra: true },
  { name: "Priority support", lite: false, pro: true, ultra: true },
  { name: "Dedicated support", lite: false, pro: false, ultra: true },
  { name: "Support", lite: "Community", pro: "Priority", ultra: "Dedicated" },
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
  const [isYearly, setIsYearly] = useState(true);
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
              Save up to <span className="text-[#F59E0B] font-semibold">50%</span> with annual billing
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
              Get 25 free credits on sign up. Upgrade to Pro when you need more power. No hidden fees, cancel anytime.
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
              <span className="px-2 py-0.5 rounded-full bg-[#EC4899]/15 text-[#EC4899] text-[10px] font-bold">
                Save up to 50%
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
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  <th className="text-center py-4 px-4 text-sm font-semibold text-[#F8FAFC]">Lite</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-[#EC4899]">Pro</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-[#F8FAFC]">Ultra</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, i) => (
                  <tr key={i} className="border-b border-[#1E293B]/50">
                    <td className="py-3.5 px-4 text-sm text-[#CBD5E1]">{feature.name}</td>
                    {["lite", "pro", "ultra"].map((tier) => {
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
          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC]">
              Ready to Create?
            </h2>
            <p className="text-base text-[#94A3B8] max-w-[440px] mx-auto">
              Get 25 free credits on sign up. Upgrade to Pro when you need more power.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-6 h-11"
              asChild
            >
              <Link href="/generate">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Start Creating
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

      <Footer />
    </div>
  );
}
