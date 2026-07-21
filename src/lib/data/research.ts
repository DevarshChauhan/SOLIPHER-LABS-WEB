export type ResearchStatus = "published" | "in-progress";

export interface ResearchProject {
  slug: string;
  codename: string;
  domain: string;
  status: ResearchStatus;
  statusLabel: string;
  problem: string;
  scale: string;
  impact: string[];
  keywords: string[];
}

export const researchProjects: ResearchProject[] = [
  {
    slug: "h-plhf-core",
    codename: "H-PLHF-Core",
    domain: "High-performance data infrastructure",
    status: "published",
    statusLabel: "Original research, patent-backed",
    problem:
      "Systems that need fast exact lookups, priority-ranked retrieval, and ordered range queries over the same data, under a hard resource budget, usually have to choose between one general-purpose structure that's mediocre at all three, or three separate systems that drift out of sync with each other.",
    scale: "Validated across 1,414 real benchmark runs on production-grade cloud hardware. No simulated results.",
    impact: [
      "Concurrent throughput scales from 54.8k to 1.83M operations per second across 1–64 threads, overtaking common alternative approaches once real contention kicks in.",
      "Adds no measurable overhead on 11 of 13 tested workload patterns.",
      "Builds a queryable snapshot 5.7×–12.5× faster than alternative approaches, with a disclosed trade-off on a different metric depending on deployment pattern.",
    ],
    keywords: ["high-performance infrastructure", "resource-bounded systems", "data structures"],
  },
  {
    slug: "sharp-wce-v2",
    codename: "SHARP-WCE",
    domain: "Medical imaging",
    status: "published",
    statusLabel: "Original research, patent-backed",
    problem:
      "A single capsule-endoscopy study produces 50,000–80,000 images per patient, and reviewing that volume is the acknowledged bottleneck of the diagnostic method. The open question isn't just which frames look abnormal, it's how to retain, rank, and triage that volume under real memory and storage limits without losing a defensible record of every decision.",
    scale: "Evaluated on 47,161 labelled frames across 43 real patient studies, against six alternative approaches.",
    impact: [
      "Which of two comparably-trained scoring models feeds the system swings the flagged-for-review rate by more than 40 percentage points, a dependency our system makes visible and measurable instead of hiding it.",
      "Full data-durability guarantees cost 45.8%–48.4% latency overhead, reduced substantially once batched.",
      "A common alternative approach shows a 200×–500× tail-latency spike at the 99.9th percentile that is completely invisible if you only check the average.",
    ],
    keywords: ["medical imaging", "resource-bounded systems", "selective prediction"],
  },
  {
    slug: "sharp-serve",
    codename: "SHARP-Serve",
    domain: "AI inference infrastructure",
    status: "published",
    statusLabel: "Original research, patent-backed",
    problem:
      "Production LLM inference clusters running above roughly 60% memory utilization face a scheduling problem, not a modeling one: when a request's cached context has been evicted to slower memory, the system has to decide whether recovery can finish before that request's deadline, before admitting it to the next processing batch. Existing schedulers admit optimistically and only discover a missed deadline after the request has already run.",
    scale: "Validated bare-metal on a 192-core cloud instance: 60 distinct thread-scaling configurations (4 test types × 15 thread counts from 8–384), each the mean of 5 independent runs (300 total runs), plus 13 further configurations comparing against production-style baseline strategies.",
    impact: [
      "Zero unsafe (deadline-missing) admissions across every one of those 300 thread-scaling runs and all 13 baseline-comparison configurations, where a comparable aggressive-transfer baseline let through up to 40% unsafe admissions under tight deadlines.",
      "Measured peak throughput of 863,000 scheduling decisions per second, with near-linear scaling from 8 to roughly 96 threads on a 192-core machine before gracefully leveling off under 2× oversubscription. No cliff, no correctness loss.",
      "Matches a theoretical best-case scheduler (perfect resource foreknowledge) in success rate at deadlines of 6ms or looser, with no throughput penalty for the added safety guarantee.",
      "Fairness verified under concurrency: per-thread success-rate variance stayed at floating-point noise levels (under 10⁻¹⁴) across the entire 8–384 thread sweep. No tenant or thread is systematically shortchanged under load.",
    ],
    keywords: ["AI inference infrastructure", "resource-bounded systems", "admission control", "SLO scheduling"],
  },
  {
    slug: "sharp-flow",
    codename: "SHARP-Flow",
    domain: "Network security",
    status: "in-progress",
    statusLabel: "Active R&D, not yet published",
    problem:
      "Detecting and mitigating intrusions at line rate needs the same fast-lookup, priority-ranking, and resource-budgeting problem our infrastructure research already solves elsewhere, applied to live network traffic instead of stored data.",
    scale: "Core validation work is complete; traffic-scale benchmarking has not started.",
    impact: [],
    keywords: ["network security", "resource-bounded systems"],
  },
];
