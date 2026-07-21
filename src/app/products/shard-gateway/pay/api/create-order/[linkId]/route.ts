import { NextResponse } from "next/server";
import { getPaymentLink, getCompanyById } from "@/lib/admin/db";
import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/admin/razorpay";

// Public route (no admin session) -- reachable by whoever the company
// sends the pay link to. Deliberately reads the amount/term_years ONLY
// from the payment_links row looked up by linkId; nothing here accepts a
// client-supplied amount.
export async function POST(_req: Request, { params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await params;
  const link = await getPaymentLink(linkId);
  if (!link) {
    return NextResponse.json({ ok: false, error: "This payment link is invalid or has expired." }, { status: 404 });
  }
  if (new Date(link.expiresAt) < new Date()) {
    return NextResponse.json({ ok: false, error: "This payment link has expired." }, { status: 410 });
  }

  const company = await getCompanyById(link.companyId);
  if (!company) {
    return NextResponse.json({ ok: false, error: "Company not found." }, { status: 404 });
  }

  let order;
  try {
    order = await createRazorpayOrder({
      amountInRupees: link.amount,
      currency: link.currency,
      companyId: link.companyId,
      termYears: link.termYears,
      paymentLinkId: link.id,
    });
  } catch (err) {
    console.error(`Order creation failed for payment link ${link.id}: ${(err as Error).message}`);
    return NextResponse.json({ ok: false, error: "Could not start checkout. Please contact Solipher Labs." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: getRazorpayKeyId(),
    companyName: company.name,
  });
}
