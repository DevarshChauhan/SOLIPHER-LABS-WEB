import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeInView } from "@/components/ui/FadeInView";
import { services } from "@/lib/data/services";
import { servicesVariants, pickVariant } from "@/lib/copyVariants";
import { ArrowRight, Check, Building2, Cpu, Smartphone, BrainCircuit, Gauge, HeartPulse, Handshake, type LucideIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Odoo ERP, custom algorithm engineering, Android and web development, custom AI/ML, business development, resource-bounded systems consulting, and medical imaging pipelines.",
};

const serviceIcons: Record<string, LucideIcon> = {
  "odoo-erp": Building2,
  "algorithm-engineering": Cpu,
  "android-web-apps": Smartphone,
  "custom-ai-ml": BrainCircuit,
  "resource-bounded-systems": Gauge,
  "medical-imaging-pipelines": HeartPulse,
  bde: Handshake,
};

export default function ServicesPage() {
  const hero = pickVariant(servicesVariants);
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={hero.title}
        description={hero.description}      />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((service, i) => {
              const Icon = serviceIcons[service.slug] ?? Cpu;
              return (
              <FadeInView key={service.slug} index={i} className="flex flex-col rounded-2xl border border-border bg-surface p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5">
                  <Icon size={22} className="text-red-500" />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground">{service.name}</h2>
                <p className="mt-1 text-sm font-medium text-red-400">{service.summary}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{service.detail}</p>
                <ul className="mt-6 space-y-2.5">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm text-foreground/85">
                      <Check size={16} className="mt-0.5 shrink-0 text-red-500" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  {service.detailSlug && (
                    <Button href={`/services/${service.detailSlug}`} variant="primary">
                      See examples <ArrowRight size={14} />
                    </Button>
                  )}
                  <Button href="/contact" variant="secondary">
                    Discuss a project
                  </Button>
                </div>
              </FadeInView>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
