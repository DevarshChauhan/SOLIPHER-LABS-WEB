export interface CaseStudy {
  slug: string;
  title: string;
  domain: string;
  challenge: string;
  outcome: string;
  results: string[];
  researchSlug: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "hplhf-core",
    title: "Replacing three unsynchronized data stores with one engine",
    domain: "High-performance infrastructure",
    challenge:
      "A system needed fast exact lookups, priority-ranked retrieval, and ordered range queries over the same data, under a hard resource budget, without running three separate stores that drift out of sync.",
    outcome:
      "Solipher Index (built from this research) now covers all three access patterns from one engine with a fixed, predictable resource ceiling, validated on production-grade cloud hardware.",
    results: [
      "1,407 of 1,414 real benchmark runs completed exactly as intended",
      "Throughput scaled from 54.8k to 1.83M ops/s across 1–64 concurrent threads",
      "Overtook common alternative approaches once real contention kicked in",
    ],
    researchSlug: "h-plhf-core",
  },
  {
    slug: "sharp-wce-v2",
    title: "Triaging 47,161 capsule-endoscopy frames under a fixed budget",
    domain: "Medical imaging",
    challenge:
      "A wireless capsule endoscopy study produces 50,000–80,000 images per patient. The bottleneck wasn't classifier accuracy, it was retaining, ranking, and triaging that volume under real memory and storage limits with a defensible decision record.",
    outcome:
      "Solipher Triage (built from this research) now handles that triage layer, evaluated on the public Kvasir-Capsule dataset against six alternative approaches.",
    results: [
      "Scoring-model choice alone swung the flagged-for-review rate by more than 40 percentage points",
      "Full durability guarantees measured at 45.8–48.4% latency overhead, reduced substantially once batched",
      "A common alternative approach showed a 200–500× tail-latency spike invisible at the average",
    ],
    researchSlug: "sharp-wce-v2",
  },
];
