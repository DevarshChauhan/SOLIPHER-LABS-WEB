"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

export function PayButton({ linkId, companyName }: { linkId: string; companyName: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/products/shard-gateway/pay/api/create-order/${linkId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Could not start checkout.");
      }

      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key: data.keyId,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: "Solipher Labs",
        description: "SHARD Gateway license",
        prefill: { name: data.companyName },
        theme: { color: "#e4002b" },
        handler: () => {
          // Not the source of truth for license issuance -- the webhook
          // (payment.captured, verified server-side) does that. This is
          // only the immediate UI acknowledgment.
          setPaid(true);
        },
      });
      rzp.open();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (paid) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
        Payment received — your license will be issued automatically within a few minutes. We&rsquo;ll be in touch.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full rounded-lg bg-red-500 text-white text-sm font-medium py-3 hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Starting checkout…" : `Pay for ${companyName}`}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
