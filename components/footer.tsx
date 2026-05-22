import Link from "next/link";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  "Creative Tools": [
    { label: "Text to Video AI", href: "/tools/text-to-video" },
    { label: "Image to Video AI", href: "/tools/image-to-video" },
  ],
  "Video Models": [
    { label: "Seedance 2.0", href: "/models/seedance-2.0-t2v" },
    { label: "Seedance 2.0 fast", href: "/models/seedance-2.0-fast-t2v" },
    { label: "Veo 3.1 Lite", href: "/models/veo3-1-lite" },
    { label: "Veo 3.1 Fast", href: "/models/veo3-1-fast" },
    { label: "Veo 3.1 Quality", href: "/models/veo3-1-quality" },
    { label: "Sora 2", href: "/models/sora-2-vip" },
    { label: "Sora 2 Pro", href: "/models/sora-2-pro" },
    { label: "Runway", href: "/models/runway-gen4" },
    { label: "Kling 3.0", href: "/models/kling-3" },
    { label: "Kling V2.6", href: "/models/kling-2.6-motion-control" },
    { label: "Hailuo 02", href: "/models/hailuo-02" },
    { label: "Hailuo 02 Pro", href: "/models/hailuo-02-pro" },
    { label: "Grok", href: "/models/grok-imagine-t2v" },
  ],
  "Image Models": [
    { label: "Nano Banana Pro", href: "/models/nano-banana-pro" },
    { label: "Nano Banana 2", href: "/models/nano-banana-2" },
    { label: "GPT Image 2.0", href: "/models/gpt-image-2" },
    { label: "GPT Image 1.5", href: "/models/gpt-image-1-5" },
    { label: "Grok", href: "/models/grok-imagine" },
    { label: "Ideogram", href: "/models/ideogram" },
    { label: "Flux", href: "/models/flux" },
    { label: "Midjourney", href: "/models/midjourney" },
  ],
  "Company": [
    { label: "Contact Us", href: "mailto:support@imgvex.com?subject=Contact%20imgvex.AI" },
    { label: "Pricing", href: "/pricing" },
    { label: "API", href: "#" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="py-16 px-6 md:px-12 border-t border-[#1E293B]/50">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-[280px]">
            <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">imgvex.AI</h3>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              The unified console for AI video and image generation. Built for creators who demand precision.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="flex flex-col gap-2.5">
                <h4 className="text-[13px] font-semibold text-[#F8FAFC]">{title}</h4>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
