"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreditPill } from "@/components/credit-pill";
import { createClient } from "@/lib/supabase/client";

interface User {
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
  };
}

const sidebarItems = [
  { icon: "◆", label: "Overview", href: "/dashboard", active: true },
  { icon: "▶", label: "Generate", href: "/generate", active: false },
  { icon: "◈", label: "Assets", href: "/dashboard/assets", active: false },
  { icon: "◉", label: "Billing", href: "/dashboard/billing", active: false },
  { icon: "◊", label: "Settings", href: "/dashboard/settings", active: false },
];

const stats = [
  { label: "Total Generations", value: "1,247", color: "#F8FAFC" },
  { label: "Credits Left", value: "48", color: "#14B8A6" },
  { label: "This Month", value: "86", color: "#F8FAFC" },
  { label: "Avg. Time", value: "42s", color: "#F8FAFC" },
];

const recentGenerations = [
  { id: "1", title: "Neon cityscape at night", model: "Kling 2.0", resolution: "1080p", duration: "5s", time: "2h ago", status: "completed" as const },
  { id: "2", title: "Abstract fluid portrait", model: "Midjourney v7", resolution: "2048px", duration: "", time: "5h ago", status: "completed" as const },
  { id: "3", title: "Ocean waves slow-mo", model: "Runway Gen-4", resolution: "1080p", duration: "10s", time: "1m ago", status: "generating" as const, progress: 67 },
  { id: "4", title: "Product showcase reel", model: "Pika 2.0", resolution: "720p", duration: "3s", time: "1d ago", status: "completed" as const },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getInitials(email?: string, name?: string) {
  if (name) return name.slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return "U";
}

function getDisplayName(user: User) {
  return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
}

export default function DashboardContent({ user }: { user: User }) {
  const router = useRouter();
  const displayName = getDisplayName(user);
  const initials = getInitials(user.email, displayName);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-[#0B0817] flex flex-col">
      {/* Top Nav */}
      <header className="h-[60px] border-b border-[#1E293B] bg-[#06060A] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-[#F8FAFC]">imgvex.AI</Link>
          <div className="w-px h-6 bg-[#1E293B]" />
          <span className="text-sm font-medium text-[#F8FAFC]">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <Button className="rounded-full bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm h-9 px-4" asChild>
            <Link href="/generate">+ New Generation</Link>
          </Button>
          <CreditPill credits={48} />
          <button
            onClick={handleSignOut}
            className="w-9 h-9 rounded-full bg-[#6366F1] flex items-center justify-center text-sm font-semibold text-white hover:bg-[#4F52E6] transition-colors"
            title="Sign out"
          >
            {initials}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[220px] flex-shrink-0 border-r border-[#1E293B] bg-[#0A0A12] p-4 flex flex-col gap-1">
          <p className="text-[10px] font-semibold text-[#475569] tracking-[1.5px] px-3 py-2">MENU</p>
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-colors ${
                item.active
                  ? "bg-[rgba(99,102,241,0.12)] text-[#F8FAFC] font-medium"
                  : "text-[#64748B] hover:bg-[rgba(99,102,241,0.08)] hover:text-[#F8FAFC]"
              }`}
            >
              <span className={`text-xs ${item.active ? "text-[#818CF8]" : "text-[#475569]"}`}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-8 max-w-[1200px]">
            {/* Welcome */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#F8FAFC]">{getGreeting()}, {displayName}</h1>
                <p className="text-sm text-[#64748B]">Here&apos;s what&apos;s happening with your account</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-2 p-5 rounded-2xl bg-[#0F0F1A] border border-[#1E293B]">
                  <p className="text-xs text-[#64748B]">{stat.label}</p>
                  <p className="text-[28px] font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Generations */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#F8FAFC]">Recent Generations</h2>
                <Link href="#" className="text-sm text-[#818CF8] hover:underline">View all →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentGenerations.map((gen) => (
                  <div key={gen.id} className="flex flex-col rounded-2xl bg-[#0F0F1A] border border-[#1E293B] overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                    <div className="h-[140px] bg-[#1E293B] flex items-center justify-center text-xs text-[#64748B]">
                      {gen.status === "generating" ? (
                        <span className="text-[#818CF8]">Generating...</span>
                      ) : (
                        "Preview"
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#F8FAFC] truncate">{gen.title}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          gen.status === "completed"
                            ? "bg-[rgba(20,184,166,0.12)] text-[#14B8A6]"
                            : "bg-[rgba(99,102,241,0.12)] text-[#818CF8]"
                        }`}>
                          {gen.status === "generating" ? `${gen.progress}%` : "Done"}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B]">
                        {gen.model} • {gen.resolution}{gen.duration ? ` • ${gen.duration}` : ""} • {gen.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-[#F8FAFC]">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/generate" className="flex items-center gap-3 p-4 rounded-xl bg-[#0F0F1A] border border-[#1E293B] hover:border-[#475569] transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(99,102,241,0.12)] flex items-center justify-center text-sm text-[#818CF8] group-hover:bg-[rgba(99,102,241,0.2)]">
                    ▶
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F8FAFC]">Start a new generation</p>
                    <p className="text-xs text-[#64748B]">Create video or image with any model</p>
                  </div>
                </Link>
                <Link href="/dashboard/billing" className="flex items-center gap-3 p-4 rounded-xl bg-[#0F0F1A] border border-[#1E293B] hover:border-[#475569] transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(20,184,166,0.12)] flex items-center justify-center text-sm text-[#14B8A6] group-hover:bg-[rgba(20,184,166,0.2)]">
                    ↑
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F8FAFC]">Top up credits</p>
                    <p className="text-xs text-[#64748B]">You have 48 credits remaining</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
