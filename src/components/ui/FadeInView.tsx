"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function FadeInView({
  children,
  index = 0,
  className,
  y = 20,
  delayStep = 0.08,
  duration = 0.5,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  y?: number;
  delayStep?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay: index * delayStep }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
