"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function LogoMark({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const src = mounted && resolvedTheme === "light" ? "/logo-light.png" : "/logo.png";

  return (
    <Image
      src={src}
      alt="Solipher Labs"
      width={500}
      height={500}
      quality={100}
      className={className}
      priority
    />
  );
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <Link href="/" className={`group flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark className="h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-105" />
      {showWordmark && (
        <span className="flex items-baseline gap-2 leading-none font-display">
          <span className="text-base font-bold tracking-wide text-foreground">SOLIPHER</span>
          <span className="text-base font-bold tracking-wide text-red-500">LABS</span>
        </span>
      )}
    </Link>
  );
}
