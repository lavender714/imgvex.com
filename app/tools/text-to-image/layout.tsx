import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Text to Image Generator",
  description:
    "Transform text prompts into stunning AI-generated images using Flux, GPT Image, Midjourney, and 12+ top models. Fast, high-quality results with imgvex.AI.",
  alternates: {
    canonical: "/tools/text-to-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
