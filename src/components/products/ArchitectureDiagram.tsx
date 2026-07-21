"use client";

import { motion } from "framer-motion";

const nodeVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.18, ease: "easeOut" as const },
  }),
};

function FlowArrow({ x, y, width, delay, label }: { x: number; y: number; width: number; delay: number; label?: string }) {
  return (
    <g>
      <motion.line
        x1={x}
        y1={y}
        x2={x + width}
        y2={y}
        stroke="var(--red-500)"
        strokeWidth={2}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
      />
      <motion.polygon
        points={`${x + width},${y} ${x + width - 8},${y - 5} ${x + width - 8},${y + 5}`}
        fill="var(--red-500)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.3, delay: delay + 0.4 }}
      />
      <motion.circle
        r={3.5}
        fill="var(--red-400)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 1, 0] }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.4, delay: delay + 0.6, repeat: Infinity, repeatDelay: 0.6, ease: "linear" }}
      >
        <animateMotion
          dur="1.4s"
          begin={`${delay + 0.6}s`}
          repeatCount="indefinite"
          path={`M${x},${y} L${x + width},${y}`}
        />
      </motion.circle>
      {label && (
        <motion.text
          x={x + width / 2}
          y={y - 10}
          textAnchor="middle"
          fontSize={11}
          fill="var(--muted)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: delay + 0.3 }}
        >
          {label}
        </motion.text>
      )}
    </g>
  );
}

export function ArchitectureDiagram() {
  const boxY = 70;
  const boxH = 110;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-background p-6">
      <p className="mb-6 text-xs uppercase tracking-wider text-muted">How a request flows through SHARD Gateway</p>
      <svg viewBox="0 0 900 260" className="w-full min-w-[720px]" role="img" aria-label="Diagram: Client sends a request to SHARD Gateway, which makes an admit, defer, or reject decision using live KV-cache telemetry from the GPU, then forwards admitted requests to vLLM.">
        {/* Feedback telemetry line: GPU -> Gateway */}
        <motion.path
          d="M 800 70 L 800 30 L 260 30 L 260 70"
          fill="none"
          stroke="var(--muted)"
          strokeWidth={1.5}
          strokeDasharray="5 5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
        <motion.polygon
          points="260,70 255,60 265,60"
          fill="var(--muted)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.3, delay: 1.7 }}
        />
        <motion.text
          x={530}
          y={22}
          textAnchor="middle"
          fontSize={11}
          fill="var(--muted)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 1.3 }}
        >
          live KV-cache telemetry (Prometheus, polled)
        </motion.text>

        {/* Client */}
        <motion.g custom={0} variants={nodeVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <rect x={0} y={boxY} width={140} height={boxH} rx={12} fill="var(--surface)" stroke="var(--border)" />
          <text x={70} y={boxY + 45} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--foreground)">Client</text>
          <text x={70} y={boxY + 66} textAnchor="middle" fontSize={10.5} fill="var(--muted)">your application</text>
        </motion.g>

        <FlowArrow x={140} y={boxY + boxH / 2} width={80} delay={0.5} label="request" />

        {/* SHARD Gateway */}
        <motion.g custom={1} variants={nodeVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <rect x={220} y={boxY - 10} width={200} height={boxH + 20} rx={14} fill="var(--red-500)" fillOpacity={0.08} stroke="var(--red-500)" strokeWidth={1.5} />
          <text x={320} y={boxY + 18} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--red-400)">SHARD Gateway</text>
          <text x={320} y={boxY + 36} textAnchor="middle" fontSize={10} fill="var(--muted)">real-time KV-cache-aware</text>
          <text x={320} y={boxY + 48} textAnchor="middle" fontSize={10} fill="var(--muted)">admission decision</text>
          {["ADMIT", "DEFER", "REJECT"].map((label, i) => (
            <g key={label}>
              <rect x={232 + i * 62} y={boxY + 62} width={54} height={26} rx={6} fill="var(--surface)" stroke="var(--border)" />
              <text x={259 + i * 62} y={boxY + 79} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">{label}</text>
            </g>
          ))}
        </motion.g>

        <FlowArrow x={420} y={boxY + boxH / 2} width={80} delay={1.0} label="forwarded" />

        {/* vLLM */}
        <motion.g custom={2} variants={nodeVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <rect x={500} y={boxY} width={140} height={boxH} rx={12} fill="var(--surface)" stroke="var(--border)" />
          <text x={570} y={boxY + 45} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--foreground)">vLLM</text>
          <text x={570} y={boxY + 66} textAnchor="middle" fontSize={10.5} fill="var(--muted)">your existing server</text>
        </motion.g>

        <FlowArrow x={640} y={boxY + boxH / 2} width={80} delay={1.5} />

        {/* GPU */}
        <motion.g custom={3} variants={nodeVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <rect x={720} y={boxY} width={160} height={boxH} rx={12} fill="var(--surface)" stroke="var(--border)" />
          <text x={800} y={boxY + 30} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--foreground)">GPU</text>
          <rect x={735} y={boxY + 45} width={130} height={40} rx={8} fill="none" stroke="var(--red-500)" strokeWidth={1.5} />
          <text x={800} y={boxY + 69} textAnchor="middle" fontSize={11} fill="var(--foreground)">KV cache</text>
        </motion.g>
      </svg>
      <motion.p
        className="mt-4 text-center text-xs italic text-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        If SHARD Gateway has a problem, it fails open, traffic flows straight through to vLLM untouched.
      </motion.p>
    </div>
  );
}
