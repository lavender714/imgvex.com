"use client";

interface FeatureCardProps {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, iconColor, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[#0F0F1A] border border-[#1E293B] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div
        className="w-11 h-11 rounded-[11px] flex items-center justify-center text-lg font-bold"
        style={{ backgroundColor: `${iconColor}15`, color: iconColor }}
      >
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#F8FAFC]">{title}</h3>
      <p className="text-[13px] text-[#94A3B8] leading-relaxed">{description}</p>
    </div>
  );
}
