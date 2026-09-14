import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading, Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeInView } from "@/components/ui/FadeInView";
import { site } from "@/lib/data/site";
import {
  Cpu,
  BrainCircuit,
  Gauge,
  HeartPulse,
  GraduationCap,
  Code2,
  Mail,
  ArrowRight,
  FileCheck2,
  ClipboardCheck,
  Hammer,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Work on real algorithm engineering, systems infrastructure, AI inference, and research implementation at Solipher Labs, on live problems, not a tutorial track.",
};

const tracks = [
  {
    icon: Cpu,
    title: "Algorithm & Data Structure Engineering",
    description: "Work alongside the team building the custom components behind our own products, under real latency and memory constraints.",
  },
  {
    icon: BrainCircuit,
    title: "AI / ML Development",
    description: "Model development, fine-tuning, and evaluation pipeline work, measured against real data, not a leaderboard benchmark.",
  },
  {
    icon: Gauge,
    title: "High-Performance Systems",
    description: "Admission control, concurrency, and bounded-latency infrastructure, the same discipline behind SHARD Gateway.",
  },
  {
    icon: HeartPulse,
    title: "Medical Imaging Pipelines",
    description: "Frame triage and retention pipeline work for high-frame-volume imaging, evaluated on real clinical data.",
  },
  {
    icon: GraduationCap,
    title: "Research Implementation & Benchmarking",
    description: "Support live engagements implementing and benchmarking designs for professors, master's students, and PhD candidates.",
  },
  {
    icon: Code2,
    title: "Web & App Development",
    description: "Ship real features on real client applications, from architecture through deployment, with production code review.",
  },
] as const;

const process = [
  {
    icon: FileCheck2,
    title: "Apply with what you've built",
    description: "Send your resume and anything you've built or measured yourself. We read every application ourselves; there's no automated filter.",
  },
  {
    icon: ClipboardCheck,
    title: "A short technical conversation",
    description: "One conversation about how you think through a real problem, not a whiteboard trivia round.",
  },
  {
    icon: Hammer,
    title: "Work on a real engagement",
    description: "You're placed on an actual product, client, or research engagement from day one, with a specific, scoped piece of it as your responsibility.",
  },
  {
    icon: BarChart3,
    title: "Leave with a measured result",
    description: "Not a certificate of attendance: a specific thing you built or measured, that you can point to and explain.",
  },
] as const;

export default function InternshipsPage() {
  const applyHref = `mailto:${site.email}?subject=${encodeURIComponent("Internship application")}`;

  return (
    <>
      <PageHero
        eyebrow="Internships"
        title="Work on the real problem, not a simulated version of it."
        description="Solipher Labs takes on a small number of interns at a time, placed directly on live products, client engagements, and research-implementation work. No busywork track, no simulated dataset standing in for the real one."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Tracks"
            title="What you'd actually work on."
            description="Every track below maps to work we're doing right now, not a curriculum built for interns specifically."
          />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track, i) => {
              const Icon = track.icon;
              return (
                <FadeInView key={track.title} index={i} className="rounded-2xl border border-border bg-surface p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5">
                    <Icon size={20} className="text-red-500" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{track.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{track.description}</p>
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
              <SectionHeading eyebrow="What this actually is" title="Placed on real work, from day one." />
              <div className="mt-6 space-y-5 text-base leading-relaxed text-muted">
                <p>
                  We&rsquo;re a small, founder-led R&amp;D team, not a training program that happens to
                  use real-sounding words. An internship here means a specific, scoped piece of an
                  actual engagement: a product feature, a benchmark run, a client deliverable, is yours
                  to own, with direct review from the engineer responsible for that work.
                </p>
                <p>
                  That includes our research-implementation engagements. If you&rsquo;re a student
                  working alongside us on that track, you&rsquo;ll help build and measure designs for
                  professors and PhD candidates under the same standard we hold ourselves to: real runs,
                  on real hardware, reported honestly.
                </p>
              </div>
            </div>
            <aside className="space-y-6">
              <FadeInView index={0} y={16}>
                <div className="rounded-2xl border border-border bg-background p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Format</h3>
                  <p className="mt-2 text-sm text-foreground">Short or long-term, in step with your academic calendar.</p>
                </div>
              </FadeInView>
              <FadeInView index={1} y={16}>
                <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400">What you leave with</h3>
                  <p className="mt-2 text-sm text-foreground">A real, shipped or measured piece of work, and a reference from the person who reviewed it.</p>
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
              No fixed cohort dates. We hire in small, specific bursts.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Tell us which track you&rsquo;re interested in and what you&rsquo;ve built or measured so
              far. If a real spot on a live engagement fits, we&rsquo;ll reach out directly, we don&rsquo;t
              run a generic applicant pipeline.
            </p>
            <Button href={applyHref} external className="mt-6">
              <Mail size={14} /> Apply for an internship <ArrowRight size={14} />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
