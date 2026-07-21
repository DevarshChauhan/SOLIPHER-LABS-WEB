import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeInView } from "@/components/ui/FadeInView";
import { site } from "@/lib/data/site";
import { aboutVariants, pickVariant } from "@/lib/copyVariants";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "Solipher Labs is an R&D lab building patent-backed algorithms and data structures across medical imaging, high-performance infrastructure, and AI inference.",
};

export default function AboutPage() {
  const hero = pickVariant(aboutVariants);
  return (
    <>
      <PageHero
        eyebrow="About Solipher Labs"
        title={hero.title}
        description={hero.description}      />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionHeading eyebrow="What we do" title="Original engineering, not integration work." />
              <div className="mt-8 space-y-6 text-base leading-relaxed text-muted">
                <p>
                  Most software companies build by combining existing tools. Solipher Labs starts one
                  level lower: when an off-the-shelf approach can&rsquo;t meet a system&rsquo;s real
                  constraints (on speed, memory, or predictability under load), we design the
                  algorithm or data structure that can, and file for the IP that protects it.
                </p>
                <p>
                  That work spans medical imaging, high-performance data infrastructure, AI inference,
                  and network security. We don&rsquo;t publish how any of it works. We publish what
                  problem it solves and exactly how much better the measured result is, the same
                  standard we hold every product on this site to.
                </p>
                <p>
                  From there, Solipher Labs ships that engineering into deployable products, and takes
                  on Odoo ERP, custom application, and AI/ML development work for teams who need the
                  same level of engineering applied to their own systems.
                </p>
              </div>

              <div className="mt-12">
                <SectionHeading eyebrow="Mission" title="Solve the hard problem. Show the number." className="max-w-none" />
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
                  We&rsquo;d rather ship fewer claims we can back with a real, measured number than a
                  long list of claims that sound good in a pitch. Every stat on this site is either
                  measured, or clearly marked as in progress.
                </p>
              </div>
            </div>

            <aside className="space-y-6">
              <FadeInView index={0} y={16}>
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Focus</h3>
                  <p className="mt-2 text-sm text-foreground">
                    Medical imaging, high-performance infrastructure, AI inference, network security,
                    Odoo ERP, and custom application development.
                  </p>
                </div>
              </FadeInView>
              <FadeInView index={1} y={16}>
                <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400">IP</h3>
                  <p className="mt-2 text-sm text-foreground">
                    Every product on this site is built on original, patent-backed algorithms and data
                    structures developed in-house.
                  </p>
                </div>
              </FadeInView>
              <FadeInView index={2} y={16}>
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Team</h3>
                  <p className="mt-2 text-sm text-foreground">
                    A five-person, founder-led team, working in-house on every product and engagement on
                    this site.
                  </p>
                </div>
              </FadeInView>
            </aside>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="Leadership" title="Five people. Original engineering." />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {site.founders.map((person, i) => (
              <FadeInView key={person.name} index={i}>
                <div className="rounded-2xl border border-border bg-background p-8">
                  <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
                  <p className="mt-1 text-sm font-medium text-red-400">{person.role}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{person.bio}</p>
                </div>
              </FadeInView>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start gap-4 rounded-2xl border border-border bg-background p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Want to see what we&rsquo;ve solved?</h3>
              <p className="mt-1 text-sm text-muted">See the problem, and exactly how much the result moved.</p>
            </div>
            <Button href="/research" variant="primary">
              See the Research <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
