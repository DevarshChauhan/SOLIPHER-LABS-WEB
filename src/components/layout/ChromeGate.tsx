"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const CHROMELESS_PREFIXES = ["/products/shard-gateway/admin"];

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const chromeless = CHROMELESS_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  if (chromeless) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <ThemeToggle />
    </>
  );
}
