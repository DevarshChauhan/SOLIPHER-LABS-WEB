"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/ui/Logo";

export function AdminHeader({ crumb }: { crumb?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/products/shard-gateway/admin/api/logout", { method: "POST" });
    router.push("/products/shard-gateway/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/products/shard-gateway/admin" className="flex items-center gap-2 shrink-0">
            <LogoMark className="h-6 w-6" />
            <span className="font-display font-bold tracking-tight">
              SOLIPHER <span className="text-red-500">LABS</span>
            </span>
          </Link>
          <span className="text-border">/</span>
          <span className="text-muted">Admin</span>
          {crumb && (
            <>
              <span className="text-border">/</span>
              <span className="text-foreground font-medium">{crumb}</span>
            </>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
