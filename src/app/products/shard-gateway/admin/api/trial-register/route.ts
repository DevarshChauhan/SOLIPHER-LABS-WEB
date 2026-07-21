import { NextRequest, NextResponse } from "next/server";
import { findTrialByFingerprint, findCompanyByEmail, createCompany, insertLicense } from "@/lib/admin/db";
import { issueTrialLicense } from "@/lib/admin/licensing";

/**
 * Called by the Gateway install process itself (gateway/docker/install.sh
 * and the Dockerfile's first-boot path), not the admin UI or a human --
 * this is how a company's info actually enters the system per D-017
 * ("every installation gets a 14-day free trial"): installing the
 * Gateway IS the signup. Deliberately public/unauthenticated (an install
 * script has no admin session), so every response is deliberately
 * minimal and every write is defensive -- this is the one surface in the
 * admin panel an anonymous caller can reach.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { company_name, contact_email, contact_name, category, topology_fingerprint } = body ?? {};

  if (typeof topology_fingerprint !== "string" || topology_fingerprint.length < 8) {
    return NextResponse.json({ ok: false, error: "topology_fingerprint is required" }, { status: 400 });
  }
  if (typeof company_name !== "string" || !company_name.trim()) {
    return NextResponse.json({ ok: false, error: "company_name is required" }, { status: 400 });
  }

  // Anti-reset: a fingerprint that's already registered a trial gets that
  // SAME trial back (idempotent under retries/reinstalls), never a second
  // one -- matches licensing/trial_registry.py's documented contract.
  const existing = await findTrialByFingerprint(topology_fingerprint);
  if (existing) {
    return NextResponse.json({ ok: true, license: existing.licenseId, reused: true }, { status: 200 });
  }

  let company = typeof contact_email === "string" && contact_email ? await findCompanyByEmail(contact_email) : null;
  if (!company) {
    company = await createCompany({
      name: company_name.trim(),
      contactEmail: typeof contact_email === "string" && contact_email ? contact_email : null,
      contactName: typeof contact_name === "string" && contact_name ? contact_name : null,
      category: category === "gpu_cloud" ? "gpu_cloud" : "ai_product",
    });
  }

  let signed;
  try {
    signed = issueTrialLicense(company.id, topology_fingerprint);
  } catch (err) {
    // SOLIPHER_SIGNING_KEY_B64 not yet configured -- fails loudly rather
    // than issuing an unsigned/fake license the C++ side would reject
    // anyway.
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 503 });
  }

  await insertLicense({
    companyId: company.id,
    licenseId: signed.license_id,
    licenseType: "trial",
    termYears: null,
    issuedAt: signed.issued_at,
    expiresAt: signed.expires_at,
    topologyFingerprint: topology_fingerprint,
    signedLicenseJson: signed,
    issuedBy: "gateway-install",
  });

  return NextResponse.json({ ok: true, license: signed, reused: false });
}
