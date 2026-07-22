export const site = {
  name: "Solipher Labs",
  legalName: "Solipher Labs",
  tagline: "We solve the hard problem. We show you the number.",
  domain: "solipherlabs.in",
  url: "https://solipherlabs.in",
  email: "contact@solipherlabs.in",
  description:
    "Solipher Labs is an R&D lab building patent-backed algorithms and data structures across medical imaging, high-performance infrastructure, AI inference, and enterprise software, and shipping them into deployable products.",
  social: {
    linkedin: "https://www.linkedin.com/company/solipherlabs",
    github: "https://github.com/solipherlabs",
    x: "https://x.com/solipherlabs",
  },
  founders: [
    {
      name: "Chauhan Devarsh Rajendra",
      role: "Founder",
      bio: "Founder of Solipher Labs. Leads a five-person in-house team building the patent-backed algorithms and data structures behind the company's products, across medical imaging, systems infrastructure, and AI inference.",
    },
  ],
  teamSize: 5,
} as const;

export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;

export const productNavLinks = [
  { href: "/products/shard-gateway", label: "SHARD Gateway" },
  { href: "/products/shard-context", label: "SHARD Context" },
  { href: "/products", label: "All Products" },
] as const;

export const serviceNavLinks = [
  { href: "/services/odoo-erp", label: "Odoo ERP" },
  { href: "/services/web-app-development", label: "Web & App Development" },
  { href: "/services/bde", label: "Business Development (BDE)" },
  { href: "/services/ai-development", label: "AI Development" },
  { href: "/services", label: "All Services" },
] as const;

// Publications is intentionally not in navLinks yet: there are no real
// papers/whitepapers to list. The route below returns notFound() until
// that changes. Re-add "/blog" here (with a Publications label) once
// the page has real title/abstract/PDF/DOI/citation/authors/venue entries.

export const heroStats = [
  { value: "1.83M ops/s", label: "Peak throughput measured under concurrent load, up from 54.8k ops/s single-threaded" },
  { value: "47,161", label: "Endoscopy frames processed in a single real evaluation run, on a public clinical dataset" },
  { value: "6", label: "Patent-backed products built from original algorithms and data structures" },
  { value: "0", label: "Simulated results. Every number we publish comes from a real, executed run" },
] as const;
