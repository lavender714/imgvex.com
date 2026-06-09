import { NextRequest, NextResponse } from "next/server";
import { generateSignature, parseWebhookEvent } from "@creem_io/webhook-types";
import { applyPaidSubscription, revokeSubscription } from "@/lib/billing/creem-products";

export async function POST(req: NextRequest) {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[creem webhook] CREEM_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("creem-signature");

  console.log("[creem webhook] received. signature=", signature ? "present" : "missing", "body length=", body.length);

  if (!signature) {
    console.error("[creem webhook] Missing creem-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const computed = await generateSignature(body, secret);
    console.log("[creem webhook] computed sig=", computed.slice(0, 16) + "...", "provided sig=", signature.slice(0, 16) + "...");

    if (computed !== signature) {
      console.error("[creem webhook] Signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (err) {
    console.error("[creem webhook] Signature generation failed:", err);
    return NextResponse.json({ error: "Signature error" }, { status: 500 });
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
        await applyPaidSubscription(event.object);
        break;
      }
      case "subscription.canceled":
      case "subscription.expired":
      case "subscription.paused": {
        console.log("[creem webhook] handling", event.eventType, "for sub=", event.object?.id);
        await revokeSubscription(event.object);
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
