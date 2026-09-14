import { NextRequest, NextResponse } from "next/server";
import { submitInternProject, hasDb } from "@/lib/admin/db";
import { normalizeCode } from "@/lib/internships/code";

// A repository link, not an arbitrary URL: this gets opened by whoever
// reviews the submission, so it has to be somewhere code actually lives.
const ALLOWED_HOSTS = ["github.com", "gitlab.com", "bitbucket.org", "git.sr.ht", "codeberg.org"];

function parseRepoUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (!ALLOWED_HOSTS.includes(host)) return null;
  return url.toString();
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const rawCode = typeof payload.code === "string" ? payload.code : "";
  const codeKey = normalizeCode(rawCode);
  const projectUrl = parseRepoUrl(payload.projectUrl);

  if (!codeKey) {
    return NextResponse.json({ ok: false, error: "Enter your intern code." }, { status: 400 });
  }
  if (!projectUrl) {
    return NextResponse.json(
      { ok: false, error: "Enter a repository link on GitHub, GitLab, Bitbucket, Codeberg or sourcehut." },
      { status: 400 }
    );
  }
  if (!hasDb) {
    return NextResponse.json({ ok: false, error: "Submissions are unavailable right now. Please email us." }, { status: 503 });
  }

  try {
    const result = await submitInternProject(codeKey, projectUrl);
    if (result === "not_found") {
      return NextResponse.json({ ok: false, error: "That code doesn't match any intern. Check it and try again." }, { status: 404 });
    }
    if (result === "already_verified") {
      return NextResponse.json(
        { ok: false, error: "Your certificate has already been issued, so this submission is closed. Email us if the link needs changing." },
        { status: 409 }
      );
    }
  } catch (err) {
    console.error("Failed to store project submission", err);
    return NextResponse.json({ ok: false, error: "We couldn't save your submission. Please email us instead." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
