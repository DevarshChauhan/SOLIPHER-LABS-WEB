import { NextResponse, type NextRequest } from "next/server";
import { get } from "@vercel/edge-config";

// Paths no legitimate visitor or crawler will ever request on this site.
// Anything that touches one of these is a scanner/bot, not a person.
const HONEYPOT_PATHS = new Set([
  "/wp-login.php",
  "/wp-admin",
  "/wp-admin/",
  "/wp-config.php",
  "/wp-content/plugins",
  "/xmlrpc.php",
  "/.env",
  "/.env.local",
  "/.env.production",
  "/.env.backup",
  "/admin.php",
  "/administrator",
  "/administrator/index.php",
  "/phpmyadmin",
  "/pma",
  "/.git/config",
  "/.git/HEAD",
  "/config.php",
  "/configuration.php",
  "/.aws/credentials",
  "/server-status",
  "/actuator/health",
  "/actuator/env",
  "/telescope",
  "/_profiler",
  "/cgi-bin/",
  "/HNAP1/",
  "/boaform/admin/formLogin",
  "/shell.php",
  "/db.sql",
  "/backup.sql",
  "/.DS_Store",
]);

// How long a triggered ban stays active. Shared/dynamic IPs (corporate NAT,
// mobile CGNAT) mean a permanent ban risks blocking an unrelated later
// visitor on the same address. A week is long enough to stop a scan without
// that becoming a standing liability.
const BAN_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

interface BanEntry {
  ip: string;
  at: number;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

async function isBanned(ip: string): Promise<boolean> {
  if (ip === "unknown") return false;
  try {
    const bans = (await get<BanEntry[]>("bannedIps")) ?? [];
    const now = Date.now();
    return bans.some((b) => b.ip === ip && now - b.at < BAN_DURATION_MS);
  } catch {
    return false;
  }
}

async function banIp(ip: string): Promise<void> {
  if (ip === "unknown") return;
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const apiToken = process.env.VERCEL_API_TOKEN;
  if (!edgeConfigId || !apiToken) return;

  try {
    const now = Date.now();
    const current = (await get<BanEntry[]>("bannedIps")) ?? [];
    const fresh = current.filter((b) => now - b.at < BAN_DURATION_MS && b.ip !== ip);
    const updated = [...fresh, { ip, at: now }];

    await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ operation: "upsert", key: "bannedIps", value: updated }],
      }),
    });
  } catch {
    // Best-effort. A failed write just means this one scanner isn't
    // blocked yet. Never let it break the response to a real visitor.
  }
}

export async function middleware(request: NextRequest) {
  const clientIp = getClientIp(request);
  const pathname = request.nextUrl.pathname;

  if (await isBanned(clientIp)) {
    return new NextResponse(null, { status: 403 });
  }

  if (HONEYPOT_PATHS.has(pathname)) {
    // Fire-and-forget: ban the IP without holding up this response.
    banIp(clientIp);
    // Look like an ordinary missing page. Don't tip off the scanner.
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
