import { NextResponse } from "next/server";
import { screenPrompt } from "@/lib/billing/creem-moderation";

/**
 * Creem Moderation API integration healthcheck.
 *
 * Purpose: fire a benign prompt through screenPrompt() so Creem's moderation
 * dashboard records a real call from our API key. Used to demonstrate
 * "integrated and tested" during account review.
 *
 * Returns a JSON envelope with the decision plus timing + environment info,
 * so we (and the reviewer, if shared) can see immediately whether the call
 * landed and which environment it hit.
 *
 * No auth: rate of cost is bounded by Creem's free moderation tier. Safe to
 * remove this route after the account is approved.
 */
export async function GET() {
  const startedAt = Date.now();
  const result = await screenPrompt(
    "A peaceful watercolor painting of a lighthouse at sunset",
    `healthz:${startedAt}`,
  );
  const durationMs = Date.now() - startedAt;

  const hasApiKey = Boolean(process.env.CREEM_API_KEY);
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://api.creem.io/v1"
      : "https://test-api.creem.io/v1";

  return NextResponse.json({
    ok: result.decision === "allow",
    decision: result.decision,
    blocked: result.blocked,
    reason: result.reason ?? null,
    durationMs,
    creem: {
      apiKeyConfigured: hasApiKey,
      baseUrl,
      nodeEnv: process.env.NODE_ENV ?? "unknown",
    },
    timestamp: new Date(startedAt).toISOString(),
    note:
      "If apiKeyConfigured is false, the call was skipped client-side and Creem's logs will show nothing. Set CREEM_API_KEY in Vercel env and redeploy.",
  });
}
