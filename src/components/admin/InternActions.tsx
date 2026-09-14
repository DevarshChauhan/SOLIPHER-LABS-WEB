"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function useAction(id: string) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function run(action: "verify" | "unverify" | "delete") {
    setLoading(action);
    await fetch(`/products/shard-gateway/admin/api/interns/${id}/${action}`, { method: "POST" });
    setLoading(null);
    router.refresh();
  }

  return { run, loading };
}

export function InternActions({ internId, status }: { internId: string; status: "active" | "submitted" | "verified" }) {
  const { run, loading } = useAction(internId);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (confirmingDelete) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">Delete this intern and their certificate?</span>
        <button
          onClick={() => run("delete")}
          disabled={loading !== null}
          className="text-xs font-medium text-rose-600 hover:text-rose-700"
        >
          {loading === "delete" ? "Deleting…" : "Confirm"}
        </button>
        <button onClick={() => setConfirmingDelete(false)} className="text-xs text-muted hover:text-foreground">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {status === "verified" ? (
        <button
          onClick={() => run("unverify")}
          disabled={loading !== null}
          className="text-xs font-medium text-muted transition-colors hover:text-amber-600"
        >
          {loading === "unverify" ? "Revoking…" : "Revoke certificate"}
        </button>
      ) : (
        <button
          onClick={() => run("verify")}
          disabled={loading !== null}
          className="text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700"
        >
          {loading === "verify" ? "Issuing…" : "Verify & issue certificate"}
        </button>
      )}
      <button
        onClick={() => setConfirmingDelete(true)}
        className="text-xs font-medium text-muted transition-colors hover:text-rose-600"
      >
        Delete
      </button>
    </div>
  );
}

export function IssueCodeButton({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleIssue() {
    setLoading(true);
    setError(null);
    const res = await fetch("/products/shard-gateway/admin/api/interns/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Could not issue a code.");
      return;
    }
    setCode(data.code);
    router.refresh();
  }

  if (code) {
    return (
      <span className="text-xs text-emerald-600">
        Code issued: <span className="font-mono tracking-wider">{code}</span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <button
        onClick={handleIssue}
        disabled={loading}
        className="text-xs font-medium text-muted transition-colors hover:text-emerald-600"
      >
        {loading ? "Issuing…" : "Accept & issue intern code"}
      </button>
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </span>
  );
}
