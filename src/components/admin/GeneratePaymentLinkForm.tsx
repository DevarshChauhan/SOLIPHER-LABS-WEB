"use client";

import { useState } from "react";
import { Link2, Copy, Check } from "lucide-react";

export function GeneratePaymentLinkForm({ companyId }: { companyId: string }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [termYears, setTermYears] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch(`/products/shard-gateway/admin/api/companies/${companyId}/payment-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), termYears }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not generate link.");
      return;
    }
    setUrl(`${window.location.origin}${data.url}`);
  }

  function copyUrl() {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface text-sm font-medium px-3.5 py-2 hover:border-red-500/40 transition-colors"
      >
        <Link2 className="h-4 w-4" />
        Generate payment link
      </button>
    );
  }

  if (url) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3">
        <p className="text-sm text-muted">Send this link to the company — the amount is locked, valid for 7 days:</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg border border-border bg-background px-3 py-2 text-xs">{url}</code>
          <button onClick={copyUrl} className="shrink-0 rounded-lg border border-border px-3 py-2 hover:border-red-500/40 transition-colors">
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <button
          onClick={() => { setOpen(false); setUrl(null); setAmount(""); }}
          className="self-start text-xs text-muted hover:text-foreground"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleGenerate} className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (₹)"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-red-500"
        />
        <select
          value={termYears}
          onChange={(e) => setTermYears(Number(e.target.value) as 1 | 2 | 3)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-red-500"
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
          className="rounded-lg bg-red-500 text-white text-sm font-medium px-4 py-2 hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate link"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}
