"use client";

import { motion } from "framer-motion";

interface TopTabSwitcherProps {
  activeTab: "video" | "image";
  onChange: (tab: "video" | "image") => void;
}

export function TopTabSwitcher({ activeTab, onChange }: TopTabSwitcherProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-[#13101F] w-fit">
      {(["video", "image"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeTab === tab
              ? "text-white"
              : "text-[#64748B] hover:text-[#F8FAFC]"
          }`}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 rounded-full bg-[#6366F1]"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">
            {tab === "video" ? "AI Video" : "AI Image"}
          </span>
        </button>
      ))}
    </div>
  );
}
