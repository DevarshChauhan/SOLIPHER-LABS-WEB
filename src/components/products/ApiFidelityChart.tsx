export interface ApiFidelityRow {
  /** The coding task asked of the model. */
  task: string;
  /** How many real repository symbols the no-context answer used. */
  bare: number;
  /** How many the compiled-context answer used. */
  withContext: number;
  /** How many were tracked for this task. */
  tracked: number;
  /** Language the no-context answer was actually written in. */
  bareLanguage: string;
}

function Bar({ row }: { row: ApiFidelityRow }) {
  const bareWidth = (row.bare / row.tracked) * 100;
  const ctxWidth = (row.withContext / row.tracked) * 100;
  const wrongLanguage = row.bareLanguage !== "Rust";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-xs font-semibold text-foreground">{row.task}</span>
        <span className={`font-mono text-[11px] ${wrongLanguage ? "text-red-400" : "text-muted"}`}>
          no context wrote {row.bareLanguage}
        </span>
      </div>

      <div className="mt-2 space-y-1.5">
        <div className="grid grid-cols-[1fr_54px] items-center gap-2.5">
          <div className="h-2.5 overflow-hidden rounded-sm bg-surface">
            <div className="h-full rounded-sm bg-muted/40" style={{ width: `${bareWidth}%` }} />
          </div>
          <span className="text-right font-mono text-[11px] tabular-nums text-muted">
            {row.bare}/{row.tracked}
          </span>
        </div>
        <div className="grid grid-cols-[1fr_54px] items-center gap-2.5">
          <div className="h-2.5 overflow-hidden rounded-sm bg-surface">
            <div className="h-full rounded-sm bg-red-500" style={{ width: `${ctxWidth}%` }} />
          </div>
          <span className="text-right font-mono text-[11px] tabular-nums text-foreground">
            {row.withContext}/{row.tracked}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ApiFidelityChart({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle?: string;
  rows: ApiFidelityRow[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-5">
        {rows.map((r) => (
          <Bar key={r.task} row={r} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-border pt-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-red-500" /> with compiled context
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-muted/40" /> no context
        </span>
      </div>
    </div>
  );
}
