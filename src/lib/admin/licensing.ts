import { createPrivateKey, sign as edSign, randomUUID } from "crypto";

// Node-native port of shard_project/licensing/licensing/canonical.py's
// signable_bytes() and license_file.py's issue_trial_license(). MUST stay
// byte-for-byte identical to the Python original -- shard_license.cpp
// verifies against this exact canonical form, and license_file.py's own
// docstring is explicit that this scheme exists specifically so a second
// implementation (this one) can reproduce it with plain string
// concatenation, no shared JSON/YAML library required.
const FIELD_ORDER = ["license_id", "customer_id", "license_type", "term_years", "issued_at", "expires_at", "topology_fingerprint"] as const;
const DELIMITER = "|";
const TRIAL_DURATION_DAYS = 14;

export interface LicenseFields {
  license_id: string;
  customer_id: string;
  license_type: "trial" | "paid";
  term_years: number | null;
  issued_at: string;
  expires_at: string;
  topology_fingerprint: string;
}

// shard_license.cpp's parse_iso8601_utc() parses with a fixed sscanf
// pattern ("%d-%d-%dT%d:%d:%d%c%d:%d") that requires an explicit
// "+00:00" UTC offset and has no fractional-seconds handling at all --
// Date.prototype.toISOString()'s own "...961Z" (milliseconds + literal Z)
// fails that scan outright (found via a real cross-language round-trip
// test: a Node-signed license came back kMalformedLicense from the C++
// side). This matches Python's license_file.py's own _iso() output
// format exactly, which is what that C++ parser was actually written
// against.
function isoNow(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "+00:00");
}

function signableBytes(license: LicenseFields): Buffer {
  const parts = FIELD_ORDER.map((field) => {
    const value = license[field];
    const str = value === null || value === undefined ? "null" : String(value);
    if (str.includes(DELIMITER)) {
      throw new Error(`license field ${field} contains the delimiter "|" -- cannot be signed safely`);
    }
    return str;
  });
  return Buffer.from(parts.join(DELIMITER), "utf-8");
}

// PyNaCl's SigningKey(base64.b64decode(seed)) takes a raw 32-byte Ed25519
// seed. Node's crypto module needs that seed wrapped in a minimal PKCS8
// DER envelope to import it -- this is the fixed, well-known Ed25519
// PKCS8 prefix (RFC 8410), not something specific to this key.
const ED25519_PKCS8_PREFIX = Buffer.from("302e020100300506032b657004220420", "hex");

function loadSigningKey(seedB64: string) {
  const seed = Buffer.from(seedB64, "base64");
  if (seed.length !== 32) {
    throw new Error(`Ed25519 signing key seed must be exactly 32 bytes, got ${seed.length}`);
  }
  const der = Buffer.concat([ED25519_PKCS8_PREFIX, seed]);
  return createPrivateKey({ key: der, format: "der", type: "pkcs8" });
}

// Ed25519 signing is deterministic (RFC 8032) -- same key + same message
// always produces the same signature, no randomness involved. That means
// this function's output is directly comparable byte-for-byte against
// PyNaCl's for the same seed + payload, which is exactly how
// licensing/tests/test_canonical.py's vectors should be used to verify
// this port before it signs anything real.
function signBytes(payload: Buffer, signingKeySeedB64: string): string {
  const key = loadSigningKey(signingKeySeedB64);
  const signature = edSign(null, payload, key);
  return signature.toString("base64");
}

function getSigningKey(): string {
  const key = process.env.SOLIPHER_SIGNING_KEY_B64;
  if (!key) {
    throw new Error(
      "SOLIPHER_SIGNING_KEY_B64 is not set -- no license can be issued until the real Solipher " +
      "Ed25519 signing key (generated offline, per the project's own custody decision) is added " +
      "as a Vercel environment secret."
    );
  }
  return key;
}

export interface SignedLicense extends LicenseFields {
  signature: string;
}

export function issueTrialLicense(customerId: string, topologyFingerprint: string): SignedLicense {
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);
  const fields: LicenseFields = {
    license_id: randomUUID(),
    customer_id: customerId,
    license_type: "trial",
    term_years: null,
    issued_at: isoNow(issuedAt),
    expires_at: isoNow(expiresAt),
    topology_fingerprint: topologyFingerprint,
  };
  const signature = signBytes(signableBytes(fields), getSigningKey());
  return { ...fields, signature };
}

export function issuePaidLicense(customerId: string, topologyFingerprint: string, termYears: 1 | 2 | 3): SignedLicense {
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + termYears);
  const fields: LicenseFields = {
    license_id: randomUUID(),
    customer_id: customerId,
    license_type: "paid",
    term_years: termYears,
    issued_at: isoNow(issuedAt),
    expires_at: isoNow(expiresAt),
    topology_fingerprint: topologyFingerprint,
  };
  const signature = signBytes(signableBytes(fields), getSigningKey());
  return { ...fields, signature };
}

// Exported for a one-time cross-language verification test: sign the same
// fixture payload this Node code and licensing/tests/test_canonical.py
// both use, and diff the two base64 signatures -- they must match
// exactly before this code issues a single real license.
export const __testables = { signableBytes, signBytes };
