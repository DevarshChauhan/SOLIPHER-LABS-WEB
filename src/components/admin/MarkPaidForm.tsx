"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck } from "lucide-react";

export function MarkPaidForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [termYears, setTermYears] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch(`/products/shard-gateway/admin/api/companies/${companyId}/mark-paid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), termYears }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not record payment.");
      return;
    }
    setOpen(false);
    setAmount("");
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface text-sm font-medium px-3.5 py-2 hover:border-emerald-500/40 transition-colors"
      >
        <BadgeCheck className="h-4 w-4" />
        Mark as paid
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3">
      <p className="text-xs text-muted">
        Confirms a bank transfer/UPI payment received directly (no gateway) and issues the license immediately.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount received (₹)"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
        />
        <select
          value={termYears}
          onChange={(e) => setTermYears(Number(e.target.value) as 1 | 2 | 3)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
        >
          <option value={1}>1 year</option>
          <option value={2}>2 years</option>
          <option value={3}>3 years</option>
        </select>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading || !amount}
          className="rounded-lg bg-emerald-600 text-white text-sm font-medium px-4 py-2 hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Recording…" : "Confirm payment & issue license"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}
