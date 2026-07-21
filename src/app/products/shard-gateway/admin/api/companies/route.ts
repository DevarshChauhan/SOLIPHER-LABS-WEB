import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionCookieValue } from "@/lib/admin/session";
import { createCompany } from "@/lib/admin/db";
import type { CompanyCategory } from "@/lib/admin/types";

async function requireAdmin() {
  const cookieStore = await cookies();
  return verifySessionCookieValue(cookieStore.get(COOKIE_NAME)?.value);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ ok: false, error: "name is required" }, { status: 400 });
  }
  const category: CompanyCategory = body.category === "gpu_cloud" ? "gpu_cloud" : "ai_product";

  const company = await createCompany({
    name: body.name,
    contactEmail: typeof body.contactEmail === "string" && body.contactEmail ? body.contactEmail : null,
    contactName: typeof body.contactName === "string" && body.contactName ? body.contactName : null,
    category,
  });
  return NextResponse.json({ ok: true, company });
}
