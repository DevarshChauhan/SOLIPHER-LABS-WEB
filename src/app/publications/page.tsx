import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/SectionHeading";
import { FadeInView } from "@/components/ui/FadeInView";
import { publications } from "@/lib/data/publications";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Papers by the founder of Solipher Labs, with their real review status: what has been submitted, what is still in preparation, and where the raw results live.",
  alternates: { canonical: "/publications" },
};

export default function PublicationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Publications"
        title="Papers, with their real status."
        description="Submitted means the journal has it. In preparation means it hasn't been sent yet. Nothing here is listed as published until it is."
      />

      <div className="divide-y divide-border">
        {publications.map((paper, i) => (
          <section key={paper.slug} id={paper.slug} className="scroll-mt-24 py-16 sm:py-20">
            <Container>
              <FadeInView index={i % 3} className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={paper.status === "published" ? "green" : "neutral"}>{paper.statusLabel}</Badge>
                  <span className="text-xs uppercase tracking-wide text-muted">{paper.articleType}</span>
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {paper.title}
                </h2>
                <p className="mt-3 text-sm text-foreground/90">{paper.authors.join(", ")}</p>
                <p className="mt-1 text-sm text-muted">{paper.affiliation}</p>
                {paper.venue && <p className="mt-1 text-sm text-muted">{paper.venue}</p>}

                <p className="mt-6 text-base leading-relaxed text-muted">{paper.abstract}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {paper.keywords.map((kw) => (
                    <span key={kw} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
                      {kw}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {paper.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300"
                    >
                      {link.label} <ArrowUpRight size={14} />
                    </a>
                  ))}
                  {paper.researchSlug && (
                    <Link
                      href={`/research#${paper.researchSlug}`}
                      className="flex min-h-11 items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300"
                    >
                      Research program <ArrowUpRight size={14} />
                    </Link>
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
