"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

// "floating" is the corner button on large screens. On phones it would sit
// over page content, so there the toggle lives inside the menu ("menu").
export function ThemeToggle({ variant = "floating" }: { variant?: "floating" | "menu" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base text-foreground/90 transition-colors hover:bg-surface-raised hover:text-red-400"
      >
        {mounted ? label : "Switch theme"}
        {mounted && (isDark ? <Sun size={18} /> : <Moon size={18} />)}
      </button>
    );
  }

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="fixed bottom-6 right-6 z-40 hidden h-11 w-11 rounded-full border border-border bg-surface-raised lg:block"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      className="fixed bottom-6 right-6 z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-raised text-foreground shadow-lg transition-colors duration-300 hover:border-red-500/50 hover:text-red-400 lg:flex"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
