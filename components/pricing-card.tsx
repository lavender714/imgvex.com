"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PricingCardProps {
  tier: "lite" | "pro" | "ultra";
  name: string;
  price: number;
  originalPrice?: number;
  period?: string;
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
  onSelect?: () => void;
}

const tierStyles = {
  lite: {
    border: "border-[#1E293B]",
    buttonBg: "bg-[#13131F]",
    buttonBorder: "border border-[#1E293B]",
    buttonText: "text-[#F8FAFC]",
    buttonHover: "hover:bg-[#1E293B]",
  },
  pro: {
    border: "border-2 border-[#EC4899]",
    buttonBg: "bg-[#EC4899]",
    buttonBorder: "",
    buttonText: "text-white",
    buttonHover: "hover:bg-[#DB2777]",
  },
  ultra: {
    border: "border-[#1E293B]",
    buttonBg: "bg-[#13131F]",
    buttonBorder: "border border-[#1E293B]",
    buttonText: "text-[#F8FAFC]",
    buttonHover: "hover:bg-[#1E293B]",
  },
};

export function PricingCard({
  tier,
  name,
  price,
  originalPrice,
  period = "/month",
  features,
  isPopular,
  isCurrent,
  onSelect,
}: PricingCardProps) {
  const styles = tierStyles[tier];

  return (
    <div
      className={`relative flex flex-col gap-0 p-8 rounded-[20px] bg-[#0F0F1A] border ${styles.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-[rgba(236,72,153,0.15)] text-[#EC4899] border-0 text-[11px] font-semibold px-2.5 py-0.5">
            Most Popular
          </Badge>
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-[rgba(20,184,166,0.15)] text-[#14B8A6] border-0 text-[11px] font-semibold px-2.5 py-0.5">
            Current Plan
          </Badge>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[#64748B]">{name}</p>
        <div className="flex items-end gap-2">
          <span className="text-[40px] font-bold text-[#F8FAFC] leading-none">
            ${price}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-lg text-[#64748B] line-through mb-1.5">
              ${originalPrice}
            </span>
          )}
          <span className="text-sm text-[#64748B] mb-1.5">{period}</span>
        </div>
      </div>
      <div className="h-px bg-[#1E293B] my-4" />
      <ul className="flex flex-col gap-3 py-4 flex-1">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[#CBD5E1]">
            <Check className="w-4 h-4 text-[#14B8A6] mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`w-full h-12 rounded-[14px] font-semibold text-[15px] ${styles.buttonBg} ${styles.buttonBorder} ${styles.buttonText} ${styles.buttonHover}`}
        onClick={onSelect}
      >
        {isCurrent ? "Current Plan" : tier === "pro" ? "Upgrade to Pro" : tier === "ultra" ? "Go Ultra" : "Get Started"}
      </Button>
    </div>
  );
}
