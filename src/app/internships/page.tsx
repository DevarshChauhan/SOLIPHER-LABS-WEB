import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading, Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeInView } from "@/components/ui/FadeInView";
import { site } from "@/lib/data/site";
import { internshipDomains, applyFormUrl } from "@/lib/data/internships";
import {
  Globe,
  Smartphone,
  Braces,
  Coffee,
  Binary,
  BrainCircuit,
  Network,
  BarChart3,
  Cloud,
  Palette,
  Megaphone,
  ArrowUpRight,
  ArrowRight,
  FileCheck2,
  ClipboardCheck,
  Hammer,
  Award,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Internship programs at Solipher Labs across web development, app development, Python, Java, C++, AI, machine learning, data science, cloud computing, UI/UX design, and digital marketing.",
};

const domainIcons: Record<string, LucideIcon> = {
  "web-development": Globe,
  "android-app-development": Smartphone,
  "python-programming": Braces,
  "java-programming": Coffee,
  "cpp-programming": Binary,
  "artificial-intelligence": BrainCircuit,
  "machine-learning": Network,
  "data-science": BarChart3,
  "cloud-computing": Cloud,
  "ui-ux-design": Palette,
  "digital-marketing": Megaphone,
};

const process = [
  {
    icon: FileCheck2,
    title: "Fill out the application form",
    description: "Pick your domain and tell us what you've built so far. We read every application ourselves; there's no automated filter.",
  },
  {
    icon: ClipboardCheck,
    title: "A short conversation",
    description: "One conversation about how you think through a real problem, not a whiteboard trivia round.",
  },
  {
    icon: Hammer,
    title: "Build real projects",
    description: "You're given real work in your chosen domain from the first week, with review from an engineer who does it professionally.",
  },
  {
    icon: Award,
    title: "Finish with proof",
    description: "A completion certificate, and more importantly the projects themselves, which you can show and explain to an employer.",
  },
] as const;

export default function InternshipsPage() {
  const applyHref =
    applyFormUrl || `mailto:${site.email}?subject=${encodeURIComponent("Internship application")}`;

  return (
    <>
      <PageHero
        eyebrow="Internship Program"
        title="Learn by building the real thing."
        description="Solipher Labs runs internship programs across eleven domains. Every one of them is built the same way: real projects, reviewed by a working engineer, finished with something you can show an employer and explain."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Internship domains"
            title="Pick the track you want to work in."
            description="Eleven domains, each with its own projects, tooling, and mentor. Open any one to see exactly what you'd be building."
          />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {internshipDomains.map((domain, i) => {
              const Icon = domainIcons[domain.slug] ?? Globe;
              return (
                <FadeInView key={domain.slug} index={i}>
                  <Link
                    href={`/internships/${domain.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-red-500/40"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5">
                      <Icon size={20} className="text-red-500" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-foreground">{domain.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{domain.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-red-400">
                      View program <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </FadeInView>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionHeading eyebrow="What this actually is" title="Real work, reviewed by people who do it professionally." />
              <div className="mt-6 space-y-5 text-base leading-relaxed text-muted">
                <p>
                  Solipher Labs is a working R&amp;D lab, not a training institute. The engineers reviewing your
                  work spend the rest of their week building the products and client systems on this site, and
                  they hold intern work to a version of the same standard: it has to actually work, and you have
                  to be able to explain why it works.
                </p>
                <p>
                  That means the feedback is direct. If something you built is wrong, you will be told it is
                  wrong and why, which is the entire point. You finish with projects you genuinely built and
                  understand, rather than a certificate attesting that you attended.
                </p>
              </div>
            </div>
            <aside className="space-y-5">
              <FadeInView index={0} y={16}>
                <div className="rounded-2xl border border-border bg-background p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Format</h3>
                  <p className="mt-2 text-sm text-foreground">Remote, short or long-term, scheduled around your academic calendar.</p>
                </div>
              </FadeInView>
              <FadeInView index={1} y={16}>
                <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400">On completion</h3>
                  <p className="mt-2 text-sm text-foreground">A certificate, your finished projects, and a reference from the engineer who reviewed your work.</p>
                </div>
              </FadeInView>
            </aside>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="How it works" title="Four steps, no black box." />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => {
              const Icon = step.icon;
              return (
                <FadeInView key={step.title} index={i} className="rounded-2xl border border-border bg-surface p-6">
                  <span className="font-display text-sm font-semibold text-red-400">{String(i + 1).padStart(2, "0")}</span>
                  <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5">
                    <Icon size={20} className="text-red-500" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                </FadeInView>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <div className="rounded-3xl border border-red-500/30 bg-red-500/[0.04] p-8 sm:p-10">
            <Badge tone="red">Applications open</Badge>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              No fixed cohort dates. Apply whenever you&rsquo;re ready.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Pick the domain you want to work in, tell us what you&rsquo;ve built so far, and we&rsquo;ll get
              back to you directly. We take a small number of interns per domain at a time.
            </p>
            <Button href={applyHref} external className="mt-6">
              Apply Now <ArrowRight size={14} />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
