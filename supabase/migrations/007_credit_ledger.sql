-- ============================================================
-- Credit ledger + two-bucket balance (M1: stop the money bug)
--
-- Splits credits into two materialized buckets on profiles:
--   subscription_credits  — granted monthly, reset/expire each period
--   topup_credits         — one-time packs, never expire
-- profiles.credits_balance is kept as the maintained TOTAL via trigger,
-- so all existing display code keeps reading it unchanged.
--
-- credit_ledger is an append-only audit trail + idempotency guard.
-- grant_subscription_credits / grant_topup_credits are idempotent, so
-- Creem webhook retries and the subscription.paid + subscription.active
-- double-event can no longer double-grant credits.
-- ============================================================

-- 1. Bucket columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_credits integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS topup_credits        integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.profiles.subscription_credits IS 'Monthly subscription credits; reset to the tier amount each billing period (use-it-or-lose-it).';
COMMENT ON COLUMN public.profiles.topup_credits IS 'One-time top-up pack credits; never expire. Spent only after subscription_credits run out.';

-- 2. Ledger table
CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id     text NOT NULL,        -- creem txn id / checkout id / generation_logs.id / 'migration:'||id
  transaction_type   text NOT NULL,        -- subscription_grant | subscription_expire | topup_grant | spend | refund | manual_refund
  amount             integer NOT NULL,     -- signed total (+grant, -spend)
  subscription_delta integer NOT NULL DEFAULT 0,
  topup_delta        integer NOT NULL DEFAULT 0,
  generation_id      uuid REFERENCES public.generation_logs(id) ON DELETE SET NULL,
  model_id           text,
  description        text,
  created_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.credit_ledger IS 'Append-only credit transaction log. Source of truth for audit, idempotency, and refundability.';

-- Idempotency: one row per (user, external event, type). A renewal produces two
-- rows (subscription_expire + subscription_grant) with different types, so both fit.
CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_ledger_idem
  ON public.credit_ledger(user_id, transaction_id, transaction_type);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_created
  ON public.credit_ledger(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_generation
  ON public.credit_ledger(generation_id);

-- RLS: users may read their own ledger; only service role writes.
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own ledger" ON public.credit_ledger;
CREATE POLICY "Users can view their own ledger"
  ON public.credit_ledger FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Trigger owns credits_balance = subscription_credits + topup_credits
CREATE OR REPLACE FUNCTION public.maintain_credit_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET credits_balance = subscription_credits + topup_credits,
      updated_at = now()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS credit_ledger_change ON public.credit_ledger;
CREATE TRIGGER credit_ledger_change
  AFTER INSERT ON public.credit_ledger
  FOR EACH ROW
  EXECUTE FUNCTION public.maintain_credit_balance();

-- 4. Backfill: treat existing credits_balance as never-expire topup credits so
--    nobody loses credits at cutover. Set buckets FIRST, then write the synthetic
--    ledger row (the trigger recomputes credits_balance = 0 + topup = same value).
UPDATE public.profiles
SET topup_credits = credits_balance,
    subscription_credits = 0
WHERE subscription_credits = 0 AND topup_credits = 0;

INSERT INTO public.credit_ledger (
  user_id, transaction_id, transaction_type, amount,
  subscription_delta, topup_delta, description
)
SELECT id, 'migration:' || id, 'topup_grant', credits_balance,
       0, credits_balance, 'Initial balance migrated to topup bucket'
FROM public.profiles
WHERE credits_balance > 0
ON CONFLICT (user_id, transaction_id, transaction_type) DO NOTHING;

-- 5. grant_subscription_credits — idempotent per creem transaction id.
--    Expires leftover subscription credits, then sets the new monthly amount.
CREATE OR REPLACE FUNCTION public.grant_subscription_credits(
  p_user_id uuid,
  p_transaction_id text,
  p_amount integer,
  p_period_end timestamptz DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prev_sub integer;
BEGIN
  -- Lock the profile row
  SELECT subscription_credits INTO prev_sub
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Idempotency: already granted for this transaction
  IF EXISTS (
    SELECT 1 FROM public.credit_ledger
    WHERE user_id = p_user_id
      AND transaction_id = p_transaction_id
      AND transaction_type = 'subscription_grant'
  ) THEN
    RETURN false;
  END IF;

  -- Expire any leftover subscription credits from the prior period
  IF prev_sub > 0 THEN
    INSERT INTO public.credit_ledger (
      user_id, transaction_id, transaction_type, amount,
      subscription_delta, topup_delta, description
    ) VALUES (
      p_user_id, p_transaction_id || ':expire', 'subscription_expire', -prev_sub,
      -prev_sub, 0, 'Expired previous subscription credits'
    );
  END IF;

  -- Set the new subscription bucket (absolute, not additive)
  UPDATE public.profiles
  SET subscription_credits = p_amount
  WHERE id = p_user_id;

  -- Record the grant (trigger recomputes credits_balance)
  INSERT INTO public.credit_ledger (
    user_id, transaction_id, transaction_type, amount,
    subscription_delta, topup_delta, description
  ) VALUES (
    p_user_id, p_transaction_id, 'subscription_grant', p_amount,
    p_amount - COALESCE(prev_sub, 0), 0,
    'Subscription credit grant'
    || CASE WHEN p_period_end IS NOT NULL THEN ' (period ends ' || p_period_end || ')' ELSE '' END
  );

  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.grant_subscription_credits(uuid, text, integer, timestamptz) IS 'Idempotent per (user, transaction_id). Expires prior subscription credits and sets the new monthly amount. Returns true if newly granted, false if duplicate.';

-- 6. grant_topup_credits — idempotent per checkout id. Adds to topup bucket.
CREATE OR REPLACE FUNCTION public.grant_topup_credits(
  p_user_id uuid,
  p_transaction_id text,
  p_amount integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM 1 FROM public.profiles WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.credit_ledger
    WHERE user_id = p_user_id
      AND transaction_id = p_transaction_id
      AND transaction_type = 'topup_grant'
  ) THEN
    RETURN false;
  END IF;

  UPDATE public.profiles
  SET topup_credits = topup_credits + p_amount
  WHERE id = p_user_id;

  INSERT INTO public.credit_ledger (
    user_id, transaction_id, transaction_type, amount,
    subscription_delta, topup_delta, description
  ) VALUES (
    p_user_id, p_transaction_id, 'topup_grant', p_amount,
    0, p_amount, 'Top-up credit pack purchase'
  );

  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.grant_topup_credits(uuid, text, integer) IS 'Idempotent per (user, transaction_id). Adds never-expiring credits to the topup bucket. Returns true if newly granted, false if duplicate.';

-- 7. Disable the old monthly reset cron — per-renewal grants replace it.
--    Leaving it scheduled would overwrite credits_balance and fight the buckets.
SELECT cron.unschedule('monthly-credits-reset')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'monthly-credits-reset');

-- 8. Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- 9. Verification
SELECT id, plan_tier, credits_balance, subscription_credits, topup_credits
FROM public.profiles
ORDER BY updated_at DESC
LIMIT 10;
