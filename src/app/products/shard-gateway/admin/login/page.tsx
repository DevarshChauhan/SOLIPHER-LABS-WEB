"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/products/shard-gateway/admin/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/products/shard-gateway/admin");
      router.refresh();
    } else {
      setError("Invalid passphrase.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 flex flex-col gap-5"
      >
        <div className="flex flex-col items-center gap-3 pb-2">
          <LogoMark className="h-10 w-10" />
          <div className="text-center">
            <div className="font-display font-bold text-lg tracking-tight">
              SOLIPHER <span className="text-red-500">LABS</span>
            </div>
            <div className="text-sm text-muted mt-1">SHARD Gateway — Admin</div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="passphrase" className="text-xs font-medium text-muted uppercase tracking-wide">
            Passphrase
          </label>
          <input
            id="passphrase"
            type="password"
            autoFocus
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-red-500 transition-colors"
            placeholder="••••••••••••"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading || !passphrase}
          className="w-full rounded-lg bg-red-500 text-white text-sm font-medium py-2.5 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
