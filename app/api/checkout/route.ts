import { NextRequest, NextResponse } from "next/server";

const API_BASE = {
  production: "https://api.creem.io",
  test: "https://test-api.creem.io",
};

function resolveSuccessUrl(url: string | null, req: NextRequest): string | undefined {
  if (!url) return undefined;
  try {
    new URL(url);
    return url;
  } catch {
    const host = req.headers.get("host") || req.headers.get("x-forwarded-host");
    const protocol = req.headers.get("x-forwarded-proto") || req.headers.get("x-forwarded-protocol") || "https";
    if (!host) {
      console.warn("[checkout] Could not resolve host for relative URL:", url);
      return url;
    }
    const baseUrl = `${protocol}://${host}`;
    return new URL(url, baseUrl).toString();
  }
}

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  const referenceId = req.nextUrl.searchParams.get("referenceId");
  const successUrlParam = req.nextUrl.searchParams.get("successUrl");
  const unitsParam = req.nextUrl.searchParams.get("units");
  const discountCode = req.nextUrl.searchParams.get("discountCode");

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const rawTestMode = process.env.CREEM_TEST_MODE;
  const isTest = rawTestMode?.toLowerCase().trim() === "true";
  const baseUrl = isTest ? API_BASE.test : API_BASE.production;

  console.log("[checkout] CREEM_TEST_MODE raw=", JSON.stringify(rawTestMode), "isTest=", isTest, "baseUrl=", baseUrl);

  const successUrl = resolveSuccessUrl(successUrlParam ?? "/dashboard?checkout=success", req);

  const body: Record<string, unknown> = {
    product_id: productId,
    ...(successUrl && { success_url: successUrl }),
    ...(unitsParam && { units: parseInt(unitsParam, 10) }),
    ...(discountCode && { discount_code: discountCode }),
    ...(referenceId && { metadata: { referenceId } }),
  };

  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    console.error("[checkout] CREEM_API_KEY is not set");
    return NextResponse.json({ error: "Server config error: missing API key" }, { status: 500 });
  }

  try {
    const res = await fetch(`${baseUrl}/v1/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    console.log("[checkout] Creem API status:", res.status, "url:", baseUrl + "/v1/checkouts");

    if (!res.ok) {
      const text = await res.text();
      console.error("[checkout] Creem API error:", res.status, text);
      return NextResponse.json(
        { error: "Failed to create checkout", details: `HTTP ${res.status}: ${text}` },
        { status: 500 }
      );
    }

    const data = (await res.json()) as { checkout_url?: string };
    console.log("[checkout] Creem response:", JSON.stringify(data));

    const checkoutUrl = data.checkout_url;
    if (!checkoutUrl) {
      return NextResponse.json({ error: "Checkout URL not available" }, { status: 500 });
    }

    return NextResponse.redirect(checkoutUrl);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    const cause = (err as Error & { cause?: Error }).cause;
    console.error("[checkout] fetch failed:", err.message, "cause:", cause?.message || "none", "stack:", err.stack);
    return NextResponse.json(
      {
        error: "Failed to create checkout",
        details: `${err.message}${cause ? ` (cause: ${cause.message})` : ""}`,
      },
      { status: 500 }
    );
  }
}
