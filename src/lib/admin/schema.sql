-- SHARD Gateway admin panel schema. Run once against the Neon Postgres
-- database (added via Vercel's integration -- see admin/README.md).
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS companies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  contact_email TEXT,
  contact_name  TEXT,
  category      TEXT NOT NULL DEFAULT 'ai_product' CHECK (category IN ('gpu_cloud', 'ai_product')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS licenses (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id            UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  license_id            TEXT NOT NULL UNIQUE,
  license_type          TEXT NOT NULL CHECK (license_type IN ('trial', 'paid')),
  term_years            INT,
  issued_at             TIMESTAMPTZ NOT NULL,
  expires_at            TIMESTAMPTZ NOT NULL,
  grace_period_days     INT NOT NULL DEFAULT 15,
  topology_fingerprint  TEXT NOT NULL,
  signed_license_json   JSONB NOT NULL,
  revoked_at            TIMESTAMPTZ,
  issued_by             TEXT NOT NULL DEFAULT 'admin',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS licenses_company_id_idx ON licenses(company_id);

-- Anti-reset guarantee (mirrors shard_project/licensing/licensing/
-- trial_registry.py's documented intent, which today only has an
-- in-memory/test-only backing store): one trial per real install. A
-- reinstall on the same hardware must find its existing trial, never
-- mint a second one -- this is the real, persistent store that concept
-- needed.
CREATE UNIQUE INDEX IF NOT EXISTS licenses_trial_fingerprint_idx
  ON licenses(topology_fingerprint) WHERE license_type = 'trial';

CREATE TABLE IF NOT EXISTS payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL CHECK (provider IN ('paytm', 'skydo', 'manual')),
  provider_ref    TEXT,
  amount          NUMERIC(12, 2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'INR',
  status          TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed')),
  webhook_payload JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_ref)
);

CREATE INDEX IF NOT EXISTS payments_company_id_idx ON payments(company_id);

-- An admin-generated, amount-locked link sent to a company so they can
-- pay directly (self-serve checkout) instead of the admin creating a
-- Razorpay Payment Link by hand each time. The amount/term_years here are
-- server-authoritative -- the public pay page reads them from THIS row,
-- never from anything in the URL a customer could tamper with. Separate
-- from `payments` (which records an actual received payment, written by
-- the webhook) on purpose: this table is "permission to pay a specific
-- amount," not "money received."
CREATE TABLE IF NOT EXISTS payment_links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  amount      NUMERIC(12, 2) NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'INR',
  term_years  INT NOT NULL DEFAULT 1 CHECK (term_years IN (1, 2, 3)),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days')
);

CREATE INDEX IF NOT EXISTS payment_links_company_id_idx ON payment_links(company_id);

-- Internship applications submitted from the public /internships/apply
-- form. Unrelated to licensing; it lives here because this is the one
-- schema file and the one database. The application code creates this
-- table on demand too, so a fresh environment doesn't need this file run
-- by hand before the form works.
CREATE TABLE IF NOT EXISTS internship_applications (
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
);

CREATE INDEX IF NOT EXISTS internship_applications_created_at_idx
  ON internship_applications(created_at DESC);

-- Applicants are grouped by college in the admin view, which is only
-- meaningful because the form's college search stores one canonical
-- spelling per institution rather than whatever the applicant typed.
CREATE INDEX IF NOT EXISTS internship_applications_institution_idx
  ON internship_applications(institution);

-- An accepted intern, and the certificate serial issued to them. The
-- serial is the identity a certificate is verified by: code_key is the
-- same value with case, spaces and dashes stripped, so a serial typed by
-- hand off a printed certificate still resolves. Created on demand by the
-- application code, like internship_applications above.
CREATE TABLE IF NOT EXISTS interns (
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
);
