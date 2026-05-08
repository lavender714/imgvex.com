"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Layers } from "lucide-react";

interface GenerateButtonProps {
  creditCost: number;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function GenerateButton({
  creditCost,
  isLoading = false,
  disabled = false,
  onClick,
}: GenerateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full h-[52px] rounded-full font-semibold text-[15px] transition-all ${
        disabled
          ? "bg-[#1E293B] text-[#475569] cursor-not-allowed"
          : "bg-[#6366F1] hover:bg-[#4F52E6] text-white"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4" />
          <span>Generate</span>
          <div className="w-px h-4 bg-white/25" />
          <span className="text-sm font-mono">{creditCost}</span>
          <Layers className="w-3.5 h-3.5 opacity-70" />
        </div>
      )}
    </Button>
  );
}
