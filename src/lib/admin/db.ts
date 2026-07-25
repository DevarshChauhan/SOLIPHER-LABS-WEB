import { Pool } from "pg";
import type { Company, License, Payment, PaymentLink, CompanyWithStatus } from "./types";
import { computeLicenseStatus } from "./types";
import { fixtureCompanies, fixtureLicenses, fixturePayments } from "./fixtures";

// No database is wired up until DATABASE_URL is set (Neon, added via
// Vercel's own Postgres integration -- see admin/README.md). Until then,
// every read/write below falls back to in-memory fixtures so the panel is
// fully previewable and the UI work isn't blocked on provisioning.
export const hasDb = Boolean(process.env.DATABASE_URL);

let pool: Pool | null = null;
function getPool(): Pool {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return pool;
}

// In-memory mutation target for the no-DB preview path only -- never used
// once hasDb is true.
const mem = {
  companies: [...fixtureCompanies],
  licenses: [...fixtureLicenses],
  payments: [...fixturePayments],
  paymentLinks: [] as PaymentLink[],
};

function rowToCompany(r: Record<string, unknown>): Company {
  return {
    id: r.id as string,
    name: r.name as string,
    contactEmail: r.contact_email as string | null,
    contactName: r.contact_name as string | null,
    category: r.category as Company["category"],
    createdAt: (r.created_at as Date).toISOString(),
  };
}

function rowToLicense(r: Record<string, unknown>): License {
  return {
    id: r.id as string,
    companyId: r.company_id as string,
    licenseId: r.license_id as string,
    licenseType: r.license_type as License["licenseType"],
    termYears: r.term_years as number | null,
    issuedAt: (r.issued_at as Date).toISOString(),
    expiresAt: (r.expires_at as Date).toISOString(),
    gracePeriodDays: r.grace_period_days as number,
    topologyFingerprint: r.topology_fingerprint as string,
    revokedAt: r.revoked_at ? (r.revoked_at as Date).toISOString() : null,
    issuedBy: r.issued_by as string,
  };
}

function rowToPayment(r: Record<string, unknown>): Payment {
  return {
    id: r.id as string,
    companyId: r.company_id as string,
    provider: r.provider as Payment["provider"],
    providerRef: r.provider_ref as string | null,
    amount: Number(r.amount),
    currency: r.currency as string,
    status: r.status as Payment["status"],
    createdAt: (r.created_at as Date).toISOString(),
  };
}

function rowToPaymentLink(r: Record<string, unknown>): PaymentLink {
  return {
    id: r.id as string,
    companyId: r.company_id as string,
    amount: Number(r.amount),
    currency: r.currency as string,
    termYears: r.term_years as 1 | 2 | 3,
    createdAt: (r.created_at as Date).toISOString(),
    expiresAt: (r.expires_at as Date).toISOString(),
  };
}

function attachStatus(company: Company, licenses: License[], payments: Payment[], now: Date): CompanyWithStatus {
  const companyLicenses = licenses.filter((l) => l.companyId === company.id);
  const latestLicense = companyLicenses.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())[0] ?? null;
  const { status, daysRemaining } = computeLicenseStatus(latestLicense, now);
  const companyPayments = payments.filter((p) => p.companyId === company.id && p.status === "succeeded");
  const lastPaymentAt = companyPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt ?? null;
  return { ...company, latestLicense, status, daysRemaining, lastPaymentAt };
}

export async function listCompanies(): Promise<CompanyWithStatus[]> {
  const now = new Date();
  if (!hasDb) {
    return mem.companies.map((c) => attachStatus(c, mem.licenses, mem.payments, now));
  }
  const db = getPool();
  const [companiesRes, licensesRes, paymentsRes] = await Promise.all([
    db.query("SELECT * FROM companies ORDER BY created_at DESC"),
    db.query("SELECT * FROM licenses WHERE revoked_at IS NULL"),
    db.query("SELECT * FROM payments WHERE status = 'succeeded'"),
  ]);
  const companies = companiesRes.rows.map(rowToCompany);
  const licenses = licensesRes.rows.map(rowToLicense);
  const payments = paymentsRes.rows.map(rowToPayment);
  return companies.map((c) => attachStatus(c, licenses, payments, now));
}

export async function getCompanyDetail(companyId: string): Promise<{ company: CompanyWithStatus; licenses: License[]; payments: Payment[] } | null> {
  const now = new Date();
  if (!hasDb) {
    const company = mem.companies.find((c) => c.id === companyId);
    if (!company) return null;
    const licenses = mem.licenses.filter((l) => l.companyId === companyId).sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
    const payments = mem.payments.filter((p) => p.companyId === companyId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { company: attachStatus(company, mem.licenses, mem.payments, now), licenses, payments };
  }
  const db = getPool();
  const companyRes = await db.query("SELECT * FROM companies WHERE id = $1", [companyId]);
  if (companyRes.rows.length === 0) return null;
  const [licensesRes, paymentsRes] = await Promise.all([
    db.query("SELECT * FROM licenses WHERE company_id = $1 ORDER BY issued_at DESC", [companyId]),
    db.query("SELECT * FROM payments WHERE company_id = $1 ORDER BY created_at DESC", [companyId]),
  ]);
  const licenses = licensesRes.rows.map(rowToLicense);
  const payments = paymentsRes.rows.map(rowToPayment);
  const company = attachStatus(rowToCompany(companyRes.rows[0]), licenses, payments, now);
  return { company, licenses, payments };
}

export async function createCompany(input: { name: string; contactEmail: string | null; contactName: string | null; category: Company["category"] }): Promise<Company> {
  if (!hasDb) {
    const company: Company = { id: `c${mem.companies.length + 1}`, createdAt: new Date().toISOString(), ...input };
    mem.companies.unshift(company);
    return company;
  }
  const db = getPool();
  const res = await db.query(
    "INSERT INTO companies (name, contact_email, contact_name, category) VALUES ($1, $2, $3, $4) RETURNING *",
    [input.name, input.contactEmail, input.contactName, input.category]
  );
  return rowToCompany(res.rows[0]);
}

export async function revokeLicense(licenseId: string): Promise<void> {
  if (!hasDb) {
    const lic = mem.licenses.find((l) => l.id === licenseId);
    if (lic) lic.revokedAt = new Date().toISOString();
    return;
  }
  const db = getPool();
  await db.query("UPDATE licenses SET revoked_at = now() WHERE id = $1", [licenseId]);
}

// --- Trial registration (called by the Gateway install process itself,
// not the admin UI -- see gateway/docker/install.sh) ---

/** Anti-reset check: a topology_fingerprint that already has a trial license never gets a second one. */
export async function findTrialByFingerprint(fingerprint: string): Promise<License | null> {
  if (!hasDb) {
    const lic = mem.licenses.find((l) => l.licenseType === "trial" && l.topologyFingerprint === fingerprint);
    return lic ?? null;
  }
  const db = getPool();
  const res = await db.query("SELECT * FROM licenses WHERE license_type = 'trial' AND topology_fingerprint = $1", [fingerprint]);
  return res.rows.length ? rowToLicense(res.rows[0]) : null;
}

export async function findCompanyByEmail(email: string): Promise<Company | null> {
  if (!hasDb) {
    return mem.companies.find((c) => c.contactEmail === email) ?? null;
  }
  const db = getPool();
  const res = await db.query("SELECT * FROM companies WHERE contact_email = $1 LIMIT 1", [email]);
  return res.rows.length ? rowToCompany(res.rows[0]) : null;
}

export async function getCompanyById(companyId: string): Promise<Company | null> {
  if (!hasDb) {
    return mem.companies.find((c) => c.id === companyId) ?? null;
  }
  const db = getPool();
  const res = await db.query("SELECT * FROM companies WHERE id = $1", [companyId]);
  return res.rows.length ? rowToCompany(res.rows[0]) : null;
}

/** Anti-double-processing: a (provider, provider_ref) pair that's already been recorded is never processed twice, even under a payment gateway's own callback/webhook retry behavior. */
export async function findPaymentByProviderRef(provider: Payment["provider"], providerRef: string): Promise<Payment | null> {
  if (!hasDb) {
    return mem.payments.find((p) => p.provider === provider && p.providerRef === providerRef) ?? null;
  }
  const db = getPool();
  const res = await db.query("SELECT * FROM payments WHERE provider = $1 AND provider_ref = $2", [provider, providerRef]);
  return res.rows.length ? rowToPayment(res.rows[0]) : null;
}

export async function insertPayment(input: {
  companyId: string;
  provider: Payment["provider"];
  providerRef: string | null;
  amount: number;
  currency: string;
  status: Payment["status"];
  webhookPayload: unknown;
}): Promise<Payment> {
  if (!hasDb) {
    const payment: Payment = {
      id: `p${mem.payments.length + 1}`,
      companyId: input.companyId,
      provider: input.provider,
      providerRef: input.providerRef,
      amount: input.amount,
      currency: input.currency,
      status: input.status,
      createdAt: new Date().toISOString(),
    };
    mem.payments.unshift(payment);
    return payment;
  }
  const db = getPool();
  const res = await db.query(
    `INSERT INTO payments (company_id, provider, provider_ref, amount, currency, status, webhook_payload)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [input.companyId, input.provider, input.providerRef, input.amount, input.currency, input.status, JSON.stringify(input.webhookPayload)]
  );
  return rowToPayment(res.rows[0]);
}

/** Most recent license (any type, including revoked) for a company -- used to reuse its topology_fingerprint when issuing a paid license, since a company only ever reaches checkout after its Gateway has already registered a trial. */
export async function getLatestLicense(companyId: string): Promise<License | null> {
  if (!hasDb) {
    return mem.licenses.filter((l) => l.companyId === companyId).sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())[0] ?? null;
  }
  const db = getPool();
  const res = await db.query("SELECT * FROM licenses WHERE company_id = $1 ORDER BY issued_at DESC LIMIT 1", [companyId]);
  return res.rows.length ? rowToLicense(res.rows[0]) : null;
}

export async function insertLicense(input: {
  companyId: string;
  licenseId: string;
  licenseType: License["licenseType"];
  termYears: number | null;
  issuedAt: string;
  expiresAt: string;
  topologyFingerprint: string;
  signedLicenseJson: unknown;
  issuedBy: string;
}): Promise<License> {
  if (!hasDb) {
    const license: License = {
      id: `l${mem.licenses.length + 1}`,
      companyId: input.companyId,
      licenseId: input.licenseId,
      licenseType: input.licenseType,
      termYears: input.termYears,
      issuedAt: input.issuedAt,
      expiresAt: input.expiresAt,
      gracePeriodDays: 15,
      topologyFingerprint: input.topologyFingerprint,
      revokedAt: null,
      issuedBy: input.issuedBy,
    };
    mem.licenses.unshift(license);
    return license;
  }
  const db = getPool();
  const res = await db.query(
    `INSERT INTO licenses (company_id, license_id, license_type, term_years, issued_at, expires_at, topology_fingerprint, signed_license_json, issued_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [input.companyId, input.licenseId, input.licenseType, input.termYears, input.issuedAt, input.expiresAt, input.topologyFingerprint, JSON.stringify(input.signedLicenseJson), input.issuedBy]
  );
  return rowToLicense(res.rows[0]);
}

// --- Payment links (admin-generated, amount-locked self-serve checkout) ---

export async function createPaymentLink(input: { companyId: string; amount: number; currency: string; termYears: 1 | 2 | 3 }): Promise<PaymentLink> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  if (!hasDb) {
    const link: PaymentLink = {
      id: `pl${mem.paymentLinks.length + 1}`,
      companyId: input.companyId,
      amount: input.amount,
      currency: input.currency,
      termYears: input.termYears,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
    mem.paymentLinks.push(link);
    return link;
  }
  const db = getPool();
  const res = await db.query(
    `INSERT INTO payment_links (company_id, amount, currency, term_years) VALUES ($1, $2, $3, $4) RETURNING *`,
    [input.companyId, input.amount, input.currency, input.termYears]
  );
  return rowToPaymentLink(res.rows[0]);
}

/** Looked up by the PUBLIC pay page -- the amount/term_years it returns are treated as authoritative, never overridden by anything client-supplied. */
export async function getPaymentLink(id: string): Promise<PaymentLink | null> {
  if (!hasDb) {
    return mem.paymentLinks.find((l) => l.id === id) ?? null;
  }
  const db = getPool();
  const res = await db.query("SELECT * FROM payment_links WHERE id = $1", [id]);
  return res.rows.length ? rowToPaymentLink(res.rows[0]) : null;
}
