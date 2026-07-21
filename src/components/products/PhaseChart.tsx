export interface PhaseChartRow {
  model: string;
  baselineLabel: string;
  gatewayLabel: string;
  baselineValue: number;
  gatewayValue: number;
  delta: string;
  deltaTone?: "good" | "neutral";
  note?: string;
}

function Bar({
  label,
  value,
  max,
  display,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  display: string;
  tone: "base" | "gateway";
}) {
  const width = max > 0 ? Math.max((value / max) * 100, value > 0 ? 2 : 0) : 0;
  return (
    <div className="grid grid-cols-[46px_1fr_92px] items-center gap-2.5">
      <span className="text-right font-mono text-[10px] uppercase tracking-wide text-muted">{label}</span>
      <div className="h-3 overflow-hidden rounded-sm bg-surface">
        <div
          className={`h-full rounded-sm ${tone === "gateway" ? "bg-red-500" : "bg-muted/40"}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span
        className={`text-right font-mono text-[11px] tabular-nums ${
          tone === "gateway" ? "text-foreground" : "text-muted"
        }`}
      >
        {display}
      </span>
    </div>
  );
}

export function PhaseChart({
  title,
  subtitle,
  rows,
}: {
  title: string;
  subtitle?: string;
  rows: PhaseChartRow[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-6">
        {rows.map((r) => (
          <div key={r.model}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-xs font-semibold text-foreground">{r.model}</span>
              <span
                className={`font-mono text-xs font-semibold ${
                  r.deltaTone === "neutral" ? "text-muted" : "text-red-400"
                }`}
              >
                {r.delta}
              </span>
            </div>
            {r.note ? (
              <p className="mt-2 font-mono text-xs text-muted">{r.note}</p>
            ) : (
              <div className="mt-2 space-y-1.5">
                <Bar
                  label="base"
                  value={r.baselineValue}
                  max={Math.max(r.baselineValue, r.gatewayValue)}
                  display={r.baselineLabel}
                  tone="base"
                />
                <Bar
                  label="gw"
                  value={r.gatewayValue}
                  max={Math.max(r.baselineValue, r.gatewayValue)}
                  display={r.gatewayLabel}
                  tone="gateway"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-5 border-t border-border pt-4 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-muted/40" /> raw vLLM
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-[1px] bg-red-500" /> through Gateway
        </span>
      </div>
    </div>
  );
}
