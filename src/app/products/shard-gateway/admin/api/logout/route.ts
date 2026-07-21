import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/admin/session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { path: "/products/shard-gateway/admin", maxAge: 0 });
  return res;
}
