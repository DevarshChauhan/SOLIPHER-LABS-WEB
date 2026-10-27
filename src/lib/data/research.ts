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
    codename: "SHARP-Core",
    domain: "High-performance data infrastructure",
    status: "in-progress",
    statusLabel: "Patent filed, manuscript in preparation",
    problem:
      "Systems that need fast exact lookups, priority-ranked retrieval, and ordered range queries over the same data, under a hard resource budget, usually have to choose between one general-purpose structure that's mediocre at all three, or three separate systems that drift out of sync with each other. And when a budgeted index refuses an insert, it rarely records whether the budget or the structure itself was the cause.",
    scale: "Five benchmark campaigns on cloud virtual machines, the last two with paired trials. 2,120 of 2,120 trials completed in the latest campaign. Microbenchmarks only.",
    impact: [
      "The admission check costs 5–10 ns per put-heavy operation under identical dispatch, and at most 2 ns on read-mostly workloads.",
      "Every refusal is attributed to one cause: in one budget sweep, 8.9 million refusals came from the budget and 16 from the probe bound, with every deferred put accounted for.",
      "The ordered plane returns ranges of 10,000 keys or more 1.2–7× faster than an STX B+-tree, ALEX and PGM-index, at 15–36% more peak memory. Learned indexes still win point and short-range queries.",
      "A finding that changed the design: the original owner-thread hand-off cost 78–312× the latency of the same logic run inline, and per-shard locking beat it 6–86× under concurrency, so per-shard locking is now the recommended default. libcuckoo remains up to 1.9× faster while cores are available.",
    ],
    keywords: ["high-performance infrastructure", "admission control", "data structures"],
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
    slug: "prism-cvm",
    codename: "PRISM-CVM",
    domain: "Security",
    status: "in-progress",
    statusLabel: "Under review, SN Computer Science",
    problem:
      "Confidential virtual machines on AMD SEV-SNP and Intel TDX hide guest memory from the host, which removes the view that hypervisor-level malware detectors rely on. The open question is whether the disk-request metadata the host must still serve (address, size, direction, time) is enough to detect ransomware.",
    scale: "Evaluated on 530 runs of the public RanSMAP dataset with run-disjoint splits, plus request logging inside real SEV-SNP and TDX cloud guests running benign workloads.",
    impact: [
      "AUROC 0.981 on the same hardware and 0.966 on hardware never seen in training: level with intrusive memory-based features, and better on the unseen machine.",
      "A three-of-five alarm rule caught every ransomware run on the unseen hardware, with 4 of 60 benign runs alarmed.",
      "Block-request locality survives in-guest disk encryption, and a host-side collector saw every byte of guest block traffic at no measurable cost.",
      "Stated limits: held-out REvil and WannaCry were detected in only 50% and 59% of runs, a held-out benign program raised alarms in 66% of its runs, and the dataset authors' published F-scores are not beaten.",
    ],
    keywords: ["confidential computing", "ransomware detection", "security"],
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
