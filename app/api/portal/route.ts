import { Portal } from "@creem_io/nextjs";

const rawTestMode = process.env.CREEM_TEST_MODE;
const testMode = rawTestMode?.toLowerCase().trim() === "true";

export const GET = Portal({
  apiKey: process.env.CREEM_API_KEY!,
  testMode,
});
