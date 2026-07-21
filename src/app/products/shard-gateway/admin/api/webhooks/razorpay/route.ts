import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getCompanyById, getLatestLicense, findPaymentByProviderRef, insertPayment, insertLicense } from "@/lib/admin/db";
import { issuePaidLicense } from "@/lib/admin/licensing";

/**
 * Razorpay webhook -- the trigger for auto-issuing a paid license once a
 * company's subscription/payment link actually clears. Payment collection
 * itself (the checkout page) is a Razorpay-hosted Subscription or Payment
 * Link set up per-company from the Razorpay dashboard with
 * notes.company_id set to this admin panel's company id -- that's how
 * this handler knows which company a given payment belongs to, without
 * building a self-serve checkout flow (out of scope for v1, see the
 * plan's own "customer-facing side" note).
 *
 * Handles payment.captured (one-time / Payment Links) and
 * subscription.charged (recurring) -- both carry a payment entity with
 * notes on it.
 */

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function extractPaymentEntity(body: any): { id: string; amount: number; currency: string; notes: Record<string, string> } | null {
  const payment = body?.payload?.payment?.entity;
  if (!payment?.id) return null;
  return {
    id: payment.id,
    amount: Number(payment.amount) / 100, // Razorpay amounts are in the smallest currency unit (paise for INR)
    currency: payment.currency ?? "INR",
    notes: payment.notes ?? {},
  };
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not set -- refusing to process any webhook until it is.");
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const event = body?.event;
  if (event !== "payment.captured" && event !== "subscription.charged") {
    // Not an event this handler acts on (e.g. payment.failed, refund.*) --
    // 200 so Razorpay doesn't keep retrying an event we're deliberately
    // ignoring.
    return NextResponse.json({ ok: true, ignored: event });
  }

  const payment = extractPaymentEntity(body);
  if (!payment) {
    return NextResponse.json({ ok: false, error: "no payment entity in webhook payload" }, { status: 400 });
  }

  // Idempotent under Razorpay's own retry behavior -- the same
  // provider_ref is never processed twice, so a retried webhook can't
  // double-issue a license.
  const existing = await findPaymentByProviderRef("razorpay", payment.id);
  if (existing) {
    return NextResponse.json({ ok: true, alreadyProcessed: true });
  }

  const companyId = payment.notes.company_id;
  if (!companyId) {
    console.error(`Razorpay payment ${payment.id} has no notes.company_id -- can't attribute it to a company. Recording it unattributed is worse than surfacing the gap loudly.`);
    return NextResponse.json({ ok: false, error: "payment has no notes.company_id" }, { status: 400 });
  }

  const company = await getCompanyById(companyId);
  if (!company) {
    return NextResponse.json({ ok: false, error: `no company with id ${companyId}` }, { status: 404 });
  }

  await insertPayment({
    companyId: company.id,
    provider: "razorpay",
    providerRef: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    status: "succeeded",
    webhookPayload: body,
  });

  // A paid license reuses the topology_fingerprint from the company's
  // most recent license -- a company only reaches checkout after its
  // Gateway has already self-registered a trial (see trial-register's
  // own doc comment), so this should always exist. If it doesn't,
  // something's out of order upstream; fail loudly rather than issue an
  // unenforceable license with a placeholder fingerprint.
  const latest = await getLatestLicense(company.id);
  if (!latest) {
    console.error(`Payment recorded for ${company.name} (${company.id}) but no prior license exists to source a topology_fingerprint from -- license NOT issued.`);
    return NextResponse.json({ ok: true, paymentRecorded: true, licenseIssued: false });
  }

  const termYearsRaw = Number(payment.notes.term_years);
  const termYears: 1 | 2 | 3 = termYearsRaw === 2 ? 2 : termYearsRaw === 3 ? 3 : 1;

  let signed;
  try {
    signed = issuePaidLicense(company.id, latest.topologyFingerprint, termYears);
  } catch (err) {
    console.error(`Payment recorded for ${company.name} but license issuance failed: ${(err as Error).message}`);
    return NextResponse.json({ ok: true, paymentRecorded: true, licenseIssued: false, error: (err as Error).message });
  }

  await insertLicense({
    companyId: company.id,
    licenseId: signed.license_id,
    licenseType: "paid",
    termYears,
    issuedAt: signed.issued_at,
    expiresAt: signed.expires_at,
    topologyFingerprint: latest.topologyFingerprint,
    signedLicenseJson: signed,
    issuedBy: "razorpay-webhook",
  });

  return NextResponse.json({ ok: true, paymentRecorded: true, licenseIssued: true });
}
