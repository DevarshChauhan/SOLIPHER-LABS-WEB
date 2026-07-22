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
