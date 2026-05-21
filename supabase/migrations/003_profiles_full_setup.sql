-- ============================================================
-- Complete profiles + credits + generation_logs setup
--
-- This migration supersedes 001 and 002. It's fully idempotent —
-- safe to re-run on any environment. Use this for fresh deploys.
-- Migration 001 assumed public.profiles already existed (which it
-- didn't in production), so its ALTER TABLE silently no-op'd and
-- broke the entire credits system.
-- ============================================================

-- 1. profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  plan_tier text NOT NULL DEFAULT 'free',
  credits_balance integer NOT NULL DEFAULT 25,
  credits_monthly integer NOT NULL DEFAULT 0,
  plan_started_at timestamptz,
  plan_ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'User profiles with credits and plan info';
COMMENT ON COLUMN public.profiles.plan_tier IS 'free | lite | pro | ultra';
COMMENT ON COLUMN public.profiles.credits_balance IS 'Current available credits';
COMMENT ON COLUMN public.profiles.credits_monthly IS 'Monthly recurring credit grant (e.g. 800 for Pro)';

-- 2. RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. generation_logs table
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

CREATE INDEX IF NOT EXISTS idx_generation_logs_user_id ON public.generation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_task_id ON public.generation_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_created_at ON public.generation_logs(created_at DESC);

ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own generation logs" ON public.generation_logs;
CREATE POLICY "Users can view their own generation logs"
  ON public.generation_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own generation logs" ON public.generation_logs;
CREATE POLICY "Users can insert their own generation logs"
  ON public.generation_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own generation logs" ON public.generation_logs;
CREATE POLICY "Users can update their own generation logs"
  ON public.generation_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Atomic credit deduction
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

-- 5. Auto-create profile row when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, plan_tier, credits_balance, credits_monthly)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'free',
    25,
    0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Backfill: create profile rows for existing auth users without one
INSERT INTO public.profiles (id, email, full_name, avatar_url, plan_tier, credits_balance, credits_monthly)
SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'full_name',
  u.raw_user_meta_data->>'avatar_url',
  'free',
  25,
  0
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 7. Verification query (read-only, prints state of the world)
SELECT
  (SELECT count(*) FROM auth.users) AS total_users,
  (SELECT count(*) FROM public.profiles) AS total_profiles,
  (SELECT count(*) FROM public.profiles WHERE credits_balance = 25) AS with_starter_credits;
