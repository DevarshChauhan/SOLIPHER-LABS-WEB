import { NextRequest, NextResponse } from "next/server";
import { createInternshipApplication, hasDb } from "@/lib/admin/db";
import { getInternshipDomain } from "@/lib/data/internships";

const LIMITS = {
  fullName: 120,
  email: 200,
  phone: 40,
  institution: 200,
  experience: 4000,
  portfolioUrl: 500,
  availability: 200,
  message: 4000,
} as const;

function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;

  // Honeypot: a field hidden from real users. Anything that fills it in is a
  // bot, and gets a success response so it doesn't retry with a new strategy.
  if (clean(payload.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const domainSlug = clean(payload.domainSlug, 80);
  const fullName = clean(payload.fullName, LIMITS.fullName);
  const email = clean(payload.email, LIMITS.email);

  if (!domainSlug || !getInternshipDomain(domainSlug)) {
    return NextResponse.json({ ok: false, error: "Pick an internship domain." }, { status: 400 });
  }
  if (!fullName) {
    return NextResponse.json({ ok: false, error: "Your name is required." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid email address is required." }, { status: 400 });
  }

  // Storing this in memory would lose it on the next deploy, so rather than
  // reporting a success we can't honour, say plainly that it didn't save.
  if (!hasDb) {
    return NextResponse.json(
      { ok: false, error: "Applications aren't being accepted through the site right now. Please email us instead." },
      { status: 503 }
    );
  }

  try {
    await createInternshipApplication({
      domainSlug,
      fullName,
      email,
      phone: clean(payload.phone, LIMITS.phone),
      institution: clean(payload.institution, LIMITS.institution),
      experience: clean(payload.experience, LIMITS.experience),
      portfolioUrl: clean(payload.portfolioUrl, LIMITS.portfolioUrl),
      availability: clean(payload.availability, LIMITS.availability),
      message: clean(payload.message, LIMITS.message),
    });
  } catch (err) {
    console.error("Failed to store internship application", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your application. Please email us instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
