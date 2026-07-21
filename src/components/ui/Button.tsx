"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-red-500 text-white hover:bg-red-400 shadow-[0_0_0_1px_color-mix(in_srgb,var(--red-500)_40%,transparent)] hover:shadow-[0_0_24px_color-mix(in_srgb,var(--red-500)_45%,transparent)]",
  secondary:
    "bg-surface-raised text-foreground border border-border hover:border-red-500/50 hover:bg-surface",
  ghost: "text-foreground/80 hover:text-foreground",
};

const MotionLink = motion.create(Link);

export function Button({
  href,
  children,
  variant = "primary",
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 ${variantStyles[variant]} ${className ?? ""}`;

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <MotionLink
      href={href}
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </MotionLink>
  );
}
