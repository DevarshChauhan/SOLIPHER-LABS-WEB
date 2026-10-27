export const site = {
  name: "Solipher Labs",
  legalName: "Solipher Labs",
  tagline: "We solve the hard problem. We show you the number.",
  domain: "solipherlabs.in",
  url: "https://solipherlabs.in",
  email: "contact@solipherlabs.in",
  // Used as the default meta and social description: keep it under ~160
  // characters so search results show it whole.
  metaDescription:
    "An R&D lab building original algorithms and data structures for AI infrastructure, medical imaging and security, with every result measured on a real run.",
  description:
    "Solipher Labs is an R&D lab building original algorithms and data structures across medical imaging, high-performance infrastructure, AI inference, and enterprise software, shipping them into deployable products, and implementing and benchmarking research designs for professors, master's students, and PhD candidates.",
  social: {
    linkedin: "https://www.linkedin.com/company/solipher-labs/",
    github: "https://github.com/SOLIPHER-LABS",
    x: "https://x.com/solipherlabs",
  },
  founders: [
    {
      name: "Chauhan Devarsh Rajendra",
      role: "Founder",
      bio: "Founder of Solipher Labs. Designed, implemented and benchmarked the original algorithms and data structures behind the company's products, across medical imaging, systems infrastructure, AI inference and security research.",
    },
  ],
  teamSize: 1,
  // Printed on the offer letter and certificate. Only list what we
  // actually hold: we are MSME registered, and are NOT ISO certified or
  // Startup India recognised, so neither is claimed anywhere.
  credentials: {
    msme: true,
    // Set this to print "Udyam Registration No. ..." on both documents.
    udyamNumber: "",
  },
  internship: {
    // Application fee, paid by UPI before the form is submitted. The
    // applicant then enters their UPI transaction ID on the form, and it
    // is checked against the bank by hand before the application is
    // approved -- nothing here confirms a payment on its own.
    feeAmount: 1000,
    currency: "INR",
    // Until this UPI ID is filled in, the form asks applicants to email
    // for payment details instead of showing a payee that doesn't exist.
    upiId: "0lucifer0@slc",
    upiPayeeName: "Solipher Labs",
    // Path to a UPI QR image under public/, e.g. "/upi-qr.png". Shown next
    // to the UPI ID so someone filling the form on a laptop can scan it
    // with their phone instead of typing the ID.
    upiQrImage: "",
    // Shown verbatim on the apply page and above the fee on the form.
    // Stated plainly and before payment rather than buried: the fee is
    // taken before an application is assessed, so "what if I'm not
    // selected" has to be answered up front, not after someone has paid.
    refundPolicy:
      "The application fee is non-refundable, including if your application is not selected.",
  },
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
  { href: "/products/shard-codecontext", label: "SHARD CodeContext" },
  { href: "/products", label: "All Products" },
] as const;

export const serviceNavLinks = [
  { href: "/services/odoo-erp", label: "Odoo ERP" },
  { href: "/services/web-app-development", label: "Web & App Development" },
  { href: "/services/bde", label: "Business Development (BDE)" },
  { href: "/services/ai-development", label: "AI Development" },
  { href: "/services", label: "All Services" },
] as const;

// Publications (src/lib/data/publications.ts) lists only manuscripts with a
// checkable status. It is linked from the footer and the Research page, not
// the header, which has no room left. /blog redirects to /publications.

export const heroStats = [
  { value: "0.966", label: "AUROC detecting ransomware on hardware never seen in training, from disk metadata alone (PRISM-CVM, under review)" },
  { value: "47,161", label: "Endoscopy frames processed in a single real evaluation run, on a public clinical dataset" },
  { value: "3", label: "Deployable AI infrastructure products, each built on original algorithms and data structures" },
  { value: "0", label: "Simulated results. Every number we publish comes from a real, executed run" },
] as const;
