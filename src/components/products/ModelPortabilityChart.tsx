export interface ModelPortabilityRow {
  model: string;
  vendor: string;
  correct: number;
  rateLimited: number;
  total: number;
  note?: string;
}

function StackedBar({ row }: { row: ModelPortabilityRow }) {
  const correctPct = (row.correct / row.total) * 100;
  const rateLimitedPct = (row.rateLimited / row.total) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <span className="font-mono text-xs font-semibold text-foreground">{row.model}</span>
          <span className="ml-2 text-[11px] text-muted">{row.vendor}</span>
        </div>
        <span className="font-mono text-xs font-semibold text-red-400">
          {row.correct}/{row.total} correct
        </span>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-sm bg-surface">
        <div className="flex h-full w-full">
          <div className="h-full bg-red-500" style={{ width: `${correctPct}%` }} />
          <div className="h-full bg-muted/30" style={{ width: `${rateLimitedPct}%` }} />
        </div>
      </div>
      {row.note && <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{row.note}</p>}
    </div>
  );
}

export function ModelPortabilityChart({ title, subtitle, rows }: { title: string; subtitle?: string; rows: ModelPortabilityRow[] }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-6">
        {rows.map((r) => (
          <StackedBar key={r.model} row={r} />
        ))}
      </div>
      <div className="mt-6 flex items-center gap-5 border-t border-border pt-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-red-500" /> correct selection
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-muted/30" /> rate limited (429), not a wrong answer
        </span>
      </div>
      <p className="mt-3 font-mono text-[10px] text-muted">Zero incorrect selections across any model, any scenario</p>
    </div>
  );
}
