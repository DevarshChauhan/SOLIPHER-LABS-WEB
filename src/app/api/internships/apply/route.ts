import { NextRequest, NextResponse } from "next/server";
import { createInternshipApplication, hasDb, type InternshipMode } from "@/lib/admin/db";
import { getInternshipDomain } from "@/lib/data/internships";
import { findCoupon, feeWithCoupon } from "@/lib/internships/coupons";

const LIMITS = {
  fullName: 120,
  email: 200,
  phone: 40,
  institution: 200,
  enrollmentNo: 60,
  transactionId: 80,
  experience: 4000,
  portfolioUrl: 500,
  message: 4000,
} as const;

// Stored as a DATE, so anything that isn't a plain YYYY-MM-DD is dropped
// rather than handed to Postgres to reject mid-insert.
function cleanDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  return Number.isNaN(new Date(trimmed).getTime()) ? null : trimmed;
}

const MODES: InternshipMode[] = ["online", "offline", "hybrid"];

function cleanMode(value: unknown): InternshipMode | null {
  return typeof value === "string" && MODES.includes(value as InternshipMode) ? (value as InternshipMode) : null;
}

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

  // Recorded as a claim to be checked against the bank, never treated as
  // proof of payment: the application stays 'pending' until a human says
  // otherwise, so a made-up reference buys nothing.
  // An unrecognised coupon is ignored rather than rejected: the fee simply
  // stays at full price, which the admin sees on the application.
  const coupon = findCoupon(payload.couponCode);

  const transactionId = clean(payload.transactionId, LIMITS.transactionId);
  if (!transactionId) {
    return NextResponse.json({ ok: false, error: "Enter the UPI transaction ID for your application fee." }, { status: 400 });
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
      enrollmentNo: clean(payload.enrollmentNo, LIMITS.enrollmentNo),
      experience: clean(payload.experience, LIMITS.experience),
      portfolioUrl: clean(payload.portfolioUrl, LIMITS.portfolioUrl),
      startDate: cleanDate(payload.startDate),
      mode: cleanMode(payload.mode),
      message: clean(payload.message, LIMITS.message),
      transactionId,
      couponCode: coupon?.code ?? null,
      // Recomputed here from the coupon rather than taken from the
      // request: the browser is told what to pay, never trusted to report
      // it. Stored per application so a later fee or coupon change
      // doesn't rewrite what this applicant was actually asked for.
      feeAmount: feeWithCoupon(coupon),
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
