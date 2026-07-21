"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading, Badge } from "@/components/ui/SectionHeading";
import { products } from "@/lib/data/products";

const featured = products.filter((p) =>
  ["solipher-triage", "solipher-index", "solipher-shard"].includes(p.slug)
);

export function FeaturedProducts() {
  return (
    <section className="border-t border-border bg-surface py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Products"
            title="Patent-backed research, packaged into things you can deploy."
            description="Every product below solves a specific, named problem, and we can tell you exactly how much better the result is."
          />
          <Link href="/products" className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 sm:flex">
            All products <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex h-full flex-col rounded-2xl border border-border bg-background p-8"
            >
              <Badge>{product.category}</Badge>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">{product.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{product.tagline}</p>
              <Link
                href={`/products/${product.slug}`}
                className="mt-6 flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300"
              >
                Learn more <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
