"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditPill } from "@/components/credit-pill";
import { useAuth } from "@/components/auth-provider";
import type { AuthUser } from "@/lib/auth/types";
import {
  ChevronDown,
  Image,
  Video,
  Layers,
  Copy,
  Type,
  LogOut,
  LayoutDashboard,
  CreditCard,
  Settings,
} from "lucide-react";

interface NavbarProps {
  variant?: "landing" | "app";
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
    label: "Video AI",
    items: [
      { icon: Video, label: "Text to Video", href: "/tools/text-to-video", desc: "Prompt-to-video generation" },
      { icon: Image, label: "Image to Video", href: "/tools/image-to-video", desc: "Animate any photo" },
      { icon: Layers, label: "Video to Video", href: "/tools/video-to-video", desc: "Transform existing footage" },
    ],
  },
  {
    label: "Image AI",
    items: [
      { icon: Type, label: "Text to Image", href: "/tools/text-to-image", desc: "Prompt-to-image creation" },
      { icon: Copy, label: "Image to Image", href: "/tools/image-to-image", desc: "Restyle & transform" },
    ],
  },
];

/* ─── NavDropdown ─── */

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

/* ─── User Menu ─── */

function UserMenu({ user, credits }: { user: AuthUser; credits: number }) {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
  const initials = (() => {
    if (user.user_metadata?.full_name || user.user_metadata?.name) {
      const n = (user.user_metadata?.full_name || user.user_metadata?.name)!;
      return n.slice(0, 2).toUpperCase();
    }
    if (user.email) return user.email.slice(0, 2).toUpperCase();
    return "U";
  })();

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-[#6366F1] flex items-center justify-center text-sm font-semibold text-white hover:bg-[#4F52E6] transition-colors"
        title={displayName}
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full pt-2 z-50 w-[260px]">
          <div className="rounded-2xl bg-[#0F0F1A] border border-[#1E293B] shadow-2xl shadow-black/50 py-3 overflow-hidden">
            {/* User Info */}
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6366F1] flex items-center justify-center text-sm font-semibold text-white shrink-0">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-[#F8FAFC] truncate">{displayName}</span>
                <span className="text-xs text-[#64748B] truncate">{user.email}</span>
              </div>
            </div>

            <div className="h-px bg-[#1E293B] mx-3 my-1" />

            {/* Credits */}
            <div className="px-4 py-2">
              <CreditPill credits={credits} />
            </div>

            <div className="h-px bg-[#1E293B] mx-3 my-1" />

            {/* Links */}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[rgba(99,102,241,0.08)] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#64748B]" />
              Dashboard
            </Link>
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[rgba(99,102,241,0.08)] transition-colors"
            >
              <CreditCard className="w-4 h-4 text-[#64748B]" />
              Pricing
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[rgba(99,102,241,0.08)] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#64748B]" />
              Settings
            </Link>

            <div className="h-px bg-[#1E293B] mx-3 my-1" />

            <button
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#CBD5E1] hover:text-red-400 hover:bg-red-500/5 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-[#64748B]" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Navbar ─── */

export function Navbar({ variant = "landing" }: NavbarProps) {
  const pathname = usePathname();
  const authHref = pathname ? `/auth?next=${encodeURIComponent(pathname)}` : "/auth";
  const { user, credits, isLoading } = useAuth();

  if (variant === "app") {
    return (
      <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[60px] border-b border-[#1E293B] bg-[#06060A]/85 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-[#F8FAFC]">imgvex.AI</Link>
          <div className="w-px h-6 bg-[#1E293B]" />
          <Link href="/generate" className="text-sm font-medium text-[#F8FAFC]">Generate</Link>
          <Link href="/tools/image-to-video" className="text-sm font-medium text-[#64748B] hover:text-[#F8FAFC] transition-colors">Tools</Link>
          <Link href="/dashboard" className="text-sm font-medium text-[#64748B] hover:text-[#F8FAFC] transition-colors">Dashboard</Link>
          <Link href="/pricing" className="text-sm font-medium text-[#64748B] hover:text-[#F8FAFC] transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <CreditPill credits={credits} />
              <UserMenu user={user} credits={credits} />
            </>
          ) : (
            <>
              <Link
                href={authHref}
                className="text-sm font-medium text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors"
              >
                Login
              </Link>
              <Button
                className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold px-4 py-2 text-sm"
                asChild
              >
                <Link href={authHref}>Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </header>
      <div className="h-[60px]" />
      </>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-[#06060A]/85 backdrop-blur-md border-b border-[#1E293B]/50">
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6 lg:px-12">
        <Link href="/" className="text-[22px] font-bold text-[#F8FAFC]">imgvex.AI</Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/generate"
              className="px-3 py-2 text-sm font-medium text-[#EC4899] hover:text-[#F472B6] transition-colors duration-200"
            >
              Agent
            </Link>

            {dropdownMenus.map((menu) => (
              <NavDropdown key={menu.label} label={menu.label} items={menu.items} />
            ))}

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
            {isLoading ? (
              <div className="w-20 h-9 rounded-full bg-[#1E293B] animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <CreditPill credits={credits} />
                <UserMenu user={user} credits={credits} />
              </div>
            ) : (
              <>
                <Link
                  href={authHref}
                  className="text-sm font-medium text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors duration-200 px-3 py-2"
                >
                  Login
                </Link>
                <Button
                  className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold px-5 py-2 text-sm"
                  asChild
                >
                  <Link href={authHref}>Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
