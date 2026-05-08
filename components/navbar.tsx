"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditPill } from "@/components/credit-pill";

interface NavbarProps {
  variant?: "landing" | "app";
  credits?: number;
}

export function Navbar({ variant = "landing", credits = 48 }: NavbarProps) {
  if (variant === "app") {
    return (
      <header className="h-[60px] border-b border-[#1E293B] bg-[#06060A] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-[#F8FAFC]">Synapse</Link>
          <div className="w-px h-6 bg-[#1E293B]" />
          <Link href="/generate" className="text-sm font-medium text-[#F8FAFC]">Generate</Link>
          <Link href="/dashboard" className="text-sm font-medium text-[#64748B] hover:text-[#F8FAFC] transition-colors">Dashboard</Link>
        </div>
        <div className="flex items-center gap-4">
          <CreditPill credits={credits} />
          <div className="w-9 h-9 rounded-full bg-[#6366F1] flex items-center justify-center text-sm font-semibold text-white cursor-pointer hover:bg-[#4F52E6] transition-colors">
            JD
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-[#06060A]/85 backdrop-blur-md border-b border-[#1E293B]/50">
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6 lg:px-12">
        <Link href="/" className="text-[22px] font-bold text-[#F8FAFC]">Synapse</Link>
        <nav className="hidden md:flex items-center gap-2">
          {["Features", "Models", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-sm font-medium text-[#818CF8] hover:text-[#818CF8] hover:bg-transparent"
            asChild
          >
            <Link href="/auth">Sign In</Link>
          </Button>
          <Button
            className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold px-5 py-2 text-sm"
            asChild
          >
            <Link href="/generate">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
