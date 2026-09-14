import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { findInternByCodeKey, hasDb } from "@/lib/admin/db";
import { getInternshipDomain } from "@/lib/data/internships";
import { normalizeCode } from "@/lib/internships/code";
import { site } from "@/lib/data/site";
import { BadgeCheck, XCircle, Clock, Search, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify a Certificate",
  description:
    "Check whether a Solipher Labs internship certificate is genuine by entering the serial code printed on it.",
};

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10";

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { dateStyle: "long" });
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.code) ? params.code[0] : params.code;
  const submitted = typeof raw === "string" && raw.trim().length > 0;
  const codeKey = submitted ? normalizeCode(raw) : "";

  const intern = submitted && codeKey && hasDb ? await findInternByCodeKey(codeKey) : null;
  const domain = intern ? getInternshipDomain(intern.domainSlug) : null;
  const isValid = intern?.status === "verified" && Boolean(intern.certificateIssuedAt);

  return (
    <>
      <PageHero
        eyebrow="Certificate verification"
        title="Verify a certificate."
        description="Every internship certificate we issue carries a serial code. Enter it below to confirm the certificate is genuine and see what it was issued for."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl">
            <form method="GET" action="/verify" className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  name="code"
                  required
                  defaultValue={submitted ? raw : ""}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="SL-XXXX-XXXX"
                  aria-label="Certificate code"
                  className={`${inputClass} pl-10 font-mono uppercase tracking-wider`}
                />
              </div>
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-red-400 hover:shadow-[0_0_24px_color-mix(in_srgb,var(--red-500)_45%,transparent)]"
              >
                Verify
              </button>
            </form>

            {submitted && !hasDb && (
              <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-sm leading-relaxed text-muted">
                Verification is temporarily unavailable. Please email{" "}
                <a href={`mailto:${site.email}`} className="text-red-400 underline underline-offset-2">
                  {site.email}
                </a>{" "}
                and we&rsquo;ll confirm the certificate directly.
              </div>
            )}

            {submitted && hasDb && isValid && intern && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.04]">
                <div className="flex items-center gap-2.5 border-b border-emerald-500/30 px-6 py-4">
                  <BadgeCheck size={20} className="text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-500">Genuine certificate</span>
                </div>
                <dl className="divide-y divide-border px-6">
                  <Row label="Certificate code" value={<span className="font-mono tracking-wider">{intern.code}</span>} />
                  <Row label="Issued to" value={intern.fullName} />
                  <Row label="Internship domain" value={domain?.name ?? intern.domainSlug} />
                  {intern.institution && <Row label="College" value={intern.institution} />}
                  {intern.startDate && <Row label="Internship started" value={formatDay(intern.startDate)} />}
                  {intern.certificateIssuedAt && <Row label="Certificate issued" value={formatDay(intern.certificateIssuedAt)} />}
                  {intern.projectUrl && (
                    <Row
                      label="Verified project"
                      value={
                        <a
                          href={intern.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="inline-flex items-center gap-1.5 text-red-400 underline underline-offset-2"
                        >
                          {intern.projectUrl}
                          <ExternalLink size={13} />
                        </a>
                      }
                    />
                  )}
                </dl>
                <p className="border-t border-border px-6 py-4 text-xs leading-relaxed text-muted">
                  This certificate was issued by {site.legalName} after the project above was reviewed by the team.
                </p>
              </div>
            )}

            {submitted && hasDb && intern && !isValid && (
              <div className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/[0.04] p-6">
                <div className="flex items-center gap-2.5">
                  <Clock size={20} className="text-amber-500" />
                  <span className="text-sm font-semibold text-amber-500">No certificate issued yet</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  This code belongs to a current intern, but no certificate has been issued against it yet. A
                  certificate is only issued once the internship project has been submitted and verified.
                </p>
              </div>
            )}

            {submitted && hasDb && !intern && (
              <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/[0.04] p-6">
                <div className="flex items-center gap-2.5">
                  <XCircle size={20} className="text-red-500" />
                  <span className="text-sm font-semibold text-red-400">No match found</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  No certificate or intern matches that code. Check for typos, then email{" "}
                  <a href={`mailto:${site.email}`} className="text-red-400 underline underline-offset-2">
                    {site.email}
                  </a>{" "}
                  if you believe the certificate is genuine.
                </p>
              </div>
            )}

            {!submitted && (
              <p className="mt-6 text-sm leading-relaxed text-muted">
                The code looks like <span className="font-mono text-foreground/85">SL-XXXX-XXXX</span> and is printed
                on the certificate itself. Capitalisation and dashes don&rsquo;t matter.
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="text-sm break-words text-foreground/90">{value}</dd>
    </div>
  );
}
