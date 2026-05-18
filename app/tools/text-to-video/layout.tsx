import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Text to Video Generator",
  description:
    "Generate high-quality videos from text descriptions using Sora, Kling, Runway, and 14+ leading AI video models. Cinematic results in minutes with imgvex.AI.",
  alternates: {
    canonical: "/tools/text-to-video",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
