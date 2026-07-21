"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export function AddCompanyForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [category, setCategory] = useState<"gpu_cloud" | "ai_product">("ai_product");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/products/shard-gateway/admin/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contactName, contactEmail, category }),
    });
    setLoading(false);
    setOpen(false);
    setName("");
    setContactName("");
    setContactEmail("");
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 text-white text-sm font-medium px-3.5 py-2 hover:bg-red-600 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add company
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3 mb-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">New company</h3>
        <button type="button" onClick={() => setOpen(false)} className="text-muted hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Company name"
          className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-red-500"
        />
        <input
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          placeholder="Contact name"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-red-500"
        />
        <input
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="Contact email"
          type="email"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-red-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as "gpu_cloud" | "ai_product")}
          className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-red-500"
        >
          <option value="ai_product">AI product company</option>
          <option value="gpu_cloud">GPU cloud / inference reseller</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading || !name}
        className="self-start rounded-lg bg-red-500 text-white text-sm font-medium px-4 py-2 hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Adding…" : "Add company"}
      </button>
    </form>
  );
}
