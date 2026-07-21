export interface Service {
  slug: string;
  name: string;
  summary: string;
  detail: string;
  deliverables: string[];
  detailSlug?: string;
}

export const services: Service[] = [
  {
    slug: "odoo-erp",
    name: "Odoo ERP Solutions & Customization",
    summary: "Implementation, migration, custom modules, and ongoing support.",
    detail:
      "Full-cycle Odoo work, from first implementation to custom modules, for teams that need their ERP to reflect how they actually operate, not the other way around.",
    deliverables: ["Implementation & data migration", "Custom module development", "Third-party integrations", "Ongoing managed support"],
    detailSlug: "odoo-erp",
  },
  {
    slug: "algorithm-engineering",
    name: "Data Structure & Algorithm Engineering",
    summary: "Custom, high-performance components built for your exact constraints.",
    detail:
      "When an off-the-shelf library doesn't fit your latency, memory, or concurrency budget, we design and build the component that does. The same discipline behind our own products, applied to your problem.",
    deliverables: ["Requirements & constraint analysis", "Custom component design & implementation", "Performance benchmarking against your workload", "Integration support"],
  },
  {
    slug: "android-web-apps",
    name: "Android & Web Application Development",
    summary: "Custom applications from architecture through deployment.",
    detail:
      "End-to-end mobile and web application development, native Android and modern web front ends, for products built to be maintained long after launch, not just shipped once.",
    deliverables: ["Architecture & technical design", "Native Android development", "Web application development", "CI/CD & deployment setup"],
    detailSlug: "web-app-development",
  },
  {
    slug: "custom-ai-ml",
    name: "Custom AI/ML Development",
    summary: "Model development and evaluation pipelines built around real constraints.",
    detail:
      "Custom model development, fine-tuning, and evaluation pipelines, built around your actual deployment constraints instead of a generic benchmark.",
    deliverables: ["Model development & fine-tuning", "Evaluation pipeline design", "Deployment & monitoring"],
    detailSlug: "ai-development",
  },
  {
    slug: "resource-bounded-systems",
    name: "Resource-Bounded Systems Consulting",
    summary: "Admission control, capacity planning, and bounded-latency architecture.",
    detail:
      "Consulting for systems that need predictable behavior under load: admission control design, capacity budget modeling, and architecture review.",
    deliverables: ["Admission-control architecture design", "Capacity & budget modeling", "Concurrency & latency review", "Benchmark harness design"],
  },
  {
    slug: "medical-imaging-pipelines",
    name: "Medical Imaging Pipelines",
    summary: "Custom triage and retention pipelines for imaging workflows.",
    detail:
      "Custom pipeline development for imaging workflows beyond capsule endoscopy: bounded-resource frame triage applied to other high-frame-volume imaging modalities.",
    deliverables: ["Pipeline architecture & design", "Model-agnostic triage integration", "Retention & storage design", "PACS/viewer integration"],
  },
  {
    slug: "bde",
    name: "Business Development Executive (BDE)",
    summary: "Outsourced business development, run like a dedicated hire.",
    detail:
      "A dedicated business development function for teams that need pipeline built, not another software subscription: outbound, partnership development, and deal support run on your behalf.",
    deliverables: ["Outbound pipeline & lead generation", "Partnership & channel development", "Deal support through to close", "Weekly pipeline reporting"],
    detailSlug: "bde",
  },
];
