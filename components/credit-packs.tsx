"use client";

import { CreemCheckout } from "@creem_io/nextjs";
import { CreditPackCard } from "@/components/credit-pack-card";

// One-time credit packs (SPEC: 2K=$19, 10K=$79, 50K=$349). Product ids come from
// public env vars so the same values map to credits server-side in CREDIT_PACK_MAP.
const PACKS = [
  { credits: 2000, price: 19, productId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_2K },
  { credits: 10000, price: 79, productId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_10K },
  { credits: 50000, price: 349, productId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PACK_50K },
];

export function CreditPacks({ referenceId }: { referenceId?: string }) {
  const packs = PACKS.filter((p) => Boolean(p.productId));
  if (packs.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-[#F8FAFC]">Buy more credits</h2>
        <p className="text-sm text-[#94A3B8]">
          One-time packs — never expire and stack on top of your monthly credits.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {packs.map((p) =>
          referenceId ? (
            <CreemCheckout
              key={p.credits}
              productId={p.productId!}
              referenceId={referenceId}
              checkoutPath="/api/checkout"
              successUrl="/dashboard/billing?checkout=success"
            >
              <CreditPackCard credits={p.credits} price={p.price} />
            </CreemCheckout>
          ) : (
            <CreditPackCard key={p.credits} credits={p.credits} price={p.price} />
          )
        )}
      </div>
    </div>
  );
}
