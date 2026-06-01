import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Video Generator",
  description:
    "Generate high-quality AI videos from text prompts or images. Access leading models including Sora, Kling, Runway, Hailuo, and more. Cinematic results in minutes.",
  alternates: {
    canonical: "/solutions/ai-video-generator",
  },
};

const models = [
  { id: "sora-2", name: "Sora 2", tag: "Cinematic" },
  { id: "kling-3.0", name: "Kling 3.0", tag: "Realistic" },
  { id: "runway-gen4", name: "Runway Gen-4", tag: "Creative" },
  { id: "hailuo-02-pro", name: "Hailuo 02 Pro", tag: "Motion" },
  { id: "veo3-1-quality", name: "Veo 3.1 Quality", tag: "Google" },
  { id: "seedance-2.0", name: "Seedance 2.0", tag: "Dance" },
  { id: "grok-video", name: "Grok Video", tag: "X AI" },
];

const useCases = [
  {
    title: "Social Media Videos",
    desc: "Generate short-form videos for TikTok, Reels, and Shorts with AI.",
  },
  {
    title: "Product Demos",
    desc: "Create dynamic product showcase videos without filming.",
  },
  {
    title: "Storyboarding",
    desc: "Visualize scenes and camera movements for film pre-production.",
  },
  {
    title: "Ads & Marketing",
    desc: "Produce video ads at scale for multiple platforms.",
  },
];

export default function AiVideoGeneratorPage() {
  return (
    <main className="min-h-full bg-[#0B0817] text-[#F8FAFC]">
      <section className="relative overflow-hidden px-6 pt-24 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            AI Video Generator
          </h1>
          <p className="mt-6 text-lg text-[#94A3B8]">
            Transform text and images into cinematic videos with cutting-edge AI
            models. Professional-quality results, zero production cost.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/tools/text-to-video"
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

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold">Supported Models</h2>
          <p className="mt-2 text-[#94A3B8]">
            Choose from 14+ state-of-the-art video generation models
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

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#1E293B] bg-[#13101F] p-10 text-center">
          <h2 className="text-2xl font-semibold">
            Start Creating AI Videos Today
          </h2>
          <p className="mt-3 text-[#94A3B8]">
            No credit card required. Generate your first video in minutes.
          </p>
          <Link
            href="/tools/text-to-video"
            className="mt-6 inline-block rounded-lg bg-[#6366F1] px-8 py-3 font-medium text-white hover:bg-[#5558E0]"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </main>
  );
}
