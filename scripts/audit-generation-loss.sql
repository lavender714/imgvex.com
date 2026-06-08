-- ============================================================
-- Audit: Calculate revenue loss from mispriced video generations
-- Run this in Supabase SQL Editor
--
-- Context: MODEL_CREDIT_COSTS used providerModelId as keys
-- but calculateGenerationCost() received MODEL_REGISTRY id.
-- All video models with mismatched keys fell back to default 10 credits.
-- ============================================================

-- Step 1: Show all video generation logs from the affected period
-- (Jun 1 ~ Jun 8, before maintenance mode was applied)
SELECT
  model,
  task_type,
  COUNT(*) AS total_requests,
  SUM(credits_cost) AS actual_charged_credits,
  -- Correct credits based on current fixed MODEL_CREDIT_COSTS mapping
  CASE model
    WHEN 'seedance-2.0'            THEN 155
    WHEN 'seedance-2.0-fast'       THEN 50
    WHEN 'seedance-2.0-image-video' THEN 155
    WHEN 'seedance-2.0-fast-image-video' THEN 155
    WHEN 'kling-3.0'               THEN 35
    WHEN 'kling-2.6-motion'        THEN 35
    WHEN 'kling-o3'                THEN 35
    WHEN 'veo-3.1-lite'            THEN 75
    WHEN 'veo-3.1-fast'            THEN 163
    WHEN 'veo-3.1-quality'         THEN 163
    WHEN 'veo-3.1-lite-4k'         THEN 120
    WHEN 'veo-3.1-fast-4k'         THEN 120
    WHEN 'veo-3.1-quality-4k'      THEN 240
    WHEN 'sora-2'                  THEN 75
    WHEN 'sora-2-pro'              THEN 165
    WHEN 'grok-video'              THEN 50
    WHEN 'runway-gen4'             THEN 6
    WHEN 'hailuo-02'               THEN 15
    WHEN 'hailuo-02-pro'           THEN 23
    WHEN 'hailuo-02-image-video'   THEN 15
    WHEN 'hailuo-02-pro-image-video' THEN 23
    WHEN 'wan-2.7-image-video'     THEN 60
    WHEN 'kling-3.0-image-video'   THEN 35
    WHEN 'kling-2.6-motion-image-video' THEN 35
    WHEN 'kling-o3-image-video'    THEN 35
    WHEN 'grok-image-video'        THEN 50
    WHEN 'sora-2-image-video'      THEN 75
    WHEN 'sora-2-pro-image-video'  THEN 165
    WHEN 'runway-gen4-image-video' THEN 6
    WHEN 'veo-3.1-fast-ref'        THEN 75
    WHEN 'veo-3.1-lite-image-video' THEN 75
    WHEN 'veo-3.1-fast-image-video' THEN 163
    WHEN 'veo-3.1-quality-image-video' THEN 163
    ELSE 10
  END AS correct_credits_per_request,
  SUM(credits_cost) - (COUNT(*) * CASE model
    WHEN 'seedance-2.0'            THEN 155
    WHEN 'seedance-2.0-fast'       THEN 50
    WHEN 'seedance-2.0-image-video' THEN 155
    WHEN 'seedance-2.0-fast-image-video' THEN 155
    WHEN 'kling-3.0'               THEN 35
    WHEN 'kling-2.6-motion'        THEN 35
    WHEN 'kling-o3'                THEN 35
    WHEN 'veo-3.1-lite'            THEN 75
    WHEN 'veo-3.1-fast'            THEN 163
    WHEN 'veo-3.1-quality'         THEN 163
    WHEN 'veo-3.1-lite-4k'         THEN 120
    WHEN 'veo-3.1-fast-4k'         THEN 120
    WHEN 'veo-3.1-quality-4k'      THEN 240
    WHEN 'sora-2'                  THEN 75
    WHEN 'sora-2-pro'              THEN 165
    WHEN 'grok-video'              THEN 50
    WHEN 'runway-gen4'             THEN 6
    WHEN 'hailuo-02'               THEN 15
    WHEN 'hailuo-02-pro'           THEN 23
    WHEN 'hailuo-02-image-video'   THEN 15
    WHEN 'hailuo-02-pro-image-video' THEN 23
    WHEN 'wan-2.7-image-video'     THEN 60
    WHEN 'kling-3.0-image-video'   THEN 35
    WHEN 'kling-2.6-motion-image-video' THEN 35
    WHEN 'kling-o3-image-video'    THEN 35
    WHEN 'grok-image-video'        THEN 50
    WHEN 'sora-2-image-video'      THEN 75
    WHEN 'sora-2-pro-image-video'  THEN 165
    WHEN 'runway-gen4-image-video' THEN 6
    WHEN 'veo-3.1-fast-ref'        THEN 75
    WHEN 'veo-3.1-lite-image-video' THEN 75
    WHEN 'veo-3.1-fast-image-video' THEN 163
    WHEN 'veo-3.1-quality-image-video' THEN 163
    ELSE 10
  END) AS credit_loss,
  ROUND((COUNT(*) * CASE model
    WHEN 'seedance-2.0'            THEN 155
    WHEN 'seedance-2.0-fast'       THEN 50
    WHEN 'seedance-2.0-image-video' THEN 155
    WHEN 'seedance-2.0-fast-image-video' THEN 155
    WHEN 'kling-3.0'               THEN 35
    WHEN 'kling-2.6-motion'        THEN 35
    WHEN 'kling-o3'                THEN 35
    WHEN 'veo-3.1-lite'            THEN 75
    WHEN 'veo-3.1-fast'            THEN 163
    WHEN 'veo-3.1-quality'         THEN 163
    WHEN 'veo-3.1-lite-4k'         THEN 120
    WHEN 'veo-3.1-fast-4k'         THEN 120
    WHEN 'veo-3.1-quality-4k'      THEN 240
    WHEN 'sora-2'                  THEN 75
    WHEN 'sora-2-pro'              THEN 165
    WHEN 'grok-video'              THEN 50
    WHEN 'runway-gen4'             THEN 6
    WHEN 'hailuo-02'               THEN 15
    WHEN 'hailuo-02-pro'           THEN 23
    WHEN 'hailuo-02-image-video'   THEN 15
    WHEN 'hailuo-02-pro-image-video' THEN 23
    WHEN 'wan-2.7-image-video'     THEN 60
    WHEN 'kling-3.0-image-video'   THEN 35
    WHEN 'kling-2.6-motion-image-video' THEN 35
    WHEN 'kling-o3-image-video'    THEN 35
    WHEN 'grok-image-video'        THEN 50
    WHEN 'sora-2-image-video'      THEN 75
    WHEN 'sora-2-pro-image-video'  THEN 165
    WHEN 'runway-gen4-image-video' THEN 6
    WHEN 'veo-3.1-fast-ref'        THEN 75
    WHEN 'veo-3.1-lite-image-video' THEN 75
    WHEN 'veo-3.1-fast-image-video' THEN 163
    WHEN 'veo-3.1-quality-image-video' THEN 163
    ELSE 10
  END - SUM(credits_cost)) * 0.01, 2) AS usd_loss
FROM public.generation_logs
WHERE task_type LIKE '%video%'
  AND created_at >= '2026-06-01'
  AND created_at < '2026-06-09'
  AND status = 'completed'
GROUP BY model, task_type
ORDER BY usd_loss DESC;

-- Step 2: Total summary across all video models
SELECT
  COUNT(*) AS total_video_requests,
  SUM(credits_cost) AS total_charged,
  -- total correct credits would need per-row calculation
  -- Simplified: show total charged vs estimated default fallback
  COUNT(*) FILTER (WHERE credits_cost = 10) AS fallback_charged_requests,
  SUM(credits_cost) FILTER (WHERE credits_cost = 10) AS fallback_charged_credits
FROM public.generation_logs
WHERE task_type LIKE '%video%'
  AND created_at >= '2026-06-01'
  AND created_at < '2026-06-09'
  AND status = 'completed';
