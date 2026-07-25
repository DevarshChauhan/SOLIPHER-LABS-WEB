import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeInView } from "@/components/ui/FadeInView";
import { products } from "@/lib/data/products";
import {
  Check,
  Layers,
  Target,
  Lightbulb,
  TrendingUp,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

const statusTone: Record<string, "neutral" | "red" | "green"> = {
  available: "green",
  "early-access": "red",
};

function SubsectionLabel({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
      <Icon size={14} className="text-red-500" />
      {children}
    </h3>
  );
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
  };
}

export const dynamicParams = false;

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <>
      <PageHero eyebrow="Products" title={product.name} description={product.tagline} />

      <section className="py-20 sm:py-24">
        <Container>
          <FadeInView className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5">
                <Layers size={22} className="text-red-500" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{product.category}</Badge>
                <Badge tone={statusTone[product.status]}>{product.statusLabel}</Badge>
              </div>

              <div className="mt-8">
                <SubsectionLabel icon={Target}>The problem</SubsectionLabel>
                <p className="mt-3 text-base leading-relaxed text-muted">{product.problem}</p>
              </div>

              <div className="mt-6">
                <SubsectionLabel icon={Lightbulb}>The solution</SubsectionLabel>
                <p className="mt-3 text-base leading-relaxed text-muted">{product.solution}</p>
              </div>

              <div className="mt-8">
                <SubsectionLabel icon={Check}>Key features</SubsectionLabel>
                <div className="mt-3 space-y-3">
                  {product.features.map((f) => (
                    <div key={f} className="flex gap-3">
                      <Check size={18} className="mt-0.5 shrink-0 text-red-500" />
                      <p className="text-sm leading-relaxed text-foreground/90">{f}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <SubsectionLabel icon={TrendingUp}>Technical advantages</SubsectionLabel>
                <div className="mt-3 rounded-xl border border-border bg-surface p-5">
                  <p className="text-sm leading-relaxed text-foreground/90">{product.impact}</p>
                </div>
              </div>

              <div className="mt-8">
                <SubsectionLabel icon={Briefcase}>Enterprise benefits</SubsectionLabel>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {product.enterpriseBenefits.map((b) => (
                    <div key={b} className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground/90">
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 content-start gap-4 lg:sticky lg:top-24 lg:self-start">
              {product.pricing.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl border p-6 ${
                    tier.highlighted ? "border-red-500/50 bg-red-500/[0.04]" : "border-border bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{tier.name}</h3>
                    {tier.highlighted && <Badge tone="red">Popular</Badge>}
                  </div>
                  <p className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">{tier.price}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{tier.description}</p>
                  <ul className="mt-4 space-y-2">
                    {tier.features.map((f) => (
                      <li key={f} className="flex gap-2 text-xs text-muted">
                        <Check size={14} className="mt-0.5 shrink-0 text-red-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button href="/contact" variant={tier.highlighted ? "primary" : "secondary"} className="mt-5 w-full">
                    {tier.cta}
                  </Button>
                </div>
              ))}
            </div>
          </FadeInView>
        </Container>
      </section>
    </>
  );
}
