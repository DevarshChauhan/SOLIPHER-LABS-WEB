"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { site } from "@/lib/data/site";

const projectTypes = [
  "Odoo ERP",
  "Custom algorithm / data structure engineering",
  "Android or web application",
  "Custom AI/ML development",
  "Business Development (BDE)",
  "Resource-bounded systems consulting",
  "Medical imaging pipeline",
  "Product licensing",
  "Other / not sure yet",
];

type FieldName = "name" | "email" | "message";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<FieldName | null>(null);
  const searchParams = useSearchParams();
  const prefillType = searchParams.get("type") ?? "";
  const prefillMessage = searchParams.get("message") ?? "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setErrorField(null);
    setStatus("sending");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setErrorField((data.field as FieldName | undefined) ?? null);
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
        <h3 className="text-lg font-semibold text-foreground">Message received.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We&rsquo;ll reply to the email address you gave.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 min-h-11 text-sm font-medium text-red-400 hover:text-red-300"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required invalid={errorField === "name"} />
        <Field label="Email" name="email" type="email" required invalid={errorField === "email"} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Company" name="company" />
        <div>
          <label htmlFor="projectType" className="mb-2 block text-sm font-medium text-foreground/90">
            Project type
          </label>
          <select
            id="projectType"
            name="projectType"
            defaultValue={projectTypes.includes(prefillType) ? prefillType : ""}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          >
            <option value="">Select one</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground/90">
          What are you building?
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          required
          aria-invalid={errorField === "message" || undefined}
          aria-describedby={errorField === "message" ? "contact-error" : undefined}
          defaultValue={prefillMessage}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 aria-invalid:border-red-500"
          placeholder="Tell us about the system, timeline, and what a good outcome looks like."
        />
      </div>
      {/* Honeypot: hidden from people and assistive tech, filled in only by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div id="contact-error" role="alert" aria-live="assertive">
        {error && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/5 px-4 py-3 text-sm text-foreground/90">
            {error} You can also email{" "}
            <a href={`mailto:${site.email}`} className="text-red-400 underline underline-offset-2">
              {site.email}
            </a>
            .
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-red-400 hover:shadow-[0_0_24px_color-mix(in_srgb,var(--red-500)_45%,transparent)] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  invalid,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  invalid?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-foreground/90">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? "contact-error" : undefined}
        autoComplete={name === "email" ? "email" : name === "name" ? "name" : name === "company" ? "organization" : undefined}
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 aria-invalid:border-red-500"
      />
    </div>
  );
}
