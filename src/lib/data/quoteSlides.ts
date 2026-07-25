import type { LucideIcon } from "lucide-react";
import { Cpu, Building2, Smartphone, Handshake, BrainCircuit, Send } from "lucide-react";

export interface QuoteSlide {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  projectType?: string;
  message?: string;
}

export const quoteSlides: QuoteSlide[] = [
  {
    id: "research-products",
    title: "Research & Products",
    description: "SHARD Gateway and SHARD Context, our patent-backed AI infrastructure.",
    icon: Cpu,
    href: "/products/shard-gateway",
  },
  {
    id: "odoo-erp",
    title: "Odoo ERP",
    description: "Implementation, migration, and custom modules for your ERP.",
    icon: Building2,
    href: "/services/odoo-erp",
  },
  {
    id: "web-app-development",
    title: "Web & App Development",
    description: "Custom web and Android applications, built to be maintained long-term.",
    icon: Smartphone,
    href: "/services/web-app-development",
  },
  {
    id: "bde",
    title: "Business Development (BDE)",
    description: "A dedicated business development function, run on your behalf.",
    icon: Handshake,
    href: "/services/bde",
  },
  {
    id: "ai-development",
    title: "AI Development",
    description: "Custom AI/ML development and evaluation pipelines for your workload.",
    icon: BrainCircuit,
    href: "/services/ai-development",
  },
  {
    id: "get-a-quote",
    title: "Get a Quote",
    description: "Not sure which of these fits? Tell us what you're building.",
    icon: Send,
  },
];
