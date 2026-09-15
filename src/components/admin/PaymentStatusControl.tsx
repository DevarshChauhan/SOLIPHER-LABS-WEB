"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "pending" | "verified" | "rejected";

export function PaymentStatusControl({ applicationId, status }: { applicationId: string; status: Status }) {
  const router = useRouter();
  const [loading, setLoading] = useState<Status | null>(null);

  async function set(next: Status) {
    setLoading(next);
    await fetch(`/products/shard-gateway/admin/api/internship-applications/${applicationId}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {status !== "verified" && (
        <button
          onClick={() => set("verified")}
          disabled={loading !== null}
          className="text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700"
        >
          {loading === "verified" ? "Marking…" : "Mark payment verified"}
        </button>
      )}
      {status !== "rejected" && (
        <button
          onClick={() => set("rejected")}
          disabled={loading !== null}
          className="text-xs font-medium text-muted transition-colors hover:text-rose-600"
        >
          {loading === "rejected" ? "Marking…" : "Payment not found"}
        </button>
      )}
      {status !== "pending" && (
        <button
          onClick={() => set("pending")}
          disabled={loading !== null}
          className="text-xs font-medium text-muted transition-colors hover:text-foreground"
        >
          {loading === "pending" ? "Resetting…" : "Reset to pending"}
        </button>
      )}
    </div>
  );
}
