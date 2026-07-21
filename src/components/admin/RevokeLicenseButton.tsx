"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RevokeLicenseButton({ licenseId }: { licenseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleRevoke() {
    setLoading(true);
    await fetch(`/products/shard-gateway/admin/api/licenses/${licenseId}/revoke`, { method: "POST" });
    setLoading(false);
    setConfirming(false);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">Revoke this license?</span>
        <button onClick={handleRevoke} disabled={loading} className="text-xs font-medium text-rose-600 hover:text-rose-700">
          {loading ? "Revoking…" : "Confirm"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-muted hover:text-foreground">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-xs font-medium text-muted hover:text-rose-600 transition-colors">
      Revoke
    </button>
  );
}
