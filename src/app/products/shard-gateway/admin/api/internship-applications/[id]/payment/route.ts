import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionCookieValue } from "@/lib/admin/session";
import { setApplicationPaymentStatus, type PaymentStatus } from "@/lib/admin/db";

const STATUSES: PaymentStatus[] = ["pending", "verified", "rejected"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!verifySessionCookieValue(cookieStore.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const status = body.status;

  if (typeof status !== "string" || !STATUSES.includes(status as PaymentStatus)) {
    return NextResponse.json({ ok: false, error: "Unknown status." }, { status: 400 });
  }

  await setApplicationPaymentStatus(id, status as PaymentStatus);
  return NextResponse.json({ ok: true });
}
