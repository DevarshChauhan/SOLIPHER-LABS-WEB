import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/SectionHeading";
import { FadeInView } from "@/components/ui/FadeInView";
import { caseStudies } from "@/lib/data/portfolio";
import { portfolioVariants, pickVariant } from "@/lib/copyVariants";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Case studies from Solipher Labs' engineering: the problem, and exactly how much the result moved.",
};

export default function PortfolioPage() {
  const hero = pickVariant(portfolioVariants);
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title={hero.title}
        description={hero.description}      />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="space-y-6">
            {caseStudies.map((cs, i) => (
              <FadeInView key={cs.slug} index={i} className="rounded-2xl border border-border bg-surface p-8 sm:p-10">
                <Badge>{cs.domain}</Badge>
                <h2 className="mt-4 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{cs.title}</h2>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Challenge</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{cs.challenge}</p>
                    <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Outcome</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{cs.outcome}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Results</h3>
                    <ul className="mt-3 space-y-3">
                      {cs.results.map((r, i) => (
                        <li key={i} className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground/90">
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={`/research#${cs.researchSlug}`}
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300"
                >
                  See the research <ArrowUpRight size={14} />
                </Link>
              </FadeInView>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
