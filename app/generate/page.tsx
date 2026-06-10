"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { TopTabSwitcher } from "@/components/top-tab-switcher";
import { HeroInput } from "@/components/hero-input";
import { ParamPills, type VideoParams, type ImageParams } from "@/components/param-pills";
import { GenerateButton } from "@/components/generate-button";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Download, Share2, RefreshCw } from "lucide-react";

const defaultVideoPrompt = "A cinematic drone shot flying over a misty mountain valley at golden hour, with a small village glowing with warm lights below...";

const defaultImagePrompt = "A hyper-realistic portrait of a cyberpunk character with neon circuit tattoos, dramatic rim lighting, 8K detail";

const queueItems = [
  { id: "1", title: "Mountain valley drone...", status: "completed" as const, model: "Kling 2.0", time: "2m ago", type: "video" as const },
  { id: "2", title: "Cyberpunk cityscape...", status: "generating" as const, model: "Runway", progress: 45, type: "video" as const },
  { id: "3", title: "Abstract fluid art...", status: "queued" as const, model: "Midjourney", type: "image" as const },
];

export default function GeneratePage() {
  const [activeTab, setActiveTab] = useState<"video" | "image">("video");
  const [prompt, setPrompt] = useState(defaultVideoPrompt);
  const [planTier, setPlanTier] = useState<string>("free");

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("plan_tier")
        .eq("id", user.id)
        .maybeSingle();
      if (data?.plan_tier) {
        setPlanTier(data.plan_tier);
      }
    };
    fetchProfile();
  }, []);

  const [videoParams, setVideoParams] = useState<VideoParams>({
    model: "kling-2",
    duration: "5",
    aspectRatio: "16:9",
    resolution: "1080p",
  });

  const [imageParams, setImageParams] = useState<ImageParams>({
    model: "midjourney-v7",
    quantity: "1",
    aspectRatio: "1:1",
  });

  const handleTabChange = (tab: "video" | "image") => {
    setActiveTab(tab);
    setPrompt(tab === "video" ? defaultVideoPrompt : defaultImagePrompt);
  };

  const getCreditCost = () => {
    if (activeTab === "video") {
      const base = videoParams.resolution === "4K" ? 30 : videoParams.resolution === "1080p" ? 20 : 10;
      return base;
    }
    return 4 * parseInt(imageParams.quantity);
  };

  return (
    <div className="min-h-screen bg-[#0B0817] flex flex-col">
      <Navbar variant="app" />

      <main className="flex-1 flex flex-col">
        {/* Background glow */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 60%)" }}
          />
          <div className="absolute top-[5%] right-[5%] w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 60%)" }}
          />
        </div>

        {/* Top Section: Input Area */}
        <div className="flex-1 flex flex-col items-center px-6 py-8 max-w-[1100px] mx-auto w-full relative z-10">
          {/* Tab Switcher */}
          <div className="mb-6">
            <TopTabSwitcher activeTab={activeTab} onChange={handleTabChange} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col gap-4"
            >
              {/* Hero Input */}
              <HeroInput
                value={prompt}
                onChange={setPrompt}
                onEnhance={() => setPrompt(prompt + " (enhanced)")}
              />

              {/* Param Pills */}
              <ParamPills
                mode={activeTab}
                params={activeTab === "video" ? videoParams : imageParams}
                onChange={activeTab === "video" ? setVideoParams as (p: VideoParams | ImageParams) => void : setImageParams as (p: VideoParams | ImageParams) => void}
                planTier={planTier}
              />

              {/* Generate Button */}
              <GenerateButton
                creditCost={getCreditCost()}
                onClick={() => console.log("generate", { activeTab, prompt, params: activeTab === "video" ? videoParams : imageParams })}
              />
            </motion.div>
          </AnimatePresence>

          {/* Featured Carousel */}
          <div className="w-full mt-8">
            <FeaturedCarousel />
          </div>

          {/* Results Area */}
          <div className="w-full mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#94A3B8]">Recent Generations</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B] cursor-pointer hover:text-[#CBD5E1] transition-colors">All</span>
                <span className="text-xs text-[#475569]">|</span>
                <span className="text-xs text-[#64748B] cursor-pointer hover:text-[#CBD5E1] transition-colors">Video</span>
                <span className="text-xs text-[#475569]">|</span>
                <span className="text-xs text-[#64748B] cursor-pointer hover:text-[#CBD5E1] transition-colors">Image</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {queueItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col rounded-2xl bg-[#13101F] border border-[#1E293B] overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                >
                  {/* Preview */}
                  <div className="h-[160px] bg-[#1E293B] flex items-center justify-center relative"
                  >
                    {item.status === "completed" ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-[rgba(99,102,241,0.12)] flex items-center justify-center"
                        >
                          <Play className="w-5 h-5 text-[#6366F1] ml-0.5" />
                        </div>
                        <span className="text-xs text-[#64748B]">Preview</span>
                      </div>
                    ) : item.status === "generating" ? (
                      <div className="flex flex-col items-center gap-2"
                      >
                        <div className="relative w-12 h-12"
                        >
                          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48"
                          >
                            <circle
                              cx="24" cy="24" r="20"
                              fill="none"
                              stroke="#1E293B"
                              strokeWidth="3"
                            />
                            <circle
                              cx="24" cy="24" r="20"
                              fill="none"
                              stroke="#6366F1"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeDasharray={`${(item.progress || 0) * 1.26} 126`}
                              className="transition-all duration-500"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#6366F1]"
                          >
                            {item.progress}%
                          </span>
                        </div>
                        <span className="text-xs text-[#6366F1]">Generating...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#13131F] flex items-center justify-center"
                        >
                          <span className="text-lg text-[#64748B]">⏸</span>
                        </div>
                        <span className="text-xs text-[#64748B]">Queued</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between"
                    >
                      <p className="text-sm font-semibold text-[#F8FAFC] truncate">{item.title}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === "completed"
                          ? "bg-[rgba(20,184,166,0.12)] text-[#14B8A6]"
                          : item.status === "generating"
                          ? "bg-[rgba(99,102,241,0.12)] text-[#818CF8]"
                          : "bg-[#13131F] text-[#64748B]"
                      }`}>
                        {item.status === "completed" ? "Done" : item.status === "generating" ? `${item.progress}%` : "Queued"}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B]">
                      {item.model} • {item.type === "video" ? "1080p • 5s" : "2048px"} • {item.time}
                    </p>

                    {/* Actions (completed only) */}
                    {item.status === "completed" && (
                      <div className="flex items-center gap-2 mt-1"
                      >
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#13131F] border border-[#1E293B] text-xs font-medium text-[#CBD5E1] hover:bg-[#1E293B] transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#13131F] border border-[#1E293B] text-xs font-medium text-[#CBD5E1] hover:bg-[#1E293B] transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          Share
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#13131F] border border-[#1E293B] text-xs font-medium text-[#CBD5E1] hover:bg-[#1E293B] transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
