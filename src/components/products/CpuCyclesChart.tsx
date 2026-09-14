export interface CpuCyclesData {
  cyclesPerCall: number;
  instructionsPerCall: number;
  cpi: number;
  iterations: number;
  environment: string;
}

function formatCount(n: number) {
  return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n.toLocaleString();
}

// Cycles and instructions per call are on the same rough order of
// magnitude here (millions), so a plain linear width (unlike
// Bm25FixChart's log scale, built for a ~3-order-of-magnitude spread)
// is the honest, readable choice.
function Bar({ label, value, max, display }: { label: string; value: number; max: number; display: string }) {
  const width = Math.max((value / max) * 100, 2);
  return (
    <div className="grid grid-cols-[88px_1fr_110px] items-center gap-2.5">
      <span className="text-right font-mono text-[10px] uppercase tracking-wide text-muted">{label}</span>
      <div className="h-3 overflow-hidden rounded-sm bg-surface">
        <div className="h-full rounded-sm bg-red-500" style={{ width: `${width}%` }} />
      </div>
      <span className="text-right font-mono text-[11px] tabular-nums text-foreground">{display}</span>
    </div>
  );
}

export function CpuCyclesChart({ title, subtitle, data }: { title: string; subtitle?: string; data: CpuCyclesData }) {
  const max = Math.max(data.cyclesPerCall, data.instructionsPerCall);
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-6 space-y-2">
        <Bar label="cycles" value={data.cyclesPerCall} max={max} display={`${formatCount(data.cyclesPerCall)}/call`} />
        <Bar
          label="instructions"
          value={data.instructionsPerCall}
          max={max}
          display={`${formatCount(data.instructionsPerCall)}/call`}
        />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4">
        <span className="font-mono text-xs text-muted">
          CPI <span className="font-semibold text-red-400">{data.cpi.toFixed(3)}</span>
        </span>
        <span className="font-mono text-xs text-muted">{data.iterations.toLocaleString()} compile() calls</span>
      </div>
      <p className="mt-3 font-mono text-[10px] text-muted">{data.environment}</p>
    </div>
  );
}
