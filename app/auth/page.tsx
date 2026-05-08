"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen bg-[#0B0817] flex relative overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, transparent 40%, transparent 60%, rgba(236,72,153,0.1) 100%)",
        }}
      />

      {/* Left: Brand */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-16 gap-8 relative overflow-hidden">
        <div
          className="absolute top-[100px] left-[200px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }}
        />
        <div className="relative flex flex-col items-center gap-6 max-w-[400px] text-center">
          <h1 className="text-[42px] font-bold text-[#F8FAFC]">Synapse</h1>
          <p className="text-base text-[#94A3B8] leading-relaxed">
            The unified console for AI video and image generation. One account, every model.
          </p>
          <div className="flex gap-10">
            {[
              { value: "20+", label: "AI Models" },
              { value: "12K+", label: "Creators" },
              { value: "1M+", label: "Generations" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-[28px] font-bold text-[#F8FAFC]">{stat.value}</span>
                <span className="text-xs text-[#64748B]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-[#0A0A12] relative">
        <div className="w-full max-w-[420px] flex flex-col gap-6">
          <div className="bg-[#13131F] border border-[#1E293B] rounded-[20px] p-10 flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex gap-0 bg-[#0F0F1A] rounded-xl p-1">
              <button
                onClick={() => setTab("signin")}
                className={`flex-1 h-11 rounded-lg text-sm font-semibold transition-colors ${
                  tab === "signin"
                    ? "bg-[#6366F1] text-white"
                    : "text-[#64748B] hover:text-[#CBD5E1]"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab("signup")}
                className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors ${
                  tab === "signup"
                    ? "bg-[#6366F1] text-white"
                    : "text-[#64748B] hover:text-[#CBD5E1]"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Social Login */}
            <div className="flex flex-col gap-3">
              <button className="h-11 rounded-xl bg-[#13131F] border border-[#1E293B] flex items-center justify-center gap-3 text-sm font-medium text-[#F8FAFC] hover:bg-[#1E293B] transition-colors">
                <span className="text-base font-bold">G</span>
                Continue with Google
              </button>
              <button className="h-11 rounded-xl bg-[#13131F] border border-[#1E293B] flex items-center justify-center gap-3 text-sm font-medium text-[#F8FAFC] hover:bg-[#1E293B] transition-colors">
                <span className="text-base font-bold">⌘</span>
                Continue with GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1E293B]" />
              <span className="text-xs text-[#64748B]">or</span>
              <div className="flex-1 h-px bg-[#1E293B]" />
            </div>

            {/* Email Form */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[#CBD5E1]">Email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 bg-[#0F0F1A] border-[#1E293B] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#475569] focus:border-[#475569] focus:ring-0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[#CBD5E1]">Password</label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-11 bg-[#0F0F1A] border-[#1E293B] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#475569] focus:border-[#475569] focus:ring-0 pr-16"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#818CF8] hover:text-[#6366F1]">
                    Show
                  </button>
                </div>
              </div>
              {tab === "signin" && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs text-[#818CF8] hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button className="w-full h-12 rounded-[14px] bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-[15px]">
              {tab === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </div>

          {/* Anonymous hint */}
          <div className="flex items-center justify-center gap-2 py-4">
            <span className="text-[13px] text-[#64748B]">Want to try first?</span>
            <Link href="/generate" className="text-[13px] font-medium text-[#818CF8] hover:underline">
              Generate 2 videos for free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
