import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteApplicationButton } from "@/components/admin/DeleteApplicationButton";
import { IssueCodeButton } from "@/components/admin/InternActions";
import { listInternshipApplications, hasDb } from "@/lib/admin/db";
import { getInternshipDomain } from "@/lib/data/internships";
import { Mail, Phone, ExternalLink, CalendarDays, IdCard } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Internship applications",
  robots: { index: false, follow: false },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

export default async function InternshipApplicationsPage() {
  const applications = hasDb ? await listInternshipApplications() : [];

  const byCollege = new Map<string, number>();
  for (const app of applications) {
    const key = app.institution ?? "Not given";
    byCollege.set(key, (byCollege.get(key) ?? 0) + 1);
  }
  const collegeCounts = [...byCollege.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return (
    <>
      <AdminHeader crumb="Internship applications" />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Internship applications</h1>
            <p className="mt-1 text-sm text-muted">
              {applications.length} {applications.length === 1 ? "application" : "applications"} submitted from the
              public form.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/products/shard-gateway/admin/interns"
              className="text-muted transition-colors hover:text-foreground"
            >
              Interns &amp; certificates →
            </Link>
            <Link href="/products/shard-gateway/admin" className="text-muted transition-colors hover:text-foreground">
              Back to licensing
            </Link>
          </div>
        </div>

        {!hasDb && (
          <p className="mt-8 rounded-xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-foreground/90">
            No database is configured, so the public form is turning applicants away rather than silently dropping
            their applications. Set DATABASE_URL to start accepting them.
          </p>
        )}

        {hasDb && applications.length === 0 && (
          <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-sm text-muted">
            No applications yet. They&rsquo;ll appear here as soon as someone submits the form at /internships/apply.
          </p>
        )}

        {collegeCounts.length > 0 && (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">By college</h2>
            <ul className="mt-3 divide-y divide-border">
              {collegeCounts.map(([college, count]) => (
                <li key={college} className="flex items-center justify-between gap-4 py-2 text-sm">
                  <span className="text-foreground/85">{college}</span>
                  <span className="shrink-0 tabular-nums text-muted">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {applications.map((app) => {
            const domain = getInternshipDomain(app.domainSlug);
            return (
              <article key={app.id} className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{app.fullName}</h2>
                    <p className="mt-1 text-sm font-medium text-red-400">{domain?.name ?? app.domainSlug}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs text-muted">{formatDate(app.createdAt)}</span>
                    <IssueCodeButton applicationId={app.id} />
                    <DeleteApplicationButton applicationId={app.id} />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <a href={`mailto:${app.email}`} className="inline-flex items-center gap-1.5 text-foreground/85 hover:text-red-400">
                    <Mail size={14} className="text-red-500" />
                    {app.email}
                  </a>
                  {app.phone && (
                    <span className="inline-flex items-center gap-1.5 text-foreground/85">
                      <Phone size={14} className="text-red-500" />
                      {app.phone}
                    </span>
                  )}
                  {app.portfolioUrl && (
                    <a
                      href={app.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-foreground/85 hover:text-red-400"
                    >
                      <ExternalLink size={14} className="text-red-500" />
                      {app.portfolioUrl}
                    </a>
                  )}
                </div>

                {(app.institution || app.enrollmentNo || app.startDate) && (
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                    {app.institution && <span className="text-foreground/85">{app.institution}</span>}
                    {app.enrollmentNo && (
                      <span className="inline-flex items-center gap-1.5">
                        <IdCard size={14} className="text-red-500" />
                        {app.enrollmentNo}
                      </span>
                    )}
                    {app.startDate && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-red-500" />
                        Starts {formatDay(app.startDate)}
                      </span>
                    )}
                    {app.mode && <span className="capitalize">{app.mode}</span>}
                  </div>
                )}

                {app.experience && (
                  <div className="mt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">What they&rsquo;ve built</h3>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">{app.experience}</p>
                  </div>
                )}

                {app.message && (
                  <div className="mt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Why this domain</h3>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">{app.message}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
