import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading, Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeInView } from "@/components/ui/FadeInView";
import { site } from "@/lib/data/site";
import { internshipDomains, getInternshipDomain, applyFormUrl } from "@/lib/data/internships";
import {
  Check,
  ArrowRight,
  Hammer,
  Users,
  FolderGit2,
  CalendarClock,
  MessagesSquare,
  GraduationCap,
  Repeat,
  Code2,
} from "lucide-react";

const whyThisProgram = [
  {
    icon: Hammer,
    title: "You build, from day one",
    description: "There is no classroom phase. You are given something real to build in your first week, and you build it.",
  },
  {
    icon: MessagesSquare,
    title: "Reviewed by a working engineer",
    description: "Your work goes through review by someone who does this professionally, and you get told what is wrong with it.",
  },
  {
    icon: FolderGit2,
    title: "Portfolio you can show",
    description: "You finish with projects you can put in front of an employer and explain line by line, not a certificate alone.",
  },
  {
    icon: CalendarClock,
    title: "Flexible around your studies",
    description: "Short or long-term, remote, and scheduled around your academic calendar rather than against it.",
  },
];

const whoShouldApply = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Studying computer science or an adjacent field and want experience that looks like real work, not coursework.",
  },
  {
    icon: Repeat,
    title: "Career changers",
    description: "Moving into tech from somewhere else and need hands-on experience to make the move credible.",
  },
  {
    icon: Code2,
    title: "Self-taught developers",
    description: "You have taught yourself the basics and want structure, review, and honest feedback on where you actually stand.",
  },
];

export function generateStaticParams() {
  return internshipDomains.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const domain = getInternshipDomain(slug);
  if (!domain) return {};
  return {
    title: `${domain.name} Internship`,
    description: domain.heroDescription,
  };
}

export const dynamicParams = false;

export default async function InternshipDomainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const domain = getInternshipDomain(slug);
  if (!domain) notFound();

  const applyHref =
    applyFormUrl ||
    `mailto:${site.email}?subject=${encodeURIComponent(`Internship application - ${domain.name}`)}`;

  const otherDomains = internshipDomains.filter((d) => d.slug !== domain.slug).slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow="Internship Program"
        title={`${domain.name} Internship`}
        description={domain.heroDescription}
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">
            <div>
              <SectionHeading eyebrow="The program" title={`What the ${domain.name} track is.`} />
              <div className="mt-6 space-y-5 text-base leading-relaxed text-muted">
                {domain.overview.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">What you&rsquo;ll work with</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {domain.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-red-500/30 bg-red-500/5 px-3.5 py-1.5 text-sm text-foreground/85"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.04] p-6">
                <Badge tone="red">Applications open</Badge>
                <h3 className="mt-4 text-base font-semibold text-foreground">Apply for this track</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Tell us what you&rsquo;ve built so far. We read every application ourselves.
                </p>
                <Button href={applyHref} external className="mt-5 w-full">
                  Apply Now <ArrowRight size={14} />
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">What you leave with</h3>
                <ul className="mt-3 space-y-2.5">
                  {domain.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-2.5 text-sm text-foreground/85">
                      <Check size={16} className="mt-0.5 shrink-0 text-red-500" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="What you'll build"
            title="Three real projects, not three tutorials."
            description="Every project below produces something that works and that you can explain. They are scoped to be finished, not to look impressive on a syllabus."
          />
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {domain.projects.map((project, i) => (
              <FadeInView key={project.title} index={i} className="flex flex-col rounded-2xl border border-border bg-background p-7">
                <span className="font-display text-sm font-semibold text-red-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-base font-semibold text-foreground">{project.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{project.description}</p>
              </FadeInView>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Why this program" title="What makes it worth your time." />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {whyThisProgram.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeInView key={item.title} index={i} className="rounded-2xl border border-border bg-surface p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5">
                    <Icon size={20} className="text-red-500" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                </FadeInView>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Who should apply" title="Who this track is built for." />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {whoShouldApply.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeInView key={item.title} index={i} className="rounded-2xl border border-border bg-surface p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5">
                    <Icon size={20} className="text-red-500" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                </FadeInView>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-20 sm:py-24">
        <Container>
          <div className="rounded-3xl border border-red-500/30 bg-red-500/[0.04] p-8 sm:p-10">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-red-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">How to apply</span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Fill out the application form and tell us what you&rsquo;ve built.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Include anything you&rsquo;ve built, broken, or measured yourself, a repo, a project, a course you finished.
              We care more about what you&rsquo;ve actually attempted than where you&rsquo;re studying. There are no fixed
              cohort dates; we take a small number of interns per track at a time.
            </p>
            <Button href={applyHref} external className="mt-6">
              Apply Now <ArrowRight size={14} />
            </Button>
          </div>

          <div className="mt-14">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Other internship domains</h3>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {otherDomains.map((other) => (
                <Button key={other.slug} href={`/internships/${other.slug}`} variant="secondary">
                  {other.name}
                </Button>
              ))}
              <Button href="/internships" variant="secondary">
                All domains <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
