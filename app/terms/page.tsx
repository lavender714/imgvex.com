"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: [
      "Welcome to imgvex.AI. These Terms of Service (\"Terms\") govern your access to and use of the imgvex.AI website, applications, and services (collectively, the \"Service\"). By accessing or using the Service, you agree to be bound by these Terms.",
      "If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms. In that case, \"you\" and \"your\" will refer to that organization.",
      "We may update these Terms from time to time. We will notify you of any material changes by posting the updated Terms on our website and updating the \"Effective Date\" at the top. Your continued use of the Service after such changes constitutes acceptance of the revised Terms.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    content: [
      "You must be at least 18 years old (or the age of legal majority in your jurisdiction) to use the Service. By using the Service, you represent and warrant that you meet this requirement.",
      "If you are using the Service on behalf of a company or organization, you represent and warrant that you have the authority to bind that entity to these Terms.",
      "We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion, including if we believe that your conduct violates applicable law or is harmful to our interests.",
    ],
  },
  {
    id: "account",
    title: "Account Registration",
    content: [
      "To access certain features of the Service, you may be required to register for an account. You agree to provide accurate, complete, and up-to-date information during registration and to keep your account information current.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.",
      "We reserve the right to disable any user account at any time if, in our opinion, you have failed to comply with any provision of these Terms.",
    ],
  },
  {
    id: "use-of-service",
    title: "Use of the Service",
    content: [
      "Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the Service for your personal or internal business purposes.",
      "You agree not to (and not to permit any third party to): (a) use the Service for any illegal, harmful, or unauthorized purpose; (b) interfere with or disrupt the Service or servers; (c) attempt to gain unauthorized access to any portion of the Service; (d) reverse engineer, decompile, or disassemble any part of the Service; (e) use automated scripts or bots to access the Service; (f) resell, sublicense, or commercially exploit the Service without our express written consent.",
      "We may modify, suspend, or discontinue the Service (or any part thereof) at any time without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation.",
    ],
  },
  {
    id: "user-content",
    title: "User Content",
    content: [
      "The Service allows you to upload, submit, store, send, or receive content, including text, images, videos, and other materials (\"User Content\"). You retain all rights in and to your User Content.",
      "By uploading User Content to the Service, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform your User Content in connection with operating, improving, and promoting the Service.",
      "You represent and warrant that: (a) you own or have the necessary rights to your User Content; (b) your User Content does not violate the rights of any third party, including intellectual property rights and privacy rights; (c) your User Content complies with these Terms and all applicable laws.",
      "We do not claim ownership of your User Content. However, we reserve the right to review, monitor, and remove any User Content that violates these Terms or that we find objectionable, at our sole discretion and without notice.",
    ],
  },
  {
    id: "content-restrictions",
    title: "Content Restrictions",
    content: [
      "You may not use the Service to generate, upload, or distribute any content that:",
      "Is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable; promotes violence, discrimination, or illegal activities; infringes upon any patent, trademark, trade secret, copyright, or other proprietary rights; contains software viruses or any other malicious code; impersonates any person or entity; constitutes unsolicited or unauthorized advertising or spam; or violates any applicable local, state, national, or international law.",
      "Additionally, you may not use the Service to generate content that: depicts minors in a sexual or violent manner; promotes self-harm or suicide; contains deepfakes of real individuals without their explicit consent; or is intended to deceive or mislead others (e.g., fake news, scams).",
      "We reserve the right to suspend or terminate accounts that violate these content restrictions and to report illegal content to the appropriate authorities.",
    ],
  },
  {
    id: "ai-generated-content",
    title: "AI-Generated Content",
    content: [
      "The Service uses artificial intelligence to generate images, videos, and other content based on your prompts and inputs. You acknowledge that AI-generated content may be unpredictable and may not always meet your expectations.",
      "You are solely responsible for the prompts and inputs you provide and for any AI-generated content you create, publish, or distribute using the Service. You agree to review all AI-generated content before using it commercially or sharing it publicly.",
      "We do not guarantee that AI-generated content is unique, original, or free from third-party rights. Similar or identical content may be generated for other users. We recommend that you conduct your own due diligence before using AI-generated content for commercial purposes.",
      "To the maximum extent permitted by law, we disclaim all warranties and liability regarding the accuracy, quality, legality, or appropriateness of AI-generated content.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: [
      "The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of imgvex.AI and its licensors. The Service is protected by copyright, trademark, and other laws.",
      "Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent. All other trademarks not owned by us that appear on the Service are the property of their respective owners.",
      "Subject to your compliance with these Terms and applicable law, you own the AI-generated content you create using the Service. You may use such content for personal or commercial purposes, subject to the limitations set forth in these Terms.",
      "We reserve the right to use anonymized and aggregated data derived from User Content and AI-generated content for the purpose of improving our AI models and services.",
    ],
  },
  {
    id: "payment",
    title: "Payment and Subscription",
    content: [
      "Certain features of the Service require payment. By subscribing to a paid plan, you agree to pay all applicable fees as described on our Pricing page. All fees are exclusive of taxes, which you are responsible for paying.",
      "Subscriptions automatically renew at the end of each billing cycle unless you cancel before the renewal date. You authorize us to charge your designated payment method for all renewal fees.",
      "You may upgrade or downgrade your subscription at any time. Upgrades take effect immediately; downgrades take effect at the start of the next billing cycle. We do not provide refunds or credits for partial months.",
      "We reserve the right to change our fees at any time. Any fee changes will take effect at the start of the next billing cycle after we notify you.",
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation and Refunds",
    content: [
      "You may cancel your subscription at any time through your account settings or by contacting us. Your cancellation will take effect at the end of your current billing period.",
      "Upon cancellation, you will continue to have access to your paid features until the end of the current billing period. After that, your account will revert to the free plan or be suspended, depending on your usage.",
      "We offer a 3-day money-back guarantee for first-time subscribers. If you are not satisfied with the Service, you may request a full refund within 3 days of your initial purchase. Refund requests must be submitted via email.",
      "One-time credit packs are non-refundable once credits have been used. Unused credits from credit packs remain available even after subscription cancellation.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    content: [
      "We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.",
      "Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.",
      "You may terminate your account at any time by following the instructions on the Service or by contacting us. Upon termination, we may retain certain information as required by law or for legitimate business purposes.",
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: [
      "THE SERVICE IS PROVIDED ON AN \"AS IS\" AND \"AS AVAILABLE\" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.",
      "WE DO NOT WARRANT THAT: (A) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (B) THE RESULTS OBTAINED FROM USING THE SERVICE WILL BE ACCURATE OR RELIABLE; (C) ANY ERRORS IN THE SERVICE WILL BE CORRECTED.",
      "YOU UNDERSTAND AND AGREE THAT YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED FROM US OR THROUGH THE SERVICE SHALL CREATE ANY WARRANTY NOT EXPRESSLY STATED HEREIN.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: [
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL IMGVEX.AI, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.",
      "OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRIOR TO THE EVENT GIVING RISE TO LIABILITY, OR (B) ONE HUNDRED US DOLLARS (US$100).",
      "THE FOREGOING LIMITATIONS SHALL APPLY REGARDLESS OF WHETHER WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND REGARDLESS OF THE THEORY OF LIABILITY.",
    ],
  },
  {
    id: "indemnification",
    title: "Indemnification",
    content: [
      "You agree to defend, indemnify, and hold harmless imgvex.AI and its affiliates, officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from: (a) your use of and access to the Service; (b) your violation of any provision of these Terms; (c) your violation of any third-party right, including without limitation any copyright, property, or privacy right; or (d) any claim that your User Content caused damage to a third party.",
      "This indemnification obligation will survive the termination of these Terms and your use of the Service.",
    ],
  },
  {
    id: "miscellaneous",
    title: "Miscellaneous",
    content: [
      "These Terms constitute the entire agreement between you and imgvex.AI regarding the Service and supersede all prior agreements and understandings.",
      "If any provision of these Terms is held to be invalid or unenforceable, that provision will be enforced to the maximum extent permissible, and the remaining provisions will remain in full force and effect.",
      "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. Any waiver must be in writing and signed by an authorized representative of imgvex.AI.",
      "We may assign or transfer these Terms, in whole or in part, without restriction. You may not assign or transfer these Terms without our prior written consent.",
      "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which imgvex.AI is established, without regard to its conflict of law provisions.",
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    content: [
      "If you have any questions about these Terms, please contact us at: support@imgvex.com",
      "imgvex.AI is operated by imgvex.AI Inc. For legal notices, please write to the address provided on our Contact page.",
    ],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function TermsPage() {
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
              Terms of Service
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

      <Footer />
    </div>
  );
}
