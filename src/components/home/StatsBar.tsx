"use client";

import { motion } from "framer-motion";
import { heroStats } from "@/lib/data/site";
import { Container } from "@/components/ui/Container";

export function StatsBar() {
  return (
    <section className="border-y border-border bg-surface py-14">
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {heroStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{stat.value}</div>
              <p className="mt-2 text-sm leading-snug text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
