"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setIsLoading(false);
      setErrorMsg(error.message);
    }
  };

  const signInWithGitHub = async () => {
    setIsLoading(true);
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setIsLoading(false);
      setErrorMsg(error.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    const supabase = createClient();

    if (tab === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Check your email for a confirmation link!");
      }
      setIsLoading(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
      } else {
        window.location.href = "/dashboard";
      }
    }
  };

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
          <h1 className="text-[42px] font-bold text-[#F8FAFC]">imgvex.AI</h1>
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
              <button
                onClick={signInWithGoogle}
                disabled={isLoading}
                className="h-11 rounded-xl bg-[#13131F] border border-[#1E293B] flex items-center justify-center gap-3 text-sm font-medium text-[#F8FAFC] hover:bg-[#1E293B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-[#64748B] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-base font-bold">G</span>
                )}
                {isLoading ? "Redirecting..." : "Continue with Google"}
              </button>
              <button
                onClick={signInWithGitHub}
                disabled={isLoading}
                className="h-11 rounded-xl bg-[#13131F] border border-[#1E293B] flex items-center justify-center gap-3 text-sm font-medium text-[#F8FAFC] hover:bg-[#1E293B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-[#64748B] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                )}
                {isLoading ? "Redirecting..." : "Continue with GitHub"}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1E293B]" />
              <span className="text-xs text-[#64748B]">or</span>
              <div className="flex-1 h-px bg-[#1E293B]" />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className={`text-xs text-center py-2 px-3 rounded-lg ${errorMsg.includes("Check your email") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                {errorMsg}
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[#CBD5E1]">Email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-[#0F0F1A] border-[#1E293B] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#475569] focus:border-[#475569] focus:ring-0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[#CBD5E1]">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-11 bg-[#0F0F1A] border-[#1E293B] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#475569] focus:border-[#475569] focus:ring-0 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#818CF8] hover:text-[#6366F1]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {tab === "signin" && (
                <div className="flex justify-end">
                  <Link href="/auth/reset-password" className="text-xs text-[#818CF8] hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-[14px] bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-[15px] disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : tab === "signin" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
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
