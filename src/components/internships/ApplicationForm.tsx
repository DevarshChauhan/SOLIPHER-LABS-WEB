"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { internshipDomains } from "@/lib/data/internships";
import { site } from "@/lib/data/site";

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10";

export function ApplicationForm() {
  const searchParams = useSearchParams();
  const requestedDomain = searchParams.get("domain") ?? "";
  const defaultDomain = internshipDomains.some((d) => d.slug === requestedDomain) ? requestedDomain : "";

  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(
      ["domainSlug", "fullName", "email", "phone", "institution", "experience", "portfolioUrl", "availability", "message", "website"].map(
        (key) => [key, form.get(key)?.toString() ?? ""]
      )
    );

    try {
      const res = await fetch("/api/internships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        <h3 className="mt-4 text-lg font-semibold text-foreground">Application received.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We read every application ourselves, so a reply takes a little longer than an autoresponder would.
          If it&rsquo;s a fit for a live engagement, we&rsquo;ll be in touch at the email you gave us.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="domainSlug" className="mb-2 block text-sm font-medium text-foreground/90">
          Which internship domain? <span className="text-red-400">*</span>
        </label>
        <select id="domainSlug" name="domainSlug" required defaultValue={defaultDomain} className={inputClass}>
          <option value="">Select a domain</option>
          {internshipDomains.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName" required />
        <Field label="Email" name="email" type="email" required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" />
        <Field label="College / university" name="institution" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="GitHub, portfolio, or LinkedIn" name="portfolioUrl" type="url" placeholder="https://" />
        <Field label="Availability" name="availability" placeholder="e.g. 3 months from June, part-time" />
      </div>

      <div>
        <label htmlFor="experience" className="mb-2 block text-sm font-medium text-foreground/90">
          What have you built so far?
        </label>
        <textarea
          id="experience"
          name="experience"
          rows={4}
          className={inputClass}
          placeholder="Projects, coursework, anything you've built, broken, or measured yourself. Links are welcome."
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground/90">
          Why this domain?
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className={inputClass}
          placeholder="What you want to get out of it, and what you're hoping to work on."
        />
      </div>

      {/* Honeypot: hidden from real users, bots fill it in and get filtered. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
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
        {status === "submitting" ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-foreground/90">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} className={inputClass} />
    </div>
  );
}
