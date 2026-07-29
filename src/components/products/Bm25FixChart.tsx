export interface Bm25FixRow {
  corpus: string;
  beforeUs: number;
  afterUs: number;
  beforeLabel: string;
  afterLabel: string;
}

function formatUs(us: number) {
  return us >= 1000 ? `${(us / 1000).toFixed(1)}ms` : `${us.toFixed(1)}µs`;
}

// Log scale: the real numbers span ~2.4us to ~10.7ms, more than three
// orders of magnitude, so a linear width would make the "after" bars
// invisible next to "before". Same log-scale idea the brochure's own
// chart PNG uses, done here with plain CSS width percentages instead.
function logWidth(us: number, minUs: number, maxUs: number) {
  const lo = Math.log10(minUs);
  const hi = Math.log10(maxUs);
  const frac = (Math.log10(Math.max(us, minUs)) - lo) / (hi - lo);
  return Math.max(frac * 100, 2);
}

function Bar({ label, us, minUs, maxUs, display, tone }: { label: string; us: number; minUs: number; maxUs: number; display: string; tone: "before" | "after" }) {
  const width = logWidth(us, minUs, maxUs);
  return (
    <div className="grid grid-cols-[52px_1fr_92px] items-center gap-2.5">
      <span className="text-right font-mono text-[10px] uppercase tracking-wide text-muted">{label}</span>
      <div className="h-3 overflow-hidden rounded-sm bg-surface">
        <div
          className={`h-full rounded-sm ${tone === "after" ? "bg-red-500" : "bg-muted/40"}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={`text-right font-mono text-[11px] tabular-nums ${tone === "after" ? "text-foreground" : "text-muted"}`}>
        {display}
      </span>
    </div>
  );
}

export function Bm25FixChart({ title, subtitle, rows }: { title: string; subtitle?: string; rows: Bm25FixRow[] }) {
  const allUs = rows.flatMap((r) => [r.beforeUs, r.afterUs]);
  const minUs = Math.min(...allUs);
  const maxUs = Math.max(...allUs);
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-6">
        {rows.map((r) => (
          <div key={r.corpus}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-xs font-semibold text-foreground">{r.corpus}</span>
              <span className="font-mono text-xs font-semibold text-red-400">{(r.beforeUs / r.afterUs).toFixed(1)}x faster</span>
            </div>
            <div className="mt-2 space-y-1.5">
              <Bar label="before" us={r.beforeUs} minUs={minUs} maxUs={maxUs} display={r.beforeLabel} tone="before" />
              <Bar label="after" us={r.afterUs} minUs={minUs} maxUs={maxUs} display={r.afterLabel} tone="after" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-5 border-t border-border pt-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-muted/40" /> before the fix
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-red-500" /> after the fix
        </span>
      </div>
      <p className="mt-3 font-mono text-[10px] text-muted">Log scale, bars are not proportional to raw value</p>
    </div>
  );
}
