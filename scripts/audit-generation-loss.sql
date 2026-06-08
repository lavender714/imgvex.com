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
WITH correct_costs AS (
  SELECT * FROM (VALUES
    ('seedance-2.0', 155),
    ('seedance-2.0-fast', 50),
    ('seedance-2.0-image-video', 155),
    ('seedance-2.0-fast-image-video', 155),
    ('kling-3.0', 35),
    ('kling-2.6-motion', 35),
    ('kling-o3', 35),
    ('veo-3.1-lite', 75),
    ('veo-3.1-fast', 163),
    ('veo-3.1-quality', 163),
    ('veo-3.1-lite-4k', 120),
    ('veo-3.1-fast-4k', 120),
    ('veo-3.1-quality-4k', 240),
    ('sora-2', 75),
    ('sora-2-pro', 165),
    ('grok-video', 50),
    ('runway-gen4', 6),
    ('hailuo-02', 15),
    ('hailuo-02-pro', 23),
    ('wan-2.7-image-video', 60),
    ('kling-3.0-image-video', 35),
    ('kling-2.6-motion-image-video', 35),
    ('kling-o3-image-video', 35),
    ('grok-image-video', 50),
    ('sora-2-image-video', 75),
    ('sora-2-pro-image-video', 165),
    ('runway-gen4-image-video', 6),
    ('hailuo-02-image-video', 15),
    ('hailuo-02-pro-image-video', 23),
    ('veo-3.1-fast-ref', 75),
    ('veo-3.1-lite-image-video', 75),
    ('veo-3.1-fast-image-video', 163),
    ('veo-3.1-quality-image-video', 163)
  ) AS t(model_id, correct_credits)
),
affected_logs AS (
  SELECT
    gl.*,
    COALESCE(cc.correct_credits, 10) AS correct_credits,
    COALESCE(cc.correct_credits, 10) - gl.credits_cost AS credit_loss
  FROM public.generation_logs gl
  LEFT JOIN correct_costs cc ON gl.model = cc.model_id
  WHERE gl.task_type LIKE '%video%'
    AND gl.created_at >= '2026-06-01'
    AND gl.created_at < '2026-06-09'
    AND gl.status = 'completed'
)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART A: Per-Model Summary
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECT
  model,
  task_type,
  COUNT(*) AS total_requests,
  SUM(credits_cost) AS actual_charged,
  SUM(correct_credits) AS should_charged,
  SUM(credit_loss) AS credit_loss,
  ROUND(SUM(credit_loss) * 0.01, 2) AS usd_loss
FROM affected_logs
GROUP BY model, task_type
ORDER BY usd_loss DESC;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART B: Per-User Summary (run separately, or use UNION)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Total stats
SELECT
  'TOTAL' AS metric,
  COUNT(*)::text AS value,
  ROUND(SUM(credit_loss) * 0.01, 2)::text AS usd_loss
FROM affected_logs
UNION ALL
SELECT
  'UNIQUE_USERS' AS metric,
  COUNT(DISTINCT user_id)::text AS value,
  NULL
FROM affected_logs
UNION ALL
SELECT
  'AFFECTED_USERS' AS metric,
  COUNT(DISTINCT user_id) FILTER (WHERE credit_loss > 0)::text AS value,
  NULL
FROM affected_logs;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- PART C: Per-User Breakdown (Top 20 loss makers)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WITH user_stats AS (
  SELECT
    user_id,
    COUNT(*) AS req_count,
    SUM(credits_cost) AS charged,
    SUM(correct_credits) AS correct,
    SUM(credit_loss) AS loss,
    COUNT(DISTINCT model) AS model_count,
    MIN(created_at) AS first_at,
    MAX(created_at) AS last_at
  FROM affected_logs
  GROUP BY user_id
)
SELECT
  ROW_NUMBER() OVER (ORDER BY loss DESC) AS rank,
  user_id,
  req_count,
  charged,
  correct,
  loss,
  ROUND(loss * 0.01, 2) AS usd_loss,
  model_count,
  first_at,
  last_at
FROM user_stats
ORDER BY loss DESC
LIMIT 20;
