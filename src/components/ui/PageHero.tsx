"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { GridGlow } from "@/components/ui/Glow";
import { Badge } from "@/components/ui/SectionHeading";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border pt-16 pb-20 sm:pt-20 sm:pb-24">
      <GridGlow />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge tone="red">{eyebrow}</Badge>
        </motion.div>
        <motion.h1
          key={title}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p
          key={description}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-5 max-w-2xl text-lg leading-relaxed text-muted"
        >
          {description}
        </motion.p>
      </Container>
    </section>
  );
}
