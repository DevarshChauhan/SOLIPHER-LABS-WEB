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

// Every current product (SHARD Gateway, SHARD Context) has outgrown this
// generic template and now has its own dedicated page under
// src/app/products/. This array, and the /products/[slug] route it drives,
// stay in place for the next product that starts here before it does too.
export const products: Product[] = [];
