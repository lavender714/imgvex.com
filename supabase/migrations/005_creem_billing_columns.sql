-- ============================================================
-- Creem billing integration: link profiles to Creem customer/subscription
--
-- Adds two columns to public.profiles so the Creem webhook handler
-- can locate the row for a customer/subscription event.
-- Idempotent (uses IF NOT EXISTS).
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS creem_customer_id text,
  ADD COLUMN IF NOT EXISTS creem_subscription_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_creem_customer_id
  ON public.profiles(creem_customer_id)
  WHERE creem_customer_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_creem_subscription_id
  ON public.profiles(creem_subscription_id)
  WHERE creem_subscription_id IS NOT NULL;

COMMENT ON COLUMN public.profiles.creem_customer_id IS 'Creem customer ID, set on first successful subscription payment';
COMMENT ON COLUMN public.profiles.creem_subscription_id IS 'Active Creem subscription ID; nullable when no active subscription';
