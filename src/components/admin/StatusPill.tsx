import type { LicenseStatus } from "@/lib/admin/types";

// Semantic status color, deliberately separate from the site's brand
// accent (--red-500) -- a pill "means" something (safe / degrading /
// off), it isn't a brand moment.
const STYLES: Record<LicenseStatus, { label: string; dot: string; text: string; bg: string }> = {
  active: { label: "Active", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  grace: { label: "Grace period", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-500/10" },
  demoted: { label: "Demoted", dot: "bg-zinc-500", text: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-500/10" },
  revoked: { label: "Revoked", dot: "bg-rose-600", text: "text-rose-700 dark:text-rose-400", bg: "bg-rose-600/10" },
  none: { label: "No license", dot: "bg-border", text: "text-muted", bg: "bg-surface" },
};

export function StatusPill({ status }: { status: LicenseStatus }) {
  const s = STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
