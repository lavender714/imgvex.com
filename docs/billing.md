# Billing & Credits — Architecture & Ops

> Credits are a user-paid liability. This system is built for exactly-once credit
> grants and a fully auditable ledger. Read this before touching anything under
> `lib/billing/`, `lib/credits/`, the Creem webhook, or the credit migrations.

## 1. Data model

Credits live in **two materialized buckets** on `profiles`, plus an append-only
ledger:

| Column | Meaning |
|---|---|
| `profiles.subscription_credits` | Monthly plan credits. **Reset/expire each billing period** (use-it-or-lose-it). |
| `profiles.topup_credits` | One-time pack credits. **Never expire.** |
| `profiles.credits_balance` | Maintained **total** (`subscription + topup`) via trigger. All UI reads this. |

`credit_ledger` is the source of truth for audit, idempotency, and refundability:

| Column | Notes |
|---|---|
| `transaction_id` | External id: Creem transaction id / checkout id / `generation_logs.id` / `migration:<uid>` / refund id |
| `transaction_type` | `subscription_grant` · `subscription_expire` · `topup_grant` · `spend` · `refund` · `manual_refund` · `chargeback` |
| `amount` | Signed total (+grant, −spend) |
| `subscription_delta` / `topup_delta` | Per-bucket signed change (lets a refund restore the exact buckets) |
| `generation_id` | FK → `generation_logs.id` for spend/refund rows |

**Idempotency** = unique index `(user_id, transaction_id, transaction_type)`.
A renewal writes two rows (`subscription_expire` + `subscription_grant`) with the
same `transaction_id` but different types, so both fit.

**Trigger** `credit_ledger_change` recomputes `credits_balance` from the buckets
on every ledger insert. **Functions update the buckets BEFORE inserting the
ledger row** so the trigger reads the new values — keep that order in any new
function.

**Spend order:** subscription bucket first, then topup.

## 2. Postgres functions (all `SECURITY DEFINER`, `FOR UPDATE` lock, idempotent)

| Function | Migration | Purpose |
|---|---|---|
| `grant_subscription_credits(user, txn_id, amount, period_end)` | 007 | Expire leftover subscription credits, set new monthly amount. Idempotent per txn. |
| `grant_topup_credits(user, txn_id, amount)` | 007 | Add to topup bucket. Idempotent per checkout id. |
| `spend_credits(user, generation_id, amount, model_id)` | 008 | Subscription-first spend, records bucket split. Idempotent per generation. Unlimited models → true, no charge. |
| `refund_generation_credits(generation_id)` | 008 | Restore a failed generation's credits to the exact buckets. Idempotent per generation. |
| `revoke_credits(user, amount, bucket, ref_id, reason)` | 009 | Claw back a refund/chargeback, **clamped at 0**. Idempotent per `(ref_id, reason)`. Returns amount removed. |
| `expire_subscription_credits(user, ref_id)` | 009 | Zero the subscription bucket at period end. Topup untouched. |

`deduct_credits` (pre-rework) is left in the DB but no longer called; remove once
you're confident nothing external uses it.

## 3. Creem webhook → handler map

`app/api/webhooks/creem/route.ts` (signature-verified) dispatches to
`lib/billing/creem-products.ts`:

| Event | Handler | Effect |
|---|---|---|
| `subscription.paid` | `applyPaidSubscription` | Sync tier/perms **+** grant monthly credits (keyed on `last_transaction_id`). |
| `subscription.active` | `applyActiveSubscription` | Sync tier/perms **only — no credits** (prevents the paid+active double-grant). |
| `subscription.canceled` | `cancelSubscription` | Record `plan_ends_at` only. **Keeps access until period end.** No downgrade. |
| `subscription.expired` / `paused` | `expireSubscription` | Downgrade to free perms + `expire_subscription_credits`. |
| `checkout.completed` | `grantTopupCredits` | Grant pack credits if product ∈ `CREDIT_PACK_MAP`; no-op for subscription checkouts. |
| `refund.created` | `revokeRefundedCredits(…, "manual_refund")` | Match grant in ledger, claw back from its bucket. |
| `dispute.created` | `revokeRefundedCredits(…, "chargeback")` | Same claw-back path. |

Refunds/disputes carry no `referenceId`; the handler finds the user + amount by
matching the refund's `transaction/checkout/subscription/order` ids against our
own ledger grant rows.

## 4. Generation spend/refund flow

`app/api/generate/route.ts`:
1. `createGeneration()` → pending `generation_logs` row (gives a stable id).
2. `spendCredits(user, generationId, cost, model)` — insufficient → delete row, 402.
3. `executeTaskWithFailover()` — dispatch failure → `refundGeneration()` + delete row, rethrow.
4. `attachGenerationTask()` writes the provider `task_id`.

`app/api/generate/status/route.ts` (polled): on terminal `failed`/`error`, flips
the log to `failed` and calls `refund_generation_credits` (idempotent + locked,
so concurrent polls can't double-refund). On `completed`, marks the log completed.

## 5. Refund policy (manual, no self-serve)

Per Pollo convention: **no in-app refund button.** Policy is in
`app/terms/page.tsx` ("Cancellation and Refunds"): 3-day window, **<50 credits
used**, first-time subscribers, via `support@imgvex.com`. Packs non-refundable
once used. Operator processes the refund in the **Creem Dashboard**, which fires
`refund.created` → automatic claw-back.

## 6. Top-up packs (M3) — setup checklist

SPEC pricing: **2K=$19, 10K=$79, 50K=$349** (one-time, never expire).

1. Creem Dashboard → create 3 **one-time** products in **Live** and **Test** (6 total).
2. Set env (deploy platform + `.env.local`), then **redeploy** (NEXT_PUBLIC_ is build-time):
   `NEXT_PUBLIC_CREEM_PRODUCT_PACK_{2K,10K,50K}` and `…_TEST`.
3. Credit amounts are mapped in `CREDIT_PACK_MAP` (`lib/billing/creem-products.ts`); keep them in sync with the products.

## 7. Ops SQL cheat-sheet

```sql
-- A user's balance + buckets
SELECT plan_tier, credits_balance, subscription_credits, topup_credits
FROM profiles WHERE id = '<uid>';

-- A user's ledger history
SELECT created_at, transaction_type, amount, subscription_delta, topup_delta, transaction_id
FROM credit_ledger WHERE user_id = '<uid>' ORDER BY created_at DESC LIMIT 50;

-- Ledger sum must equal the bucket total (consistency check)
SELECT p.id,
       p.subscription_credits + p.topup_credits AS balance,
       (SELECT COALESCE(SUM(amount),0) FROM credit_ledger l WHERE l.user_id = p.id) AS ledger_sum
FROM profiles p
WHERE (p.subscription_credits + p.topup_credits)
      <> (SELECT COALESCE(SUM(amount),0) FROM credit_ledger l WHERE l.user_id = p.id);
-- ^ returns rows only when a balance drifted from its ledger (should be empty)

-- Credits consumed since a date (refund-eligibility helper for support)
SELECT COALESCE(SUM(ABS(amount)),0) AS consumed
FROM credit_ledger
WHERE user_id = '<uid>' AND transaction_type = 'spend' AND created_at >= '<purchase_ts>';
```

## 8. Gotchas

- **Don't reintroduce additive credit writes** (`credits_balance = current + N`) — that was the original money bug. All credit changes go through the RPCs.
- **Bucket update must precede the ledger insert** (the trigger derives `credits_balance` from buckets).
- **`subscription.active` must never grant credits** — only `subscription.paid`.
- The old monthly-reset cron (migration 004) is **unscheduled**; per-renewal `subscription.paid` grants replace it. Don't re-enable it.
- Migrations are applied by pasting into the Supabase SQL editor (Ctrl+A to avoid dropping the leading `--`). Each ends with `NOTIFY pgrst, 'reload schema'`.
