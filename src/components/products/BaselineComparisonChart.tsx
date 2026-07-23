export interface BaselineRow {
  name: string;
  tokens: number;
  distractorIncluded: boolean;
  isShardContext?: boolean;
}

function Bar({ row, max }: { row: BaselineRow; max: number }) {
  const width = max > 0 ? Math.max((row.tokens / max) * 100, 2) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className={`font-mono text-xs font-semibold ${row.isShardContext ? "text-red-400" : "text-foreground"}`}>
          {row.name}
        </span>
        <span
          className={`font-mono text-xs font-semibold ${
            row.distractorIncluded ? "text-muted" : "text-red-400"
          }`}
        >
          {row.distractorIncluded ? "distractor included" : "no distractor"}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-[1fr_90px] items-center gap-2.5">
        <div className="h-3 overflow-hidden rounded-sm bg-surface">
          <div
            className={`h-full rounded-sm ${row.isShardContext ? "bg-red-500" : "bg-muted/40"}`}
            style={{ width: `${width}%` }}
          />
        </div>
        <span className="text-right font-mono text-[11px] tabular-nums text-foreground">
          {row.tokens} tok
        </span>
      </div>
    </div>
  );
}

export function BaselineComparisonChart({ title, subtitle, rows }: { title: string; subtitle?: string; rows: BaselineRow[] }) {
  const max = Math.max(...rows.map((r) => r.tokens));
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-5">
        {rows.map((r) => (
          <Bar key={r.name} row={r} max={max} />
        ))}
      </div>
      <div className="mt-6 flex items-center gap-5 border-t border-border pt-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-red-500" /> SHARD Context
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-muted/40" /> required baseline
        </span>
      </div>
    </div>
  );
}
