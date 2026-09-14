export interface CodeReductionRow {
  /** Repository and task, e.g. "zod: $ZodCheckMultipleOf". */
  name: string;
  /** Language tag: "rs", "py", "ts". */
  lang: string;
  /** Tokens if you pasted the single most obviously relevant file. */
  oneFile: number;
  /** Tokens SHARD CodeContext actually compiled. */
  compiled: number;
}

function pct(row: CodeReductionRow) {
  return ((1 - row.compiled / row.oneFile) * 100);
}

function Row({ row, max }: { row: CodeReductionRow; max: number }) {
  const saving = pct(row);
  const wins = saving > 0;
  const baselineWidth = Math.max((row.oneFile / max) * 100, 2);
  const compiledWidth = Math.max((row.compiled / max) * 100, 2);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-xs font-semibold text-foreground">
          <span className="mr-2 rounded-sm border border-border px-1 py-0.5 text-[10px] uppercase text-muted">
            {row.lang}
          </span>
          {row.name}
        </span>
        <span className={`font-mono text-xs font-semibold ${wins ? "text-red-400" : "text-muted"}`}>
          {wins ? `${saving.toFixed(1)}% fewer` : `${Math.abs(saving).toFixed(1)}% more`}
        </span>
      </div>

      <div className="mt-2 space-y-1.5">
        <div className="grid grid-cols-[1fr_96px] items-center gap-2.5">
          <div className="h-2.5 overflow-hidden rounded-sm bg-surface">
            <div className="h-full rounded-sm bg-muted/40" style={{ width: `${baselineWidth}%` }} />
          </div>
          <span className="text-right font-mono text-[11px] tabular-nums text-muted">
            {row.oneFile.toLocaleString()} tok
          </span>
        </div>
        <div className="grid grid-cols-[1fr_96px] items-center gap-2.5">
          <div className="h-2.5 overflow-hidden rounded-sm bg-surface">
            <div className="h-full rounded-sm bg-red-500" style={{ width: `${compiledWidth}%` }} />
          </div>
          <span className="text-right font-mono text-[11px] tabular-nums text-foreground">
            {row.compiled.toLocaleString()} tok
          </span>
        </div>
      </div>
    </div>
  );
}

export function CodeReductionChart({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle?: string;
  rows: CodeReductionRow[];
}) {
  const max = Math.max(...rows.map((r) => Math.max(r.oneFile, r.compiled)));
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-5">
        {rows.map((r) => (
          <Row key={r.name} row={r} max={max} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-border pt-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-red-500" /> SHARD CodeContext
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-muted/40" /> paste the one relevant file
        </span>
      </div>
    </div>
  );
}
