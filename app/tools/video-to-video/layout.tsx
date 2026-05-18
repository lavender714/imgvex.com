import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video to Video Generator",
  description:
    "Transform and restyle videos with cutting-edge AI models. Upload a video and apply new styles, effects, and transformations using imgvex.AI.",
  alternates: {
    canonical: "/tools/video-to-video",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
