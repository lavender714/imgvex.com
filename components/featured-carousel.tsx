"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  gradient: string;
}

const defaultItems: FeaturedItem[] = [
  {
    id: "1",
    title: "SEEDANCE 2.0",
    subtitle: "Create the World You Imagine",
    badge: "60% OFF",
    badgeColor: "#F59E0B",
    gradient: "linear-gradient(135deg, #6366F1 0%, #0F0F1A 100%)",
  },
  {
    id: "2",
    title: "POLLO 3.0",
    subtitle: "Multi-Shot Made Easy",
    gradient: "linear-gradient(135deg, #EC4899 0%, #0F0F1A 100%)",
  },
  {
    id: "3",
    title: "KLING 3.0",
    subtitle: "Motion Control Upgraded",
    gradient: "linear-gradient(135deg, #14B8A6 0%, #0F0F1A 100%)",
  },
];

interface FeaturedCarouselProps {
  items?: FeaturedItem[];
}

export function FeaturedCarousel({ items = defaultItems }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#64748B]">Featured Models</p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="w-7 h-7 rounded-full bg-[#13101F] border border-[#1E293B] flex items-center justify-center text-[#64748B] hover:bg-[#1E293B] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-7 h-7 rounded-full bg-[#13101F] border border-[#1E293B] flex items-center justify-center text-[#64748B] hover:bg-[#1E293B] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-[340px] h-[160px] p-6 rounded-2xl border border-[#1E293B] cursor-pointer hover:border-[#475569] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex flex-col justify-end"
            style={{ background: item.gradient }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: item.badgeColor }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[22px] font-bold text-[#F8FAFC]">{item.title}</p>
              <p className="text-[13px] text-[#CBD5E1]">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
