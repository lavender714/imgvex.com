import { NextRequest, NextResponse } from "next/server";
import { generateSignature, parseWebhookEvent } from "@creem_io/webhook-types";
import {
  applyPaidSubscription,
  applyActiveSubscription,
  cancelSubscription,
  expireSubscription,
  grantTopupCredits,
  revokeRefundedCredits,
} from "@/lib/billing/creem-products";

export async function POST(req: NextRequest) {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  const isTest = process.env.CREEM_TEST_MODE?.toLowerCase().trim() === "true";
  const body = await req.text();
  const signature = req.headers.get("creem-signature");

  console.log("[creem webhook] received. test=", isTest, "signature=", signature ? "present" : "missing", "body length=", body.length);

  // In test mode, allow a missing/mismatched signature for debugging
  // but still verify if present. Production always requires valid signature.
  if (signature && secret) {
    try {
      const computed = await generateSignature(body, secret);
      console.log("[creem webhook] computed sig=", computed.slice(0, 16) + "...", "provided sig=", signature.slice(0, 16) + "...");
      if (computed !== signature) {
        if (isTest) {
          console.warn("[creem webhook] Signature mismatch in test mode — continuing anyway");
        } else {
          console.error("[creem webhook] Signature mismatch");
          return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
      }
    } catch (err) {
      console.error("[creem webhook] Signature generation failed:", err);
      if (!isTest) {
        return NextResponse.json({ error: "Signature error" }, { status: 500 });
      }
    }
  } else if (!signature && !isTest) {
    console.error("[creem webhook] Missing creem-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  } else if (!signature) {
    console.warn("[creem webhook] Missing signature in test mode — continuing anyway");
  }

  let event;
  try {
    event = parseWebhookEvent(body);
    console.log("[creem webhook] eventType=", event.eventType, "id=", event.id);
  } catch (err) {
    console.error("[creem webhook] Failed to parse event:", err);
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  try {
    switch (event.eventType) {
      case "subscription.paid": {
        console.log("[creem webhook] handling subscription.paid for sub=", event.object?.id);
        await applyPaidSubscription(event.object);
        break;
      }
      case "subscription.active": {
        console.log("[creem webhook] handling subscription.active for sub=", event.object?.id);
        // Tier/permissions only — credits are granted exclusively on subscription.paid
        // so this lifecycle duplicate cannot double-grant.
        await applyActiveSubscription(event.object);
        break;
      }
      case "subscription.canceled": {
        console.log("[creem webhook] handling subscription.canceled for sub=", event.object?.id);
        // Keep access until period end; downgrade happens on subscription.expired.
        await cancelSubscription(event.object);
        break;
      }
      case "subscription.expired":
      case "subscription.paused": {
        console.log("[creem webhook] handling", event.eventType, "for sub=", event.object?.id);
        await expireSubscription(event.object);
        break;
      }
      case "checkout.completed": {
        console.log("[creem webhook] handling checkout.completed for checkout=", event.object?.id);
        // Fulfills one-time credit packs; no-op for subscription checkouts.
        await grantTopupCredits(event.object);
        break;
      }
      case "refund.created": {
        console.log("[creem webhook] handling refund.created for refund=", event.object?.id);
        await revokeRefundedCredits(event.object, "manual_refund");
        break;
      }
      case "dispute.created": {
        console.log("[creem webhook] handling dispute.created for dispute=", event.object?.id);
        await revokeRefundedCredits(event.object, "chargeback");
        break;
      }
      default: {
        console.log("[creem webhook] unhandled event type:", event.eventType);
      }
    }
    return NextResponse.json({ message: "Webhook processed" });
  } catch (err) {
    console.error("[creem webhook] Handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
