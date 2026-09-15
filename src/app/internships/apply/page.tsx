import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { ApplicationForm } from "@/components/internships/ApplicationForm";
import { site } from "@/lib/data/site";
import { Mail, Check, IndianRupee } from "lucide-react";

export const metadata: Metadata = {
  title: "Apply for an Internship",
  description:
    "Apply for an internship at Solipher Labs. Pick your domain, tell us what you've built, and we'll get back to you directly.",
};

const whatWeLookFor = [
  "Something you've actually built, at any scale",
  "A clear reason you picked this domain",
  "Honesty about what you don't know yet",
];

export default function InternshipApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Internship Program"
        title="Apply for an internship."
        description="One form, any domain. We read every application ourselves, so tell us something real rather than something polished."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-start">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">What we look for</h2>
              <ul className="mt-4 space-y-3">
                {whatWeLookFor.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
                    <Check size={16} className="mt-0.5 shrink-0 text-red-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm leading-relaxed text-muted">
                We care more about what you&rsquo;ve attempted than where you&rsquo;re studying or what your marks
                are. There are no fixed cohort dates, and we take a small number of interns per domain at a time.
              </p>

              <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                <div className="flex items-center gap-2">
                  <IndianRupee size={15} className="text-red-500" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-red-400">Application fee</h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  Applying costs{" "}
                  <strong>₹{site.internship.feeAmount.toLocaleString("en-IN")} per person</strong>, payable by UPI
                  before you submit the form. You&rsquo;ll enter your transaction ID as part of the application,
                  and we confirm it against our bank before reviewing.
                </p>
                {site.internship.refundPolicy && (
                  <p className="mt-2 text-xs leading-relaxed text-muted">{site.internship.refundPolicy}</p>
                )}
              </div>

              <div className="mt-8">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Prefer email?</h2>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent("Internship application")}`}
                  className="mt-3 flex items-center gap-2.5 text-sm text-foreground/90 transition-colors hover:text-red-400"
                >
                  <Mail size={16} className="text-red-500" />
                  {site.email}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <Suspense fallback={<div className="h-[520px]" />}>
                <ApplicationForm />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
