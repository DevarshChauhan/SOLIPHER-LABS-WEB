import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { InternActions, InternDetailsForm } from "@/components/admin/InternActions";
import { listInterns, hasDb } from "@/lib/admin/db";
import { getInternshipDomain } from "@/lib/data/internships";
import { Mail, ExternalLink, BadgeCheck, Clock, CircleDashed, FileText, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Interns & certificates",
  robots: { index: false, follow: false },
};

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

const statusMeta = {
  active: { label: "In progress", icon: CircleDashed, className: "text-muted" },
  submitted: { label: "Awaiting verification", icon: Clock, className: "text-amber-600 dark:text-amber-400" },
  verified: { label: "Certificate issued", icon: BadgeCheck, className: "text-emerald-600 dark:text-emerald-400" },
} as const;

export default async function InternsPage() {
  const interns = hasDb ? await listInterns() : [];
  const awaiting = interns.filter((i) => i.status === "submitted").length;

  return (
    <>
      <AdminHeader crumb="Interns & certificates" />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Interns &amp; certificates</h1>
            <p className="mt-1 text-sm text-muted">
              {interns.length} {interns.length === 1 ? "intern" : "interns"}
              {awaiting > 0 && <span className="text-amber-600 dark:text-amber-400"> · {awaiting} awaiting verification</span>}
            </p>
          </div>
          <Link
            href="/products/shard-gateway/admin/internships"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            ← Applications
          </Link>
        </div>

        {!hasDb && (
          <p className="mt-8 rounded-xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-foreground/90">
            No database is configured, so no intern codes or certificates can be issued. Set DATABASE_URL first.
          </p>
        )}

        {hasDb && interns.length === 0 && (
          <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-sm text-muted">
            No intern codes issued yet. Accept an application on the{" "}
            <Link href="/products/shard-gateway/admin/internships" className="text-red-400 underline underline-offset-2">
              applications page
            </Link>{" "}
            to issue one.
          </p>
        )}

        <div className="mt-8 space-y-4">
          {interns.map((intern) => {
            const domain = getInternshipDomain(intern.domainSlug);
            const meta = statusMeta[intern.status];
            const StatusIcon = meta.icon;
            return (
              <article key={intern.id} className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-base font-semibold text-foreground">{intern.fullName}</h2>
                      <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs tracking-wider text-foreground/85">
                        {intern.code}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-red-400">{domain?.name ?? intern.domainSlug}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta.className}`}>
                    <StatusIcon size={14} />
                    {meta.label}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <a href={`mailto:${intern.email}`} className="inline-flex items-center gap-1.5 text-foreground/85 hover:text-red-400">
                    <Mail size={14} className="text-red-500" />
                    {intern.email}
                  </a>
                  {intern.institution && <span className="text-muted">{intern.institution}</span>}
                  {intern.startDate && <span className="text-muted">Started {formatDay(intern.startDate)}</span>}
                </div>

                {intern.projectUrl ? (
                  <div className="mt-4 rounded-xl border border-border bg-background p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Submitted project</h3>
                    <a
                      href={intern.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="mt-1.5 inline-flex items-center gap-1.5 break-all text-sm text-red-400 underline underline-offset-2"
                    >
                      {intern.projectUrl}
                      <ExternalLink size={13} className="shrink-0" />
                    </a>
                    {intern.submittedAt && (
                      <p className="mt-1.5 text-xs text-muted">Submitted {formatDay(intern.submittedAt)}</p>
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted">No project submitted yet.</p>
                )}

                {intern.certificateIssuedAt && (
                  <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">
                    Certificate issued {formatDay(intern.certificateIssuedAt)} · verifiable at /verify
                  </p>
                )}

                <div className="mt-5 border-t border-border pt-4">
                  <InternDetailsForm
                    internId={intern.id}
                    startDate={intern.startDate}
                    endDate={intern.endDate}
                    mode={intern.mode}
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                  <div className="flex items-center gap-4 text-xs">
                    <Link
                      href={`/products/shard-gateway/admin/interns/${intern.id}/offer-letter`}
                      className="inline-flex items-center gap-1.5 font-medium text-foreground/85 transition-colors hover:text-red-400"
                    >
                      <FileText size={13} className="text-red-500" />
                      Offer letter
                    </Link>
                    <Link
                      href={`/products/shard-gateway/admin/interns/${intern.id}/certificate`}
                      className="inline-flex items-center gap-1.5 font-medium text-foreground/85 transition-colors hover:text-red-400"
                    >
                      <Award size={13} className="text-red-500" />
                      Certificate
                    </Link>
                  </div>
                  <InternActions internId={intern.id} status={intern.status} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
