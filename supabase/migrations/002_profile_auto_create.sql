-- ============================================================
-- Phase 2: Auto-create public.profiles row on new auth.users signup
-- Fixes bug where users had no profile row, causing credits to show 0.
-- ============================================================

-- 1. Function that runs after auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, plan_tier, credits_balance, credits_monthly)
  VALUES (NEW.id, 'free', 25, 0)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user IS 'Auto-creates profiles row with 25 starter credits when a new auth user is created';

-- 2. Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill missing profile rows for users who signed up before this trigger existed
INSERT INTO public.profiles (id, plan_tier, credits_balance, credits_monthly)
SELECT u.id, 'free', 25, 0
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
