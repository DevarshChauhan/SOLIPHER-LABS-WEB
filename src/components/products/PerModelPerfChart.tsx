export interface PerModelPerfRow {
  model: string;
  vendor: string;
  value: number | null;
  n: number;
}

function Bar({ row, max, fmt }: { row: PerModelPerfRow; max: number; fmt: (v: number) => string }) {
  const width = row.value !== null && max > 0 ? Math.max((row.value / max) * 100, 2) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <span className="font-mono text-xs font-semibold text-foreground">{row.model}</span>
          <span className="ml-2 text-[11px] text-muted">{row.vendor}</span>
        </div>
        <span className="font-mono text-xs text-muted">n={row.n}</span>
      </div>
      <div className="mt-2 grid grid-cols-[1fr_90px] items-center gap-2.5">
        <div className="h-3 overflow-hidden rounded-sm bg-surface">
          {row.value !== null && <div className="h-full rounded-sm bg-red-500" style={{ width: `${width}%` }} />}
        </div>
        <span className="text-right font-mono text-[11px] tabular-nums text-foreground">
          {row.value !== null ? fmt(row.value) : (
            <span className="text-muted line-through">rate limited</span>
          )}
        </span>
      </div>
    </div>
  );
}

export function PerModelPerfChart({
  title,
  subtitle,
  rows,
  fmt,
  max,
}: {
  title: string;
  subtitle?: string;
  rows: PerModelPerfRow[];
  fmt: (v: number) => string;
  max: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-5">
        {rows.map((r) => (
          <Bar key={r.model} row={r} max={max} fmt={fmt} />
        ))}
      </div>
      <p className="mt-4 border-t border-border pt-3 font-mono text-[10px] text-muted">
        Small, real sample per model (n shown per row), atom-extraction call only, not the full compile.
        A gap means the model was rate limited during this sampling window, not that a number was skipped.
      </p>
    </div>
  );
}
