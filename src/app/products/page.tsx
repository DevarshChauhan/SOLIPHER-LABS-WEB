import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeInView } from "@/components/ui/FadeInView";
import { productsVariants, pickVariant } from "@/lib/copyVariants";
import { Scissors, ArrowRight, Network, FileCode2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description:
    "SHARD Gateway and Solipher SHARD Context: patent-backed AI infrastructure from Solipher Labs, packaged into deployable products.",
};

export default function ProductsPage() {
  const hero = pickVariant(productsVariants);
  return (
    <>
      <PageHero eyebrow="Products" title={hero.title} description={hero.description} />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FadeInView index={0} className="flex flex-col rounded-2xl border border-red-500/30 bg-red-500/5 p-8">
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
                Real GPU benchmarks, an install guide, and pricing, from our admission-control research.
              </p>

              <div className="mt-8">
                <Button href="/products/shard-gateway" variant="primary">
                  What it is, installation guide, and pricing <ArrowRight size={14} />
                </Button>
              </div>
            </FadeInView>

            <FadeInView index={1} className="flex flex-col rounded-2xl border border-red-500/30 bg-red-500/5 p-8">
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

            <FadeInView index={2} className="flex flex-col rounded-2xl border border-red-500/30 bg-red-500/5 p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <FileCode2 size={22} className="text-red-500" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>AI infrastructure</Badge>
                <Badge tone="red">Benchmarked on real repositories</Badge>
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">Solipher SHARD CodeContext</h2>
              <p className="mt-1 text-sm font-medium text-red-400">
                Compiles the smallest slice of your repository a coding task actually needs, under a hard token budget.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                11 real tasks across 4 open repositories in Rust, Python and TypeScript, re-measured by CI on
                every push, including the three cases where it does not win.
              </p>

              <div className="mt-8">
                <Button href="/products/shard-codecontext" variant="primary">
                  The full benchmark, and the honest gaps <ArrowRight size={14} />
                </Button>
              </div>
            </FadeInView>
          </div>
        </Container>
      </section>
    </>
  );
}
