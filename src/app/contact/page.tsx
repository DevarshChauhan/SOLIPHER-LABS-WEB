import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/SectionHeading";
import { GridGlow } from "@/components/ui/Glow";
import { ContactForm } from "@/components/contact/ContactForm";
import { LinkedInIcon, GitHubIcon, XIcon } from "@/components/ui/BrandIcons";
import { Mail } from "lucide-react";
import { site } from "@/lib/data/site";
import { contactVariants, pickVariant } from "@/lib/copyVariants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get a quote or start a conversation with Solipher Labs: Odoo ERP, custom AI/ML, and more.",
};

export default function ContactPage() {
  const hero = pickVariant(contactVariants);
  return (
    <section className="relative flex min-h-[calc(100dvh-5rem)] items-center overflow-hidden py-10">
      <GridGlow />
      <Container>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <Badge tone="red">Contact</Badge>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{hero.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{hero.description}</p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Reach us directly</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 flex items-center gap-2.5 text-sm text-foreground/90 transition-colors hover:text-red-400"
            >
              <Mail size={16} className="text-red-500" />
              {site.email}
            </a>

            <div className="mt-4 flex items-center gap-3">
              <SocialIcon href={site.social.linkedin} label="LinkedIn">
                <LinkedInIcon size={15} />
              </SocialIcon>
              <SocialIcon href={site.social.github} label="GitHub">
                <GitHubIcon size={15} />
              </SocialIcon>
              <SocialIcon href={site.social.x} label="X">
                <XIcon size={15} />
              </SocialIcon>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-muted">
              We read every message ourselves and reply honestly, including when we&rsquo;re not the right fit. You get a quote, not a sales pitch.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <Suspense fallback={<div className="h-[420px]" />}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </Container>
    </section>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-red-500/50 hover:text-red-400"
    >
      {children}
    </a>
  );
}
