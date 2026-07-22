import { notFound } from "next/navigation";
import { getPaymentLink, getCompanyById } from "@/lib/admin/db";
import { LogoMark } from "@/components/ui/Logo";

export const dynamic = "force-dynamic";

function fmtMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export default async function PayPage({ params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await params;
  const link = await getPaymentLink(linkId);
  if (!link) notFound();

  const company = await getCompanyById(link.companyId);
  if (!company) notFound();

  const expired = new Date(link.expiresAt) < new Date();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div className="text-center">
            <div className="font-display font-bold text-lg tracking-tight">
              SOLIPHER <span className="text-red-500">LABS</span>
            </div>
            <div className="text-sm text-muted mt-1">SHARD Gateway license</div>
          </div>
        </div>

        {expired ? (
          <div className="rounded-lg border border-border bg-background px-4 py-6 text-center text-sm text-muted">
            This invoice has expired. Please contact Solipher Labs for a new one.
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-border bg-background px-5 py-6 flex flex-col items-center gap-1">
              <div className="text-sm text-muted">{company.name}</div>
              <div className="text-3xl font-display font-bold tabular-nums">{fmtMoney(link.amount, link.currency)}</div>
              <div className="text-xs text-muted">
                {link.termYears}-year SHARD Gateway license
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background px-5 py-5 text-center text-sm text-muted flex flex-col gap-2">
              <p>
                Reach out to <span className="text-foreground font-medium">contact@solipherlabs.in</span> to pay this
                invoice by bank transfer or UPI.
              </p>
              <p className="text-xs">Mention your company name — we&rsquo;ll confirm receipt and issue your license directly.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
