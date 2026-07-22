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
    slug: "solipher-shard-context",
    name: "Solipher SHARD Context",
    tagline: "Shrinks what you send to an LLM without losing the facts that have to be exactly right.",
    category: "AI infrastructure",
    problem:
      "LLM applications routinely send far more context into a model than a given request needs (full documents, entire conversation histories, every retrieved source) because trimming it down risks silently dropping the one detail that has to be exactly correct.",
    solution:
      "Solipher SHARD Context compiles the smallest context package that still fits your model's exact token budget, without dropping the facts marked as required. Most context-reduction tools compress everything the same way; this one distinguishes a fact that can be paraphrased from one that can't.",
    impact:
      "This one is at the specification stage: the design is fully scoped and internally reviewed, but implementation and benchmarking haven't started. We're not publishing a token-reduction, latency, or quality number until we've measured it against a real workload, the same rule we hold every other claim on this site to.",
    features: [
      "Designed so facts marked critical always keep an exact, traceable source, never a summary standing in alone",
      "Fits the request to the real token budget of your specific model and template, not an estimate",
      "Falls back to sending the original, unmodified request rather than silently guessing when it can't guarantee correctness",
      "Runs locally next to your application, your data doesn't have to leave your infrastructure",
    ],
    enterpriseBenefits: [
      "Lower per-request token cost at the same answer quality",
      "Reduces the risk of a critical fact being silently paraphrased away",
      "Runs locally, so sensitive data doesn't have to leave your infrastructure",
    ],
    pricing: [
      {
        name: "Design Partner",
        price: "Custom",
        description: "For teams who want input into the specification before implementation starts.",
        features: ["Direct engineering access", "Input into the evaluation workload", "First access once benchmarked"],
        cta: "Register interest",
      },
    ],
    status: "early-access",
    statusLabel: "Specification stage, not yet built",
  },
];
