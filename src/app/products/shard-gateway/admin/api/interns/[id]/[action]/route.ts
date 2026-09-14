import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionCookieValue } from "@/lib/admin/session";
import { verifyIntern, unverifyIntern, deleteIntern } from "@/lib/admin/db";

const ACTIONS = {
  verify: verifyIntern,
  unverify: unverifyIntern,
  delete: deleteIntern,
} as const;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; action: string }> }) {
  const cookieStore = await cookies();
  if (!verifySessionCookieValue(cookieStore.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id, action } = await params;
  const handler = ACTIONS[action as keyof typeof ACTIONS];
  if (!handler) {
    return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });
  }

  await handler(id);
  return NextResponse.json({ ok: true });
}
