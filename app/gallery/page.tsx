import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Gallery",
  description:
    "Explore stunning AI-generated images and videos created with imgvex.AI. Browse examples from Flux, GPT Image, Midjourney, Sora, Kling, and more top models.",
  alternates: {
    canonical: "/gallery",
  },
};

const galleryItems = [
  {
    id: "1",
    type: "image" as const,
    title: "Cyberpunk Cityscape",
    prompt: "A futuristic cyberpunk city at night with neon lights and rain",
    model: "Flux",
    aspect: "16:9",
    image: "https://images.unsplash.com/photo-1515630278258-407f66498911?w=800&q=80",
  },
  {
    id: "2",
    type: "image" as const,
    title: "Fantasy Portrait",
    prompt: "Elegant fantasy portrait of a mage with glowing runes",
    model: "GPT Image 2.0",
    aspect: "3:4",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
  },
  {
    id: "3",
    type: "image" as const,
    title: "Product Photography",
    prompt: "Minimalist product shot of luxury headphones on marble surface",
    model: "Midjourney",
    aspect: "1:1",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  },
  {
    id: "4",
    type: "image" as const,
    title: "Abstract Art",
    prompt: "Vibrant abstract oil painting with flowing colors",
    model: "Grok Imagine",
    aspect: "1:1",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
  },
  {
    id: "5",
    type: "image" as const,
    title: "Space Explorer",
    prompt: "An astronaut floating above a colorful nebula in deep space",
    model: "Nano Banana 2",
    aspect: "9:16",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
  },
  {
    id: "6",
    type: "image" as const,
    title: "Nature Scene",
    prompt: "Misty mountain landscape at sunrise with a serene lake",
    model: "Ideogram",
    aspect: "16:9",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-full bg-[#0B0817] text-[#F8FAFC]">
      <section className="px-6 pt-24 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              AI Gallery
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#94A3B8]">
              Explore stunning creations from our community. Each image was
              generated using imgvex.AI&apos;s powerful models.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-[#1E293B] bg-[#13101F]"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={`AI generated image: ${item.title} - ${item.prompt}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.title}</span>
                    <span className="rounded-full bg-[#1E293B] px-2 py-0.5 text-xs text-[#94A3B8]">
                      {item.model}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#64748B] line-clamp-2">
                    {item.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-[#94A3B8]">
              Want to create your own AI masterpieces?
            </p>
            <Link
              href="/tools/text-to-image"
              className="mt-4 inline-block rounded-lg bg-[#6366F1] px-8 py-3 font-medium text-white hover:bg-[#5558E0]"
            >
              Start Creating
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
