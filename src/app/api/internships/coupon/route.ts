import { NextRequest, NextResponse } from "next/server";
import { findCoupon, feeWithCoupon } from "@/lib/internships/coupons";
import { site } from "@/lib/data/site";

// Coupons are handed out privately, so this endpoint is the one place they
// could be discovered: a short numeric code is guessable if you let someone
// try a million of them. Best-effort per-instance throttling -- a serverless
// deployment may run several instances, so treat this as raising the cost of
// enumeration rather than preventing it.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_ATTEMPTS;
}

function clientKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Checks a coupon so the form can show the applicant what to actually pay.
 * The answer here is advisory: the fee is recomputed from the code again when
 * the application is submitted, so nothing the browser reports is trusted. */
export async function POST(req: NextRequest) {
  if (!rateLimit(clientKey(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const coupon = findCoupon(body.code);

  if (!coupon) {
    return NextResponse.json({ ok: false, error: "That coupon code isn't valid." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    code: coupon.code,
    discountAmount: coupon.discountAmount,
    baseAmount: site.internship.feeAmount,
    finalAmount: feeWithCoupon(coupon),
  });
}
