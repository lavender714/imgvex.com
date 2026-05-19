import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { AuthProvider } from "@/components/auth-provider";
import type { AuthUser } from "@/lib/auth/types";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.imgvex.com"),
  title: {
    template: "%s | imgvex.AI",
    default: "imgvex.AI — AI Video & Image Generation Platform",
  },
  description:
    "One console. Every AI model. Generate stunning videos and images with 20+ leading AI models including Flux, GPT Image, Midjourney, and more.",
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const initialUser = user
    ? {
        id: user.id,
        email: user.email ?? undefined,
        user_metadata: user.user_metadata as AuthUser["user_metadata"] | undefined,
      }
    : null;

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0817] text-[#F8FAFC]">
        <AuthProvider initialUser={initialUser}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
