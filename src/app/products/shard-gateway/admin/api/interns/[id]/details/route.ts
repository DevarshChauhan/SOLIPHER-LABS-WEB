import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionCookieValue } from "@/lib/admin/session";
import { updateInternDetails, type InternshipMode } from "@/lib/admin/db";

const MODES: InternshipMode[] = ["online", "offline", "hybrid"];

function cleanDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  return Number.isNaN(new Date(trimmed).getTime()) ? null : trimmed;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!verifySessionCookieValue(cookieStore.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  await updateInternDetails(id, {
    startDate: cleanDate(body.startDate),
    endDate: cleanDate(body.endDate),
    mode: MODES.includes(body.mode as InternshipMode) ? (body.mode as InternshipMode) : null,
  });

  return NextResponse.json({ ok: true });
}
