import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "shard_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h, matches console/webapp's own session TTL convention

// Fails loudly in production rather than silently signing with a
// predictable default -- an admin session guarding license issuance and
// payment records must never run on a guessable secret.
function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SESSION_SECRET is not set -- refusing to sign admin sessions in production.");
    }
    return "dev-only-insecure-secret-set-ADMIN_SESSION_SECRET";
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionCookieValue(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `admin:${expiresAt}`;
  return `${payload}:${sign(payload)}`;
}

export function verifySessionCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split(":");
  if (parts.length !== 3) return false;
  const [role, expiresAtStr, signature] = parts;
  const payload = `${role}:${expiresAtStr}`;
  const expected = sign(payload);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;
  return role === "admin";
}

export function verifyPassphrase(candidate: string): boolean {
  const real = process.env.ADMIN_PASSPHRASE;
  if (!real) return false; // no passphrase configured = admin panel refuses all logins, not open
  const a = Buffer.from(candidate);
  const b = Buffer.from(real);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export { COOKIE_NAME };
