"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CreemPortal } from "@creem_io/nextjs";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  CreditCard,
  Calendar,
  Coins,
  ArrowRight,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface BillingProfile {
  plan_tier: string;
  credits_balance: number;
  credits_monthly: number;
  plan_ends_at: string | null;
  creem_customer_id: string | null;
  creem_subscription_id: string | null;
}

const TIER_LABELS: Record<string, { name: string; color: string; description: string }> = {
  free: { name: "Free", color: "#64748B", description: "25 starter credits, no auto-renewal" },
  lite: { name: "Lite", color: "#14B8A6", description: "300 credits / month, starter models" },
  pro: { name: "Pro", color: "#6366F1", description: "800 credits / month, all 20+ models" },
  ultra: { name: "Ultra", color: "#EC4899", description: "5,000 credits / month, unlimited usage" },
};

export default function BillingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<BillingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth?next=/dashboard/billing");
      return;
    }

    let cancelled = false;
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("plan_tier, credits_balance, credits_monthly, plan_ends_at, creem_customer_id, creem_subscription_id")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("[billing] Failed to fetch profile:", error);
      }
      setProfile((data as BillingProfile | null) ?? null);
      setIsLoading(false);
    };
    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-full bg-[#0B0817]">
        <Navbar variant="app" />
        <div className="pt-[72px] flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 text-[#64748B] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const tier = TIER_LABELS[profile?.plan_tier ?? "free"] ?? TIER_LABELS.free;
  const isPaid = profile?.plan_tier && profile.plan_tier !== "free";
  const hasCreemCustomer = Boolean(profile?.creem_customer_id);

  const formatDate = (iso: string | null) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="min-h-full bg-[#0B0817]">
      <Navbar variant="app" />

      <main className="pt-[88px] px-6 md:px-12 pb-16">
        <motion.div
          className="max-w-[960px] mx-auto flex flex-col gap-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold text-[#F8FAFC]">Billing</h1>
            <p className="text-sm text-[#94A3B8]">
              Manage your subscription, view your plan, and update payment details.
            </p>
          </div>

          {/* Current plan card */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#0F0F1A] border border-[#1E293B]">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Current plan
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-3xl font-bold" style={{ color: tier.color }}>
                    {tier.name}
                  </h2>
                  {isPaid && (
                    <span className="px-2 py-0.5 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-[10px] font-bold uppercase text-[#14B8A6]">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#94A3B8]">{tier.description}</p>
              </div>

              {isPaid && hasCreemCustomer ? (
                <CreemPortal customerId={profile!.creem_customer_id!} portalPath="/api/portal">
                  <Button className="rounded-full bg-[#13101F] border border-[#1E293B] hover:bg-[#1E293B] text-[#F8FAFC] font-semibold text-sm px-5 h-10 inline-flex items-center gap-1.5">
                    Manage Subscription
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </CreemPortal>
              ) : (
                <Button
                  className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm px-5 h-10"
                  asChild
                >
                  <Link href="/pricing">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Choose a plan
                  </Link>
                </Button>
              )}
            </div>

            {/* Stats row */}
            <div className="mt-8 pt-6 border-t border-[#1E293B] grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Stat
                icon={Coins}
                label="Credits remaining"
                value={`${profile?.credits_balance ?? 0}`}
                accent="#14B8A6"
              />
              <Stat
                icon={CreditCard}
                label="Monthly allowance"
                value={
                  profile?.credits_monthly && profile.credits_monthly > 0
                    ? `${profile.credits_monthly}`
                    : "—"
                }
                accent="#6366F1"
              />
              <Stat
                icon={Calendar}
                label="Renews / expires on"
                value={formatDate(profile?.plan_ends_at ?? null)}
                accent="#F59E0B"
              />
            </div>
          </div>

          {/* Help / change plan row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/pricing"
              className="flex items-center justify-between p-5 rounded-2xl bg-[#0F0F1A] border border-[#1E293B] hover:border-[#334155] transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-[#F8FAFC]">Change plan</span>
                <span className="text-xs text-[#64748B]">
                  Upgrade, downgrade, or switch billing period
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#64748B]" />
            </Link>
            <a
              href="mailto:support@imgvex.com?subject=Billing%20Question"
              className="flex items-center justify-between p-5 rounded-2xl bg-[#0F0F1A] border border-[#1E293B] hover:border-[#334155] transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-[#F8FAFC]">Need help?</span>
                <span className="text-xs text-[#64748B]">
                  Email support — we respond within 3 business days
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#64748B]" />
            </a>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${accent}1a`, border: `1px solid ${accent}33` }}
      >
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-[#64748B]">{label}</span>
        <span className="text-lg font-bold text-[#F8FAFC]">{value}</span>
      </div>
    </div>
  );
}
