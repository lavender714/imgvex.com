"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: [
      "This Privacy Policy describes how imgvex.AI (\"we\", \"us\", or \"our\") collects, uses, and shares your personal information when you use our website, applications, and services (collectively, the \"Service\").",
      "By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with this policy, please do not use our Service.",
      "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the \"Effective Date\" at the top.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: [
      "Account Information: When you register for an account, we collect your email address, password, and optional profile information such as your name and avatar.",
      "Usage Data: We automatically collect information about how you interact with the Service, including your IP address, browser type, device information, pages visited, time spent, and click patterns.",
      "User Content: We collect the text prompts, images, videos, and other content you upload or generate using the Service. This includes both your inputs and the AI-generated outputs.",
      "Payment Information: When you make a purchase, our payment processors (Stripe, PayPal) collect your payment details. We do not store your full credit card information.",
      "Communication Data: If you contact us via email or support channels, we collect and store those communications to respond to your inquiries.",
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: [
      "To provide, maintain, and improve the Service, including training and optimizing our AI models.",
      "To process your transactions and manage your account, including sending billing notifications and usage alerts.",
      "To communicate with you about updates, new features, promotional offers, and important service announcements.",
      "To detect, prevent, and address technical issues, fraud, abuse, and security vulnerabilities.",
      "To comply with legal obligations and enforce our Terms of Service.",
      "For research and analytics purposes, using aggregated and anonymized data that cannot identify you personally.",
    ],
  },
  {
    id: "third-party",
    title: "Third-Party AI Processors",
    content: [
      "To provide AI generation capabilities, we integrate with various third-party AI model providers. When you submit a prompt or upload content for generation, your inputs are sent to these providers for processing.",
      "Current third-party AI processors include: OpenAI (GPT, DALL-E), Stability AI (Stable Diffusion, Stable Video), Runway ML, Midjourney, Luma AI, Pika Labs, Kling AI, and other providers we may integrate with in the future.",
      "Each third-party provider has its own privacy policy governing how they process data. We recommend reviewing their policies. We only share the minimum data necessary for the generation request.",
      "We do not sell your personal information or User Content to third parties for marketing purposes.",
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information, including encryption in transit (TLS/SSL) and at rest, access controls, and regular security audits.",
      "Your payment information is processed by PCI-DSS compliant payment processors. We do not store your full credit card numbers on our servers.",
      "While we strive to protect your data, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.",
      "In the event of a data breach that affects your personal information, we will notify you in accordance with applicable laws.",
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: [
      "Depending on your location, you may have the following rights regarding your personal data: the right to access, correct, or delete your personal information; the right to restrict or object to processing; the right to data portability; and the right to withdraw consent.",
      "To exercise these rights, please contact us at support@imgvex.com. We will respond to your request within 30 days.",
      "You may delete your account at any time through your account settings. Upon deletion, we will remove your personal information from our active systems within 30 days, though some data may be retained in backups for a limited period or as required by law.",
      "You may opt out of marketing communications at any time by clicking the \"Unsubscribe\" link in our emails or by contacting us directly.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Tracking",
    content: [
      "We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content.",
      "Essential Cookies: Required for the Service to function properly, such as authentication and security.",
      "Analytics Cookies: Help us understand how visitors interact with the Service so we can improve it.",
      "You can manage your cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of the Service.",
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: [
      "The Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.",
      "If we become aware that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or Service features.",
      "We will notify you of any material changes by posting the updated policy on this page with a revised \"Effective Date\". For significant changes, we may also send you an email notification.",
      "Your continued use of the Service after any changes to this Privacy Policy constitutes acceptance of the updated policy.",
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    content: [
      "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:",
      "Email: support@imgvex.com",
      "We will make every effort to respond to your inquiry within 30 days.",
    ],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B0817]">
      <Navbar variant="landing" />

      {/* Hero */}
      <section className="pt-[120px] pb-12 px-6 md:px-12">
        <div className="max-w-[800px] mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col gap-3"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] tracking-[-0.02em]">
              Privacy Policy
            </h1>
            <p className="text-sm text-[#64748B]">
              Effective Date: May 11, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-6 md:px-12">
        <div className="max-w-[800px] mx-auto flex flex-col gap-12">
          {sections.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-[#F8FAFC] mb-4">{section.title}</h2>
              <div className="flex flex-col gap-4">
                {section.content.map((paragraph, i) => (
                  <p key={i} className="text-[15px] text-[#94A3B8] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 md:px-12 bg-[#040408]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-10">
            <div className="max-w-[280px]">
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">imgvex.AI</h3>
              <p className="text-[13px] text-[#64748B] leading-relaxed">
                The unified console for AI video and image generation. Built for creators who demand precision.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              <div className="flex flex-col gap-2.5">
                <h4 className="text-[13px] font-semibold text-[#F8FAFC]">Creative Tools</h4>
                <Link href="/generate" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">AI Video Generator</Link>
                <Link href="/generate" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Text to Video AI</Link>
                <Link href="/tools/image-to-video" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Image to Video AI</Link>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">AI Photo Editor</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">AI Video Extender</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Mimic Motion</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <h4 className="text-[13px] font-semibold text-[#F8FAFC]">Video Models</h4>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Pollo 2.5</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Veo 3</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Sora 2</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Kling 3.0</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Seanceance 2.0</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Runway</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <h4 className="text-[13px] font-semibold text-[#F8FAFC]">Image Models</h4>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">GPT Image 2</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Nano Banana 2</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Recraft</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Ideogram</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Stable Diffusion</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Flux AI</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <h4 className="text-[13px] font-semibold text-[#F8FAFC]">Apps</h4>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Clone Viral Video</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">UGC Video Ads</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Anime Video</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Story Video</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Music Video</a>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">News Video</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <h4 className="text-[13px] font-semibold text-[#F8FAFC]">Company</h4>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">About Us</a>
                <a href="mailto:support@imgvex.com?subject=Contact%20imgvex.AI" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Contact Us</a>
                <Link href="/pricing" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Pricing</Link>
                <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">API</a>
                <Link href="/terms" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Terms</Link>
                <Link href="/privacy" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="h-px bg-[#1E293B] mb-6" />
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs text-[#475569]">
            <span>© 2026 imgvex.AI. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-[#64748B] transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-[#64748B] transition-colors">Terms</Link>
              <a href="#" className="hover:text-[#64748B] transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
