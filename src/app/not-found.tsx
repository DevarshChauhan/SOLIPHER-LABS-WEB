import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GridGlow } from "@/components/ui/Glow";
import { Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const suggestions = [
  { href: "/research", label: "Research", description: "What each program solves, with the measured numbers." },
  { href: "/products", label: "Products", description: "SHARD Gateway, SHARD Context and SHARD CodeContext." },
  { href: "/publications", label: "Publications", description: "Papers, with their real review status." },
  { href: "/internships", label: "Internships", description: "Programs, how to apply, and certificate verification." },
];

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <GridGlow />
      <Container>
        <Badge tone="red">404</Badge>
        <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          This page doesn&rsquo;t exist.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          The link may be old, or the page may have moved. Here&rsquo;s where most people are headed.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>

        <div className="mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
          {suggestions.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-red-500/40"
            >
              <span className="flex items-center justify-between text-sm font-semibold text-foreground">
                {s.label}
                <ArrowUpRight size={14} className="text-muted transition-colors group-hover:text-red-400" />
              </span>
              <span className="mt-1.5 block text-sm text-muted">{s.description}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
