import { site } from "@/lib/data/site";

// Server-only on purpose: never import this from a client component, or
// every coupon code ends up readable in the browser bundle. The form asks
// the API to check a code instead of checking it itself.

export interface Coupon {
  code: string;
  discountAmount: number;
}

const COUPONS: Coupon[] = [{ code: "070403", discountAmount: 200 }];

export function findCoupon(input: unknown): Coupon | null {
  if (typeof input !== "string") return null;
  const normalized = input.trim().toUpperCase();
  if (!normalized) return null;
  return COUPONS.find((c) => c.code.toUpperCase() === normalized) ?? null;
}

/** The fee actually payable. Clamped at zero so a discount can never exceed
 * the fee and produce a negative amount in a UPI link. */
export function feeWithCoupon(coupon: Coupon | null): number {
  const base = site.internship.feeAmount;
  if (!coupon) return base;
  return Math.max(0, base - coupon.discountAmount);
}
