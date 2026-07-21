import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/SectionHeading";
import { FadeInView } from "@/components/ui/FadeInView";
import { researchProjects } from "@/lib/data/research";
import { researchVariants, pickVariant } from "@/lib/copyVariants";
import { TrendingUp, Gauge } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research & Innovations",
  description:
    "What each Solipher Labs research program solves, and exactly how much better the measured result is. Patent-backed, mechanism not disclosed.",
};

export default function ResearchPage() {
  const hero = pickVariant(researchVariants);
  return (
    <>
      <PageHero
        eyebrow="Research & Innovations"
        title={hero.title}
        description={hero.description}      />

      <div className="divide-y divide-border">
        {researchProjects.map((project, i) => (
          <section key={project.slug} id={project.slug} className="scroll-mt-24 py-20 sm:py-24">
            <Container>
              <FadeInView index={i % 3} className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
                <div>
                  <Badge tone={project.status === "published" ? "green" : "neutral"}>{project.statusLabel}</Badge>
                  <h2 className="mt-4 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{project.codename}</h2>
                  <p className="mt-1 text-sm text-muted">{project.domain}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.keywords.map((kw) => (
                      <span key={kw} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Gauge size={16} className="text-red-500" /> The problem
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted">{project.problem}</p>

                  <p className="mt-6 text-xs uppercase tracking-wide text-muted">{project.scale}</p>

                  {project.impact.length > 0 && (
                    <div className="mt-8">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <TrendingUp size={16} className="text-red-500" /> How much it solves it
                      </h3>
                      <div className="mt-4 space-y-3">
                        {project.impact.map((line, i) => (
                          <div key={i} className="rounded-xl border border-border bg-surface p-5 text-sm leading-relaxed text-foreground/90">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </FadeInView>
            </Container>
          </section>
        ))}
      </div>
    </>
  );
}
