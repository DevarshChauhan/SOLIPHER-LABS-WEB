export interface TestGrowthPoint {
  label: string;
  tests: number;
  isLatest?: boolean;
}

function Bar({ point, max }: { point: TestGrowthPoint; max: number }) {
  const width = Math.max((point.tests / max) * 100, 2);
  return (
    <div className="grid grid-cols-[168px_1fr_64px] items-center gap-2.5">
      <span className="text-right font-mono text-[11px] text-muted">{point.label}</span>
      <div className="h-3 overflow-hidden rounded-sm bg-surface">
        <div
          className={`h-full rounded-sm ${point.isLatest ? "bg-red-500" : "bg-muted/40"}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span
        className={`text-right font-mono text-[11px] tabular-nums ${point.isLatest ? "text-foreground font-semibold" : "text-muted"}`}
      >
        {point.tests}
      </span>
    </div>
  );
}

export function TestGrowthChart({
  title,
  subtitle,
  points,
}: {
  title: string;
  subtitle?: string;
  points: TestGrowthPoint[];
}) {
  const max = Math.max(...points.map((p) => p.tests));
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-3">
        {points.map((p) => (
          <Bar key={p.label} point={p} max={max} />
        ))}
      </div>
      <p className="mt-5 border-t border-border pt-4 font-mono text-[10px] text-muted">
        Every feature landed with its own new, real tests passing before the next one started, not one bulk test count claimed at the end.
      </p>
    </div>
  );
}
