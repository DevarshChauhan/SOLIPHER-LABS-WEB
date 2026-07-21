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

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const prefillType = searchParams.get("type") ?? "";
  const prefillMessage = searchParams.get("message") ?? "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name")?.toString() ?? "";
    const email = form.get("email")?.toString() ?? "";
    const company = form.get("company")?.toString() ?? "";
    const projectType = form.get("projectType")?.toString() ?? "";
    const message = form.get("message")?.toString() ?? "";

    const subject = `[Quote request] ${projectType || "New project"} (${company || name})`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "n/a"}`,
      `Project type: ${projectType || "n/a"}`,
      "",
      "Message:",
      message,
    ].join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
        <h3 className="text-lg font-semibold text-foreground">Your email client should be opening now.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          If it didn&rsquo;t, email us directly at{" "}
          <a href={`mailto:${site.email}`} className="text-red-400 underline underline-offset-2">
            {site.email}
          </a>
          .
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-red-400 hover:text-red-300"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
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
          defaultValue={prefillMessage}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
          placeholder="Tell us about the system, timeline, and what a good outcome looks like."
        />
      </div>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-red-400 hover:shadow-[0_0_24px_color-mix(in_srgb,var(--red-500)_45%,transparent)] sm:w-auto"
      >
        Send message
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
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
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
      />
    </div>
  );
}
