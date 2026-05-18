import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Image to Image Generator",
  description:
    "Restyle and transform existing images with AI. Upload an image and convert it into new styles using Flux, GPT Image, and more leading models on imgvex.AI.",
  alternates: {
    canonical: "/tools/image-to-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
