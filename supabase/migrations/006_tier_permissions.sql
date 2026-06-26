-- ============================================================
-- Tier permissions + Unlimited models for Ultra promo
--
-- Adds permission fields to profiles and updates deduct_credits
-- to support unlimited model access (Ultra promo).
-- ============================================================

-- 1. Add permission columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS max_image_resolution text DEFAULT '1024x1024',
  ADD COLUMN IF NOT EXISTS max_video_resolution text,
  ADD COLUMN IF NOT EXISTS max_video_duration integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_concurrent_jobs integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS has_watermark boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS commercial_license boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS priority_queue boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS privacy_controls boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS copy_protection boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS unlimited_models jsonb DEFAULT '{}';

COMMENT ON COLUMN public.profiles.unlimited_models IS 'JSONB map of model_id -> {type, expires_at} for unlimited access';
COMMENT ON COLUMN public.profiles.has_watermark IS 'Whether outputs include watermark';
COMMENT ON COLUMN public.profiles.priority_queue IS 'Whether to use priority processing queue';

-- 2. Backfill existing profiles based on plan_tier
UPDATE public.profiles SET
  max_image_resolution = CASE plan_tier
    WHEN 'free' THEN '1024x1024'
    WHEN 'lite' THEN '2048x2048'
    ELSE '4096x4096'
  END,
  max_video_resolution = CASE plan_tier
    WHEN 'free' THEN null
    WHEN 'lite' THEN '720p'
    WHEN 'pro' THEN '1080p'
    ELSE '4K'
  END,
  max_video_duration = CASE plan_tier
    WHEN 'free' THEN 0
    WHEN 'lite' THEN 10
    WHEN 'pro' THEN 15
    ELSE 60
  END,
  max_concurrent_jobs = CASE plan_tier
    WHEN 'free' THEN 1
    WHEN 'lite' THEN 2
    WHEN 'pro' THEN 3
    ELSE 6
  END,
  has_watermark = (plan_tier IN ('free', 'lite')),
  commercial_license = (plan_tier IN ('lite', 'pro', 'ultra')),
  priority_queue = (plan_tier IN ('pro', 'ultra')),
  privacy_controls = (plan_tier IN ('pro', 'ultra')),
  copy_protection = (plan_tier IN ('pro', 'ultra')),
  unlimited_models = '{}'::jsonb
WHERE true;

-- 3. Replace deduct_credits with model-aware version
-- Drop the old 2-arg version first; otherwise the new 3-arg overload
-- (p_model_id has a DEFAULT) collides with it on 2-arg calls.
DROP FUNCTION IF EXISTS public.deduct_credits(uuid, integer);

CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id uuid,
  p_amount integer,
  p_model_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance integer;
  current_tier text;
  unlimited_entry jsonb;
BEGIN
  SELECT credits_balance, plan_tier, unlimited_models
  INTO current_balance, current_tier, unlimited_entry
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  -- Check if this specific model is in the user's unlimited list and not expired
  IF p_model_id IS NOT NULL AND unlimited_entry IS NOT NULL THEN
    IF (unlimited_entry->p_model_id->>'expires_at')::timestamptz > now() THEN
      RETURN true;
    END IF;
  END IF;

  -- Fall back to normal credit deduction
  IF current_balance IS NULL OR current_balance < p_amount THEN
    RETURN false;
  END IF;

  UPDATE public.profiles
  SET credits_balance = credits_balance - p_amount
  WHERE id = p_user_id;

  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.deduct_credits(uuid, integer, text) IS 'Atomically deduct credits. If p_model_id is provided and exists in unlimited_models with a future expires_at, returns true without deducting.';

-- 4. Helper function: count active concurrent jobs for a user
CREATE OR REPLACE FUNCTION public.count_active_jobs(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  job_count integer;
BEGIN
  SELECT COUNT(*)::integer INTO job_count
  FROM public.generation_logs
  WHERE user_id = p_user_id
    AND status IN ('pending', 'processing')
    AND created_at > now() - interval '30 minutes';

  RETURN job_count;
END;
$$;

-- 5. Verification
SELECT
  plan_tier,
  count(*) as user_count,
  max_concurrent_jobs,
  has_watermark,
  priority_queue
FROM public.profiles
GROUP BY plan_tier, max_concurrent_jobs, has_watermark, priority_queue
ORDER BY plan_tier;
