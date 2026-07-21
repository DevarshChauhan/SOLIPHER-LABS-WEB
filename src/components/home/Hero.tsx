"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/SectionHeading";
import { GridGlow } from "@/components/ui/Glow";

export function Hero({
  lead,
  highlight,
  description,
}: {
  lead: string;
  highlight: string;
  description: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
      <motion.div style={{ y: glowY }}>
        <GridGlow />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge tone="red">R&amp;D lab · Patent-backed systems</Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-6xl"
        >
          {lead} <span className="text-gradient-red">{highlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button href="/contact" variant="primary">
            Get a Quote <ArrowRight size={16} />
          </Button>
          <Button href="/research" variant="secondary">
            <FileText size={16} /> See the Research
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
