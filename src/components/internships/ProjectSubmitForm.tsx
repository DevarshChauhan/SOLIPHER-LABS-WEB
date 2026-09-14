"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { site } from "@/lib/data/site";

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10";

export function ProjectSubmitForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/internships/submit-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.get("code")?.toString() ?? "",
          projectUrl: form.get("projectUrl")?.toString() ?? "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
        <CheckCircle2 size={28} className="mx-auto text-red-500" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">Project submitted.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We&rsquo;ll review your repository and, once it&rsquo;s verified, issue your certificate against your
          intern code. You&rsquo;ll receive it by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="code" className="mb-2 block text-sm font-medium text-foreground/90">
          Your intern code <span className="text-red-400">*</span>
        </label>
        <input
          id="code"
          name="code"
          required
          autoComplete="off"
          spellCheck={false}
          placeholder="SL-XXXX-XXXX"
          className={`${inputClass} font-mono uppercase tracking-wider`}
        />
        <p className="mt-1.5 text-xs text-muted">The code we sent you when your internship started.</p>
      </div>

      <div>
        <label htmlFor="projectUrl" className="mb-2 block text-sm font-medium text-foreground/90">
          Project repository link <span className="text-red-400">*</span>
        </label>
        <input
          id="projectUrl"
          name="projectUrl"
          type="url"
          required
          placeholder="https://github.com/your-username/your-project"
          className={inputClass}
        />
        <p className="mt-1.5 text-xs text-muted">
          GitHub, GitLab, Bitbucket, Codeberg or sourcehut. Make sure the repository is public so we can open it.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-500/40 bg-red-500/5 p-3.5 text-sm text-foreground/90">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
          <span>
            {error}{" "}
            <a href={`mailto:${site.email}`} className="text-red-400 underline underline-offset-2">
              {site.email}
            </a>
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-red-400 hover:shadow-[0_0_24px_color-mix(in_srgb,var(--red-500)_45%,transparent)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Submitting…" : "Submit project"}
      </button>
    </form>
  );
}
