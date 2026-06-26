-- ============================================================
-- Claw-back + period-end expiry (M4)
--
-- revoke_credits: deduct a refunded/charged-back grant from a bucket,
--   clamped at 0 (never goes negative). Idempotent per reference id.
-- expire_subscription_credits: zero the subscription bucket at period end
--   (subscription.expired). Topup credits never expire and are untouched.
-- ============================================================

-- 1. revoke_credits — claw back from a specific bucket, clamp at 0.
CREATE OR REPLACE FUNCTION public.revoke_credits(
  p_user_id uuid,
  p_amount integer,
  p_bucket text,           -- 'subscription' | 'topup'
  p_ref_id text,           -- refund id / dispute id (idempotency key)
  p_reason text DEFAULT 'manual_refund'
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sub integer;
  top integer;
  actual integer;
BEGIN
  SELECT subscription_credits, topup_credits INTO sub, top
  FROM public.profiles WHERE id = p_user_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Idempotency: this refund/dispute already clawed back
  IF EXISTS (
    SELECT 1 FROM public.credit_ledger
    WHERE user_id = p_user_id AND transaction_id = p_ref_id AND transaction_type = p_reason
  ) THEN
    RETURN 0;
  END IF;

  IF p_bucket = 'subscription' THEN
    actual := LEAST(p_amount, sub);
    UPDATE public.profiles SET subscription_credits = subscription_credits - actual WHERE id = p_user_id;
    INSERT INTO public.credit_ledger (
      user_id, transaction_id, transaction_type, amount,
      subscription_delta, topup_delta, description
    ) VALUES (
      p_user_id, p_ref_id, p_reason, -actual, -actual, 0,
      'Credits clawed back (' || p_reason || ')'
    );
  ELSE
    actual := LEAST(p_amount, top);
    UPDATE public.profiles SET topup_credits = topup_credits - actual WHERE id = p_user_id;
    INSERT INTO public.credit_ledger (
      user_id, transaction_id, transaction_type, amount,
      subscription_delta, topup_delta, description
    ) VALUES (
      p_user_id, p_ref_id, p_reason, -actual, 0, -actual,
      'Credits clawed back (' || p_reason || ')'
    );
  END IF;

  RETURN actual;
END;
$$;

COMMENT ON FUNCTION public.revoke_credits(uuid, integer, text, text, text) IS 'Claw back credits from a bucket (clamped at 0) for a refund or chargeback. Idempotent per (user, ref_id, reason). Returns the amount actually removed.';

-- 2. expire_subscription_credits — zero the subscription bucket at period end.
CREATE OR REPLACE FUNCTION public.expire_subscription_credits(
  p_user_id uuid,
  p_ref_id text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cur integer;
BEGIN
  SELECT subscription_credits INTO cur
  FROM public.profiles WHERE id = p_user_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.credit_ledger
    WHERE user_id = p_user_id AND transaction_id = p_ref_id AND transaction_type = 'subscription_expire'
  ) THEN
    RETURN false;
  END IF;

  IF cur <= 0 THEN
    RETURN false;
  END IF;

  UPDATE public.profiles SET subscription_credits = 0 WHERE id = p_user_id;
  INSERT INTO public.credit_ledger (
    user_id, transaction_id, transaction_type, amount,
    subscription_delta, topup_delta, description
  ) VALUES (
    p_user_id, p_ref_id, 'subscription_expire', -cur, -cur, 0,
    'Subscription credits expired at period end'
  );

  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.expire_subscription_credits(uuid, text) IS 'Zero the subscription bucket at period end (topup untouched). Idempotent per (user, ref_id).';

-- 3. Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
