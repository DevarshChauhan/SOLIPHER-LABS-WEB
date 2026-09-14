import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProjectSubmitForm } from "@/components/internships/ProjectSubmitForm";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Submit Your Internship Project",
  description:
    "Finishing your Solipher Labs internship? Submit your project repository against your intern code to have your certificate issued.",
};

const steps = [
  {
    title: "Submit your repository",
    description: "Enter the intern code you were given at the start, along with a public link to the project you built.",
  },
  {
    title: "We verify the work",
    description: "Someone on the team opens the repository and checks the work is yours and complete. This isn't automatic.",
  },
  {
    title: "Your certificate is issued",
    description: "Once verified, your certificate is issued against your code and emailed to you. Anyone can then verify it.",
  },
];

export default function SubmitProjectPage() {
  return (
    <>
      <PageHero
        eyebrow="Internship Program"
        title="Submit your project."
        description="Finished your internship? Submit the project you built against your intern code, and we'll verify it before issuing your certificate."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">How this works</h2>
              <ol className="mt-4 space-y-5">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-red-500/40 bg-red-500/5 font-display text-xs font-semibold text-red-400">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-foreground">{step.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">{step.description}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
                <h3 className="text-sm font-semibold text-foreground">Already have a certificate?</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Any certificate we issue can be checked against its code.
                </p>
                <Button href="/verify" variant="secondary" className="mt-4">
                  Verify a certificate <ArrowRight size={14} />
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <ProjectSubmitForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
