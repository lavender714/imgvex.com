"use client";

import Link from "next/link";
import { Coins } from "lucide-react";

interface CreditPillProps {
  credits: number;
}

export function CreditPill({ credits }: CreditPillProps) {
  return (
    <Link
      href="/dashboard/billing"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(20,184,166,0.08)] border border-[rgba(20,184,166,0.15)] hover:bg-[rgba(20,184,166,0.12)] transition-colors"
    >
      <Coins className="w-3.5 h-3.5 text-[#14B8A6]" />
      <span className="text-xs font-semibold text-[#14B8A6]">{credits} credits</span>
    </Link>
  );
}
