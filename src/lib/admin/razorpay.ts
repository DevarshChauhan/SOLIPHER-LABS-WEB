// Server-side Razorpay Orders API client -- used only to create an Order
// for a payment_links row's own locked amount (see db.ts's own comment on
// why that amount is authoritative). Never call this with a
// client-supplied amount.

export interface RazorpayOrder {
  id: string;
  amount: number; // paise
  currency: string;
}

export async function createRazorpayOrder(input: {
  amountInRupees: number;
  currency: string;
  companyId: string;
  termYears: number;
  paymentLinkId: string;
}): Promise<RazorpayOrder> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set -- can't create a real order until both are configured.");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(input.amountInRupees * 100), // Razorpay wants the smallest currency unit (paise for INR)
      currency: input.currency,
      // The webhook (api/webhooks/razorpay/route.ts) reads notes.company_id
      // and notes.term_years to attribute the eventual payment.captured
      // event -- this is the same attribution mechanism used for
      // dashboard-created Payment Links, just set programmatically here.
      notes: {
        company_id: input.companyId,
        term_years: String(input.termYears),
        payment_link_id: input.paymentLinkId,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Razorpay order creation failed (${res.status}): ${body}`);
  }

  const order = await res.json();
  return { id: order.id, amount: order.amount, currency: order.currency };
}

export function getRazorpayKeyId(): string {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) throw new Error("RAZORPAY_KEY_ID is not set.");
  return keyId;
}
