"use client";

interface ModelCardProps {
  id: string;
  name: string;
  type: "video" | "image";
  logo: string;
  logoColor: string;
  specs: string;
}

export function ModelCard({ name, logo, logoColor, specs }: ModelCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-[14px] bg-[#0F0F1A] border border-[#1E293B] hover:border-[#475569] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer min-w-[260px]">
      <div
        className="w-10 h-10 rounded-[10px] flex items-center justify-center text-base font-bold shrink-0"
        style={{ backgroundColor: `${logoColor}15`, color: logoColor }}
      >
        {logo}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#F8FAFC] truncate">{name}</p>
        <p className="text-xs text-[#64748B] truncate">{specs}</p>
      </div>
    </div>
  );
}
