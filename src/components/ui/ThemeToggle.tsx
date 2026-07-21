"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="fixed bottom-5 right-5 z-40 h-11 w-11 rounded-full border border-border bg-surface-raised sm:bottom-6 sm:right-6"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-raised text-foreground shadow-lg transition-colors duration-300 hover:border-red-500/50 hover:text-red-400 sm:bottom-6 sm:right-6"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
