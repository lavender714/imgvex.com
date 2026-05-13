"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditPill } from "@/components/credit-pill";
import {
  ChevronDown,
  Image,
  Video,
  Layers,
  Zap,
  Clock,
  Sparkles,
  Music,
  User,
  Wand2,
  Eye,
  Link2,
  Paintbrush,
  Clapperboard,
  Copy,
  Type,
  Brush,
  Scissors,
  Film,
  Mic,
  MessageSquare,
  Newspaper,
  BarChart3,
} from "lucide-react";

interface NavbarProps {
  variant?: "landing" | "app";
  credits?: number;
}

/* ─── Dropdown Data ─── */

type DropdownItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  desc?: string;
};

type DropdownSection = {
  label: string;
  href?: string;
  items: DropdownItem[];
};

const dropdownMenus: DropdownSection[] = [
  {
    label: "Apps",
    items: [
      { icon: Film, label: "Clone Viral Video", href: "#", desc: "Recreate trending content" },
      { icon: BarChart3, label: "UGC Video Ads", href: "#", desc: "Product-focused creatives" },
      { icon: Sparkles, label: "Anime Video", href: "#", desc: "Stylized animation" },
      { icon: Newspaper, label: "Story Video", href: "#", desc: "Narrative sequences" },
      { icon: Music, label: "Music Video", href: "#", desc: "Sync visuals to audio" },
      { icon: Mic, label: "News Video", href: "#", desc: "Automated news content" },
    ],
  },
  {
    label: "Video AI",
    items: [
      { icon: Image, label: "Image to Video", href: "/tools/image-to-video", desc: "Animate any photo" },
      { icon: Video, label: "Text to Video", href: "/tools/text-to-video", desc: "Prompt-to-video generation" },
      { icon: Layers, label: "Video to Video", href: "/tools/video-to-video", desc: "Transform existing footage" },
      { icon: Zap, label: "Video Transition", href: "#", desc: "Seamless scene changes" },
      { icon: Clock, label: "Video Extend", href: "#", desc: "Expand video length" },
      { icon: Sparkles, label: "One-Click Video", href: "#", desc: "Instant generation" },
      { icon: Music, label: "Music to Video", href: "#", desc: "Audio-driven visuals" },
    ],
  },
  {
    label: "Image AI",
    items: [
      { icon: Type, label: "Text to Image", href: "/tools/text-to-image", desc: "Prompt-to-image creation" },
      { icon: Copy, label: "Image to Image", href: "/tools/image-to-image", desc: "Restyle & transform" },
      { icon: Brush, label: "AI Photo Editor", href: "#", desc: "Smart editing tools" },
      { icon: Scissors, label: "Background Remover", href: "#", desc: "Clean cutouts" },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { icon: User, label: "AI Avatar", href: "#", desc: "Digital personas" },
      { icon: Wand2, label: "Lip Sync", href: "#", desc: "Perfect audio matching" },
      { icon: Eye, label: "Motion Control", href: "#", desc: "Direct camera movement" },
      { icon: Paintbrush, label: "Video Style Transform", href: "#", desc: "Apply artistic styles" },
      { icon: Clapperboard, label: "Video Effects", href: "#", desc: "Cinematic filters" },
      { icon: Link2, label: "Reference To Video", href: "#", desc: "Reference-based generation" },
    ],
  },
];

/* ─── Dropdown Component ─── */

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: DropdownItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors duration-200">
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="w-[280px] rounded-2xl bg-[#0F0F1A] border border-[#1E293B] shadow-2xl shadow-black/50 py-2 overflow-hidden">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-start gap-3 px-4 py-3 hover:bg-[rgba(99,102,241,0.08)] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#13101F] border border-[#1E293B] flex items-center justify-center shrink-0 group-hover:border-[#475569] transition-colors">
                  <item.icon className="w-4 h-4 text-[#64748B] group-hover:text-[#818CF8] transition-colors" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium text-[#F8FAFC] truncate">
                    {item.label}
                  </span>
                  {item.desc && (
                    <span className="text-xs text-[#64748B] truncate">{item.desc}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Navbar ─── */

export function Navbar({ variant = "landing", credits = 48 }: NavbarProps) {
  if (variant === "app") {
    return (
      <header className="h-[60px] border-b border-[#1E293B] bg-[#06060A] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-[#F8FAFC]">imgvex.AI</Link>
          <div className="w-px h-6 bg-[#1E293B]" />
          <Link href="/generate" className="text-sm font-medium text-[#F8FAFC]">Generate</Link>
          <Link href="/tools/image-to-video" className="text-sm font-medium text-[#64748B] hover:text-[#F8FAFC] transition-colors">Tools</Link>
          <Link href="/dashboard" className="text-sm font-medium text-[#64748B] hover:text-[#F8FAFC] transition-colors">Dashboard</Link>
          <Link href="/pricing" className="text-sm font-medium text-[#64748B] hover:text-[#F8FAFC] transition-colors">Pricing</Link>
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
        <Link href="/" className="text-[22px] font-bold text-[#F8FAFC]">imgvex.AI</Link>

        <nav className="hidden md:flex items-center gap-1">
          {/* Agent — highlighted */}
          <Link
            href="/generate"
            className="px-3 py-2 text-sm font-medium text-[#EC4899] hover:text-[#F472B6] transition-colors duration-200"
          >
            Agent
          </Link>

          {/* Dropdown menus */}
          {dropdownMenus.map((menu) => (
            <NavDropdown key={menu.label} label={menu.label} items={menu.items} />
          ))}

          {/* Plain links */}
          <Link
            href="#"
            className="px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors duration-200"
          >
            API
          </Link>
          <Link
            href="/pricing"
            className="px-3 py-2 text-sm font-medium text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors duration-200"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="text-sm font-medium text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors duration-200 px-3 py-2"
          >
            Login
          </Link>
          <Button
            className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold px-5 py-2 text-sm"
            asChild
          >
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
