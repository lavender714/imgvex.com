"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface ActiveTask {
  taskId: string;
  provider: string;
  type: "image" | "video";
  startTime: number;
  etaSeconds: number;
  attempts: number;
}

interface GenerationOptions {
  model: string;
  prompt: string;
  type: "image" | "video";
  [key: string]: unknown;
}

const STORAGE_KEY = "pending_generation";

export function useGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taskStatus, setTaskStatus] = useState("");
  const [genError, setGenError] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const activeTaskRef = useRef<ActiveTask | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const maxAttemptsRef = useRef(120);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, []);

  // localStorage 恢复
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && !isGenerating) {
      try {
        const task: ActiveTask = JSON.parse(saved);
        activeTaskRef.current = task;
        setIsGenerating(true);
        setResults([]);
        setGenError("");
        startPolling(task);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearTask = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    activeTaskRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
    if (isMountedRef.current) {
      setIsGenerating(false);
      setProgress(0);
      setTaskStatus("");
    }
  }, []);

  const startPolling = useCallback(
    (task: ActiveTask) => {
      let attempts = 0;

      const poll = async () => {
        if (!isMountedRef.current) return;
        if (attempts >= maxAttemptsRef.current) {
          setGenError("Generation timed out");
          setProgress(0);
          clearTask();
          return;
        }
        attempts++;

        const elapsed = (Date.now() - task.startTime) / 1000;
        const switchDelay = (task.attempts - 1) * 3;
        const totalEta = task.etaSeconds + switchDelay;
        const rawProgress = Math.min((elapsed / totalEta) * 100, 95);
        setProgress(Math.round(rawProgress));

        try {
          const res = await fetch(
            `/api/generate/status?taskId=${task.taskId}&provider=${task.provider}&type=${task.type}`
          );
          const data = await res.json();
          const status = data.data?.status || data.status || "unknown";
          const remaining = Math.max(0, Math.ceil(totalEta - elapsed));

          const statusText =
            status === "pending"
              ? `Queued... ~${remaining}s`
              : status === "processing"
              ? `Generating... ~${remaining}s`
              : status;

          setTaskStatus(statusText);

          if (status === "completed" || status === "success") {
            const urls = data.data?.result || data.result || [];
            setResults(urls);
            setProgress(100);
            clearTask();
            return;
          }

          if (status === "failed" || status === "error") {
            setGenError(data.data?.error || data.error || "Generation failed");
            setProgress(0);
            clearTask();
            return;
          }

          const delay = attempts < 3 ? 1500 : attempts < 10 ? 3000 : 5000;
          pollTimerRef.current = setTimeout(poll, delay);
        } catch (err: any) {
          setGenError(err.message || "Polling failed");
          setProgress(0);
          clearTask();
        }
      };

      poll();
    },
    [clearTask]
  );

  const generate = useCallback(
    async (options: GenerationOptions) => {
      setIsGenerating(true);
      setGenError("");
      setResults([]);
      setProgress(0);
      setTaskStatus("Submitting...");

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(options),
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || `Failed: ${res.status}`);
        }

        const task: ActiveTask = {
          taskId: data.data.task_id,
          provider: data.data.provider,
          type: options.type,
          startTime: Date.now(),
          etaSeconds: data.data.eta_seconds || 30,
          attempts: data.data.attempts || 1,
        };

        activeTaskRef.current = task;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(task));

        if (task.attempts > 1) {
          setTaskStatus(`Switched to backup provider...`);
        }

        startPolling(task);
      } catch (err: any) {
        setGenError(err.message || "Generation failed");
        setIsGenerating(false);
        setProgress(0);
        setTaskStatus("");
      }
    },
    [startPolling]
  );

  const cancel = useCallback(() => {
    clearTask();
    setGenError("Cancelled");
  }, [clearTask]);

  return {
    isGenerating,
    progress,
    taskStatus,
    genError,
    results,
    generate,
    cancel,
    clearError: () => setGenError(""),
  };
}
