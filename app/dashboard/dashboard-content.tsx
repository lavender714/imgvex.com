"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditPill } from "@/components/credit-pill";
import { useAuth } from "@/components/auth-provider";
import { Play, Image, Video, Wand2, ArrowRight } from "lucide-react";

const sidebarItems = [
  { icon: "◆", label: "Overview", href: "/dashboard", active: true },
  { icon: "▶", label: "Generate", href: "/generate", active: false },
  { icon: "◈", label: "Assets", href: "/dashboard/assets", active: false },
  { icon: "◉", label: "Billing", href: "/dashboard/billing", active: false },
  { icon: "◊", label: "Settings", href: "/dashboard/settings", active: false },
];

const baseStats = [
  { label: "Credits Left", value: "48", color: "#14B8A6" },
  { label: "This Month", value: "0", color: "#F8FAFC" },
  { label: "Avg. Time", value: "--", color: "#F8FAFC" },
];

// TODO: fetch real generations from API
const recentGenerations: Array<{
  id: string;
  title: string;
  model: string;
  resolution: string;
  duration: string;
  time: string;
  status: "completed" | "generating";
  progress?: number;
}> = [];

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

function getDisplayName(user: NonNullable<ReturnType<typeof useAuth>["user"]>) {
  return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
}

export default function DashboardContent() {
  const { user, credits, signOut } = useAuth();
  const displayName = user ? getDisplayName(user) : "Guest";
  const initials = getInitials(user?.email, displayName);

  const totalGenerations = recentGenerations.length;
  const stats = [
    { label: "Total Generations", value: totalGenerations.toString(), color: "#F8FAFC" },
    ...baseStats,
  ];

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
            onClick={signOut}
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
                {recentGenerations.length > 0 && (
                  <Link href="#" className="text-sm text-[#818CF8] hover:underline">View all →</Link>
                )}
              </div>
              {recentGenerations.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 py-16 px-6 rounded-2xl bg-[#0F0F1A] border border-[#1E293B] border-dashed">
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(99,102,241,0.12)] flex items-center justify-center">
                    <Wand2 className="w-7 h-7 text-[#818CF8]" />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center max-w-[320px]">
                    <p className="text-base font-semibold text-[#F8FAFC]">No generations yet</p>
                    <p className="text-sm text-[#64748B] leading-relaxed">
                      Create your first AI image or video to see it here. Choose any model from our catalog.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="rounded-xl bg-[#6366F1] hover:bg-[#4F52E6] text-white font-semibold text-sm h-10 px-5" asChild>
                      <Link href="/generate">
                        <Play className="w-4 h-4 mr-2" />
                        Start Generating
                      </Link>
                    </Button>
                    <Button variant="outline" className="rounded-xl border-[#1E293B] bg-transparent text-[#CBD5E1] hover:bg-[#1E293B] hover:text-[#F8FAFC] font-medium text-sm h-10 px-5" asChild>
                      <Link href="/tools/text-to-image">
                        <Image className="w-4 h-4 mr-2" />
                        Text to Image
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
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
              )}
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
                    <p className="text-xs text-[#64748B]">Check your balance and top up</p>
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
