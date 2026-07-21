import { NextRequest, NextResponse } from "next/server";
import { createSessionCookieValue, verifyPassphrase, COOKIE_NAME } from "@/lib/admin/session";

export async function POST(req: NextRequest) {
  const { passphrase } = await req.json().catch(() => ({ passphrase: "" }));

  if (typeof passphrase !== "string" || !verifyPassphrase(passphrase)) {
    // Same generic response whether the passphrase is wrong or unset --
    // doesn't leak which case it is.
    return NextResponse.json({ ok: false, error: "Invalid passphrase." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/products/shard-gateway/admin",
    maxAge: 12 * 60 * 60,
  });
  return res;
}
