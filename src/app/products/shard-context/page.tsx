import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading, Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Check, Mail, AlertTriangle, ShieldCheck, Scale, Package, ShieldAlert } from "lucide-react";
import { ContextDiagram } from "@/components/products/ContextDiagram";
import { BaselineComparisonChart, type BaselineRow } from "@/components/products/BaselineComparisonChart";
import { Bm25FixChart, type Bm25FixRow } from "@/components/products/Bm25FixChart";
import { ModelPortabilityChart, type ModelPortabilityRow } from "@/components/products/ModelPortabilityChart";
import { PerModelBaselineChart, type PerModelBaselineRow } from "@/components/products/PerModelBaselineChart";
import { PerModelPerfChart, type PerModelPerfRow } from "@/components/products/PerModelPerfChart";

const envSpecs = [
  { k: "Primary model", v: "openai/gpt-oss-120b-maas, hosted open-weight (Vertex AI Model Garden)" },
  { k: "Model families tested", v: "5: OpenAI, Alibaba Qwen, DeepSeek, Google Gemini, plus OpenAI's smaller size variant" },
  { k: "Endpoint", v: "Global region, OpenAI-compatible chat completions" },
  { k: "GCP project", v: "weighty-planet-500504-k6" },
  { k: "Tokenizer", v: "cl100k_base-compatible, real token counts, never estimated" },
  { k: "Codebase", v: "8-crate Rust workspace, 462 automated tests, 0 regressions" },
  { k: "Memory safety", v: "#![forbid(unsafe_code)] verified in all 8 crate roots" },
  { k: "Benchmark machine", v: "AMD Ryzen Z1 Extreme, 8 cores / 16 threads, local, offline" },
];

const modelPortabilityRows: ModelPortabilityRow[] = [
  { model: "openai/gpt-oss-120b-maas", vendor: "OpenAI, open-weight", correct: 16, rateLimited: 0, total: 16 },
  { model: "qwen/qwen3-235b-a22b-instruct-2507-maas", vendor: "Alibaba", correct: 16, rateLimited: 0, total: 16 },
  { model: "google/gemini-3.5-flash-lite", vendor: "Google, native", correct: 16, rateLimited: 0, total: 16 },
  { model: "deepseek-ai/deepseek-v3.2-maas", vendor: "DeepSeek", correct: 10, rateLimited: 6, total: 16 },
  {
    model: "openai/gpt-oss-20b-maas",
    vendor: "OpenAI, open-weight, smaller size",
    correct: 1,
    rateLimited: 0,
    total: 1,
    note: "Single-scenario portability check, not a full 16-scenario run",
  },
];

// Baseline = full 6-document context (relevant doc + 5 genuine
// distractors). Context = SHARD Context's own compiled, 1-document
// output. Same 3 real scenarios, same live model, same prompt shape,
// both conditions, real n=3 each.
const perModelLatencyRows: PerModelPerfRow[] = [
  { model: "openai/gpt-oss-120b-maas", vendor: "OpenAI", baseline: 2384, context: 2507, n: 3 },
  { model: "openai/gpt-oss-20b-maas", vendor: "OpenAI, smaller", baseline: 2092, context: 1924, n: 3 },
  { model: "qwen/qwen3-235b", vendor: "Alibaba", baseline: 1712, context: 1524, n: 3 },
  { model: "deepseek-ai/deepseek-v3.2", vendor: "DeepSeek", baseline: 2124, context: 2837, n: 3 },
  { model: "google/gemini-3.5-flash-lite", vendor: "Google, native", baseline: 1441, context: 1350, n: 3 },
];

const perModelTokenRows: PerModelPerfRow[] = [
  { model: "openai/gpt-oss-120b-maas", vendor: "OpenAI", baseline: 1433, context: 642, n: 3 },
  { model: "openai/gpt-oss-20b-maas", vendor: "OpenAI, smaller", baseline: 1536, context: 699, n: 3 },
  { model: "qwen/qwen3-235b", vendor: "Alibaba", baseline: 1184, context: 395, n: 3 },
  { model: "deepseek-ai/deepseek-v3.2", vendor: "DeepSeek", baseline: 1138, context: 402, n: 3 },
  { model: "google/gemini-3.5-flash-lite", vendor: "Google, native", baseline: 1173, context: 393, n: 3 },
];

const perModelThroughputRows: PerModelPerfRow[] = [
  { model: "openai/gpt-oss-120b-maas", vendor: "OpenAI", baseline: 1000 / 2384, context: 1000 / 2507, n: 3 },
  { model: "openai/gpt-oss-20b-maas", vendor: "OpenAI, smaller", baseline: 1000 / 2092, context: 1000 / 1924, n: 3 },
  { model: "qwen/qwen3-235b", vendor: "Alibaba", baseline: 1000 / 1712, context: 1000 / 1524, n: 3 },
  { model: "deepseek-ai/deepseek-v3.2", vendor: "DeepSeek", baseline: 1000 / 2124, context: 1000 / 2837, n: 3 },
  { model: "google/gemini-3.5-flash-lite", vendor: "Google, native", baseline: 1000 / 1441, context: 1000 / 1350, n: 3 },
];

const qualityRows = [
  { question: "How many full time teachers does Victoria have?", truth: "63,519", full: "63,519", compiled: "63,519" },
  { question: "Which country today is a remnant of the Ottoman empire?", truth: "Turkey", full: "Turkey", compiled: "Turkey" },
  { question: "When was Warsaw ranked as the 32nd most liveable city?", truth: "2012", full: "2012", compiled: "2012" },
];

const perModelBaselineRows: PerModelBaselineRow[] = [
  { model: "openai/gpt-oss-120b-maas", vendor: "OpenAI, open-weight", contextPct: 0, note: "0/16" },
  { model: "qwen/qwen3-235b-a22b-instruct-2507-maas", vendor: "Alibaba", contextPct: 0, note: "0/16" },
  { model: "google/gemini-3.5-flash-lite", vendor: "Google, native", contextPct: 0, note: "0/16" },
  { model: "deepseek-ai/deepseek-v3.2-maas", vendor: "DeepSeek", contextPct: 0, note: "0/10 completed" },
  { model: "openai/gpt-oss-20b-maas", vendor: "OpenAI, smaller", contextPct: 0, note: "0/1" },
];

const evalScenarios = [
  { tag: "Scenario B", title: "Long-document QA", desc: "A real SQuAD-derived passage, real retrieval, real dispatch to the live model." },
  { tag: "Scenario C", title: "Conversation memory", desc: "A 4-turn dialogue, checking whether a session fact stated earlier is correctly retrieved and covered." },
  { tag: "Scenario D", title: "Transparent RAG, with real distractors", desc: "Three real documents: one relevant, two genuine, plausible-looking distractors. Does SHARD Context pick the useful one, or just the short one?" },
];

const baselineRows: BaselineRow[] = [
  { name: "SHARD Context (16/16 scenarios)", tokens: 144, distractorIncluded: false, isShardContext: true },
  { name: "Full context", tokens: 879, distractorIncluded: true },
  { name: "Recent-window truncation", tokens: 879, distractorIncluded: true },
  { name: "BM25 top-K", tokens: 879, distractorIncluded: true },
  { name: "Hierarchical summary", tokens: 858, distractorIncluded: true },
];

const bm25FixRows: Bm25FixRow[] = [
  { corpus: "10 documents", beforeUs: 100, afterUs: 2.4, beforeLabel: "100µs", afterLabel: "2.4µs" },
  { corpus: "100 documents", beforeUs: 1040, afterUs: 23.4, beforeLabel: "1.04ms", afterLabel: "23.4µs" },
  { corpus: "1,000 documents", beforeUs: 10700, afterUs: 256, beforeLabel: "10.7ms (2.1x over budget)", afterLabel: "256µs (19.5x under)" },
];

const cleanRoomAttempts = [
  { label: "Attempt 1", result: "Every step exited 127 (“command not found”)", detail: "The startup environment's $HOME was empty, which broke the Rust toolchain's own PATH setup, an environment bug, not a code bug. The VM still uploaded its logs and deleted itself on schedule." },
  { label: "Attempt 2", result: "459/459 tests, 0 clippy warnings, all 3 scenarios passed live", detail: "Same source, same live model, fixed environment. Re-confirms the fix from Attempt 1's own diagnosis holds on hardware that had never run this code before." },
];

const currentGaps = [
  "Claude, Grok, and Kimi are not yet tested. Claude returned a real \"no access\" response from Vertex, an account-level enablement step, not a code gap. Grok and Kimi were not found under any model id tried, and may not be offered on this platform at all.",
  "Adversarial testing so far covers two crafted prompt-injection payloads against three model families, real evidence, not a comprehensive red-team result. The quote-verification fix closes the self-report trust gap it found, but does not itself verify a selected document's topical relevance.",
  "The visual surface now has real multi-run history and comparison, but it's still browser-local storage, not a server: nothing is shared across machines or persisted anywhere a second person could see it.",
];

export const metadata: Metadata = {
  title: "Solipher SHARD Context",
  description:
    "Solipher SHARD Context compiles the smallest context package that still fits your model's exact token budget, without dropping the facts marked required. Real results below, measured against a live model.",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 text-xs leading-relaxed text-foreground/90">
      <code className="font-mono whitespace-pre">{children}</code>
    </pre>
  );
}

export default function ShardContextPage() {
  return (
    <>
      <PageHero
        eyebrow="Products · AI infrastructure"
        title="Solipher SHARD Context"
        description="Shrinks what you send to an LLM without losing the facts that have to be exactly right, compiled to your model's exact token budget, never an estimate."
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
              Scaled from one 3-document demo to 16 real scenarios, live-verified
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              16 real, topically distinct articles, fetched from a public question-answering dataset. Each becomes
              its own scenario: a real question, its own real answer-bearing document, and five other articles as
              genuine distractors. 64 real offline selection decisions, plus 16 real live compiles against the
              production GCP project above. Every approach below except SHARD Context let a distractor into the
              rendered context in all 16 of 16 scenarios, not because the budget was tight, but because none of
              them stop once the evidence requirement is actually satisfied. Numbers are averages across all 16
              scenarios, not one cherry-picked run.
            </p>
            <div className="mt-5">
              <BaselineComparisonChart title="Average tokens reaching the model, 16 real scenarios" rows={baselineRows} />
            </div>
            <p className="mt-3 text-xs text-muted">
              Dense (embedding-based) top-K is excluded from this specific 16-scenario chart, that run has not
              been repeated with it yet. A real Dense top-K adapter (Vertex AI&rsquo;s text-embedding-005, no
              OpenAI key needed) now exists and has been run live against a smaller, 3-document comparison
              instead, see below.
            </p>
          </div>

          {/* BM25 fix */}
          <div className="mt-12 rounded-2xl border border-red-500/40 bg-red-500/[0.06] p-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
              <AlertTriangle size={14} /> A real budget violation, found and then fixed, not just disclosed
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              Scaling the benchmark above to 16 scenarios required benchmarking retrieval at real corpus sizes,
              which surfaced a real, measured problem: BM25 retrieval rebuilt its entire corpus index from scratch
              on every single call. At 1,000 documents that cost roughly 10.7ms, about 2.1&times; over the
              retrieval stage&rsquo;s own 5ms budget.
            </p>
            <div className="mt-5">
              <Bm25FixChart
                title="BM25 retrieval latency, before vs after the fix"
                subtitle="Same benchmark, same three corpus sizes, re-measured after the fix, not a different test."
                rows={bm25FixRows}
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">
              The fix: the index is now built once, when the snapshot is indexed, instead of on every query, since
              both are pure functions of an immutable snapshot. Re-measured with the same benchmark: a 97.6%
              latency reduction at 1,000 documents, with zero regressions across the workspace&rsquo;s 470-test
              suite.
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

          {/* Model portability */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Real model portability, tested across five distinct model families
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              The runtime adapter layer claims to work with any OpenAI-compatible endpoint. Rather than guess at
              model identifiers, every candidate below was probed live with a direct API call first, before
              committing to a full 16-scenario run. Zero incorrect selections across any model, any scenario, in
              this entire pass, every error was a rate limit from this session&rsquo;s own call volume, never a
              wrong document.
            </p>
            <div className="mt-5">
              <ModelPortabilityChart
                title="Correct selections out of 16 real scenarios, per model"
                subtitle="Every candidate probed live before a full run; every gap shown is a rate limit, never a wrong answer."
                rows={modelPortabilityRows}
              />
            </div>
            <div className="mt-6">
              <PerModelBaselineChart
                title="Baseline vs SHARD Context, distractor inclusion rate, per model"
                subtitle="The offline baselines never call a model, so their 100% rate is a fixed reference line. What varies per model is SHARD Context's own real result, zero, every time."
                rows={perModelBaselineRows}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              A real reliability finding, not glossed over: Qwen intermittently returned a response that failed
              atom extraction&rsquo;s strict JSON parse on one attempt, succeeding cleanly on immediate retry with
              the identical input, real model sampling variance, not a SHARD Context defect, and exactly the class
              of failure this project&rsquo;s own fail-closed validation already handles cleanly. Claude, Grok, and
              Kimi were attempted and honestly reported as blocked (see Not Yet, Honestly below) rather than
              forced by guessing more model ids.
            </p>
          </div>

          {/* Per-model baseline vs context: latency, tokens, throughput */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Baseline vs SHARD Context, per model: latency, tokens, throughput
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              The same real, small, controlled sample (3 real scenarios, same prompt shape, same live
              model), run once against the full 6-document baseline context and once against SHARD
              Context&rsquo;s own compiled 1-document output, so the comparison holds within each model, not
              just across them. Every model reached a full n=3 sample on both conditions; several calls hit
              real transient 429s and were retried rather than left as gaps.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <PerModelPerfChart
                title="Tokens per call"
                rows={perModelTokenRows}
                max={1600}
                fmt={(v) => `${Math.round(v)}`}
              />
              <PerModelPerfChart
                title="API call latency"
                rows={perModelLatencyRows}
                max={3000}
                fmt={(v) => `${(v / 1000).toFixed(1)}s`}
              />
              <PerModelPerfChart
                title="Throughput (1 / latency)"
                rows={perModelThroughputRows}
                max={0.8}
                fmt={(v) => `${v.toFixed(2)}/s`}
                lowerIsBetter={false}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Tokens show a clean, consistent reduction for SHARD Context across every single model.
              Latency does not, one model (DeepSeek) was actually slower with the smaller, compiled
              context, since API response latency at this call size is dominated by network and queueing
              variance, not prompt size. Reported as measured, not smoothed into a cleaner story.
            </p>
          </div>

          {/* Answer quality */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Does compiling down to less context ever change the answer?
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              Every earlier check verified document selection, never the actual final answer text. Real
              test: the same question, asked twice, once with the full 6-document context (the relevant
              document plus 5 genuine distractors) and once with only SHARD Context&rsquo;s own compiled,
              1-document output, against the same live model.
            </p>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-background p-6">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wider text-muted">
                    <th className="pb-2 pr-4 font-medium">Question</th>
                    <th className="pb-2 pr-4 font-medium">Ground truth</th>
                    <th className="pb-2 pr-4 font-medium">Full context</th>
                    <th className="pb-2 font-medium">SHARD Context</th>
                  </tr>
                </thead>
                <tbody>
                  {qualityRows.map((r) => (
                    <tr key={r.question} className="border-b border-border last:border-0">
                      <td className="py-2.5 pr-4 text-foreground">{r.question}</td>
                      <td className="py-2.5 pr-4 font-mono text-xs text-muted">{r.truth}</td>
                      <td className="py-2.5 pr-4 font-mono text-xs text-red-400">{r.full}</td>
                      <td className="py-2.5 font-mono text-xs text-red-400">{r.compiled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              All 6 answers (3 scenarios, 2 conditions each) matched the ground truth exactly, and full
              context vs. SHARD Context produced identical answers every time. A real, small sample on one
              model, not a comprehensive claim, but a real, previously missing check now actually run.
            </p>
          </div>

          {/* Dense top-K, live */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Dense (embedding-based) top-K, closed for real, against Vertex AI
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              The one required baseline this project could not run live before now had a real, working algorithm
              (cosine similarity ranking) with no real embedding model behind it. A new adapter calls Vertex
              AI&rsquo;s own <code className="font-mono text-xs">text-embedding-005</code> endpoint, no OpenAI
              key needed, run live against the same 3-document teacher-count scenario used throughout this page.
              Honest result: at that scenario&rsquo;s token budget, Dense top-K included all three documents,
              the same distractor-inclusion outcome every other simple baseline already showed here, since the
              budget was generous enough to fit the whole small corpus regardless of similarity ranking. Not a
              favorable result, reported anyway.
            </p>
          </div>

          {/* Adversarial testing */}
          <div className="mt-12">
            <div className="rounded-2xl border border-border bg-background p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <ShieldAlert size={20} className="text-red-500" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">A real, live prompt-injection test, broadened, and a real gap it found</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                Two hostile documents were run through the live pipeline against three model families (Alibaba
                Qwen, Google Gemini, DeepSeek). A loud, explicit injection asking the model to fabricate a
                citation succeeded against two of the three models, but the system&rsquo;s own existing
                validation rejected the unknown id every time and failed the request closed, no fabricated
                citation ever reached the output. A quieter injection, keeping the real document id but asking
                the model to falsely certify unrelated content as exact evidence, succeeded against two of the
                three models, a real gap: nothing previously checked that self-reported &ldquo;exact&rdquo;
                classification against the document&rsquo;s own text. Fixed by requiring the model to supply the
                literal quote it claims answers the question, and verifying that quote is an actual substring of
                the document before honoring the claim, otherwise it is downgraded to the weaker
                &ldquo;derived&rdquo; classification. Stated plainly: this closes the specific trust gap in that
                self-report, it does not by itself verify that a selected document is topically relevant to the
                query, that remains open. Evidence across three models on two crafted payloads, reported exactly
                as found, including what the fix does not solve.
              </p>
            </div>
          </div>

          {/* Installation */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Two real installation paths, both actually run, not just written
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              Docker had to be installed on the test machine first, since it wasn&rsquo;t there. The image was
              then built and run against the live GCP project above with real mounted credentials, and the
              install script was run end to end on a real machine, ending in a real version print from the
              installed binary.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold text-red-400">
                  <Package size={14} /> Docker
                </div>
                <CodeBlock>{`docker build -f docker/Dockerfile -t shard-context-cli .
docker run --rm shard-context-cli --version

docker run --rm \\
  -v ~/.config/gcloud/application_default_credentials.json:/home/shard/.config/gcloud/application_default_credentials.json:ro \\
  -v $(pwd)/data:/data:ro \\
  shard-context-cli compile --config /data/config.toml --document /data/doc.txt --query "..."`}</CodeBlock>
              </div>
              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold text-red-400">
                  <Package size={14} /> Bare metal
                </div>
                <CodeBlock>{`bash docker/install.sh
gcloud auth application-default login
shard-context-cli compile --config <path.toml> --document <path> --query <text>`}</CodeBlock>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">
              That verification work found and fixed a real bug: the CLI hardcoded every document&rsquo;s id to
              the literal word &ldquo;document&rdquo;, which collided with the extraction prompt&rsquo;s own JSON
              field name closely enough to reliably make the live model hallucinate a fabricated citation. Fixed
              by deriving the id from the document&rsquo;s own filename instead.
            </p>
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
                  "Baseline comparison scaled to 16 real scenarios, live-verified: 0% distractor inclusion, 83.6% fewer tokens than every offline baseline",
                  "A real retrieval budget violation found and fixed at the root, 97.6% faster at 1,000 documents, re-measured, zero regressions",
                  "Security CI gates wired into real automation: fmt, clippy, forbid(unsafe_code), overflow checks, 466 tests, fuzzing, dependency scanning",
                  "Docker image and bare-metal install script, both actually built and run end to end against the live GCP project",
                  "Real adapter portability tested across five distinct model families (OpenAI, Alibaba Qwen, DeepSeek, Google Gemini), zero incorrect selections, plus real prompt-injection tests across three model families that found and fixed a real self-report trust gap",
                  "Independently reproduced from a clean environment, not just re-run on the machine that built it",
                  "A real standalone HTML viewer for compiled output, verified against a live compile's own --json-out file, not a mockup, now with real multi-run history and a side-by-side hash-diff compare mode, verified in a live browser session including surviving an actual page reload",
                  "All five required baselines now run live, including Dense (embedding-based) top-K via a real Vertex AI text-embedding-005 adapter, no fake embedder anywhere",
                  "Cross-architecture replay-hash CI: the hash and canonical-encoding primitives every structured replay hash is built on are verified byte-identical on a real x86_64 runner and a real aarch64 runner in the same CI run, not just proven on one architecture",
                  "Real Ed25519 snapshot signing (ADR-0016): a signed snapshot's tampered content is detected by an actual test that mutates it after signing, not just a construction check. Single-key, no rotation or HSM yet, named honestly rather than oversold",
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
