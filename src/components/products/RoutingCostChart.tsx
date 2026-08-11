export interface RoutingCostRow {
  /** How the request was handled. */
  approach: string;
  /** Input tokens sent. */
  input: number;
  /** Output tokens generated, including reasoning. */
  output: number;
  /** Whether this is the route SHARD CodeContext actually picks. */
  isChosen?: boolean;
}

export interface RoutingCostGroup {
  task: string;
  rows: RoutingCostRow[];
}

function Bar({ row, max }: { row: RoutingCostRow; max: number }) {
  const total = row.input + row.output;
  const inputWidth = (row.input / max) * 100;
  const outputWidth = (row.output / max) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`font-mono text-xs font-semibold ${row.isChosen ? "text-red-400" : "text-foreground"}`}
        >
          {row.approach}
        </span>
        <span className="font-mono text-[11px] tabular-nums text-muted">
          {total.toLocaleString()} tok total
        </span>
      </div>
      <div className="mt-2 grid grid-cols-[1fr_60px] items-center gap-2.5">
        <div className="flex h-3 overflow-hidden rounded-sm bg-surface">
          <div
            className={row.isChosen ? "h-full bg-red-500/50" : "h-full bg-muted/25"}
            style={{ width: `${inputWidth}%` }}
          />
          <div
            className={row.isChosen ? "h-full bg-red-500" : "h-full bg-muted/50"}
            style={{ width: `${outputWidth}%` }}
          />
        </div>
        <span className="text-right font-mono text-[11px] tabular-nums text-foreground">
          {row.input.toLocaleString()} in
        </span>
      </div>
    </div>
  );
}

export function RoutingCostChart({
  title,
  subtitle,
  groups,
}: {
  title: string;
  subtitle?: string;
  groups: RoutingCostGroup[];
}) {
  const max = Math.max(...groups.flatMap((g) => g.rows.map((r) => r.input + r.output)));
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-7">
        {groups.map((g) => (
          <div key={g.task}>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">{g.task}</p>
            <div className="space-y-4">
              {g.rows.map((r) => (
                <Bar key={r.approach} row={r} max={max} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-border pt-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-red-500/50" /> input tokens
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-red-500" /> output tokens, including reasoning
        </span>
      </div>
    </div>
  );
}
