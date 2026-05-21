-- ============================================================
-- Monthly credits reset for paid tiers
--
-- On the 1st of each month, paid tiers (lite/pro/ultra) get their
-- credits_balance reset to credits_monthly. No carry-over.
-- Free tier is excluded — those users keep their one-time 25 starter
-- credits until consumed.
-- ============================================================

-- 1. Reset function
CREATE OR REPLACE FUNCTION public.reset_monthly_credits()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rows_updated integer;
BEGIN
  UPDATE public.profiles
  SET credits_balance = credits_monthly,
      updated_at = now()
  WHERE plan_tier IN ('lite', 'pro', 'ultra')
    AND credits_monthly > 0;

  GET DIAGNOSTICS rows_updated = ROW_COUNT;

  INSERT INTO public.generation_logs (user_id, model, task_type, prompt, credits_cost, status)
  SELECT id, '__system__', '__monthly_reset__',
         'Monthly credits reset to ' || credits_monthly,
         0, 'completed'
  FROM public.profiles
  WHERE plan_tier IN ('lite', 'pro', 'ultra')
    AND credits_monthly > 0;

  RETURN rows_updated;
END;
$$;

COMMENT ON FUNCTION public.reset_monthly_credits IS 'Reset credits_balance to credits_monthly for paid tiers on the 1st of every month. No carry-over.';

-- 2. Schedule via pg_cron (Supabase has this extension available)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove old schedule if re-running
SELECT cron.unschedule('monthly-credits-reset')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'monthly-credits-reset');

-- Run at 00:05 UTC on the 1st of every month
SELECT cron.schedule(
  'monthly-credits-reset',
  '5 0 1 * *',
  $$SELECT public.reset_monthly_credits()$$
);

-- 3. Verification
SELECT jobname, schedule, command FROM cron.job WHERE jobname = 'monthly-credits-reset';
