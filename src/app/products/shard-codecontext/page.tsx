import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading, Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Check, Mail, AlertTriangle, ShieldCheck, Scale } from "lucide-react";
import { CodeReductionChart, type CodeReductionRow } from "@/components/products/CodeReductionChart";
import { ApiFidelityChart, type ApiFidelityRow } from "@/components/products/ApiFidelityChart";
import { RoutingCostChart, type RoutingCostGroup } from "@/components/products/RoutingCostChart";

const envSpecs = [
  { k: "Model", v: "google/gemini-2.5-flash via Vertex AI, OpenAI-compatible endpoint" },
  { k: "GCP project", v: "weighty-planet-500504-k6" },
  { k: "Tokenizer", v: "cl100k_base, real token counts from the tokenizer, never estimated" },
  { k: "Benchmark repositories", v: "4 real open-source and internal repos: SHARD Context (Rust), ripgrep (Rust), Flask (Python), zod (TypeScript)" },
  { k: "Codebase", v: "4-crate Rust workspace, about 350 automated tests" },
  { k: "Continuous integration", v: "GitHub Actions, fmt, clippy -D warnings, full suite, and the benchmark re-measured on every push" },
  { k: "Languages supported", v: "Rust, Python, TypeScript, JavaScript" },
];

// Every row below is a real CI run against a real checkout. "One file" is the
// single most obviously relevant file for that task, pasted whole, which is what
// a developer or an agent actually does today.
const reductionRows: CodeReductionRow[] = [
  { name: "zod: $ZodCheckMultipleOf", lang: "ts", oneFile: 9665, compiled: 632 },
  { name: "zod: toJSONSchema", lang: "ts", oneFile: 6000, compiled: 580 },
  { name: "shard-context: diff-driven optional_fill", lang: "rs", oneFile: 7865, compiled: 1127 },
  { name: "ripgrep: printer summary output", lang: "rs", oneFile: 9091, compiled: 2333 },
  { name: "ripgrep: glob matcher", lang: "rs", oneFile: 10011, compiled: 4153 },
  { name: "shard-context: add a field to SourceSpan", lang: "rs", oneFile: 3983, compiled: 1712 },
  { name: "shard-context: small budget, same task", lang: "rs", oneFile: 2639, compiled: 1436 },
  { name: "flask: url_for external URLs", lang: "py", oneFile: 5691, compiled: 4527 },
  { name: "flask: AppContext teardown", lang: "py", oneFile: 4062, compiled: 4129 },
  { name: "flask: Config loading", lang: "py", oneFile: 2834, compiled: 2900 },
  { name: "shard-context: fix the BM25 IDF floor", lang: "rs", oneFile: 2639, compiled: 2716 },
];

// Six real tasks against the SHARD Context repository, same model, temperature 0,
// identical decoding settings in both arms. The only difference is whether the
// compiled repository slice was present.
const fidelityRows: ApiFidelityRow[] = [
  { task: "Make bm25_score IDF non-negative", bare: 0, withContext: 7, tracked: 7, bareLanguage: "Python" },
  { task: "Add max_selected to optional_fill", bare: 0, withContext: 7, tracked: 7, bareLanguage: "Python" },
  { task: "Add a field to SourceSpan", bare: 2, withContext: 7, tracked: 7, bareLanguage: "Rust" },
  { task: "Log-scale relevance_q", bare: 1, withContext: 4, tracked: 4, bareLanguage: "Python" },
  { task: "Add a separator in render_exact", bare: 1, withContext: 4, tracked: 6, bareLanguage: "Python" },
  { task: "Cap mandatory_cover at 8 atoms", bare: 1, withContext: 1, tracked: 5, bareLanguage: "Python" },
];

// Real usage returned by the API itself, not estimated. Output includes
// reasoning tokens, which the provider bills as output.
const routingGroups: RoutingCostGroup[] = [
  {
    task: "Write a memoized Fibonacci function",
    rows: [
      { approach: "Asked plainly, no handling", input: 21, output: 2044 },
      { approach: "Compiled repository context attached", input: 4617, output: 689 },
      { approach: "Routed to minimise, output constrained", input: 33, output: 954, isChosen: true },
    ],
  },
  {
    task: "Add memoization to factorial_recursive",
    rows: [
      { approach: "Asked plainly, no handling", input: 19, output: 1955 },
      { approach: "Compiled repository context attached", input: 4619, output: 1218 },
      { approach: "Routed to minimise, output constrained", input: 31, output: 834, isChosen: true },
    ],
  },
];

const languageSpread = [
  { lang: "TypeScript (zod)", mean: "91.9%", why: "Large files holding many small definitions, so extracting one discards almost everything" },
  { lang: "Rust (SHARD Context, ripgrep)", mean: "53.0%", why: "Mixed file sizes, mixed cohesion" },
  { lang: "Python (Flask)", mean: "6.2%", why: "Small, already-focused modules, so there is very little to discard" },
];

const bugsFound = [
  {
    title: "A bundle went over its own hard budget",
    detail:
      "The benchmark caught a 1,514-token bundle served against a 1,500-token budget. The solver only ever saw per-span costs, but the rendered request also carries the system contract and the task itself. Fixed by subtracting that envelope before budgeting, measuring each span's marginal rather than absolute cost, and re-measuring the finished bundle and withholding it if it still exceeds. The budget is now verified, not assumed.",
  },
  {
    title: "Most modern TypeScript was invisible",
    detail:
      "Benchmarking zod showed that an exported const arrow function was not treated as a definition, so a large part of a modern TypeScript codebase could not be seen at all. zod's own safeParse could not be resolved. A second defect: the dollar sign was treated as a word separator, making every $ZodCheck symbol unreachable. Both were invisible to hand-written test fixtures and only appeared against a real repository.",
  },
  {
    title: "Overloaded Python functions broke the compile",
    detail:
      "Benchmarking Flask surfaced that Python's @overload declares each signature separately plus the implementation, so one file held three definitions named stream_with_context. All three received the same internal identifier, and the solver correctly rejects duplicates, so any task touching that file failed outright. Fixed, and overloads in a single file are now treated as one symbol rather than an ambiguity.",
  },
  {
    title: "The compiler used to lose to simply pasting the file",
    detail:
      "On small files the compiled slice cost more than the whole file. bm25.rs lost by 21.8%. The compiler now compares against that baseline after compiling and sends the whole file when the file is genuinely cheaper, taking the worst case from 21.8% worse to 2.9% worse, which is the rendering envelope and irreducible if the output is to carry provenance.",
  },
];

const currentGaps = [
  "Task success is not measured. Every number on this page is about tokens and about whether the answer used the real API. Whether the resulting code actually passes the repository's own tests was never evaluated, and that is the metric a serious claim would need.",
  "The evaluation is 11 tasks across 4 repositories. That is enough to show the mechanism works and to expose real bugs, and nowhere near enough to generalize. A published result would need hundreds of tasks on a standard benchmark such as SWE-bench or RepoBench.",
  "No comparison against published retrieval baselines. There is no BM25-only, embedding-RAG, repo-map or prompt-compression arm, so the honest claim is against pasting a file, not against the state of the art.",
  "One model, one run per case, no variance reported. Everything was measured on gemini-2.5-flash at temperature 0.",
  "The task classifier that decides whether a request needs repository context is a hand-written word list. Every other component has measurements behind it; this one does not, and its miss rate on real prompts is unknown.",
  "The HTTP proxy is not production software. It serves one request at a time, has no metrics, no rate limiting, no TLS, no graceful shutdown, and keeps its run history only in memory, so a restart loses the audit trail. The command-line tool and the editor integration are the parts fit to use today.",
  "Latency numbers were measured locally and are not re-measured in CI, unlike the token numbers. They indicate the shape of the cost, not a reproducible result.",
  "Three languages, not more. Go, Java and C# are not implemented.",
  "The project depends on a private repository and carries no licence file, so it cannot currently be built or used by anyone outside this account.",
];

export const metadata: Metadata = {
  title: "Solipher SHARD CodeContext",
  description:
    "Solipher SHARD CodeContext compiles the minimal slice of a repository a coding task actually needs, under a hard token budget, with every span traceable to the reason it was included. Real measured results below.",
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 text-xs leading-relaxed text-foreground/90">
      <code className="font-mono whitespace-pre">{children}</code>
    </pre>
  );
}

export default function ShardCodeContextPage() {
  return (
    <>
      <PageHero
        eyebrow="Products · AI infrastructure"
        title="Solipher SHARD CodeContext"
        description="Compiles the smallest slice of your repository a coding task actually needs, under a hard token budget, with every line traceable to the reason it was included."
      />

      {/* What it is */}
      <section id="what-it-is" className="scroll-mt-24 py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="What it is" title="The problem, and what SHARD CodeContext actually does." />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">The problem</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                Ask a model to change code it cannot see and it will answer anyway. In our own measured
                run, five of six answers came back written in Python for a Rust repository, confidently
                describing an API that does not exist. The usual fix is to paste whole files, which works
                and costs thousands of tokens per request.
              </p>
            </div>
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400">The solution</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                SHARD CodeContext treats this as a constraint problem rather than a search problem. It
                works out which code the task genuinely requires, guarantees that code is present, fills
                the remaining budget with whatever else helps most, and refuses to answer at all rather
                than quietly return a slice that is missing something required.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Cuts at whole definitions, never mid-function, so every span it returns stands on its own",
              "The code your task names is a hard requirement, not a ranking, and it refuses rather than ship a slice missing it",
              "Token costs come from the real tokenizer against the exact rendered output, never an estimate",
              "Every span carries why it was included: which diff hunk, stack frame or symbol pinned it",
            ].map((f) => (
              <div
                key={f}
                className="flex gap-2.5 rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground/85"
              >
                <Check size={16} className="mt-0.5 shrink-0 text-red-500" />
                {f}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-display text-base font-semibold text-foreground">
              It also decides when to send nothing at all
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/90">
              Measuring the product honestly produced a result that changed its design. For a
              self-contained request like &ldquo;write a memoized Fibonacci function&rdquo;, attaching
              repository context costs about 4,600 extra input tokens and buys nothing, because the answer
              does not depend on your code at all. So requests are routed. If the task resolves to real
              code, it compiles. If it resolves to nothing, it sends no context and constrains the answer
              instead. If it is not a coding request at all, it passes through untouched, because forcing
              a code-only answer onto a question makes the answer worse rather than cheaper.
            </p>
            <div className="mt-5">
              <CodeBlock>{`codecontext compile --repo . --task "fix the IDF floor in bm25_score" --explain
  route: compile (task resolves to 1 span in this repository)
  bundle: 16 spans, 2995 tokens

codecontext compile --task "write a memoized fibonacci function"
  route: minimise (no repository supplied)
  no context compiled; max_output_tokens=2048, reasoning=low`}</CodeBlock>
            </div>
          </div>
        </Container>
      </section>

      {/* Real evidence */}
      <section id="evidence" className="scroll-mt-24 border-t border-border bg-surface py-20 sm:py-24">
        <Container>
          <Badge tone="red">Real repositories, re-measured by CI on every push</Badge>
          <h2 className="mt-4 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            The full evidence
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            Every number below comes from a real run against a real checkout, with token counts read from
            the tokenizer rather than estimated. The benchmark is not a fixture: continuous integration
            clones all four repositories and re-measures these figures on every push, so a regression in
            the compiler shows up as a failed build.
          </p>

          <div className="mt-10 rounded-2xl border border-red-500/40 bg-red-500/[0.06] p-6">
            <p className="flex items-center gap-2 font-display text-sm font-semibold text-red-400">
              <AlertTriangle size={14} /> Read this before the numbers below
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              These results measure tokens, and whether the answer used the repository&rsquo;s real API.
              They do not measure whether the code the model then wrote actually works. That is the
              metric that would matter most and it has not been evaluated. The sample is 11 tasks across
              4 repositories, which is enough to expose real bugs and not enough to generalize from.
              Three of the eleven cases are a small loss rather than a win, and they are shown here
              alongside the wins rather than dropped.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {envSpecs.map((s) => (
              <div key={s.k} className="rounded-xl border border-border bg-background p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{s.k}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{s.v}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <CodeReductionChart
              title="Tokens sent, compared against pasting the one relevant file"
              subtitle="11 real tasks, 4 repositories. The baseline is the single most obviously relevant file for that task, pasted whole, which is what a developer or a coding agent does today. Every case served a bundle with complete coverage of the code the task required."
              rows={reductionRows}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="font-display text-base font-semibold text-foreground">
                The result depends on how the codebase is written
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Averaged per language, the three disagree sharply, and the disagreement is the useful
                finding rather than a problem to smooth over.
              </p>
              <div className="mt-5 space-y-4">
                {languageSpread.map((l) => (
                  <div key={l.lang} className="border-t border-border pt-4 first:border-0 first:pt-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-xs font-semibold text-foreground">{l.lang}</span>
                      <span className="font-mono text-sm font-semibold text-red-400">{l.mean}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{l.why}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="font-display text-base font-semibold text-foreground">
                What that actually means
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                A tool that selects a slice can only save you as much as the file contained code your task
                did not need. zod&rsquo;s checks.ts is 1,293 lines of many small definitions, so pulling
                one out discards almost all of it: 632 tokens against 9,665. Flask&rsquo;s modules are
                small and cohesive, so there is very little to discard, and two of the three Flask cases
                land within 2.5% of simply sending the file.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                That is not a weakness in Python. It is a property of well-factored code, and the honest
                reading is that this product pays for itself on large or loosely-factored files and
                roughly breaks even on small ones. It detects that case and sends the whole file rather
                than spending your budget to lose.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <ApiFidelityChart
              title="Did the answer use the repository's real API?"
              subtitle="Six real tasks against the SHARD Context repository. Same model, temperature 0, identical decoding settings. The only difference is whether the compiled slice was present. Scored by how many of that task's real symbols the answer actually used."
              rows={fidelityRows}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-background p-6">
            <h3 className="font-display text-base font-semibold text-foreground">
              The counting understates it
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/90">
              On the last task both arms score 1 out of 5, so by symbol count they look equal. They are
              not. Without context the model produced a Python class with a Pydantic validator, for a Rust
              codebase. With context it produced this:
            </p>
            <div className="mt-4">
              <CodeBlock>{`--- a/contracts/src/policy.rs
+++ b/contracts/src/policy.rs
-pub const MAX_MANDATORY_ATOMS: usize = 12;
+pub const MAX_MANDATORY_ATOMS: usize = 8;`}</CodeBlock>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/90">
              Correct constant, correct file, correct value, 182 bytes. Five of the six no-context answers
              were written in the wrong language entirely.
            </p>
          </div>

          <div className="mt-8">
            <RoutingCostChart
              title="When context is the wrong answer"
              subtitle="Real token usage returned by the API, for two self-contained tasks that do not depend on any repository. Output includes reasoning tokens, which are billed as output. Attaching context costs about 4,600 input tokens and buys nothing; routing the request away from the compiler and constraining the answer instead is cheaper than both alternatives."
              groups={routingGroups}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/[0.06] p-6">
            <p className="flex items-center gap-2 font-display text-sm font-semibold text-red-400">
              <AlertTriangle size={14} /> Four real bugs the benchmarks found, and what was done about them
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              None of these were visible to hand-written test fixtures. They appeared only once the
              compiler was pointed at real repositories, which is the argument for benchmarking against
              real code rather than examples written to pass.
            </p>
            <div className="mt-5 space-y-5">
              {bugsFound.map((b) => (
                <div key={b.title} className="border-t border-red-500/20 pt-4 first:border-0 first:pt-0">
                  <p className="font-mono text-xs font-semibold text-red-400">{b.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">{b.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Current status */}
      <section id="status" className="scroll-mt-24 border-t border-border bg-background py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Current status"
            title="What's real today, and what isn't yet."
            description="The command-line tool and the editor integration are genuinely usable. The HTTP proxy is a correct demonstration, not a service you should deploy. Both things are true, and the difference matters more than a single readiness label would."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <ShieldCheck size={20} className="text-red-500" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Real today</h3>
              <ul className="mt-3 space-y-2.5">
                {[
                  "A working compiler, not a prototype: repository walk with real safety filters, syntax-aware chunking at definition boundaries, a symbol index with a one-hop dependency graph, mandatory-atom extraction, and a budget-bounded selection stage, all with real test coverage",
                  "11 real tasks across 4 real repositories in Rust, Python and TypeScript, all served with complete coverage of the code each task required, re-measured by CI on every push rather than quoted from a fixture",
                  "Answer quality measured against a live model, not asserted from architecture: with the compiled slice present the answer used the repository's real API in every case, and without it five of six answers came back in the wrong programming language",
                  "A hard token budget that is verified rather than assumed. The finished bundle is re-measured after rendering and withheld if it exceeds, which is how a real 1,514-against-1,500 budget violation was caught and fixed",
                  "Deterministic output: the same repository, task and budget produce byte-identical results, verified against a real repository where filesystem ordering is the thing most likely to break it",
                  "Refuses rather than guesses. An ambiguous symbol reports every match instead of picking one, a budget too small to cover the required code abstains instead of returning a partial slice, and a task that resolves to nothing is routed away from the compiler rather than given irrelevant context",
                  "A persistent, per-file index so an edited file is the only thing re-processed, plus an optional watcher that absorbs that work in the background, taking the call right after an edit from 423ms to 190ms on a real repository",
                  "Secret redaction before any code is stored or sent, covering cloud keys, private key headers, tokens and obvious credential assignments, with a deliberately narrow, high-precision rule set rather than a claim of complete coverage",
                  "An editor integration over the Model Context Protocol, driven end to end over a real connection, which tells an agent honestly when a task needs no repository context instead of returning a pointless slice",
                  "An OpenAI-compatible HTTP endpoint, live-verified against a real model, with authentication, per-tenant access control checked twice per request, signed output, and a startup refusal to bind to a public address without a token configured",
                  "Four real defects found by benchmarking against real repositories and fixed at the root, each with a regression test, rather than a claim of first-try correctness",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-foreground/85">
                    <Check size={16} className="mt-0.5 shrink-0 text-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6">
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
      <section id="get-involved" className="scroll-mt-24 border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Design partner program"
            title="Looking for repositories to be wrong about."
            description="The most useful thing right now is a codebase this has not seen. Every real repository pointed at it so far has produced a real bug, and the language results say the benefit depends heavily on how a codebase is written, which is exactly the kind of claim that needs more than four repositories behind it."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="mailto:contact@solipherlabs.in" variant="primary">
              <Mail size={16} /> Talk to us
            </Button>
            <Button href="/products" variant="secondary">
              All products
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
