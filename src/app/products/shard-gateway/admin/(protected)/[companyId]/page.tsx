import { notFound } from "next/navigation";
import { getCompanyDetail } from "@/lib/admin/db";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusPill } from "@/components/admin/StatusPill";
import { RevokeLicenseButton } from "@/components/admin/RevokeLicenseButton";
import { GeneratePaymentLinkForm } from "@/components/admin/GeneratePaymentLinkForm";
import { MarkPaidForm } from "@/components/admin/MarkPaidForm";
import { Mail, User, Building2, Fingerprint } from "lucide-react";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const detail = await getCompanyDetail(companyId);
  if (!detail) notFound();
  const { company, licenses, payments } = detail;

  return (
    <div>
      <AdminHeader crumb={company.name} />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-2xl font-display font-bold tracking-tight">{company.name}</h1>
              <StatusPill status={company.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted">
              {company.contactName && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> {company.contactName}
                </span>
              )}
              {company.contactEmail && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {company.contactEmail}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> {company.category === "gpu_cloud" ? "GPU cloud" : "AI product"}
              </span>
            </div>
          </div>
          {company.daysRemaining !== null && (
            <div className="text-right">
              <div className="text-3xl font-display font-bold tabular-nums">{company.daysRemaining}</div>
              <div className="text-xs text-muted uppercase tracking-wide">
                {company.status === "active" ? "days remaining" : "days of grace left"}
              </div>
            </div>
          )}
        </div>

        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted mb-3">Get paid</h2>
          <p className="text-xs text-muted mb-3">
            No payment gateway is wired up -- payment is a direct bank transfer/UPI to the Slice account. Send an
            invoice link, then confirm receipt here once the money lands.
          </p>
          <div className="flex flex-wrap gap-3">
            <GeneratePaymentLinkForm companyId={company.id} />
            <MarkPaidForm companyId={company.id} />
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-medium text-muted mb-3">License history</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-xs text-muted uppercase tracking-wide">
                  <th className="px-4 py-3 font-medium">License</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Issued</th>
                  <th className="px-4 py-3 font-medium">Expires</th>
                  <th className="px-4 py-3 font-medium">Fingerprint</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-muted">{l.licenseId.slice(0, 13)}…</td>
                    <td className="px-4 py-3 capitalize">{l.licenseType}{l.termYears ? ` · ${l.termYears}y` : ""}</td>
                    <td className="px-4 py-3 text-muted">{fmtDate(l.issuedAt)}</td>
                    <td className="px-4 py-3 text-muted">{fmtDate(l.expiresAt)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted flex items-center gap-1.5">
                      <Fingerprint className="h-3 w-3" /> {l.topologyFingerprint.slice(0, 10)}…
                    </td>
                    <td className="px-4 py-3 text-right">
                      {l.revokedAt ? (
                        <span className="text-xs text-muted">Revoked {fmtDate(l.revokedAt)}</span>
                      ) : (
                        <RevokeLicenseButton licenseId={l.id} />
                      )}
                    </td>
                  </tr>
                ))}
                {licenses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted">
                      No license issued yet — waiting on a Gateway install to self-register.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium text-muted mb-3">Payment history</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-left text-xs text-muted uppercase tracking-wide">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted">{fmtDate(p.createdAt)}</td>
                    <td className="px-4 py-3 capitalize">{p.provider}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{p.providerRef ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={p.status === "succeeded" ? "text-emerald-600 dark:text-emerald-400" : p.status === "failed" ? "text-rose-600" : "text-amber-600"}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">{fmtMoney(p.amount, p.currency)}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted">
                      No payments recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
