"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { DotGlow } from "@/components/ui/Glow";

export function CTABand() {
  return (
    <section className="relative overflow-hidden border-t border-border py-24 sm:py-32">
      <DotGlow className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Have a hard systems problem that needs solving?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Whether it&apos;s a triage pipeline, an ERP rollout, or a performance ceiling you can&apos;t
            engineer around, tell us what you&apos;re building and we&apos;ll tell you honestly whether we&apos;re a fit.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact" variant="primary">
              Get a Quote <ArrowRight size={16} />
            </Button>
            <Button href="/portfolio" variant="secondary">
              See the work
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
