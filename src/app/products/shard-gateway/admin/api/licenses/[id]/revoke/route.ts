import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionCookieValue } from "@/lib/admin/session";
import { revokeLicense } from "@/lib/admin/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!verifySessionCookieValue(cookieStore.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  await revokeLicense(id);
  return NextResponse.json({ ok: true });
}
