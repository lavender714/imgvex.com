export type ModerationDecision = "allow" | "flag" | "deny" | "error" | "skipped";

export interface ModerationResult {
  decision: ModerationDecision;
  blocked: boolean;
  reason?: string;
  raw?: unknown;
}

const TIMEOUT_MS = 5_000;

function getBaseUrl() {
  return process.env.NODE_ENV === "production"
    ? "https://api.creem.io/v1"
    : "https://test-api.creem.io/v1";
}

/**
 * Screen a user prompt against Creem's content moderation policy.
 * Fails closed: any error, timeout, or non-"allow" decision blocks the request.
 * If CREEM_API_KEY is not configured, logs a warning and returns a skipped
 * result so local development still works.
 */
export async function screenPrompt(
  prompt: string,
  externalId: string,
): Promise<ModerationResult> {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    console.warn(
      "[moderation] CREEM_API_KEY not set — skipping prompt screening. This MUST be configured before production.",
    );
    return { decision: "skipped", blocked: false };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${getBaseUrl()}/moderation/prompt`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({ prompt, external_id: externalId }),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error(
        `[moderation] Non-OK response (${res.status}) — failing closed`,
      );
      return {
        decision: "error",
        blocked: true,
        reason: `moderation_api_status_${res.status}`,
      };
    }

    const data = (await res.json()) as { decision?: string };
    const decision = (data.decision as ModerationDecision) ?? "error";
    const blocked = decision !== "allow" && decision !== "skipped";

    return { decision, blocked, raw: data };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    console.error(
      `[moderation] ${isAbort ? "timeout" : "fetch error"} — failing closed`,
      err,
    );
    return {
      decision: "error",
      blocked: true,
      reason: isAbort ? "moderation_timeout" : "moderation_fetch_error",
    };
  } finally {
    clearTimeout(timer);
  }
}
