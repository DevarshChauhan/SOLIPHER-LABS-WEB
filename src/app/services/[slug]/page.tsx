import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading, Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeInView } from "@/components/ui/FadeInView";
import { servicePages, getServicePage } from "@/lib/data/servicePages";
import { Check, Building2, Smartphone, Handshake, BrainCircuit, ArrowRight, type LucideIcon } from "lucide-react";

const heroIcons: Record<string, LucideIcon> = {
  "odoo-erp": Building2,
  "web-app-development": Smartphone,
  bde: Handshake,
  "ai-development": BrainCircuit,
};

export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  return {
    title: page.name,
    description: page.tagline,
  };
}

export const dynamicParams = false;

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const Icon = heroIcons[page.slug] ?? Building2;
  const contactHref = `/contact?type=${encodeURIComponent(page.projectType)}`;

  return (
    <>
      <PageHero eyebrow="Services" title={page.name} description={page.heroDescription} />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5">
            <Icon size={22} className="text-red-500" />
          </div>
          <SectionHeading eyebrow="How we work" title="The approach, every time." />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {page.approach.map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-border bg-surface p-6">
                <span className="font-display text-sm font-semibold text-red-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="What we can build for you"
            title="Illustrative examples, not a client list."
            description="Solipher Labs is a young lab. These are the kinds of problems this service is built to solve, not named client work. Tell us what you're building."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {page.examples.map((ex, i) => {
              const Icon = ex.icon;
              return (
                <FadeInView key={ex.title} index={i} className="flex flex-col rounded-2xl border border-border bg-surface p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5">
                    <Icon size={22} className="text-red-500" />
                  </div>
                  <Badge>{ex.category}</Badge>
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{ex.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{ex.description}</p>
                  <ul className="mt-6 space-y-2.5">
                    {ex.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 text-sm text-foreground/85">
                        <Check size={16} className="mt-0.5 shrink-0 text-red-500" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </FadeInView>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-red-500/30 bg-red-500/[0.04] p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Have something like this to build?</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Tell us what you&rsquo;re building and we&rsquo;ll tell you honestly whether we&rsquo;re a fit.
              </p>
            </div>
            <Button href={contactHref} className="shrink-0">
              Get a Quote <ArrowRight size={14} />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
