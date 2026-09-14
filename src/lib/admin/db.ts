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

// --- Internship applications (public form at /internships/apply) ---

export interface InternshipApplication {
  id: string;
  domainSlug: string;
  fullName: string;
  email: string;
  phone: string | null;
  institution: string | null;
  enrollmentNo: string | null;
  experience: string | null;
  portfolioUrl: string | null;
  startDate: string | null;
  mode: InternshipMode | null;
  message: string | null;
  createdAt: string;
}

export type InternshipMode = "online" | "offline" | "hybrid";

// Deliberately NOT mirrored into the in-memory fixture path the licensing
// tables use: an application stored in memory would be silently lost on the
// next deploy, and losing a real person's application is worse than telling
// them to email instead. Without a database the API route says so outright.
let applicationsTableReady: Promise<void> | null = null;
function ensureApplicationsTable(): Promise<void> {
  if (!applicationsTableReady) {
    const db = getPool();
    applicationsTableReady = db
      .query(
        `CREATE TABLE IF NOT EXISTS internship_applications (
           id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
           domain_slug   TEXT NOT NULL,
           full_name     TEXT NOT NULL,
           email         TEXT NOT NULL,
           phone         TEXT,
           institution   TEXT,
           enrollment_no TEXT,
           experience    TEXT,
           portfolio_url TEXT,
           start_date    DATE,
           mode          TEXT,
           message       TEXT,
           created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
         )`
      )
      // Brings a table created by an earlier deploy up to the current
      // shape, so adding a field never needs a migration run by hand.
      .then(() =>
        db.query(
          `ALTER TABLE internship_applications
             ADD COLUMN IF NOT EXISTS enrollment_no TEXT,
             ADD COLUMN IF NOT EXISTS start_date    DATE,
             ADD COLUMN IF NOT EXISTS mode          TEXT`
        )
      )
      .then(() =>
        db.query(
          `CREATE INDEX IF NOT EXISTS internship_applications_institution_idx
             ON internship_applications(institution)`
        )
      )
      .then(() => undefined)
      .catch((err) => {
        applicationsTableReady = null;
        throw err;
      });
  }
  return applicationsTableReady;
}

function rowToApplication(r: Record<string, unknown>): InternshipApplication {
  return {
    id: r.id as string,
    domainSlug: r.domain_slug as string,
    fullName: r.full_name as string,
    email: r.email as string,
    phone: (r.phone as string | null) ?? null,
    institution: (r.institution as string | null) ?? null,
    enrollmentNo: (r.enrollment_no as string | null) ?? null,
    experience: (r.experience as string | null) ?? null,
    portfolioUrl: (r.portfolio_url as string | null) ?? null,
    startDate: r.start_date ? (r.start_date as Date).toISOString().slice(0, 10) : null,
    mode: (r.mode as InternshipMode | null) ?? null,
    message: (r.message as string | null) ?? null,
    createdAt: (r.created_at as Date).toISOString(),
  };
}

export async function createInternshipApplication(input: {
  domainSlug: string;
  fullName: string;
  email: string;
  phone: string | null;
  institution: string | null;
  enrollmentNo: string | null;
  experience: string | null;
  portfolioUrl: string | null;
  startDate: string | null;
  mode: InternshipMode | null;
  message: string | null;
}): Promise<InternshipApplication> {
  await ensureApplicationsTable();
  const res = await getPool().query(
    `INSERT INTO internship_applications
       (domain_slug, full_name, email, phone, institution, enrollment_no, experience, portfolio_url, start_date, mode, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      input.domainSlug,
      input.fullName,
      input.email,
      input.phone,
      input.institution,
      input.enrollmentNo,
      input.experience,
      input.portfolioUrl,
      input.startDate,
      input.mode,
      input.message,
    ]
  );
  return rowToApplication(res.rows[0]);
}

// --- Interns and certificate verification ---

export type InternStatus = "active" | "submitted" | "verified";

export interface Intern {
  id: string;
  code: string;
  fullName: string;
  email: string;
  domainSlug: string;
  institution: string | null;
  startDate: string | null;
  endDate: string | null;
  mode: InternshipMode | null;
  projectUrl: string | null;
  submittedAt: string | null;
  status: InternStatus;
  certificateIssuedAt: string | null;
  createdAt: string;
}

/** What the PUBLIC verification page is allowed to see. Deliberately no
 * email, phone or enrollment number: anyone holding a serial can read this. */
export interface CertificateRecord {
  code: string;
  fullName: string;
  domainSlug: string;
  institution: string | null;
  startDate: string | null;
  projectUrl: string | null;
  status: InternStatus;
  certificateIssuedAt: string | null;
}

let internsTableReady: Promise<void> | null = null;
function ensureInternsTable(): Promise<void> {
  if (!internsTableReady) {
    const db = getPool();
    internsTableReady = db
      .query(
        `CREATE TABLE IF NOT EXISTS interns (
           id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
           code                   TEXT NOT NULL,
           code_key               TEXT NOT NULL UNIQUE,
           application_id         UUID REFERENCES internship_applications(id) ON DELETE SET NULL,
           full_name              TEXT NOT NULL,
           email                  TEXT NOT NULL,
           domain_slug            TEXT NOT NULL,
           institution            TEXT,
           start_date             DATE,
           end_date               DATE,
           mode                   TEXT,
           project_url            TEXT,
           submitted_at           TIMESTAMPTZ,
           status                 TEXT NOT NULL DEFAULT 'active'
                                    CHECK (status IN ('active', 'submitted', 'verified')),
           certificate_issued_at  TIMESTAMPTZ,
           created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
         )`
      )
      .then(() =>
        db.query(
          `ALTER TABLE interns
             ADD COLUMN IF NOT EXISTS end_date DATE,
             ADD COLUMN IF NOT EXISTS mode     TEXT`
        )
      )
      .then(() => undefined)
      .catch((err) => {
        internsTableReady = null;
        throw err;
      });
  }
  return internsTableReady;
}

function rowToIntern(r: Record<string, unknown>): Intern {
  return {
    id: r.id as string,
    code: r.code as string,
    fullName: r.full_name as string,
    email: r.email as string,
    domainSlug: r.domain_slug as string,
    institution: (r.institution as string | null) ?? null,
    startDate: r.start_date ? (r.start_date as Date).toISOString().slice(0, 10) : null,
    endDate: r.end_date ? (r.end_date as Date).toISOString().slice(0, 10) : null,
    mode: (r.mode as InternshipMode | null) ?? null,
    projectUrl: (r.project_url as string | null) ?? null,
    submittedAt: r.submitted_at ? (r.submitted_at as Date).toISOString() : null,
    status: r.status as InternStatus,
    certificateIssuedAt: r.certificate_issued_at ? (r.certificate_issued_at as Date).toISOString() : null,
    createdAt: (r.created_at as Date).toISOString(),
  };
}

export async function listInterns(): Promise<Intern[]> {
  await ensureInternsTable();
  const res = await getPool().query("SELECT * FROM interns ORDER BY created_at DESC");
  return res.rows.map(rowToIntern);
}

export async function createIntern(input: {
  code: string;
  codeKey: string;
  applicationId: string | null;
  fullName: string;
  email: string;
  domainSlug: string;
  institution: string | null;
  startDate: string | null;
  mode: InternshipMode | null;
}): Promise<Intern> {
  await ensureApplicationsTable();
  await ensureInternsTable();
  const res = await getPool().query(
    `INSERT INTO interns (code, code_key, application_id, full_name, email, domain_slug, institution, start_date, mode)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      input.code,
      input.codeKey,
      input.applicationId,
      input.fullName,
      input.email,
      input.domainSlug,
      input.institution,
      input.startDate,
      input.mode,
    ]
  );
  return rowToIntern(res.rows[0]);
}

export async function getIntern(id: string): Promise<Intern | null> {
  await ensureInternsTable();
  const res = await getPool().query("SELECT * FROM interns WHERE id = $1", [id]);
  return res.rows.length ? rowToIntern(res.rows[0]) : null;
}

/** Start/end dates and mode drive what the offer letter and certificate
 * say, so they stay editable after the code is issued. */
export async function updateInternDetails(
  id: string,
  input: { startDate: string | null; endDate: string | null; mode: InternshipMode | null }
): Promise<void> {
  await ensureInternsTable();
  await getPool().query("UPDATE interns SET start_date = $1, end_date = $2, mode = $3 WHERE id = $4", [
    input.startDate,
    input.endDate,
    input.mode,
    id,
  ]);
}

export async function findInternByCodeKey(codeKey: string): Promise<Intern | null> {
  await ensureInternsTable();
  const res = await getPool().query("SELECT * FROM interns WHERE code_key = $1", [codeKey]);
  return res.rows.length ? rowToIntern(res.rows[0]) : null;
}

/** Records the project link an intern submits against their own code. Only
 * allowed while the certificate hasn't been issued -- once it has, the link
 * it was verified against must stay fixed, or the certificate would vouch
 * for a repository that changed after the fact. */
export async function submitInternProject(codeKey: string, projectUrl: string): Promise<"ok" | "not_found" | "already_verified"> {
  await ensureInternsTable();
  const db = getPool();
  const existing = await findInternByCodeKey(codeKey);
  if (!existing) return "not_found";
  if (existing.status === "verified") return "already_verified";
  await db.query(
    "UPDATE interns SET project_url = $1, submitted_at = now(), status = 'submitted' WHERE code_key = $2",
    [projectUrl, codeKey]
  );
  return "ok";
}

export async function verifyIntern(id: string): Promise<void> {
  await ensureInternsTable();
  await getPool().query(
    "UPDATE interns SET status = 'verified', certificate_issued_at = now() WHERE id = $1",
    [id]
  );
}

/** Sends a submission back for rework: clears the issued certificate too, so
 * a certificate can never outlive the verification that justified it. */
export async function unverifyIntern(id: string): Promise<void> {
  await ensureInternsTable();
  await getPool().query(
    `UPDATE interns SET status = CASE WHEN project_url IS NULL THEN 'active' ELSE 'submitted' END,
                        certificate_issued_at = NULL
     WHERE id = $1`,
    [id]
  );
}

export async function deleteIntern(id: string): Promise<void> {
  await ensureInternsTable();
  await getPool().query("DELETE FROM interns WHERE id = $1", [id]);
}

export async function deleteInternshipApplication(id: string): Promise<void> {
  await ensureApplicationsTable();
  await getPool().query("DELETE FROM internship_applications WHERE id = $1", [id]);
}

export async function listInternshipApplications(): Promise<InternshipApplication[]> {
  await ensureApplicationsTable();
  const res = await getPool().query("SELECT * FROM internship_applications ORDER BY created_at DESC");
  return res.rows.map(rowToApplication);
}
