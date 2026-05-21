import { Webhook } from "@creem_io/nextjs";
import { applyPaidSubscription, revokeSubscription } from "@/lib/billing/creem-products";

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  onSubscriptionPaid: async (event) => {
    await applyPaidSubscription(event);
  },
  onSubscriptionCanceled: async (event) => {
    await revokeSubscription(event);
  },
  onSubscriptionExpired: async (event) => {
    await revokeSubscription(event);
  },
  onSubscriptionPaused: async (event) => {
    await revokeSubscription(event);
  },
});
