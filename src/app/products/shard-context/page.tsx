import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading, Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Check, Mail, AlertTriangle, ShieldCheck, Scale } from "lucide-react";
import { ContextDiagram } from "@/components/products/ContextDiagram";
import { BaselineComparisonChart, type BaselineRow } from "@/components/products/BaselineComparisonChart";

const envSpecs = [
  { k: "Model", v: "openai/gpt-oss-120b, hosted open-weight (Vertex AI Model Garden)" },
  { k: "Endpoint", v: "Global region, OpenAI-compatible chat completions" },
  { k: "Tokenizer", v: "cl100k_base-compatible, real token counts, never estimated" },
  { k: "Codebase", v: "8-crate Rust workspace, ~18,100 lines, 459 automated tests" },
  { k: "Memory safety", v: "#![forbid(unsafe_code)] verified in all 8 crate roots" },
  { k: "Clean-room host", v: "GCE e2-small, Debian 12, self-destructing after the run" },
];

const evalScenarios = [
  { tag: "Scenario B", title: "Long-document QA", desc: "A real SQuAD-derived passage, real retrieval, real dispatch to the live model." },
  { tag: "Scenario C", title: "Conversation memory", desc: "A 4-turn dialogue, checking whether a session fact stated earlier is correctly retrieved and covered." },
  { tag: "Scenario D", title: "Transparent RAG, with real distractors", desc: "Three real documents: one relevant, two genuine, plausible-looking distractors. Does SHARD Context pick the useful one, or just the short one?" },
];

const baselineRows: BaselineRow[] = [
  { name: "SHARD Context", tokens: 126, distractorIncluded: false, isShardContext: true },
  { name: "Full context", tokens: 416, distractorIncluded: true },
  { name: "Recent-window truncation", tokens: 416, distractorIncluded: true },
  { name: "BM25 top-K", tokens: 416, distractorIncluded: true },
  { name: "Hierarchical summary", tokens: 405, distractorIncluded: true },
];

const cleanRoomAttempts = [
  { label: "Attempt 1", result: "Every step exited 127 (“command not found”)", detail: "The startup environment's $HOME was empty, which broke the Rust toolchain's own PATH setup — an environment bug, not a code bug. The VM still uploaded its logs and deleted itself on schedule." },
  { label: "Attempt 2", result: "459/459 tests, 0 clippy warnings, all 3 scenarios passed live", detail: "Same source, same live model, fixed environment. Re-confirms the fix from Attempt 1's own diagnosis holds on hardware that had never run this code before." },
];

const currentGaps = [
  "No published latency benchmarks yet — the core solvers are provably cheap at their current caps, but nothing has been measured and published as a number.",
  "Retrieval isn't yet tuned for large corpora — correct and fast at evaluation scale, no caching story yet for production-size document sets.",
  "Snapshot integrity is hash-based, not cryptographically signed — tamper-evident today, not tamper-proof against an adversary who controls both the data and its hash.",
  "Security CI gates (dependency scanning, fuzzing) are specified in policy, not yet wired into automated CI.",
  "Dense (embedding-based) retrieval comparison needs a hosted embedding model we haven't wired up yet — excluded from the results below rather than faked.",
];

export const metadata: Metadata = {
  title: "Solipher SHARD Context",
  description:
    "Solipher SHARD Context compiles the smallest context package that still fits your model's exact token budget, without dropping the facts marked required. Real results below, measured against a live model.",
};

export default function ShardContextPage() {
  return (
    <>
      <PageHero
        eyebrow="Products · AI infrastructure"
        title="Solipher SHARD Context"
        description="Shrinks what you send to an LLM without losing the facts that have to be exactly right — compiled to your model's exact token budget, never an estimate."
      />

      {/* What it is */}
      <section id="what-it-is" className="scroll-mt-24 py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="What it is" title="The problem, and what SHARD Context actually does." />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">The problem</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                LLM applications routinely send far more context into a model than a given request needs, full
                documents, entire conversation histories, every retrieved source, because trimming it down risks
                silently dropping the one detail that has to be exactly correct.
              </p>
            </div>
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400">The solution</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                SHARD Context compiles the smallest context package that still fits your model&rsquo;s exact token
                budget, without dropping the facts marked as required. Most context-reduction tools compress
                everything the same way; this one distinguishes a fact that can be paraphrased from one that
                can&rsquo;t.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <ContextDiagram />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-4">
            {[
              "Critical facts always keep an exact, traceable source, never a summary standing in alone",
              "Fits the request to the real token budget of your specific model and template, not an estimate",
              "Falls back to the original, unmodified request rather than silently guessing when it can't guarantee correctness",
              "Runs locally next to your application, your data doesn't have to leave your infrastructure",
            ].map((f) => (
              <div key={f} className="flex gap-2.5 rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground/85">
                <Check size={16} className="mt-0.5 shrink-0 text-red-500" />
                {f}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Real evidence */}
      <section id="evidence" className="scroll-mt-24 border-t border-border bg-surface py-20 sm:py-24">
        <Container>
          <Badge tone="red">Real Vertex AI testing, not simulation</Badge>
          <h2 className="mt-4 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            The full evidence, generated 2026-07-22
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            Every number below is from a real run against a live, hosted open-weight model, plus a second,
            independent clean-room reproduction on a self-destructing cloud VM, no simulation, no projection
            presented as measured fact.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="overflow-x-auto rounded-2xl border border-border bg-background p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Test environment</h3>
              <table className="mt-4 w-full min-w-[420px] border-collapse text-sm">
                <tbody>
                  {envSpecs.map((row) => (
                    <tr key={row.k} className="border-b border-border last:border-0">
                      <td className="py-2.5 pr-4 text-muted">{row.k}</td>
                      <td className="py-2.5 font-mono text-xs text-foreground">{row.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border bg-background p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">What each scenario tests</h3>
              <div className="mt-4 divide-y divide-border">
                {evalScenarios.map((s) => (
                  <div key={s.tag} className="grid grid-cols-[76px_1fr] gap-4 py-3 first:pt-0 last:pb-0">
                    <span className="pt-0.5 font-mono text-xs font-bold text-red-400">{s.tag}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Honesty callout */}
          <div className="mt-10 rounded-2xl border border-red-500/40 bg-red-500/[0.06] p-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
              <AlertTriangle size={14} /> Read this before the numbers below
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              Scenario D&rsquo;s distractor-rejection check was written to <strong>fail</strong> if SHARD Context
              pulled an irrelevant document into context. <strong>It did fail, on the first live run.</strong>{" "}
              Investigation found two stacked bugs in the optional-fill scorer: relevance was being normalized
              against the wrong candidate pool, and there was no minimum-relevance floor, so a document could
              occupy budget purely for being &ldquo;least-bad among leftovers.&rdquo;
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              Both were fixed, and the fix was re-confirmed against the live model. That&rsquo;s the result in the
              chart below, not a claim it worked on the first try, the honest record of what it took to get there.
            </p>
          </div>

          {/* Baseline comparison */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Compared against the required baselines, same corpus, same query, same budget
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              One relevant document, two genuine distractors, a 4,000-token budget. Every other approach let a
              distractor into the rendered context, at roughly 3.3&times; the token cost, not because the budget
              was tight (there was plenty of room to include everything, and every other approach did), but
              because none of them stop once the evidence requirement is actually satisfied.
            </p>
            <div className="mt-5">
              <BaselineComparisonChart title="Tokens reaching the model" rows={baselineRows} />
            </div>
            <p className="mt-3 text-xs text-muted">
              Dense (embedding-based) top-K is intentionally excluded here, it needs a hosted embedding model we
              haven&rsquo;t wired up against Vertex AI yet, a named gap, not worked around with a fake embedder.
            </p>
          </div>

          {/* Clean-room reproduction */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Independently reproduced on a machine that had never run this code before
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              A fresh, ephemeral cloud VM was given only the source code, told to build it, test it, and run the
              same live evaluation, then upload its own logs and delete itself, no human touching the machine
              after creation.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {cleanRoomAttempts.map((a) => (
                <div key={a.label} className="rounded-2xl border border-border bg-background p-5">
                  <div className="font-mono text-xs font-semibold text-red-400">{a.label}</div>
                  <div className="mt-2 text-sm font-semibold text-foreground">{a.result}</div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{a.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Current status, honestly */}
      <section id="status" className="scroll-mt-24 border-t border-border bg-surface py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Current status"
            title="What's real today, and what isn't yet."
            description="This is implemented and measured against a live workload, not a specification anymore. It also isn't finished. Both things are true at once."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <ShieldCheck size={20} className="text-red-500" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Real today</h3>
              <ul className="mt-3 space-y-2.5">
                {[
                  "A working, tested compiler pipeline, not a prototype: ingestion, retrieval, scoring, mandatory-cover and optional-fill solvers, structural firewall, all with real test coverage",
                  "Run end to end against a live, hosted model across three distinct evaluation scenarios",
                  "A real bug found via adversarial testing and fixed, then re-verified live, twice",
                  "Independently reproduced from a clean environment, not just re-run on the machine that built it",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-foreground/85">
                    <Check size={16} className="mt-0.5 shrink-0 text-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <Scale size={20} className="text-red-500" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Not yet, honestly</h3>
              <ul className="mt-3 space-y-2.5">
                {currentGaps.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-foreground/85">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Get involved */}
      <section id="get-involved" className="scroll-mt-24 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Design partner program"
            title="Get in before the general benchmark."
            description="For teams who want early access to a measured, working implementation, and input into what gets evaluated next."
          />

          <div className="mt-10 flex flex-col items-start gap-6 rounded-2xl border border-red-500/30 bg-red-500/5 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <Mail size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Register interest as a design partner</h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                  Direct engineering access, input into what gets evaluated next, and first access once benchmarked
                  against your own workload.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button href="mailto:contact@solipherlabs.in" variant="primary" external>
                <Mail size={14} /> Email contact@solipherlabs.in
              </Button>
              <Button href="/contact?type=Product+licensing&message=I%27d+like+to+register+interest+as+a+design+partner+for+SHARD+Context." variant="secondary">
                Request via contact form
              </Button>
            </div>
          </div>

          <p className="mt-8 text-sm text-muted">
            Looking for the broader admission-control side of the AI infrastructure line?{" "}
            <Link href="/products/shard-gateway" className="text-red-400 underline underline-offset-2 hover:text-red-300">
              See SHARD Gateway
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
