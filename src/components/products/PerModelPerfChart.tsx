export interface PerModelPerfRow {
  model: string;
  vendor: string;
  baseline: number;
  context: number;
  n: number;
}

function DualBar({
  row,
  max,
  fmt,
  lowerIsBetter,
}: {
  row: PerModelPerfRow;
  max: number;
  fmt: (v: number) => string;
  lowerIsBetter: boolean;
}) {
  const baseWidth = max > 0 ? Math.max((row.baseline / max) * 100, 2) : 0;
  const ctxWidth = max > 0 ? Math.max((row.context / max) * 100, 2) : 0;
  const better = lowerIsBetter ? row.context < row.baseline : row.context > row.baseline;
  const delta = row.baseline > 0 ? Math.abs(1 - row.context / row.baseline) * 100 : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <span className="font-mono text-xs font-semibold text-foreground">{row.model}</span>
          <span className="ml-2 text-[11px] text-muted">{row.vendor}</span>
        </div>
        <span className={`font-mono text-xs font-semibold ${better ? "text-red-400" : "text-muted"}`}>
          {row.context < row.baseline ? "-" : "+"}{delta.toFixed(0)}% vs baseline
        </span>
      </div>
      <div className="mt-2 space-y-1">
        <div className="grid grid-cols-[46px_1fr_90px] items-center gap-2.5">
          <span className="text-right font-mono text-[10px] uppercase tracking-wide text-muted">base</span>
          <div className="h-3 overflow-hidden rounded-sm bg-surface">
            <div className="h-full rounded-sm bg-muted/40" style={{ width: `${baseWidth}%` }} />
          </div>
          <span className="text-right font-mono text-[11px] tabular-nums text-muted">{fmt(row.baseline)}</span>
        </div>
        <div className="grid grid-cols-[46px_1fr_90px] items-center gap-2.5">
          <span className="text-right font-mono text-[10px] uppercase tracking-wide text-muted">ctx</span>
          <div className="h-3 overflow-hidden rounded-sm bg-surface">
            <div className="h-full rounded-sm bg-red-500" style={{ width: `${ctxWidth}%` }} />
          </div>
          <span className="text-right font-mono text-[11px] tabular-nums text-red-400">{fmt(row.context)}</span>
        </div>
      </div>
      <p className="mt-1 font-mono text-[10px] text-muted">n={row.n} per condition</p>
    </div>
  );
}

export function PerModelPerfChart({
  title,
  subtitle,
  rows,
  fmt,
  max,
  lowerIsBetter = true,
}: {
  title: string;
  subtitle?: string;
  rows: PerModelPerfRow[];
  fmt: (v: number) => string;
  max: number;
  lowerIsBetter?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-5">
        {rows.map((r) => (
          <DualBar key={r.model} row={r} max={max} fmt={fmt} lowerIsBetter={lowerIsBetter} />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-5 border-t border-border pt-3 font-mono text-[10px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-muted/40" /> baseline, full 6-document context
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-red-500" /> SHARD Context, compiled 1-document
        </span>
      </div>
    </div>
  );
}
