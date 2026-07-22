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

export function ContextDiagram() {
  const boxY = 76;
  const boxH = 100;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-background p-6">
      <p className="mb-6 text-xs uppercase tracking-wider text-muted">What reaches the model, with and without SHARD Context</p>
      <svg
        viewBox="0 0 900 300"
        className="w-full min-w-[720px]"
        role="img"
        aria-label="Diagram: a corpus of one relevant document and two distractors passes through SHARD Context, which forwards only the relevant document to the model, dropping both distractors."
      >
        {/* Corpus */}
        <motion.g custom={0} variants={nodeVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <rect x={0} y={boxY - 20} width={150} height={boxH + 40} rx={12} fill="var(--surface)" stroke="var(--border)" />
          <text x={75} y={boxY} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">Corpus</text>
          <rect x={16} y={boxY + 10} width={118} height={22} rx={6} fill="none" stroke="var(--border)" />
          <text x={75} y={boxY + 25} textAnchor="middle" fontSize={9} fill="var(--muted)">distractor A</text>
          <rect x={16} y={boxY + 38} width={118} height={22} rx={6} fill="var(--red-500)" fillOpacity={0.1} stroke="var(--red-500)" />
          <text x={75} y={boxY + 53} textAnchor="middle" fontSize={9} fill="var(--red-400)">relevant doc</text>
          <rect x={16} y={boxY + 66} width={118} height={22} rx={6} fill="none" stroke="var(--border)" />
          <text x={75} y={boxY + 81} textAnchor="middle" fontSize={9} fill="var(--muted)">distractor B</text>
        </motion.g>

        <FlowArrow x={150} y={boxY + boxH / 2 - 10} width={70} delay={0.5} label="all three" />

        {/* SHARD Context */}
        <motion.g custom={1} variants={nodeVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <rect x={220} y={boxY - 10} width={200} height={boxH + 20} rx={14} fill="var(--red-500)" fillOpacity={0.08} stroke="var(--red-500)" strokeWidth={1.5} />
          <text x={320} y={boxY + 16} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--red-400)">SHARD Context</text>
          <text x={320} y={boxY + 34} textAnchor="middle" fontSize={10} fill="var(--muted)">covers required facts,</text>
          <text x={320} y={boxY + 46} textAnchor="middle" fontSize={10} fill="var(--muted)">drops what isn&#39;t needed</text>
          <rect x={260} y={boxY + 58} width={120} height={24} rx={6} fill="var(--background)" stroke="var(--red-500)" />
          <text x={320} y={boxY + 74} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">126 tokens, exact</text>
        </motion.g>

        <FlowArrow x={420} y={boxY + boxH / 2 - 10} width={80} delay={1.0} label="only the relevant doc" />

        {/* Model */}
        <motion.g custom={2} variants={nodeVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
          <rect x={500} y={boxY} width={150} height={boxH} rx={12} fill="var(--surface)" stroke="var(--border)" />
          <text x={575} y={boxY + 45} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--foreground)">Model</text>
          <text x={575} y={boxY + 66} textAnchor="middle" fontSize={10.5} fill="var(--muted)">gets exactly what it needs</text>
        </motion.g>

        {/* Dropped distractors, shown falling away */}
        <motion.g
          initial={{ opacity: 0, y: -6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <text x={470} y={boxY + boxH + 46} textAnchor="middle" fontSize={10} fill="var(--muted)">2 distractors, dropped &mdash; never reach the model</text>
        </motion.g>
      </svg>
      <motion.p
        className="mt-4 text-center text-xs italic text-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 1.8 }}
      >
        If SHARD Context can&rsquo;t guarantee correctness, it falls back to the original, unmodified request &mdash; it never guesses.
      </motion.p>
    </div>
  );
}
