"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface VideoParams {
  duration: "3" | "5" | "10" | "15" | "16";
  aspectRatio: "16:9" | "9:16" | "4:3" | "3:4" | "1:1" | "21:9";
  resolution: "480p" | "720p" | "1080p" | "4K";
  model: string;
}

export interface ImageParams {
  quantity: "1" | "2" | "4";
  aspectRatio: "16:9" | "9:16" | "4:3" | "3:4" | "1:1" | "21:9";
  model: string;
}

interface ParamPillsProps {
  mode: "video" | "image";
  params: VideoParams | ImageParams;
  onChange: (params: VideoParams | ImageParams) => void;
}

const videoModels = [
  { id: "kling-2", name: "Kling 2.0", cost: 20 },
  { id: "runway-gen4", name: "Runway Gen-4", cost: 20 },
  { id: "pika-2", name: "Pika 2.0", cost: 10 },
  { id: "luma-dream", name: "Luma Dream Machine", cost: 10 },
  { id: "stable-video", name: "Stable Video", cost: 10 },
];

const imageModels = [
  { id: "midjourney-v7", name: "Midjourney v7", cost: 4 },
  { id: "flux-pro", name: "Flux Pro", cost: 4 },
  { id: "dalle-4", name: "DALL-E 4", cost: 4 },
];

export function ParamPills({ mode, params, onChange }: ParamPillsProps) {
  const models = mode === "video" ? videoModels : imageModels;
  const isVideo = mode === "video";

  const updateParam = (
    key: string,
    value: string
  ) => {
    onChange({ ...params, [key]: value } as VideoParams | ImageParams);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Model Selector */}
      <Select value={params.model} onValueChange={(v) => updateParam("model", v)}>
        <SelectTrigger className="h-9 pl-3 pr-2 gap-1.5 rounded-full bg-[#13101F] border-[#1E293B] text-xs font-medium text-[#CBD5E1] hover:border-[#475569] transition-colors">
          <SelectValue />
          <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
        </SelectTrigger>
        <SelectContent className="bg-[#13101F] border-[#1E293B]">
          {models.map((m) => (
            <SelectItem key={m.id} value={m.id} className="text-xs text-[#CBD5E1] focus:bg-[#1E293B] focus:text-[#F8FAFC]">
              <div className="flex items-center justify-between w-full">
                <span>{m.name}</span>
                <span className="text-[10px] text-[#64748B] ml-4">{m.cost} cr</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Duration (Video only) */}
      {isVideo && (
        <Select value={(params as VideoParams).duration} onValueChange={(v) => updateParam("duration", v as VideoParams["duration"])}>
          <SelectTrigger className="h-9 pl-3 pr-2 gap-1.5 rounded-full bg-[#13101F] border-[#1E293B] text-xs font-medium text-[#CBD5E1] hover:border-[#475569] transition-colors">
            <SelectValue />
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </SelectTrigger>
          <SelectContent className="bg-[#13101F] border-[#1E293B]">
            {["3", "5", "10", "15", "16"].map((v) => (
              <SelectItem key={v} value={v} className="text-xs text-[#CBD5E1] focus:bg-[#1E293B] focus:text-[#F8FAFC]">{v}s</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Quantity (Image only) */}
      {!isVideo && (
        <Select value={(params as ImageParams).quantity} onValueChange={(v) => updateParam("quantity", v as ImageParams["quantity"])}>
          <SelectTrigger className="h-9 pl-3 pr-2 gap-1.5 rounded-full bg-[#13101F] border-[#1E293B] text-xs font-medium text-[#CBD5E1] hover:border-[#475569] transition-colors">
            <SelectValue />
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </SelectTrigger>
          <SelectContent className="bg-[#13101F] border-[#1E293B]">
            {["1", "2", "4"].map((v) => (
              <SelectItem key={v} value={v} className="text-xs text-[#CBD5E1] focus:bg-[#1E293B] focus:text-[#F8FAFC]">
                {v} image{v !== "1" ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Aspect Ratio */}
      <Select value={params.aspectRatio} onValueChange={(v) => updateParam("aspectRatio", v as VideoParams["aspectRatio"])}>
        <SelectTrigger className="h-9 pl-3 pr-2 gap-1.5 rounded-full bg-[#13101F] border-[#1E293B] text-xs font-medium text-[#CBD5E1] hover:border-[#475569] transition-colors">
          <SelectValue />
          <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
        </SelectTrigger>
        <SelectContent className="bg-[#13101F] border-[#1E293B]">
          {["16:9", "9:16", "4:3", "3:4", "1:1", "21:9"].map((v) => (
            <SelectItem key={v} value={v} className="text-xs text-[#CBD5E1] focus:bg-[#1E293B] focus:text-[#F8FAFC]">{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Resolution (Video only) */}
      {isVideo && (
        <Select value={(params as VideoParams).resolution} onValueChange={(v) => updateParam("resolution", v as VideoParams["resolution"])}>
          <SelectTrigger className="h-9 pl-3 pr-2 gap-1.5 rounded-full bg-[#13101F] border-[#1E293B] text-xs font-medium text-[#CBD5E1] hover:border-[#475569] transition-colors">
            <SelectValue />
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </SelectTrigger>
          <SelectContent className="bg-[#13101F] border-[#1E293B]">
            {["480p", "720p", "1080p", "4K"].map((v) => (
              <SelectItem key={v} value={v} className="text-xs text-[#CBD5E1] focus:bg-[#1E293B] focus:text-[#F8FAFC]">{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Auto toggle */}
      <button className="h-9 pl-3 pr-3 gap-1.5 rounded-full bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.25)] text-xs font-medium text-[#14B8A6] hover:bg-[rgba(20,184,166,0.15)] transition-colors flex items-center">
        <Sparkles className="w-3.5 h-3.5" />
        Auto
      </button>
    </div>
  );
}
