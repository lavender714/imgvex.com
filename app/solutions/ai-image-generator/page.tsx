import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Image Generator",
  description:
    "Create stunning AI images from text prompts with imgvex.AI. Access 12+ top models including Flux, GPT Image, Midjourney, Ideogram, and more. Fast generation, high-quality results.",
  alternates: {
    canonical: "/solutions/ai-image-generator",
  },
};

const models = [
  { id: "flux", name: "Flux", tag: "Best Quality" },
  { id: "gpt-image-2", name: "GPT Image 2.0", tag: "Ultra Realistic" },
  { id: "nano-banana-2", name: "Nano Banana 2", tag: "Fast" },
  { id: "nano-banana-pro", name: "Nano Banana Pro", tag: "Balanced" },
  { id: "grok-imagine", name: "Grok Imagine", tag: "Creative" },
  { id: "ideogram", name: "Ideogram", tag: "Typography" },
  { id: "flux-2", name: "Flux 2", tag: "Latest" },
  { id: "midjourney", name: "Midjourney", tag: "Artistic" },
];

const useCases = [
  {
    title: "Social Media Content",
    desc: "Create eye-catching visuals for Instagram, Twitter, and TikTok in seconds.",
  },
  {
    title: "Product Photography",
    desc: "Generate professional product shots without a studio setup.",
  },
  {
    title: "Concept Art",
    desc: "Visualize characters, environments, and scenes for games and films.",
  },
  {
    title: "Marketing Materials",
    desc: "Produce banners, posters, and ad creatives at scale.",
  },
];

export default function AiImageGeneratorPage() {
  return (
    <main className="min-h-full bg-[#0B0817] text-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-24 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            AI Image Generator
          </h1>
          <p className="mt-6 text-lg text-[#94A3B8]">
            Turn your ideas into stunning images with the world&apos;s leading AI
            models. One platform, every style, unlimited creativity.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/tools/text-to-image"
              className="rounded-lg bg-[#6366F1] px-6 py-3 font-medium text-white hover:bg-[#5558E0]"
            >
              Try Free
            </Link>
            <Link
              href="/gallery"
              className="rounded-lg border border-[#1E293B] px-6 py-3 font-medium text-[#F8FAFC] hover:border-[#64748B]"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Models */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold">Supported Models</h2>
          <p className="mt-2 text-[#94A3B8]">
            Choose from 12+ state-of-the-art image generation models
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {models.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-[#1E293B] bg-[#13101F] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{m.name}</span>
                  <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-xs text-[#94A3B8]">
                    {m.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold">Use Cases</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="rounded-xl border border-[#1E293B] bg-[#13101F] p-6"
              >
                <h3 className="font-medium">{uc.title}</h3>
                <p className="mt-2 text-sm text-[#94A3B8]">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#1E293B] bg-[#13101F] p-10 text-center">
          <h2 className="text-2xl font-semibold">
            Start Creating AI Images Today
          </h2>
          <p className="mt-3 text-[#94A3B8]">
            No credit card required. Generate your first image in under 30
            seconds.
          </p>
          <Link
            href="/tools/text-to-image"
            className="mt-6 inline-block rounded-lg bg-[#6366F1] px-8 py-3 font-medium text-white hover:bg-[#5558E0]"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </main>
  );
}
