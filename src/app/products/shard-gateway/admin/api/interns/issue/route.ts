import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionCookieValue } from "@/lib/admin/session";
import { createIntern, findInternByCodeKey, listInternshipApplications } from "@/lib/admin/db";
import { generateInternCode, normalizeCode } from "@/lib/internships/code";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!verifySessionCookieValue(cookieStore.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const applicationId = body && typeof body === "object" ? (body as Record<string, unknown>).applicationId : null;
  if (typeof applicationId !== "string" || !applicationId) {
    return NextResponse.json({ ok: false, error: "Missing application." }, { status: 400 });
  }

  const application = (await listInternshipApplications()).find((a) => a.id === applicationId);
  if (!application) {
    return NextResponse.json({ ok: false, error: "Application not found." }, { status: 404 });
  }

  // Collisions are vanishingly unlikely at ~40 bits, but a duplicate code
  // would hand two people the same certificate identity, so retry rather
  // than let the unique index turn it into a 500.
  let code = "";
  let codeKey = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateInternCode();
    const key = normalizeCode(candidate);
    if (!(await findInternByCodeKey(key))) {
      code = candidate;
      codeKey = key;
      break;
    }
  }
  if (!code) {
    return NextResponse.json({ ok: false, error: "Could not allocate a code. Try again." }, { status: 500 });
  }

  try {
    const intern = await createIntern({
      code,
      codeKey,
      applicationId: application.id,
      fullName: application.fullName,
      email: application.email,
      domainSlug: application.domainSlug,
      institution: application.institution,
      startDate: application.startDate,
      mode: application.mode,
    });
    return NextResponse.json({ ok: true, code: intern.code });
  } catch (err) {
    console.error("Failed to issue intern code", err);
    return NextResponse.json({ ok: false, error: "Could not issue a code." }, { status: 500 });
  }
}
