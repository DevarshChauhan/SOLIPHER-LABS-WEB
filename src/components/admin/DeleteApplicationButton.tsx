"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteApplicationButton({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/products/shard-gateway/admin/api/internship-applications/${applicationId}/delete`, {
      method: "POST",
    });
    setLoading(false);
    setConfirming(false);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">Delete permanently?</span>
        <button onClick={handleDelete} disabled={loading} className="text-xs font-medium text-rose-600 hover:text-rose-700">
          {loading ? "Deleting…" : "Confirm"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-muted hover:text-foreground">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs font-medium text-muted transition-colors hover:text-rose-600"
    >
      Delete
    </button>
  );
}
