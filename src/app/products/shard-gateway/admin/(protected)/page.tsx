import Link from "next/link";
import { listCompanies } from "@/lib/admin/db";
import { hasDb } from "@/lib/admin/db";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AddCompanyForm } from "@/components/admin/AddCompanyForm";
import { StatusPill } from "@/components/admin/StatusPill";
import { Building2, Cloud, Cpu } from "lucide-react";

export const dynamic = "force-dynamic";

function StatTile({ label, value, tone }: { label: string; value: number; tone?: "emerald" | "amber" | "zinc" }) {
  const toneClass = tone === "emerald" ? "text-emerald-600 dark:text-emerald-400" : tone === "amber" ? "text-amber-600 dark:text-amber-400" : tone === "zinc" ? "text-zinc-500" : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-surface px-5 py-4">
      <div className="text-xs text-muted uppercase tracking-wide mb-1.5">{label}</div>
      <div className={`text-2xl font-display font-bold tabular-nums ${toneClass}`}>{value}</div>
    </div>
  );
}

function daysLabel(days: number | null, status: string) {
  if (days === null) return "—";
  if (status === "active") return `${days}d left`;
  if (status === "grace") return `${days}d grace left`;
  return "—";
}

export default async function AdminCompaniesPage() {
  const companies = await listCompanies();
  const counts = {
    active: companies.filter((c) => c.status === "active").length,
    grace: companies.filter((c) => c.status === "grace").length,
    demoted: companies.filter((c) => c.status === "demoted" || c.status === "revoked").length,
  };

  return (
    <div>
      <AdminHeader />
      <main className="max-w-5xl mx-auto px-6 py-10">
        {!hasDb && (
          <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400">
            No database connected — showing preview data. Set <code className="font-mono text-xs">DATABASE_URL</code> once Neon is added via Vercel.
          </div>
        )}

        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight">Companies</h1>
            <p className="text-sm text-muted mt-1">SHARD Gateway licenses across every registered install.</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          <StatTile label="Total" value={companies.length} />
          <StatTile label="Active" value={counts.active} tone="emerald" />
          <StatTile label="Grace period" value={counts.grace} tone="amber" />
          <StatTile label="Demoted" value={counts.demoted} tone="zinc" />
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted">All companies</h2>
        </div>
        <div className="flex flex-col items-start gap-2 mb-6">
          <AddCompanyForm />
          <p className="text-xs text-muted">
            Most companies register automatically when they install the Gateway (their 14-day trial). Use this only for manually-invoiced Enterprise deals.
          </p>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-xs text-muted uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Countdown</th>
                <th className="px-4 py-3 font-medium">Last payment</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <Link href={`/products/shard-gateway/admin/${c.id}`} className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface border border-border shrink-0">
                        {c.category === "gpu_cloud" ? <Cloud className="h-3.5 w-3.5 text-muted" /> : <Cpu className="h-3.5 w-3.5 text-muted" />}
                      </span>
                      <div>
                        <div className="font-medium text-foreground">{c.name}</div>
                        <div className="text-xs text-muted">{c.contactEmail ?? "no contact on file"}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-muted">{daysLabel(c.daysRemaining, c.status)}</td>
                  <td className="px-4 py-3.5 text-muted">
                    {c.lastPaymentAt ? new Date(c.lastPaymentAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted">
                    <Building2 className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    No companies yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
