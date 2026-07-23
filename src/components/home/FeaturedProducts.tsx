"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading, Badge } from "@/components/ui/SectionHeading";

export function FeaturedProducts() {
  return (
    <section className="border-t border-border bg-surface py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Products"
            title="Patent-backed research, packaged into things you can deploy."
            description="Every product below solves a specific, named problem, and we can tell you exactly how much better the result is."
          />
          <Link href="/products" className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 sm:flex">
            All products <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="flex h-full flex-col rounded-2xl border border-red-500/30 bg-background p-8"
          >
            <Badge tone="red">AI infrastructure</Badge>
            <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">SHARD Gateway</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              A reverse proxy that sits in front of vLLM and makes a real admission decision before a request reaches the GPU.
            </p>
            <Link
              href="/products/shard-gateway"
              className="mt-6 flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300"
            >
              Learn more <ArrowUpRight size={14} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex h-full flex-col rounded-2xl border border-red-500/30 bg-background p-8"
          >
            <Badge tone="red">AI infrastructure</Badge>
            <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">Solipher SHARD Context</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Shrinks what you send to an LLM without losing the facts that have to be exactly right.
            </p>
            <Link
              href="/products/shard-context"
              className="mt-6 flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300"
            >
              Learn more <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
