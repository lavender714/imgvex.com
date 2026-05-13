"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SignInButtonProps {
  provider: "google";
  redirectTo?: string;
}

export function SignInButton({ provider, redirectTo }: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo ?? `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error(`${provider} OAuth error:`, error);
      setIsLoading(false);
      setErrorMsg(error.message);
      return;
    }
    if (data?.url) {
      window.location.href = data.url;
    } else {
      setIsLoading(false);
      setErrorMsg("No redirect URL returned.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className="h-11 rounded-xl bg-[#13131F] border border-[#1E293B] flex items-center justify-center gap-3 text-sm font-medium text-[#F8FAFC] hover:bg-[#1E293B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-[#64748B] border-t-transparent rounded-full animate-spin" />
        ) : provider === "google" ? (
          <span className="text-base font-bold">G</span>
        ) : null}
        {isLoading ? "Redirecting..." : `Continue with ${provider === "google" ? "Google" : provider}`}
      </button>
      {errorMsg && (
        <p className="text-xs text-red-400 text-center">{errorMsg}</p>
      )}
    </div>
  );
}
