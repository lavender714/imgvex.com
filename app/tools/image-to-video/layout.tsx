import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Image to Video Generator",
  description:
    "Bring static images to life with AI-powered video generation. Upload an image and create dynamic videos using Sora, Kling, Runway, and more on imgvex.AI.",
  alternates: {
    canonical: "/tools/image-to-video",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
