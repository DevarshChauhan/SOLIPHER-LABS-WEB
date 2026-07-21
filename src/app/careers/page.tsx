import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/data/site";
import { Gauge, FlaskConical, Users, Layers, Mail, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Work on patent-backed algorithms and data structures at Solipher Labs. No open requisitions posted right now, but we're always open to a conversation.",
};

const values = [
  {
    icon: Gauge,
    title: "Real numbers over decks",
    description: "Every claim we make ships with a benchmark from a real run. That standard applies to your work too, not just what goes on the website.",
  },
  {
    icon: FlaskConical,
    title: "Patent-backed, not paper-backed",
    description: "We build original algorithms and data structures, then defend them. If you want your work to end at a slide deck, this isn't the place.",
  },
  {
    icon: Layers,
    title: "Own it end to end",
    description: "Small team, few layers. You'll take something from a hard problem to a measured, shipped result, not just one stage of it.",
  },
  {
    icon: Users,
    title: "Comfortable with ambiguity",
    description: "Early-stage R&D means the spec isn't written yet. We're looking for people who can define the problem, not just solve a given one.",
  },
];

export default function CareersPage() {
  const contactHref = `mailto:${site.email}?subject=${encodeURIComponent("Speculative application")}`;

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build the algorithm, not around it."
        description="Solipher Labs is a small R&D lab working on patent-backed algorithms and data structures across medical imaging, high-performance infrastructure, AI inference, and enterprise software."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Why here" title="What working here actually looks like." />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="rounded-2xl border border-border bg-surface p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5">
                    <Icon size={20} className="text-red-500" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{v.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <div className="rounded-3xl border border-border bg-surface p-8 sm:p-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
              Open roles
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              No open requisitions posted right now.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              We&rsquo;re a young lab and we hire in small, specific bursts rather than running a standing pipeline. That said, we&rsquo;re
              always interested in hearing from engineers and researchers working on algorithms, data structures, systems infrastructure,
              medical imaging, or AI inference. If that&rsquo;s your work, tell us what you&rsquo;ve built and what you&rsquo;re looking for.
            </p>
            <Button href={contactHref} external className="mt-6">
              <Mail size={14} /> Introduce yourself <ArrowRight size={14} />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
