"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Infinity } from "lucide-react";

interface CreditPackCardProps {
  credits: number;
  price: number;
  popular?: boolean;
  onSelect?: () => void;
}

export function CreditPackCard({ credits, price, popular, onSelect }: CreditPackCardProps) {
  const isPopular = popular ?? false;

  return (
    <div
      className={`relative flex flex-col gap-4 p-6 rounded-2xl bg-[#0F0F1A] border ${
        isPopular ? "border-2 border-[#6366F1]" : "border-[#1E293B]"
      } transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-[rgba(99,102,241,0.15)] text-[#818CF8] border-0 text-[11px] font-semibold px-2.5 py-0.5">
            Best Value
          </Badge>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#F8FAFC]">
            {credits >= 1000 ? `${credits / 1000}K` : credits}
          </span>
          <span className="text-sm text-[#64748B]">credits</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[28px] font-bold text-[#F8FAFC]">${price}</span>
          <span className="text-sm text-[#64748B]">one-time</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[#14B8A6]">
        <Infinity className="w-3.5 h-3.5" />
        <span>Never expires</span>
      </div>
      <Button
        className={`w-full h-11 rounded-xl font-semibold text-sm ${
          isPopular
            ? "bg-[#6366F1] hover:bg-[#4F52E6] text-white"
            : "bg-[#13131F] hover:bg-[#1E293B] text-[#F8FAFC] border border-[#1E293B]"
        }`}
        onClick={onSelect}
      >
        Purchase
      </Button>
    </div>
  );
}
