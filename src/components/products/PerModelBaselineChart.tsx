export interface PerModelBaselineRow {
  model: string;
  vendor: string;
  contextPct: number;
  note: string;
}

// The offline baselines never call a model, so their 100% distractor
// inclusion rate is a fixed reference line, real, measured once, and
// constant regardless of which model SHARD Context itself runs against.
// What varies per model is SHARD Context's own real result.
const BASELINE_PCT = 100;

function ModelGroup({ row }: { row: PerModelBaselineRow }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <span className="font-mono text-xs font-semibold text-foreground">{row.model}</span>
          <span className="ml-2 text-[11px] text-muted">{row.vendor}</span>
        </div>
        <span className="font-mono text-xs text-muted">{row.note}</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <div className="h-3 overflow-hidden rounded-sm bg-surface">
            <div className="h-full rounded-sm bg-muted/40" style={{ width: "100%" }} />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
            <span>baseline</span>
            <span>{BASELINE_PCT}%</span>
          </div>
        </div>
        <div>
          <div className="h-3 overflow-hidden rounded-sm bg-surface">
            <div
              className="h-full rounded-sm bg-red-500"
              style={{ width: `${Math.max(row.contextPct, 2)}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-red-400">
            <span>SHARD Context</span>
            <span>{row.contextPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PerModelBaselineChart({ title, subtitle, rows }: { title: string; subtitle?: string; rows: PerModelBaselineRow[] }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-5">
        {rows.map((r) => (
          <ModelGroup key={r.model} row={r} />
        ))}
      </div>
      <div className="mt-6 flex items-center gap-5 border-t border-border pt-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-muted/40" /> baseline, every offline approach, fixed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-red-500" /> SHARD Context, real per-model result
        </span>
      </div>
    </div>
  );
}
