"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address.");
      setIsError(true);
      return;
    }
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
    });

    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else {
      setMessage("Check your email for a password reset link.");
      setIsError(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0817] flex items-center justify-center p-8">
      <div className="w-full max-w-[420px] flex flex-col gap-6">
        <div className="text-center mb-2">
          <Link href="/" className="text-2xl font-bold text-[#F8FAFC]">imgvex.AI</Link>
        </div>
        <div className="bg-[#13131F] border border-[#1E293B] rounded-[20px] p-10 flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-[#F8FAFC]">Reset Password</h1>
            <p className="text-sm text-[#64748B] mt-1">Enter your email and we&apos;ll send you a reset link</p>
          </div>

          {message && (
            <div className={`text-xs text-center py-2 px-3 rounded-lg ${isError ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-[14px] bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-[15px] disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link href="/auth" className="text-sm text-[#818CF8] hover:underline">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
