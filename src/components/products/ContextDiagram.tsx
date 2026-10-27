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
      {label && (
        <motion.text
          x={x + width / 2}
          y={y - 12}
          textAnchor="middle"
          fontSize={11.5}
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

function MobileArrow({ label }: { label: string }) {
  return (
    <li aria-hidden="true" className="flex items-center justify-center gap-2 text-xs text-muted">
      <span className="text-red-500">↓</span>
      {label}
    </li>
  );
}

export function ContextDiagram() {
  const boxY = 76;
  const boxH = 100;

  // Layout, left to right, with enough gap width for each arrow's own
  // label to never collide with the box on either side of it.
  const corpusX = 0;
  const corpusW = 150;
  const gap1X = corpusX + corpusW; // 150
  const gap1W = 90;
  const shardX = gap1X + gap1W; // 240
  const shardW = 220;
  const gap2X = shardX + shardW; // 460
  const gap2W = 110;
  const modelX = gap2X + gap2W; // 570
  const modelW = 170;
  const diagramW = modelX + modelW; // 740

  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <p className="mb-6 text-xs uppercase tracking-wider text-muted">What reaches the model, with and without SHARD Context</p>
      <svg
        viewBox={`0 0 ${diagramW + 40} 300`}
        className="hidden w-full md:block"
        role="img"
        aria-label="Diagram: a corpus of one relevant document and two distractors passes through SHARD Context, which forwards only the relevant document to the model, dropping both distractors."
      >
        {/* Corpus */}
        <motion.g custom={0} variants={nodeVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <rect x={corpusX} y={boxY - 20} width={corpusW} height={boxH + 40} rx={12} fill="var(--surface)" stroke="var(--border)" />
          <text x={corpusX + corpusW / 2} y={boxY} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">Corpus</text>
          <rect x={corpusX + 16} y={boxY + 10} width={corpusW - 32} height={22} rx={6} fill="none" stroke="var(--border)" />
          <text x={corpusX + corpusW / 2} y={boxY + 25} textAnchor="middle" fontSize={11.5} fill="var(--muted)">distractor A</text>
          <rect x={corpusX + 16} y={boxY + 38} width={corpusW - 32} height={22} rx={6} fill="var(--red-500)" fillOpacity={0.1} stroke="var(--red-500)" />
          <text x={corpusX + corpusW / 2} y={boxY + 53} textAnchor="middle" fontSize={11.5} fill="var(--red-400)">relevant doc</text>
          <rect x={corpusX + 16} y={boxY + 66} width={corpusW - 32} height={22} rx={6} fill="none" stroke="var(--border)" />
          <text x={corpusX + corpusW / 2} y={boxY + 81} textAnchor="middle" fontSize={11.5} fill="var(--muted)">distractor B</text>
        </motion.g>

        <FlowArrow x={gap1X} y={boxY + boxH / 2 - 10} width={gap1W} delay={0.5} label="all three" />

        {/* SHARD Context */}
        <motion.g custom={1} variants={nodeVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <rect x={shardX} y={boxY - 10} width={shardW} height={boxH + 20} rx={14} fill="var(--red-500)" fillOpacity={0.08} stroke="var(--red-500)" strokeWidth={1.5} />
          <text x={shardX + shardW / 2} y={boxY + 16} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--red-400)">SHARD Context</text>
          <text x={shardX + shardW / 2} y={boxY + 34} textAnchor="middle" fontSize={11.5} fill="var(--muted)">covers required facts,</text>
          <text x={shardX + shardW / 2} y={boxY + 46} textAnchor="middle" fontSize={11.5} fill="var(--muted)">drops what isn&#39;t needed</text>
          <rect x={shardX + (shardW - 140) / 2} y={boxY + 58} width={140} height={24} rx={6} fill="var(--background)" stroke="var(--red-500)" />
          <text x={shardX + shardW / 2} y={boxY + 74} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--foreground)">126 tokens, exact</text>
        </motion.g>

        <FlowArrow x={gap2X} y={boxY + boxH / 2 - 10} width={gap2W} delay={1.0} label="one kept" />

        {/* Model */}
        <motion.g custom={2} variants={nodeVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <rect x={modelX} y={boxY} width={modelW} height={boxH} rx={12} fill="var(--surface)" stroke="var(--border)" />
          <text x={modelX + modelW / 2} y={boxY + 40} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--foreground)">Model</text>
          <text x={modelX + modelW / 2} y={boxY + 60} textAnchor="middle" fontSize={11.5} fill="var(--muted)">gets exactly</text>
          <text x={modelX + modelW / 2} y={boxY + 74} textAnchor="middle" fontSize={11.5} fill="var(--muted)">what it needs</text>
        </motion.g>

        {/* Dropped distractors */}
        <motion.g
          initial={{ opacity: 0, y: -6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <text x={diagramW / 2} y={boxY + boxH + 46} textAnchor="middle" fontSize={11.5} fill="var(--muted)">2 distractors, dropped: they never reach the model</text>
        </motion.g>
      </svg>

      {/* Phones: the same flow stacked vertically in real text, since the
          SVG above would have to shrink its labels below a readable size. */}
      <ol className="space-y-3 md:hidden" aria-label="What reaches the model, step by step">
        <li className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold text-foreground">Corpus</p>
          <div className="mt-3 space-y-2 text-xs">
            <p className="rounded-md border border-border px-3 py-2 text-muted">distractor A</p>
            <p className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2 text-red-400">relevant doc</p>
            <p className="rounded-md border border-border px-3 py-2 text-muted">distractor B</p>
          </div>
        </li>
        <MobileArrow label="all three" />
        <li className="rounded-xl border border-red-500 bg-red-500/[0.08] p-4">
          <p className="text-base font-semibold text-red-400">SHARD Context</p>
          <p className="mt-1 text-sm text-muted">Covers required facts, drops what isn&rsquo;t needed.</p>
          <p className="mt-3 inline-block rounded-md border border-red-500 bg-background px-3 py-1.5 text-xs font-semibold text-foreground">
            126 tokens, exact
          </p>
        </li>
        <MobileArrow label="one kept" />
        <li className="rounded-xl border border-border bg-surface p-4">
          <p className="text-base font-semibold text-foreground">Model</p>
          <p className="mt-1 text-sm text-muted">Gets exactly what it needs.</p>
        </li>
        <li className="text-center text-xs text-muted">2 distractors, dropped: they never reach the model.</li>
      </ol>
      <motion.p
        className="mt-4 text-center text-xs italic text-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 1.8 }}
      >
        If SHARD Context can&rsquo;t guarantee correctness, it falls back to the original, unmodified request. It never guesses.
      </motion.p>
    </div>
  );
}
