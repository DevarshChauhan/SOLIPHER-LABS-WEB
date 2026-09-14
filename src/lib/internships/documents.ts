import type { InternshipMode } from "@/lib/admin/db";

export function formatDocDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Wording for the internship mode, kept in one place so the offer letter
 * and the certificate never describe the same internship differently. */
export function describeMode(mode: InternshipMode | null): { adjective: string; article: string; label: string } {
  switch (mode) {
    case "online":
      return { adjective: "online", article: "an", label: "Online" };
    case "offline":
      return { adjective: "in-office", article: "an", label: "Offline (in person)" };
    case "hybrid":
      return { adjective: "hybrid", article: "a", label: "Hybrid" };
    default:
      return { adjective: "", article: "an", label: "Not specified" };
  }
}

/** "3 months", "6 weeks" -- whichever reads naturally for the span, so the
 * offer letter's duration line doesn't say "0 months" for a short internship. */
export function describeDuration(startIso: string | null, endIso: string | null): string | null {
  if (!startIso || !endIso) return null;
  const start = new Date(startIso);
  const end = new Date(endIso);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  if (days <= 0) return null;

  const months = Math.round(days / 30.44);
  if (days >= 60 && Math.abs(days - months * 30.44) <= 5) {
    return `${months} month${months === 1 ? "" : "s"}`;
  }
  if (days >= 14) {
    const weeks = Math.round(days / 7);
    return `${weeks} week${weeks === 1 ? "" : "s"}`;
  }
  return `${days} day${days === 1 ? "" : "s"}`;
}
