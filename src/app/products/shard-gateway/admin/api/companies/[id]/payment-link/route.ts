import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionCookieValue } from "@/lib/admin/session";
import { createPaymentLink, getCompanyById } from "@/lib/admin/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!verifySessionCookieValue(cookieStore.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await params;
  const company = await getCompanyById(id);
  if (!company) return NextResponse.json({ ok: false, error: "no such company" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const amount = Number(body?.amount);
  const termYearsRaw = Number(body?.termYears);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ ok: false, error: "amount must be a positive number" }, { status: 400 });
  }
  const termYears: 1 | 2 | 3 = termYearsRaw === 2 ? 2 : termYearsRaw === 3 ? 3 : 1;

  const link = await createPaymentLink({ companyId: id, amount, currency: "INR", termYears });
  const url = `/products/shard-gateway/pay/${link.id}`;
  return NextResponse.json({ ok: true, link, url });
}
