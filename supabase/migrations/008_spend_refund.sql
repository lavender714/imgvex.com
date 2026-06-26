-- ============================================================
-- Spend + refund on the credit ledger (M2)
--
-- spend_credits replaces deduct_credits: deducts subscription credits
-- first, then topup, recording the per-bucket split so a refund can
-- restore the exact buckets. refund_generation_credits returns a failed
-- generation's credits. Both lock the profile row BEFORE the idempotency
-- check so concurrent status pollers cannot double-spend or double-refund.
-- ============================================================

-- 1. spend_credits — subscription-first, then topup. Idempotent per generation.
CREATE OR REPLACE FUNCTION public.spend_credits(
  p_user_id uuid,
  p_generation_id uuid,
  p_amount integer,
  p_model_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sub integer;
  top integer;
  unlimited_entry jsonb;
  sub_spend integer;
  top_spend integer;
BEGIN
  -- Lock the profile row (serializes concurrent spends for this user)
  SELECT subscription_credits, topup_credits, unlimited_models
  INTO sub, top, unlimited_entry
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Unlimited access for this model → free, no ledger entry
  IF p_model_id IS NOT NULL AND unlimited_entry IS NOT NULL THEN
    IF (unlimited_entry->p_model_id->>'expires_at')::timestamptz > now() THEN
      RETURN true;
    END IF;
  END IF;

  -- Idempotency: already spent for this generation
  IF EXISTS (
    SELECT 1 FROM public.credit_ledger
    WHERE generation_id = p_generation_id AND transaction_type = 'spend'
  ) THEN
    RETURN true;
  END IF;

  IF sub + top < p_amount THEN
    RETURN false;
  END IF;

  sub_spend := LEAST(p_amount, sub);
  top_spend := p_amount - sub_spend;

  -- Update buckets BEFORE the ledger insert so the trigger recomputes
  -- credits_balance from the new bucket values.
  UPDATE public.profiles
  SET subscription_credits = subscription_credits - sub_spend,
      topup_credits        = topup_credits - top_spend
  WHERE id = p_user_id;

  INSERT INTO public.credit_ledger (
    user_id, transaction_id, transaction_type, amount,
    subscription_delta, topup_delta, generation_id, model_id, description
  ) VALUES (
    p_user_id, p_generation_id::text, 'spend', -p_amount,
    -sub_spend, -top_spend, p_generation_id, p_model_id, 'Generation spend'
  );

  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.spend_credits(uuid, uuid, integer, text) IS 'Deduct credits subscription-first then topup, recording the per-bucket split. Idempotent per generation_id. Returns false if insufficient. Unlimited models return true without charge.';

-- 2. refund_generation_credits — restore the exact buckets a spend used.
CREATE OR REPLACE FUNCTION public.refund_generation_credits(
  p_generation_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s RECORD;
BEGIN
  -- Original spend (none for unlimited-model generations → nothing to refund)
  SELECT * INTO s
  FROM public.credit_ledger
  WHERE generation_id = p_generation_id AND transaction_type = 'spend'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Lock the profile BEFORE the idempotency check (race-free under concurrent pollers)
  PERFORM 1 FROM public.profiles WHERE id = s.user_id FOR UPDATE;

  IF EXISTS (
    SELECT 1 FROM public.credit_ledger
    WHERE generation_id = p_generation_id AND transaction_type = 'refund'
  ) THEN
    RETURN false;
  END IF;

  -- spend deltas are negative; subtracting them adds the credits back to the
  -- same buckets they came from.
  UPDATE public.profiles
  SET subscription_credits = subscription_credits - s.subscription_delta,
      topup_credits        = topup_credits - s.topup_delta
  WHERE id = s.user_id;

  INSERT INTO public.credit_ledger (
    user_id, transaction_id, transaction_type, amount,
    subscription_delta, topup_delta, generation_id, model_id, description
  ) VALUES (
    s.user_id, p_generation_id::text, 'refund', -s.amount,
    -s.subscription_delta, -s.topup_delta, p_generation_id, s.model_id,
    'Refund for failed generation'
  );

  RETURN true;
END;
$$;

COMMENT ON FUNCTION public.refund_generation_credits(uuid) IS 'Restore credits from a failed generation to the exact buckets the spend used. Idempotent per generation_id; returns false if there was no charge or it was already refunded.';

-- 3. Allow users to delete their own pending generation rows (used when a spend
--    fails right after the row was pre-created).
DROP POLICY IF EXISTS "Users can delete their own logs" ON public.generation_logs;
CREATE POLICY "Users can delete their own logs"
  ON public.generation_logs FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
