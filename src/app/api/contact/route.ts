import { NextRequest, NextResponse } from "next/server";
import { createContactMessage, hasDb } from "@/lib/admin/db";

const LIMITS = { name: 120, email: 200, company: 200, projectType: 120, message: 5000 } as const;

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

  // Honeypot: hidden from real users, so anything filling it in is a bot.
  // It gets a success response so it doesn't retry with a new strategy.
  if (clean(payload.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(payload.name, LIMITS.name);
  const email = clean(payload.email, LIMITS.email);
  const message = clean(payload.message, LIMITS.message);

  if (!name) {
    return NextResponse.json({ ok: false, field: "name", error: "Your name is required." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, field: "email", error: "A valid email address is required." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ ok: false, field: "message", error: "Tell us a little about what you're building." }, { status: 400 });
  }

  // Without a database the message would be lost, so say so plainly and let
  // the form offer the email fallback instead of reporting a fake success.
  if (!hasDb) {
    return NextResponse.json(
      { ok: false, error: "The form isn't accepting messages right now. Please email us instead." },
      { status: 503 }
    );
  }

  try {
    await createContactMessage({
      name,
      email,
      company: clean(payload.company, LIMITS.company),
      projectType: clean(payload.projectType, LIMITS.projectType),
      message,
    });
  } catch (err) {
    console.error("Failed to store contact message", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your message. Please email us instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
