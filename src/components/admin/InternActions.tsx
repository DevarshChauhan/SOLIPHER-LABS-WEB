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

export function InternDetailsForm({
  internId,
  startDate,
  endDate,
  mode,
}: {
  internId: string;
  startDate: string | null;
  endDate: string | null;
  mode: "online" | "offline" | "hybrid" | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const form = new FormData(e.currentTarget);
    await fetch(`/products/shard-gateway/admin/api/interns/${internId}/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: form.get("startDate")?.toString() ?? "",
        endDate: form.get("endDate")?.toString() ?? "",
        mode: form.get("mode")?.toString() ?? "",
      }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  const field =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/40";

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <label className="flex-1 min-w-[130px]">
        <span className="mb-1 block text-xs text-muted">Start date</span>
        <input type="date" name="startDate" defaultValue={startDate ?? ""} className={field} />
      </label>
      <label className="flex-1 min-w-[130px]">
        <span className="mb-1 block text-xs text-muted">End date</span>
        <input type="date" name="endDate" defaultValue={endDate ?? ""} className={field} />
      </label>
      <label className="flex-1 min-w-[120px]">
        <span className="mb-1 block text-xs text-muted">Mode</span>
        <select name="mode" defaultValue={mode ?? ""} className={field}>
          <option value="">Not set</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={saving}
        className="rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground/85 transition-colors hover:border-foreground/40 disabled:opacity-60"
      >
        {saving ? "Saving…" : saved ? "Saved" : "Save"}
      </button>
    </form>
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
