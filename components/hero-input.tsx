"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Upload, X } from "lucide-react";

interface HeroInputProps {
  value: string;
  onChange: (value: string) => void;
  quickPrompts?: string[];
  onQuickPrompt?: (prompt: string) => void;
  onEnhance?: () => void;
}

const defaultQuickPrompts = [
  "Cinematic drone shot over misty mountains at golden hour",
  "Cyberpunk cityscape with neon reflections on wet streets",
  "Abstract fluid art with iridescent colors",
  "Product showcase with dramatic studio lighting",
  "Slow-motion ocean waves crashing on black sand",
];

export function HeroInput({
  value,
  onChange,
  quickPrompts = defaultQuickPrompts,
  onQuickPrompt,
  onEnhance,
}: HeroInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleQuickPrompt = (prompt: string) => {
    onChange(prompt);
    onQuickPrompt?.(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Input */}
      <div
        className={`relative rounded-[20px] border transition-all duration-200 ${
          isFocused
            ? "border-[#6366F1] shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
            : "border-[#1E293B]"
        }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter your idea to generate..."
          className="w-full min-h-[120px] p-5 pb-14 rounded-[20px] bg-[#13101F] text-base text-[#CBD5E1] placeholder:text-[#475569] resize-none outline-none"
          maxLength={2000}
        />

        {/* Bottom Toolbar */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2"
        >
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#64748B] hover:bg-[#1E293B] transition-colors"
        >
              <Upload className="w-3.5 h-3.5" />
              Upload
            </button>
            <span className="text-[11px] text-[#475569]"
        >
              {value.length} / 2000
            </span>
          </div>

          <div className="flex items-center gap-2"
        >
            {value.length > 0 && (
              <button
                onClick={() => onChange("")}
                className="p-1.5 rounded-md text-[#475569] hover:bg-[#1E293B] hover:text-[#94A3B8] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onEnhance}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(99,102,241,0.12)] text-xs font-medium text-[#818CF8] hover:bg-[rgba(99,102,241,0.2)] transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Enhance
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <AnimatePresence>
        {isFocused && value.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-3 py-1.5 rounded-full bg-[#13101F] border border-[#1E293B] text-xs text-[#64748B] hover:border-[#475569] hover:text-[#CBD5E1] transition-colors"
              >
                {prompt.length > 40 ? prompt.slice(0, 40) + "..." : prompt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
