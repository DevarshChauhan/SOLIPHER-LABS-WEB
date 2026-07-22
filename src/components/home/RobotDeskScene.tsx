"use client";

import { motion } from "framer-motion";
import { Network, Scissors } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HumanoidRobot } from "@/components/home/HumanoidRobot";

const chips = [
  { label: "SHARD Gateway", icon: Network, delay: 0 },
  { label: "SHARD Context", icon: Scissors, delay: 0.18 },
];

export function RobotDeskScene() {
  return (
    <section className="border-t border-border py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-10">
          <div className="flex items-end gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-24 w-36 flex-col justify-center gap-2 rounded-xl border border-border bg-black px-4 sm:h-28 sm:w-44">
                <span className="h-2 w-3/4 rounded-full bg-surface-raised" />
                <span className="h-2 w-1/2 rounded-full bg-surface-raised" />
                <span className="h-2 w-2/3 rounded-full bg-red-500/60" />
              </div>
              <div className="h-3 w-3 bg-border" />
              <div className="h-1.5 w-14 rounded-full bg-border" />
            </div>
            <HumanoidRobot className="h-24 w-24 sm:h-28 sm:w-28" />
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Choosing a product&hellip;</p>
            <div className="flex flex-col gap-2">
              {chips.map((chip) => (
                <motion.div
                  key={chip.label}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: chip.delay }}
                  className="flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2"
                >
                  <chip.icon size={15} className="text-red-500" />
                  <span className="text-sm text-foreground/90">{chip.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
