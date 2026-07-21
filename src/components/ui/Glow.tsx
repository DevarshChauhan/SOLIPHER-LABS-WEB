"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export function GridGlow({ className, watermark = true }: { className?: string; watermark?: boolean }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === "light" ? "/logo-light.png" : "/logo.png";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className ?? ""}`}
    >
      <div
        className="absolute inset-0 grid-fade-mask opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[140px]" />
      {watermark && (
        <Image
          src={logoSrc}
          alt=""
          width={700}
          height={700}
          quality={100}
          className="absolute -right-24 top-1/2 h-[440px] w-[440px] -translate-y-1/2 opacity-[0.06] sm:h-[560px] sm:w-[560px]"
        />
      )}
    </div>
  );
}

export function DotGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 h-[420px] w-[420px] rounded-full bg-red-600/15 blur-[120px] ${className ?? ""}`}
    />
  );
}
