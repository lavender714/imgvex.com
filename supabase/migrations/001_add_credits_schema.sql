-- ============================================================
-- Phase 1: Credits schema for imgvex.AI
-- ============================================================

-- 1. Extend profiles table with plan & credits fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS plan_tier text NOT NULL DEFAULT 'free',
ADD COLUMN IF NOT EXISTS credits_balance integer NOT NULL DEFAULT 25,
ADD COLUMN IF NOT EXISTS credits_monthly integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS plan_started_at timestamptz,
ADD COLUMN IF NOT EXISTS plan_ends_at timestamptz;

COMMENT ON COLUMN public.profiles.plan_tier IS 'free | lite | pro | ultra';
COMMENT ON COLUMN public.profiles.credits_balance IS 'Current available credits';
COMMENT ON COLUMN public.profiles.credits_monthly IS 'Monthly recurring credits (e.g. 200 for Pro)';

-- 2. Create generation_logs table
CREATE TABLE IF NOT EXISTS public.generation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id text,
  provider text,
  model text NOT NULL,
  task_type text NOT NULL,
  prompt text,
  credits_cost integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

COMMENT ON TABLE public.generation_logs IS 'Audit log for every generation request with credits cost';

-- 3. Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_generation_logs_user_id ON public.generation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_task_id ON public.generation_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_created_at ON public.generation_logs(created_at DESC);

-- 4. Atomic credits deduction function (prevents race conditions)
CREATE OR REPLACE FUNCTION public.deduct_credits(p_user_id uuid, p_amount integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance integer;
  current_tier text;
BEGIN
  -- Lock the row to prevent concurrent deductions
  SELECT credits_balance, plan_tier
  INTO current_balance, current_tier
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  -- Ultra tier is unlimited
  IF current_tier = 'ultra' THEN
    RETURN true;
  END IF;

  IF current_balance IS NULL OR current_balance < p_amount THEN
    RETURN false;
  END IF;

  UPDATE public.profiles
  SET credits_balance = credits_balance - p_amount
  WHERE id = p_user_id;

  RETURN true;
END;
$$;

-- 5. Row Level Security (RLS) policies for generation_logs
ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generation logs"
  ON public.generation_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert generation logs"
  ON public.generation_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service can update their own generation logs"
  ON public.generation_logs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. Ensure profiles RLS allows users to read their own credits
CREATE POLICY IF NOT EXISTS "Users can read own credits"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own credits"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
