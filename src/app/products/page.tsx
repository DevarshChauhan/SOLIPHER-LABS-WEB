import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeInView } from "@/components/ui/FadeInView";
import { products } from "@/lib/data/products";
import { productsVariants, pickVariant } from "@/lib/copyVariants";
import {
  HeartPulse,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Building2,
  Scissors,
  ArrowRight,
  Network,
  type LucideIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Solipher Triage, Solipher Index, Solipher SHARD, and more: patent-backed algorithms and data structures from Solipher Labs, packaged into deployable products.",
};

const statusTone: Record<string, "neutral" | "red" | "green"> = {
  available: "green",
  "early-access": "red",
};

const productIcons: Record<string, LucideIcon> = {
  "solipher-triage": HeartPulse,
  "solipher-index": Layers,
  "solipher-shard": Cpu,
  "solipher-cache": Database,
  "solipher-shield": ShieldCheck,
  "solipher-erp": Building2,
};

export default function ProductsPage() {
  const hero = pickVariant(productsVariants);
  return (
    <>
      <PageHero eyebrow="Products" title={hero.title} description={hero.description} />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {products.map((product, i) => {
              const Icon = productIcons[product.slug] ?? Layers;
              return (
                <FadeInView key={product.slug} index={i} className="flex flex-col rounded-2xl border border-border bg-surface p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5">
                    <Icon size={22} className="text-red-500" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{product.category}</Badge>
                    <Badge tone={statusTone[product.status]}>{product.statusLabel}</Badge>
                  </div>
                  <h2 className="mt-4 font-display text-lg font-semibold text-foreground">{product.name}</h2>
                  <p className="mt-1 text-sm font-medium text-red-400">{product.tagline}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{product.problem}</p>

                  <div className="mt-8">
                    <Button href={`/products/${product.slug}`} variant="primary">
                      See details <ArrowRight size={14} />
                    </Button>
                  </div>
                </FadeInView>
              );
            })}

            <FadeInView index={products.length} className="flex flex-col rounded-2xl border border-red-500/30 bg-red-500/5 p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <Network size={22} className="text-red-500" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>AI infrastructure</Badge>
                <Badge tone="red">In active pilot testing</Badge>
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">SHARD Gateway</h2>
              <p className="mt-1 text-sm font-medium text-red-400">
                A reverse proxy that sits in front of vLLM and makes a real admission decision before a request reaches the GPU.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                The productized, vLLM-specific version of Solipher SHARD: real GPU benchmarks, an install guide, and pricing.
              </p>

              <div className="mt-8">
                <Button href="/products/shard-gateway" variant="primary">
                  What it is, installation guide, and pricing <ArrowRight size={14} />
                </Button>
              </div>
            </FadeInView>

            <FadeInView index={products.length + 1} className="flex flex-col rounded-2xl border border-red-500/30 bg-red-500/5 p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <Scissors size={22} className="text-red-500" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>AI infrastructure</Badge>
                <Badge tone="red">Measured against a live model</Badge>
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">Solipher SHARD Context</h2>
              <p className="mt-1 text-sm font-medium text-red-400">
                Shrinks what you send to an LLM without losing the facts that have to be exactly right.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Real results against a live model, real bugs found and fixed, and an independent clean-room
                reproduction, not a specification anymore.
              </p>

              <div className="mt-8">
                <Button href="/products/shard-context" variant="primary">
                  The real results, and what&rsquo;s not done yet <ArrowRight size={14} />
                </Button>
              </div>
            </FadeInView>
          </div>
        </Container>
      </section>
    </>
  );
}
