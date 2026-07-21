"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading, Badge } from "@/components/ui/SectionHeading";
import { researchProjects } from "@/lib/data/research";

const featured = researchProjects.filter((p) => p.slug !== "sharp-flow");

export function FeaturedResearch() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Research"
            title="What we solved. How much it moved the number."
            description="No simulated benchmarks, no back-of-envelope estimates. Real runs, on real hardware and real data."
          />
          <Link href="/research" className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 sm:flex">
            All research <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {featured.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/research#${project.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:border-red-500/40 hover:bg-surface-raised"
              >
                <div className="flex items-center justify-between">
                  <Badge tone={project.status === "published" ? "green" : "neutral"}>{project.statusLabel}</Badge>
                  <ArrowUpRight size={16} className="text-muted transition-colors group-hover:text-red-400" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">{project.codename}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted">{project.domain}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{project.problem}</p>
                {project.impact.length > 0 && (
                  <div className="mt-6 border-t border-border pt-5">
                    <p className="text-sm font-medium text-foreground">{project.impact[0]}</p>
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        <Link href="/research" className="mt-8 flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 sm:hidden">
          All research <ArrowUpRight size={14} />
        </Link>
      </Container>
    </section>
  );
}
