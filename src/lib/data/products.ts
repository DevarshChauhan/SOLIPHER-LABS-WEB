export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  problem: string;
  solution: string;
  impact: string;
  features: string[];
  enterpriseBenefits: string[];
  pricing: PricingTier[];
  status: "available" | "early-access";
  statusLabel: string;
}

export const products: Product[] = [
  {
    slug: "solipher-shard",
    name: "Solipher SHARD",
    tagline: "Keeps an AI inference stack predictable when demand spikes.",
    category: "AI infrastructure",
    problem:
      "LLM and other model-serving stacks tend to degrade unpredictably under load. Requests queue silently, latency climbs, and by the time it's visible to an operator, users have already felt it.",
    solution:
      "Solipher SHARD sits in front of your existing serving stack and makes overload a visible, predictable event instead of a silent one, deciding whether a request can meet its deadline before admitting it, not after.",
    impact:
      "The admission-control core is bare-metal validated: zero deadline-missing admissions across 300 thread-scaling runs and 13 baseline-comparison configurations, versus up to 40% unsafe admissions from a comparable aggressive-transfer baseline under tight deadlines, at a measured peak of 863,000 scheduling decisions per second. Live production-traffic integration is in active validation with design partners now; see Research for the full numbers.",
    features: [
      "Sits in front of existing model-serving stacks, no rewrite required",
      "Makes overload visible and attributable instead of silent",
      "Decides admission before the deadline is at risk, not after it's missed",
      "Configurable to your own resource budget, not a fixed default",
    ],
    enterpriseBenefits: [
      "Predictable latency under peak demand, without over-provisioning GPU capacity",
      "Clear operational visibility into why a request was rejected",
      "Drops into an existing stack without a serving-layer rewrite",
    ],
    pricing: [
      {
        name: "14-Day Trial",
        price: "Free",
        description: "Run it against your own serving stack for two weeks, enough time to see real traffic, not a synthetic demo.",
        features: ["Full engine access", "Direct engineering support during the trial", "No commitment required"],
        cta: "Start your trial",
      },
      {
        name: "Licensed",
        price: "Custom",
        description: "Production licensing after your trial.",
        features: ["Production license", "Direct engineering support", "SLA options available"],
        cta: "Request pricing",
        highlighted: true,
      },
    ],
    status: "early-access",
    statusLabel: "Free 14-day trial available",
  },
  {
    slug: "solipher-triage",
    name: "Solipher Triage",
    tagline: "Turns a 50,000-frame capsule-endoscopy study into a reviewable shortlist.",
    category: "Medical imaging",
    problem:
      "A single capsule-endoscopy study produces tens of thousands of images per patient, and reviewers can't manually check every frame.",
    solution:
      "Solipher Triage sits between your imaging pipeline and your reviewers, deciding what gets reviewed first, what waits, and what needs a second opinion, under a fixed memory and storage budget.",
    impact:
      "In our own evaluation on a 47,161-frame clinical dataset, the choice of scoring model alone swung the flagged-for-review rate by more than 40 percentage points, proof that this decision layer, not just the classifier underneath it, determines what a reviewer actually sees.",
    features: [
      "Works with any per-frame scoring model you already run",
      "Fixed, predictable memory and storage footprint regardless of study length",
      "Full decision record for every frame, ready for clinical review workflows",
      "Integrates into existing PACS/viewer pipelines",
    ],
    enterpriseBenefits: [
      "Cuts reviewer time spent on frames that don't need attention",
      "Fixed, predictable infrastructure cost regardless of study length",
      "Full audit trail for every triage decision, ready for clinical review",
    ],
    pricing: [
      {
        name: "Pilot",
        price: "Custom",
        description: "For a single site validating on retrospective studies.",
        features: ["Up to 500 studies / month", "Retrospective validation support", "Email support"],
        cta: "Request a pilot",
      },
      {
        name: "Clinical",
        price: "Custom",
        description: "For imaging centers running triage in live review workflows.",
        features: ["Unlimited studies", "PACS/viewer integration", "Priority support + onboarding"],
        cta: "Request a quote",
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For hospital groups standardizing across multiple sites.",
        features: ["Multi-site deployment", "Custom retention policy", "SLA-backed support"],
        cta: "Talk to us",
      },
    ],
    status: "available",
    statusLabel: "Design-partner program open",
  },
  {
    slug: "solipher-index",
    name: "Solipher Index",
    tagline: "One engine for exact lookups, priority ranking, and range queries, under a fixed budget.",
    category: "High-performance infrastructure",
    problem:
      "Teams building latency-sensitive systems (fraud detection, real-time bidding, telemetry ingestion) usually end up running two or three separate data stores to cover exact lookups, priority ranking, and range queries, and paying a synchronization cost to keep them consistent.",
    solution:
      "Solipher Index covers all three access patterns from one engine with a fixed, predictable resource ceiling, so there's one system to run instead of three that can drift out of sync.",
    impact:
      "In our own benchmarking on production-grade cloud hardware, concurrent throughput scaled from 54.8k to 1.83M operations per second across 1–64 threads, overtaking common alternative approaches once real contention kicked in, validated across 1,414 real trial runs, not simulation.",
    features: [
      "Single embeddable engine, replaces two or three separate stores",
      "Fixed resource ceiling: predictable behavior under load, not best-effort",
      "Scales with concurrent demand instead of degrading under it",
      "Drop-in for latency-sensitive ingestion and lookup pipelines",
    ],
    enterpriseBenefits: [
      "Fewer systems to operate, patch, and keep in sync",
      "Predictable resource ceiling instead of best-effort degradation under load",
      "Scales with concurrent demand rather than against it",
    ],
    pricing: [
      {
        name: "Developer",
        price: "Free",
        description: "Single-node, non-production use for evaluation.",
        features: ["Full engine access", "Community support"],
        cta: "Get started",
      },
      {
        name: "Production",
        price: "Custom",
        description: "Licensed per deployment for production workloads.",
        features: ["Production license", "Direct engineering support"],
        cta: "Request pricing",
        highlighted: true,
      },
      {
        name: "OEM / Embedded",
        price: "Custom",
        description: "For vendors embedding the engine inside their own product.",
        features: ["Source-available license", "Joint validation on your workload"],
        cta: "Talk to us",
      },
    ],
    status: "available",
    statusLabel: "Available for production licensing",
  },
  {
    slug: "solipher-cache",
    name: "Solipher Cache",
    tagline: "Cuts the memory cost of serving AI models at scale.",
    category: "AI infrastructure",
    problem:
      "Model-serving costs scale with how much context has to stay in memory, and most caching layers weren't built for how unevenly real production traffic actually hits that cache.",
    solution:
      "Solipher Cache manages that memory pressure so cost scales with genuine demand, not worst-case assumptions.",
    impact:
      "Early validation on production-shaped traffic patterns shows meaningful memory-pressure reduction versus a naive cache. We're expanding the design-partner program before publishing a hard number.",
    features: [
      "Drop-in memory management layer for existing serving infrastructure",
      "Tuned for the uneven access patterns real production traffic actually has",
      "Reduces serving cost without a hardware change",
    ],
    enterpriseBenefits: [
      "Lower serving cost without a hardware change",
      "Built for the uneven access patterns real production traffic has",
      "Drop-in layer, no serving-stack rewrite required",
    ],
    pricing: [
      {
        name: "Design Partner",
        price: "Custom",
        description: "Early access for teams with real production serving traffic to validate against.",
        features: ["Direct engineering access", "Joint validation on your workload", "Input into the production roadmap"],
        cta: "Apply as a design partner",
      },
    ],
    status: "early-access",
    statusLabel: "Early access, design partners only",
  },
  {
    slug: "solipher-shield",
    name: "Solipher Shield",
    tagline: "Line-rate intrusion detection that fails predictably, not silently.",
    category: "Network security",
    problem:
      "Detecting and mitigating intrusions at line rate needs the same fast-lookup, priority-ranking, and resource-budgeting problem we've already solved elsewhere, applied to live traffic. Under an attack-driven load spike, a defended system needs to know whether a flow was dropped by policy or by capacity, every time.",
    solution:
      "Solipher Shield applies the same resource-budgeting approach validated in Solipher Index to line-rate intrusion detection and mitigation.",
    impact:
      "Core engineering validation is complete. Traffic-scale benchmarking hasn't started, so we're not making a detection-accuracy or throughput claim yet. We're looking for design partners to help us benchmark against a real traffic profile.",
    features: [
      "Built on the same resource-budgeting approach validated in Solipher Index",
      "Distinguishes policy rejections from capacity rejections under load",
      "Early-access roadmap shaped by design-partner traffic",
    ],
    enterpriseBenefits: [
      "Predictable failure behavior under attack-driven load, not silent degradation",
      "Clear distinction between policy rejections and capacity rejections",
      "Built on infrastructure already validated at scale in Solipher Index",
    ],
    pricing: [
      {
        name: "Research Partner",
        price: "Custom",
        description: "For security teams who want early visibility and input as this moves toward benchmarking.",
        features: ["Direct access to the engineering team", "Input on the benchmark traffic profile", "First access once validated"],
        cta: "Register interest",
      },
    ],
    status: "early-access",
    statusLabel: "Active R&D, not yet for sale",
  },
  {
    slug: "solipher-erp",
    name: "Solipher ERP",
    tagline: "Odoo, customized so your systems of record stop being three separate systems.",
    category: "Enterprise software",
    problem:
      "Most clinics, imaging centers, and mid-size enterprises run patient records, billing, and inventory as three loosely-connected systems, stitched together by manual re-entry.",
    solution:
      "Solipher ERP is custom Odoo implementation and module development that connects them properly, including a direct integration path for Solipher Triage deployments.",
    impact:
      "Every engagement is scoped to the client's existing systems, so impact is measured per deployment rather than published as a general number.",
    features: [
      "Custom Odoo module development and implementation",
      "Direct integration with Solipher Triage for imaging-center deployments",
      "Migration support from existing fragmented systems",
      "Ongoing managed support and version upgrades",
    ],
    enterpriseBenefits: [
      "Eliminates manual re-entry between billing, records, and inventory",
      "Direct integration path for imaging-center deployments running Solipher Triage",
      "Ongoing managed support and version upgrades included",
    ],
    pricing: [
      {
        name: "Module License",
        price: "Custom",
        description: "A custom module for a single Odoo instance.",
        features: ["Module license", "Standard integration support", "Upgrade path with Odoo releases"],
        cta: "Request pricing",
      },
      {
        name: "Implementation",
        price: "Custom",
        description: "Full Odoo implementation or migration.",
        features: ["Requirements & data migration", "Custom workflow configuration", "Staff onboarding"],
        cta: "Request a quote",
        highlighted: true,
      },
      {
        name: "Managed Odoo",
        price: "Custom",
        description: "Ongoing administration, customization, and support.",
        features: ["Monthly customization hours", "Priority turnaround", "Version upgrade management"],
        cta: "Talk to us",
      },
    ],
    status: "available",
    statusLabel: "Available now",
  },
];
