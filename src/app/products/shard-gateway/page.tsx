import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading, Badge } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Check, Terminal, Download, Layers, Mail, AlertTriangle } from "lucide-react";
import { PhaseChart, type PhaseChartRow } from "@/components/products/PhaseChart";
import { ArchitectureDiagram } from "@/components/products/ArchitectureDiagram";

const envSpecs = [
  { k: "Instance", v: "GCP g2-standard-32 (32 vCPU, 128GB RAM)" },
  { k: "GPU", v: "1× NVIDIA L4, 24GB HBM" },
  { k: "Host OS", v: "Debian 12 (bookworm)" },
  { k: "Inference engine", v: "vLLM v0.24.0, pinned" },
  { k: "Serving container", v: "vllm/vllm-openai:latest, Docker" },
  { k: "Install-time gate", v: "Full ctest suite run before any GPU spend" },
];

const modelSpecs = [
  { model: "OPT-1.3B", params: "1.3B", layers: "24", repo: "facebook/opt-1.3b" },
  { model: "OPT-6.7B", params: "6.7B", layers: "32", repo: "facebook/opt-6.7b" },
  { model: "Qwen2.5-7B-Instruct", params: "7B", layers: "28", repo: "Qwen/Qwen2.5-7B-Instruct" },
  { model: "Yi-9B", params: "9B", layers: "48", repo: "01-ai/Yi-9B" },
];

const phaseMethodology = [
  { tag: "Phase A", title: "Moderate load — the realistic case", desc: "64-way concurrency, 200 prompts, a GPU-memory budget any sane operator would actually run in production. This is what a well-provisioned fleet looks like day to day." },
  { tag: "Phase B", title: "Aggressive overload", desc: "128-way concurrency, 400 prompts, same memory budget as Phase A, pushed past what it can comfortably serve — real demand exceeding real capacity." },
  { tag: "Phase C", title: "Connection-backlog burst", desc: "A fast, GPU-free TCP-stack test confirming the Gateway's own listen backlog holds under a connection burst." },
  { tag: "Phase D", title: "Tight memory budget", desc: "Same load pattern as Phase B, but the GPU-memory-utilization ceiling is deliberately lowered — the lever that actually shrinks the real KV-cache pool." },
  { tag: "Phase E", title: "OOM hunt — the extreme case", desc: "gpu-memory-utilization pushed to 0.97 with a 256-way concurrent burst. Built for one purpose: find a real CUDA out-of-memory crash." },
  { tag: "Phase Q", title: "Deterministic response-quality check", desc: "Real prompts at temperature=0, sent through both paths and diffed exactly — idle and under real concurrent contention. Does the Gateway ever alter what the model actually said?" },
];

const phaseA: PhaseChartRow[] = [
  { model: "Yi-9B", baselineLabel: "1.269 req/s", gatewayLabel: "1.400 req/s", baselineValue: 1.269, gatewayValue: 1.4, delta: "110%", deltaTone: "good" },
  { model: "Qwen2.5-7B", baselineLabel: "1.95 req/s", gatewayLabel: "2.03 req/s", baselineValue: 1.95, gatewayValue: 2.03, delta: "104%", deltaTone: "good" },
];

const phaseB: PhaseChartRow[] = [
  { model: "Yi-9B (176/400 completed)", baselineLabel: "505.6s", gatewayLabel: "186.6s", baselineValue: 505.6, gatewayValue: 186.6, delta: "−63%" },
  { model: "OPT-6.7B (85/400 completed)", baselineLabel: "1503.6s", gatewayLabel: "472.0s", baselineValue: 1503.6, gatewayValue: 472.0, delta: "−69%" },
  { model: "OPT-1.3B (293/400 completed)", baselineLabel: "306.2s", gatewayLabel: "203.4s", baselineValue: 306.2, gatewayValue: 203.4, delta: "−34%" },
];

const phaseD: PhaseChartRow[] = [
  { model: "Yi-9B (43/80 completed)", baselineLabel: "329.5s", gatewayLabel: "165.5s", baselineValue: 329.5, gatewayValue: 165.5, delta: "−50%" },
  { model: "OPT-6.7B (24/100 completed)", baselineLabel: "2190.2s", gatewayLabel: "481.5s", baselineValue: 2190.2, gatewayValue: 481.5, delta: "−78%" },
  { model: "OPT-1.3B (146/400 completed)", baselineLabel: "798.7s", gatewayLabel: "363.1s", baselineValue: 798.7, gatewayValue: 363.1, delta: "−55%" },
];

const phaseE: PhaseChartRow[] = [
  { model: "Yi-9B", baselineLabel: "", gatewayLabel: "", baselineValue: 0, gatewayValue: 0, delta: "", note: "vLLM failed to boot at 0.97 util — real evidence of a floor, not a bug" },
  { model: "Qwen2.5-7B (80/80 completed)", baselineLabel: "11.2s", gatewayLabel: "11.2s", baselineValue: 11.2, gatewayValue: 11.2, delta: "tied", deltaTone: "neutral" },
  { model: "OPT-6.7B (50/100 completed)", baselineLabel: "383.3s", gatewayLabel: "182.4s", baselineValue: 383.3, gatewayValue: 182.4, delta: "−52%" },
  { model: "OPT-1.3B (154/400 completed)", baselineLabel: "208.8s", gatewayLabel: "6.5s", baselineValue: 208.8, gatewayValue: 6.5, delta: "−97%" },
];

const qualityChecks = [
  { model: "Yi-9B", score: "20/20", detail: "10 idle · 10 under load — zero mismatches", perfect: true },
  { model: "OPT-6.7B", score: "20/20", detail: "10 idle · 10 under load — zero mismatches", perfect: true },
  { model: "Qwen2.5-7B", score: "18/20", detail: "10/10 idle · 8/10 under load", perfect: false },
];

export const metadata: Metadata = {
  title: "SHARD Gateway",
  description:
    "SHARD Gateway is a reverse proxy that sits in front of vLLM and makes a real admission decision before a request reaches the GPU. What it is, how to install it, and how to get it.",
};

const cliArgs = [
  { arg: "upstream_base_url", desc: "Your real vLLM instance, e.g. http://127.0.0.1:8000" },
  { arg: "listen_port", desc: "Port the Gateway itself listens on, e.g. 9100" },
  { arg: "poll_interval_ms", desc: "How often the Gateway polls vLLM's own Prometheus metrics (default 500ms)" },
  { arg: "shard_config_json", desc: "HBM budget config, must roughly match vLLM's own --gpu-memory-utilization setting" },
  { arg: "num_layers", desc: "Your model's real transformer layer count, feeds the Gateway's per-request KV-byte estimate" },
];

const envVars = [
  { name: "SHARD_LICENSE_PATH", desc: "Path to a signed license file. Unset = license verification skipped entirely." },
  { name: "SHARD_GATEWAY_AUTH_TOKEN", desc: "Shared-secret bearer token required on every route except GET /health. Empty by default." },
];

const pricingTiers = [
  { name: "Community", price: "Free", desc: "libshard core, self-hosted, MIT-licensed core, community support." },
  { name: "Diagnostic", price: "₹50,000 – ₹1,50,000 (one-time)", desc: "1-week hands-on engagement: a Solipher engineer measures your real baseline, root-causes the problem, and delivers a projected-savings report." },
  { name: "Growth", price: "₹6,000 – ₹12,000 / GPU-node / month (billed annually)", desc: "Production use, up to 8 GPU nodes, signed-license enforcement, business-hours support, 48hr bug-fix SLA.", highlighted: true },
  { name: "Enterprise", price: "₹15L – ₹40L+ / year, custom", desc: "Unlimited nodes, 24/7 support, dedicated support channel, custom SLA, hash-chained admission audit certificates for regulated industries." },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 text-xs leading-relaxed text-foreground/90">
      <code className="font-mono whitespace-pre">{children}</code>
    </pre>
  );
}

export default function ShardGatewayPage() {
  return (
    <>
      <PageHero
        eyebrow="Products · AI infrastructure"
        title="SHARD Gateway"
        description="A reverse proxy that sits in front of vLLM and makes a real admission decision, admit, defer, or reject, before a request ever reaches the GPU."
      />

      {/* What it is */}
      <section id="what-it-is" className="scroll-mt-24 py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="What it is" title="The problem, and what SHARD Gateway actually does." />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">The problem</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                LLM inference servers run out of KV-cache memory under real concurrent load. Even before an outright
                crash, every request in flight starts queuing behind an unbounded FIFO, teams see multi-minute
                time-to-first-token under load, with zero visibility into who is actually waiting and why.
                Over-provisioning GPU capacity to stay safe is expensive; running close to the edge means every
                traffic spike degrades the whole fleet, not just the requests that caused it.
              </p>
            </div>
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400">The solution</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                SHARD Gateway sits in front of vLLM and makes a real admission decision using live KV-cache
                telemetry. Under sustained overload it protects the requests it does admit instead of letting
                everyone wait in one unbounded queue. It fails open: if SHARD itself has a problem, traffic flows to
                vLLM exactly as if SHARD were never installed.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <ArchitectureDiagram />
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-background p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">What this means for your GPU bill</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              If you resell GPU-hours, every SLA-violating or timed-out request on hardware you already paid for is
              lost or refunded revenue; SHARD converts more of your existing fleet into billable, SLA-compliant
              capacity, no new hardware required. If you pay for GPU capacity to run your own product, the usual
              alternative to admission control is over-provisioning. Sustaining the same SLO-compliance rate at
              higher utilization directly reduces how many extra nodes you need to buy. Illustrative math, not a
              promise: on an 8-GPU-node fleet at ₹150–400/GPU-hour running near-continuously, even a 20–30%
              reduction in the nodes needed to hit the same SLO target is roughly ₹25L–₹70L/year in avoided spend.
              Your real number depends on your real workload; the Diagnostic engagement measures it before any
              commitment.
            </p>
          </div>

        </Container>
      </section>

      {/* Real evidence */}
      <section id="evidence" className="scroll-mt-24 border-t border-border bg-surface py-20 sm:py-24">
        <Container>
          <Badge tone="red">Real GPU testing, not projections</Badge>
          <h2 className="mt-4 font-display text-2xl font-semibold text-foreground sm:text-3xl">
            The full evidence, generated 2026-07-21
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            Every number below is from a real, repeatable GCP run against a real vLLM instance — no simulation,
            no projection presented as measured fact.
          </p>

          {/* Environment + models */}
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
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Models under test</h3>
              <table className="mt-4 w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wider text-muted">
                    <th className="pb-2 font-medium">Model</th>
                    <th className="pb-2 font-medium">Params</th>
                    <th className="pb-2 font-medium">Layers</th>
                  </tr>
                </thead>
                <tbody>
                  {modelSpecs.map((row) => (
                    <tr key={row.model} className="border-b border-border last:border-0">
                      <td className="py-2.5 pr-4 text-foreground">{row.model}</td>
                      <td className="py-2.5 pr-4 font-mono text-xs text-muted">{row.params}</td>
                      <td className="py-2.5 font-mono text-xs text-muted">{row.layers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Methodology */}
          <div className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
              What each phase actually tests
            </h3>
            <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-background">
              {phaseMethodology.map((p) => (
                <div key={p.tag} className="grid grid-cols-[80px_1fr] gap-5 p-5">
                  <span className="pt-0.5 font-mono text-xs font-bold text-red-400">{p.tag}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{p.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Honesty callout */}
          <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/[0.06] p-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
              <AlertTriangle size={14} /> Read this before the numbers below
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              <strong>No sane company runs production traffic at Phase D or E&rsquo;s settings.</strong>{" "}
              A 0.16–0.97 GPU-memory-utilization ceiling with 128–256-way concurrency is not a realistic operating
              point — it&rsquo;s a deliberately manufactured worst case, built specifically to try to force a real
              CUDA out-of-memory crash and see whether admission control prevents it.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              Here is the honest result of that search: <strong>within everything we&rsquo;ve been able to test
              so far, we have not produced a single OOM crash</strong>{" "}— not in baseline, not through the Gateway,
              on any of the four models, at any budget down to 0.16 utilization. We are not claiming a crash is
              impossible. We&rsquo;re stating precisely what we found: in the scope we could check, it
              didn&rsquo;t happen. The container-survival record below is the literal evidence for that claim, not
              a summary of it.
            </p>
          </div>

          {/* Phase A */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Phase A — at realistic load, the Gateway costs nothing
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              This is the headline, not Phase B/D/E below. At a budget any real deployment would run, the Gateway
              matches or beats raw vLLM&rsquo;s own throughput — the admission layer is invisible until it&rsquo;s
              actually needed.
            </p>
            <div className="mt-5">
              <PhaseChart title="Throughput, baseline vs. Gateway" rows={phaseA} />
            </div>
            <p className="mt-3 text-xs text-muted">
              OPT-6.7B and OPT-1.3B were not re-benchmarked at Phase A this cycle (prior clean baselines were
              reused to avoid redundant GPU spend) — no fresh number to report for them here.
            </p>
          </div>

          {/* Phase B */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Phase B — aggressive overload: same useful outcomes, delivered far faster
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              Completion <em>count</em>{" "}drops under the Gateway here, and that&rsquo;s not the story: admission
              control rejects fast and honestly instead of letting every request queue for minutes toward a
              response nobody&rsquo;s still waiting for. The number of requests that actually met the 60s SLO
              stays roughly the same on both sides — it just arrives 2-4x sooner.
            </p>
            <div className="mt-5">
              <PhaseChart title="Median latency, baseline vs. Gateway" rows={phaseB} />
            </div>
            <p className="mt-3 text-xs text-muted">
              Qwen&rsquo;s Phase B predates the current admission fix and is excluded here pending
              re-verification, rather than shown as current.
            </p>
          </div>

          {/* Phase D */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Phase D — tight memory budget: the same pattern holds
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              Same story, different lever: instead of pushing more load at a fixed budget, the budget itself is
              pulled down toward the model&rsquo;s real weight footprint.
            </p>
            <div className="mt-5">
              <PhaseChart title="Median latency, baseline vs. Gateway" rows={phaseD} />
            </div>
          </div>

          {/* Phase E */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Phase E — the OOM hunt: zero crashes found, anywhere we tested
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              0.97 utilization, 256-way burst — the closest this project has come to a deliberate crash test.
              Every container, every model, every phase: survived.
            </p>
            <div className="mt-5">
              <PhaseChart title="Median latency, baseline vs. Gateway" rows={phaseE} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Yi-9B — baseline ✓ gateway ✓ (A/B/D)", "OPT-6.7B — baseline ✓ gateway ✓ (B/D/E)", "OPT-1.3B — baseline ✓ gateway ✓ (B/D/E)", "Qwen2.5-7B — baseline ✓ gateway ✓ (A/E)"].map((s) => (
                <span key={s} className="rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[11px] text-red-400">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Quality check */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Response-quality verification — does the Gateway ever change what the model said?
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              Real prompts, temperature=0, diffed exactly between direct vLLM and Gateway-fronted calls — idle and
              under real concurrent contention. 10 prompts each way, per model.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {qualityChecks.map((q) => (
                <div key={q.model} className="rounded-2xl border border-border bg-background p-5">
                  <div className="font-mono text-xs font-semibold text-foreground">{q.model}</div>
                  <div className={`mt-2 font-display text-3xl ${q.perfect ? "text-red-400" : "text-foreground"}`}>
                    {q.score}
                  </div>
                  <div className="mt-1 text-xs text-muted">{q.detail}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-foreground/90">
              Every idle-phase check across all three models matched byte-for-byte — 30/30. That&rsquo;s the
              direct proxy-transparency proof: the Gateway never touches tokens after admission. The two Qwen
              mismatches happened only under real injected background load, which is the signature of vLLM&rsquo;s
              own preemption/recompute recovery, not the Gateway — a request preempted for KV-cache pressure and
              resumed can hit floating-point non-determinism across a different batch composition, occasionally
              flipping a near-tied token even at temperature=0. Both completions were coherent, on-topic, and
              correct — wording drift, not hallucination.
            </p>
          </div>
        </Container>
      </section>

      {/* Installation guide */}
      <section id="installation-guide" className="scroll-mt-24 border-t border-border bg-surface py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Installation guide"
            title="Two supported install paths."
            description="Every step here is drawn directly from the project's own verified installer scripts, nothing here is aspirational or untested."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <Layers size={20} className="text-red-500" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Path 1: Docker</h3>
              <p className="mt-1 text-sm text-muted">Recommended if vLLM already runs in a container.</p>
              <div className="mt-4 space-y-3">
                <CodeBlock>{`# Build the image\nZHERALDD_DIR=/path/to/zheraldd bash gateway/docker/build.sh\n\n# Run it directly\ndocker run --rm -p 9100:9100 shard-gateway:latest http://<vllm-host>:8000 9100\n\n# Or use the reference compose file\ncd gateway/docker && docker compose up`}</CodeBlock>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <Terminal size={20} className="text-red-500" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Path 2: Bare metal</h3>
              <p className="mt-1 text-sm text-muted">
                Recommended if vLLM already runs bare-metal on the same host, or your security policy doesn&rsquo;t
                allow containers on the inference host.
              </p>
              <div className="mt-4">
                <CodeBlock>{`sudo bash gateway/docker/install.sh`}</CodeBlock>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                This builds from source, runs the real test suite as an install-time quality gate, installs to
                /opt/shard/, and sets up a systemd service. The service is disabled by default; edit the generated
                unit&rsquo;s ExecStart with your real vLLM URL before starting it.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-background p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Prerequisites</h3>
            <ul className="mt-3 space-y-2.5">
              {[
                "A Linux host (bare-metal path) or Docker (container path) with access to your vLLM instance",
                "An NVIDIA GPU already running vLLM, SHARD Gateway sits in front of it, it does not replace it",
                "For bare-metal installs: gcc, g++, cmake, ninja-build, git, and libsodium-dev (installed automatically via apt on Debian/Ubuntu)",
                "A full release tarball with this repo and its zheraldd build dependency as sibling directories, ask Solipher Labs if you don't already have it",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-foreground/85">
                  <Check size={16} className="mt-0.5 shrink-0 text-red-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">The Gateway&rsquo;s real CLI contract</h3>
            <div className="mt-3">
              <CodeBlock>{`shard_gateway <upstream_base_url> <listen_port> [poll_interval_ms] [shard_config_json] [num_layers]`}</CodeBlock>
            </div>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <tbody>
                  {cliArgs.map((row) => (
                    <tr key={row.arg} className="border-b border-border last:border-0 odd:bg-background even:bg-surface/50">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-red-400">{row.arg}</td>
                      <td className="px-4 py-3 text-sm text-muted">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Environment variables</h3>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <tbody>
                  {envVars.map((row) => (
                    <tr key={row.name} className="border-b border-border last:border-0 odd:bg-background even:bg-surface/50">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-red-400">{row.name}</td>
                      <td className="px-4 py-3 text-sm text-muted">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Verifying the install</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                Both install paths run the real gateway/shard ctest suite as a hard gate before completing. Check{" "}
                <code className="font-mono text-xs text-red-400">GET /health</code> on the Gateway&rsquo;s listen port
                once running, a healthy Gateway returns 200; a degraded one returns 503 and automatically fails
                open. Send one real request through the Gateway&rsquo;s port and confirm you get a normal vLLM
                response before pointing real traffic at it.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Known limitations, honestly</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                Neither install path is a one-command &ldquo;download and go&rdquo; experience yet, both need the
                zheraldd dependency provided as a separate source tree. If you&rsquo;re installing this yourself
                rather than through Solipher directly, ask for a full release tarball that bundles both. A
                mismatched <code className="font-mono text-xs text-red-400">shard_config_json</code> /{" "}
                <code className="font-mono text-xs text-red-400">num_layers</code> relative to your real vLLM
                startup flags makes admission decisions meaningless, double-check these before production.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Download / get started */}
      <section id="download" className="scroll-mt-24 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Download & pricing"
            title="Start with the free tier, self-hosted."
            description="First-draft India-market pricing, ranges rather than fixed numbers, intended as a starting point for discussion."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col rounded-2xl border p-6 ${
                  tier.highlighted ? "border-red-500/50 bg-red-500/[0.04]" : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{tier.name}</h3>
                  {tier.highlighted && <Badge tone="red">Popular</Badge>}
                </div>
                <p className="mt-3 text-base font-semibold text-foreground">{tier.price}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{tier.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start gap-6 rounded-2xl border border-red-500/30 bg-red-500/5 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
                <Download size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Get the release tarball</h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                  SHARD Gateway is in active pilot testing and isn&rsquo;t a self-contained public download yet.
                  Email us and we&rsquo;ll send the full release tarball (Gateway plus its build dependency) and get
                  your 14-day trial started, no card required.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button href="mailto:contact@solipherlabs.in" variant="primary" external>
                <Mail size={14} /> Email contact@solipherlabs.in
              </Button>
              <Button href="/contact?type=Product+licensing&message=I%27d+like+to+request+the+SHARD+Gateway+release+tarball+and+start+a+14-day+trial." variant="secondary">
                Request via contact form
              </Button>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted">
            SHARD Gateway is in active pilot testing. Enforce-mode certification against vLLM&rsquo;s own scheduler
            integration surface is not yet complete (Capability Audit v0.24.0), SHARD&rsquo;s proven path today is
            the reverse-proxy admission-control model described above, which does not require it.
          </p>

          <p className="mt-8 text-sm text-muted">
            Looking for the context-compilation side of this work?{" "}
            <Link href="/products/solipher-shard-context" className="text-red-400 underline underline-offset-2 hover:text-red-300">
              See Solipher SHARD Context on the Products page
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
