"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/SectionHeading";

const stats = [
  { value: "30.5×", label: "Peak SLO-goodput improvement under aggressive overload, real GCP run" },
  { value: "0", label: "Real CUDA out-of-memory crashes found, across every phase and model tested" },
  { value: "30/30", label: "Idle-phase response checks matched baseline vLLM byte-for-byte, across all models" },
  { value: "2026-07-21", label: "Date of the latest full, repeatable evidence run, real hardware, no simulation" },
];

export function ShardEvidenceHighlight() {
  return (
    <section className="border-y border-border bg-surface py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Badge tone="red">SHARD Gateway · real GPU evidence</Badge>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Proven on real hardware, not projections.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              Every number below is from a real, repeatable GCP run against a real vLLM instance.
            </p>
          </div>
          <Link
            href="/products/shard-gateway#evidence"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 sm:flex"
          >
            See the full evidence <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="font-display text-2xl font-semibold tracking-tight text-red-400 sm:text-3xl">{stat.value}</div>
              <p className="mt-2 text-sm leading-snug text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <Link
          href="/products/shard-gateway#evidence"
          className="mt-8 flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 sm:hidden"
        >
          See the full evidence <ArrowUpRight size={14} />
        </Link>
      </Container>
    </section>
  );
}
