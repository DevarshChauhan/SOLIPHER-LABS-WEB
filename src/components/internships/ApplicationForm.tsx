"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Smartphone } from "lucide-react";
import { internshipDomains } from "@/lib/data/internships";
import { site } from "@/lib/data/site";
import { CollegeSelect } from "./CollegeSelect";

const inputClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10";

const MODES = [
  { value: "online", label: "Online", description: "Fully remote, from wherever you are." },
  { value: "offline", label: "Offline", description: "In person, at our office." },
  { value: "hybrid", label: "Hybrid", description: "A mix of remote and in person." },
] as const;

export function ApplicationForm() {
  const searchParams = useSearchParams();
  const requestedDomain = searchParams.get("domain") ?? "";
  const defaultDomain = internshipDomains.some((d) => d.slug === requestedDomain) ? requestedDomain : "";

  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<{ code: string; discountAmount: number; finalAmount: number } | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  const payable = coupon?.finalAmount ?? site.internship.feeAmount;

  async function applyCoupon() {
    const code = couponInput.trim();
    if (!code) return;
    setCheckingCoupon(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/internships/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setCoupon(null);
        setCouponError(data.error ?? "That coupon code isn't valid.");
        return;
      }
      setCoupon({ code: data.code, discountAmount: data.discountAmount, finalAmount: data.finalAmount });
    } catch {
      setCouponError("Couldn't check that code. Please try again.");
    } finally {
      setCheckingCoupon(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(
      ["domainSlug", "fullName", "email", "phone", "institution", "enrollmentNo", "experience", "portfolioUrl", "startDate", "mode", "message", "transactionId", "website"].map(
        (key) => [key, form.get(key)?.toString() ?? ""]
      )
    );

    try {
      const res = await fetch("/api/internships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, couponCode: coupon?.code ?? "" }),
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
          We&rsquo;ll confirm your fee payment against our bank records, then review your application. We read
          every one ourselves, so a reply takes a little longer than an autoresponder would. Either way,
          we&rsquo;ll be in touch at the email you gave us.
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
        <Field label="Enrollment number" name="enrollmentNo" placeholder="As on your university records" />
      </div>

      <CollegeSelect name="institution" inputClass={inputClass} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="GitHub, portfolio, or LinkedIn" name="portfolioUrl" type="url" placeholder="https://" />
        <div>
          <label htmlFor="startDate" className="mb-2 block text-sm font-medium text-foreground/90">
            Internship start date
          </label>
          <input id="startDate" name="startDate" type="date" className={inputClass} />
          <p className="mt-1.5 text-xs text-muted">The date your university requires the internship to begin.</p>
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-foreground/90">
          Preferred mode <span className="text-red-400">*</span>
        </legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {MODES.map((mode, i) => (
            <label
              key={mode.value}
              className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-surface p-3.5 transition-colors hover:border-red-500/40 has-[:checked]:border-red-500/60 has-[:checked]:bg-red-500/5"
            >
              <input
                type="radio"
                name="mode"
                value={mode.value}
                required
                defaultChecked={i === 0}
                className="mt-0.5 h-4 w-4 shrink-0 accent-red-500"
              />
              <span>
                <span className="block text-sm font-medium text-foreground">{mode.label}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">{mode.description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

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

      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">Application fee</h3>
          <span className="font-display text-lg font-semibold text-foreground">
            {coupon && (
              <span className="mr-2 text-sm font-normal text-muted line-through">
                ₹{site.internship.feeAmount.toLocaleString("en-IN")}
              </span>
            )}
            ₹{payable.toLocaleString("en-IN")}
          </span>
        </div>

        {coupon && (
          <p className="mt-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Coupon {coupon.code} applied — ₹{coupon.discountAmount.toLocaleString("en-IN")} off.
          </p>
        )}

        {site.internship.upiId || site.internship.upiQrImage ? (
          <>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Pay the fee by UPI first, then enter the transaction ID below. We check every payment against our
              bank by hand before approving an application.
            </p>
            <div className="mt-3 flex flex-wrap items-start gap-4">
              {site.internship.upiQrImage && (
                <img
                  src={site.internship.upiQrImage}
                  alt={`UPI QR code for ${site.internship.upiPayeeName}`}
                  className="h-36 w-36 shrink-0 rounded-lg border border-border bg-white p-2"
                />
              )}
              {site.internship.upiId && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground">
                    {site.internship.upiId}
                  </span>
                  <a
                    href={`upi://pay?pa=${encodeURIComponent(site.internship.upiId)}&pn=${encodeURIComponent(
                      site.internship.upiPayeeName
                    )}&am=${payable}&cu=${site.internship.currency}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <Smartphone size={14} />
                    Pay with a UPI app
                  </a>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Email{" "}
            <a href={`mailto:${site.email}`} className="text-red-400 underline underline-offset-2">
              {site.email}
            </a>{" "}
            for payment details, then enter your transaction ID below.
          </p>
        )}

        {site.internship.refundPolicy && (
          <p className="mt-3 text-xs leading-relaxed text-muted">{site.internship.refundPolicy}</p>
        )}

        <div className="mt-4">
          <label htmlFor="couponCode" className="mb-2 block text-sm font-medium text-foreground/90">
            Coupon code <span className="font-normal text-muted">(optional)</span>
          </label>
          <div className="flex gap-2">
            <input
              id="couponCode"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value);
                setCouponError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyCoupon();
                }
              }}
              autoComplete="off"
              spellCheck={false}
              disabled={Boolean(coupon)}
              placeholder="If you were given one"
              className={`${inputClass} font-mono disabled:opacity-60`}
            />
            <button
              type="button"
              onClick={coupon ? () => { setCoupon(null); setCouponInput(""); } : applyCoupon}
              disabled={checkingCoupon || (!coupon && !couponInput.trim())}
              className="shrink-0 rounded-lg border border-border px-4 text-sm font-medium text-foreground/85 transition-colors hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checkingCoupon ? "Checking…" : coupon ? "Remove" : "Apply"}
            </button>
          </div>
          {couponError && <p className="mt-1.5 text-xs text-red-400">{couponError}</p>}
          <p className="mt-1.5 text-xs text-muted">Apply your coupon before paying, so you pay the right amount.</p>
        </div>

        <div className="mt-4">
          <label htmlFor="transactionId" className="mb-2 block text-sm font-medium text-foreground/90">
            UPI transaction ID <span className="text-red-400">*</span>
          </label>
          <input
            id="transactionId"
            name="transactionId"
            required
            autoComplete="off"
            spellCheck={false}
            placeholder="12-digit UPI reference from your payment app"
            className={`${inputClass} font-mono`}
          />
          <p className="mt-1.5 text-xs text-muted">
            Your payment app shows this as the UPI transaction ID, UTR or reference number.
          </p>
        </div>
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
