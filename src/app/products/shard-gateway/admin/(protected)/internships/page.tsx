import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { listInternshipApplications, hasDb } from "@/lib/admin/db";
import { getInternshipDomain } from "@/lib/data/internships";
import { Mail, Phone, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Internship applications",
  robots: { index: false, follow: false },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default async function InternshipApplicationsPage() {
  const applications = hasDb ? await listInternshipApplications() : [];

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
          <Link href="/products/shard-gateway/admin" className="text-sm text-muted transition-colors hover:text-foreground">
            Back to licensing
          </Link>
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
                  <span className="text-xs text-muted">{formatDate(app.createdAt)}</span>
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

                {(app.institution || app.availability) && (
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                    {app.institution && <span>{app.institution}</span>}
                    {app.availability && <span>Available: {app.availability}</span>}
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
