import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Store,
  Truck,
  Briefcase,
  Stethoscope,
  UtensilsCrossed,
  ShoppingBag,
  ChefHat,
  Rocket,
  Globe2,
  Handshake,
  Users,
  MessageSquare,
  FileText,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export interface ServicePageExample {
  icon: LucideIcon;
  category: string;
  title: string;
  description: string;
  highlights: string[];
}

export interface ServicePageStep {
  title: string;
  description: string;
}

export interface ServicePageDetail {
  slug: string;
  name: string;
  tagline: string;
  heroDescription: string;
  approach: ServicePageStep[];
  examples: ServicePageExample[];
  projectType: string;
}

export const servicePages: ServicePageDetail[] = [
  {
    slug: "odoo-erp",
    name: "Odoo ERP",
    tagline: "Odoo implementation and customization for teams that need their ERP to match how they work.",
    heroDescription:
      "We implement, migrate, and extend Odoo for teams that are done reconciling separate systems by hand. Every rollout is scoped to your actual process, not a generic template.",
    projectType: "Odoo ERP",
    approach: [
      {
        title: "Process audit",
        description: "We map how you actually work, procurement, inventory, production, or service delivery, before touching any configuration.",
      },
      {
        title: "Scoped implementation",
        description: "Modules turned on in stages tied to your operating calendar, not a single big-bang cutover that stalls the business for a week.",
      },
      {
        title: "Migration without guesswork",
        description: "Historical data validated against your existing records before go-live, so nothing is discovered missing after the fact.",
      },
      {
        title: "Support that outlasts launch",
        description: "Ongoing managed support for the modules we build, not just a handoff document once the invoice is paid.",
      },
    ],
    examples: [
      {
        icon: Building2,
        category: "Manufacturing",
        title: "Production and inventory, finally in sync",
        description:
          "A mid-size manufacturer was running production scheduling in one spreadsheet and stock counts in another, and the two disagreed by the time anyone looked. We implemented Odoo Manufacturing and Inventory together, so a production order and a stock movement are the same event, not two records someone reconciles on Friday.",
        highlights: ["Bill-of-materials and production orders", "Real-time stock across multiple warehouses", "Purchase-to-production traceability"],
      },
      {
        icon: Store,
        category: "Retail",
        title: "One stock count across every branch",
        description:
          "A multi-branch retail chain had no single view of what was actually on the shelf at each location, so transfers between branches were guesswork. Centralized inventory and point-of-sale integration gave every branch manager the same number, in real time.",
        highlights: ["Centralized multi-branch inventory", "POS integration", "Automated reorder points"],
      },
      {
        icon: Truck,
        category: "Distribution",
        title: "Routes, invoicing, and stock, without three separate tools",
        description:
          "A distribution company was dispatching routes in one tool, invoicing in another, and tracking stock in a third, with someone manually keying data between all three. We consolidated the workflow into Odoo so a delivery, an invoice, and a stock deduction happen as one action.",
        highlights: ["Route and delivery scheduling", "Automated invoicing on delivery", "Stock deduction tied to dispatch"],
      },
      {
        icon: Briefcase,
        category: "Professional Services",
        title: "Projects and billing that reconcile themselves",
        description:
          "A professional services firm was tracking billable hours separately from project status, which meant invoices were often wrong or late. Project and billing modules tied together so time logged against a project becomes an invoice line automatically.",
        highlights: ["Project and timesheet tracking", "Automated milestone billing", "Client-facing project visibility"],
      },
    ],
  },
  {
    slug: "web-app-development",
    name: "Web & App Development",
    tagline: "Custom web and Android applications, built to be maintained for years, not just shipped once.",
    heroDescription:
      "From booking systems for clinics to storefronts that hold up under a sale-day traffic spike, we build applications around your actual users and your actual load, not a generic template.",
    projectType: "Android or web application",
    approach: [
      {
        title: "Understand the traffic pattern",
        description: "A clinic's peak load looks nothing like a restaurant chain's Saturday night. We design for your actual usage pattern, not a generic template.",
      },
      {
        title: "Architecture before pixels",
        description: "Data model, integrations, and hosting decided before any screen is designed, so the interface doesn't have to fight the backend later.",
      },
      {
        title: "Built to be maintained",
        description: "Documented, tested, and handed over in a state someone other than us can maintain, whether that's your team or another vendor.",
      },
      {
        title: "Deployed with CI/CD",
        description: "Every release goes through the same automated pipeline, so shipping a fix doesn't depend on one person's laptop.",
      },
    ],
    examples: [
      {
        icon: Stethoscope,
        category: "Healthcare",
        title: "Booking that doesn't need a phone call",
        description:
          "A multi-doctor clinic was taking appointment bookings entirely over the phone, which meant a receptionist was the bottleneck for every new patient. We built an online booking and patient-record system that lets patients self-schedule against real-time doctor availability.",
        highlights: ["Real-time appointment availability", "Patient record and history portal", "SMS/email appointment reminders"],
      },
      {
        icon: UtensilsCrossed,
        category: "Food & Beverage",
        title: "Ordering that survives a Saturday-night spike",
        description:
          "A restaurant chain's online ordering system kept failing during their busiest hours, which is the exact moment failure is most expensive. We rebuilt the ordering flow to hold up under a real traffic spike, with menu and inventory synced across every location.",
        highlights: ["Multi-location menu management", "Order flow built for peak load", "Kitchen display integration"],
      },
      {
        icon: ShoppingBag,
        category: "Retail",
        title: "A storefront that doesn't fall over on sale day",
        description:
          "A retailer's storefront had never been tested under real sale-day traffic, so every promotion was a gamble. We rebuilt the storefront and checkout for predictable performance under load, with inventory that stays accurate across online and in-store sales.",
        highlights: ["Load-tested checkout flow", "Inventory synced with in-store POS", "Cart recovery and promotions"],
      },
      {
        icon: ChefHat,
        category: "B2B Commerce",
        title: "A catalog built for buyers who order in bulk",
        description:
          "A commercial kitchen equipment seller's catalog was built for individual consumers, not the restaurants and hotels that made up most of their revenue. We built a B2B ordering portal with bulk pricing, quote requests, and account-based order history.",
        highlights: ["Tiered/bulk pricing by account", "Quote-request workflow", "Order history and reordering"],
      },
    ],
  },
  {
    slug: "bde",
    name: "Business Development Executive (BDE)",
    tagline: "A dedicated business development function, run on your behalf.",
    heroDescription:
      "Outbound, partnership development, and deal support, run like a hire on your team rather than a subscription. For companies that need pipeline, not another piece of software.",
    projectType: "Business Development (BDE)",
    approach: [
      {
        title: "Learn the offer",
        description: "We spend the first weeks understanding your product, pricing, and who actually buys, before any outreach goes out.",
      },
      {
        title: "Build the pipeline",
        description: "Outbound targeting, sequencing, and qualification run as a dedicated function, not a side project squeezed between other work.",
      },
      {
        title: "Carry deals to close",
        description: "We stay engaged through negotiation and close, not just the first meeting, so momentum doesn't die in a handoff.",
      },
      {
        title: "Report what's real",
        description: "Weekly pipeline numbers you can act on, not a vanity dashboard that looks good and tells you nothing.",
      },
    ],
    examples: [
      {
        icon: Rocket,
        category: "SaaS",
        title: "A pipeline that exists before the first sales hire",
        description:
          "An early-stage SaaS company had a working product and no one dedicated to selling it. We ran outbound and qualification as an embedded function, building a pipeline the founders could close without hiring a sales team before they were ready for one.",
        highlights: ["Ideal-customer targeting", "Outbound sequencing & qualification", "Founder-ready meeting handoff"],
      },
      {
        icon: Globe2,
        category: "Manufacturing & Export",
        title: "Finding buyers beyond the domestic market",
        description:
          "A manufacturing exporter had strong domestic relationships but no process for finding international buyers. We built and ran an outbound program targeting distributors and buyers in new markets, with every lead qualified before it reached the founders.",
        highlights: ["International buyer research", "Distributor & channel outreach", "Qualified handoff to leadership"],
      },
      {
        icon: Handshake,
        category: "Enterprise Partnerships",
        title: "Turning integrations into signed partnerships",
        description:
          "A technology company had informal integration relationships with larger platforms that had never been formalized into real partnerships. We ran the outreach and negotiation process needed to turn those relationships into signed, revenue-bearing agreements.",
        highlights: ["Partnership target mapping", "Structured outreach & negotiation", "Agreement support through signature"],
      },
      {
        icon: Users,
        category: "Professional Services",
        title: "Outbound that doesn't sound like outbound",
        description:
          "A professional services firm relied entirely on referrals and had no systematic way to reach new accounts. We built an account-based outreach program that reads as informed and specific, not templated, targeted at the accounts most likely to convert.",
        highlights: ["Account-based targeting", "Personalized outreach at scale", "Pipeline reporting & handoff"],
      },
    ],
  },
  {
    slug: "ai-development",
    name: "AI Development",
    tagline: "Custom AI/ML systems built around your deployment constraints, not a benchmark leaderboard.",
    heroDescription:
      "Model development, fine-tuning, and evaluation pipelines designed around your actual latency, cost, and privacy requirements, measured on your data before anything ships.",
    projectType: "Custom AI/ML development",
    approach: [
      {
        title: "Constraint-first scoping",
        description: "Latency, cost per inference, and data-privacy requirements set the design before any model is chosen.",
      },
      {
        title: "Evaluation before deployment",
        description: "Every model is measured against your real data and real failure cases, not a public benchmark that doesn't resemble your problem.",
      },
      {
        title: "Built for monitoring",
        description: "Drift detection and logging shipped alongside the model, so degradation is caught before it becomes an incident.",
      },
      {
        title: "Deployed to your constraints",
        description: "On-prem, private cloud, or your existing infrastructure, whichever your data and compliance requirements actually call for.",
      },
    ],
    examples: [
      {
        icon: MessageSquare,
        category: "E-commerce",
        title: "Support that doesn't wait for business hours",
        description:
          "An online retailer's support queue backed up every evening once the team went home, and most of the questions were the same handful of things. We built an AI support assistant trained on their catalog and policies, handling routine questions and escalating anything it wasn't confident about.",
        highlights: ["Catalog & policy-grounded responses", "Confidence-based escalation to humans", "Continuous evaluation against real tickets"],
      },
      {
        icon: FileText,
        category: "Healthcare",
        title: "Turning scanned records into searchable data",
        description:
          "A healthcare provider had years of patient records as scanned images with no way to search them. We built a document-processing pipeline that extracts structured data from scanned records, validated against a sample reviewed by their own staff before full rollout.",
        highlights: ["OCR & structured field extraction", "Human-in-the-loop validation", "Privacy-compliant on-prem deployment"],
      },
      {
        icon: TrendingUp,
        category: "Logistics",
        title: "Forecasts that update with the week, not the quarter",
        description:
          "A logistics company was forecasting demand quarterly, which meant the forecast was already stale by the time it shipped. We built a forecasting pipeline that retrains on rolling weekly data, cutting the lag between what actually happens and what the model expects.",
        highlights: ["Rolling retraining pipeline", "Demand forecasting by route/region", "Drift monitoring & alerting"],
      },
      {
        icon: ShieldCheck,
        category: "Financial Services",
        title: "Catching the transaction that doesn't fit the pattern",
        description:
          "A financial services firm's fraud rules were static and missed new patterns as fraud tactics shifted. We built an anomaly-detection pipeline that flags transactions statistically inconsistent with an account's own history, evaluated against their historical fraud cases before deployment.",
        highlights: ["Account-level anomaly detection", "Evaluated on historical fraud cases", "Low-latency scoring at transaction time"],
      },
    ],
  },
];

export function getServicePage(slug: string): ServicePageDetail | undefined {
  return servicePages.find((p) => p.slug === slug);
}
