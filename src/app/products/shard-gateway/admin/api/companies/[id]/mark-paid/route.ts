import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionCookieValue } from "@/lib/admin/session";
import { getCompanyById, getLatestLicense, insertPayment, insertLicense } from "@/lib/admin/db";
import { issuePaidLicense } from "@/lib/admin/licensing";

// Admin-only, manual counterpart to the old Paytm webhook: no payment
// gateway is wired up (Paytm PG registration was dropped -- payment is a
// direct bank transfer/UPI to the Slice account, confirmed by a human).
// This route records that confirmation and issues the license the same
// way the automated callback used to.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!verifySessionCookieValue(cookieStore.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await params;
  const company = await getCompanyById(id);
  if (!company) return NextResponse.json({ ok: false, error: "no such company" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const amount = Number(body?.amount);
  const termYearsRaw = Number(body?.termYears);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ ok: false, error: "amount must be a positive number" }, { status: 400 });
  }
  const termYears: 1 | 2 | 3 = termYearsRaw === 2 ? 2 : termYearsRaw === 3 ? 3 : 1;

  const latest = await getLatestLicense(company.id);
  if (!latest) {
    return NextResponse.json(
      { ok: false, error: "No prior license exists for this company -- can't source a topology fingerprint. The Gateway must self-register a trial first." },
      { status: 409 }
    );
  }

  await insertPayment({
    companyId: company.id,
    provider: "manual",
    providerRef: null,
    amount,
    currency: "INR",
    status: "succeeded",
    webhookPayload: null,
  });

  const signed = issuePaidLicense(company.id, latest.topologyFingerprint, termYears);
  const license = await insertLicense({
    companyId: company.id,
    licenseId: signed.license_id,
    licenseType: "paid",
    termYears,
    issuedAt: signed.issued_at,
    expiresAt: signed.expires_at,
    topologyFingerprint: latest.topologyFingerprint,
    signedLicenseJson: signed,
    issuedBy: "admin-manual",
  });

  return NextResponse.json({ ok: true, license });
}
