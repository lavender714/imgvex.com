import { Checkout } from "@creem_io/nextjs";

const rawTestMode = process.env.CREEM_TEST_MODE;
const testMode = rawTestMode?.toLowerCase().trim() === "true";
console.log("[creem checkout] CREEM_TEST_MODE=", JSON.stringify(rawTestMode), "parsed=", testMode);

export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode,
  defaultSuccessUrl: "/dashboard?checkout=success",
});
