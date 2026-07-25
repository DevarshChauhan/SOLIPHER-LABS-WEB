export function pickVariant<T>(variants: readonly T[]): T {
  return variants[Math.floor(Math.random() * variants.length)];
}

export const homeVariants = [
  {
    lead: "We solve the hard problem.",
    highlight: "We show you the number.",
    description:
      "Solipher Labs builds patent-backed algorithms and data structures, from a high-performance data engine measured at 1.83M ops/s under real concurrency, to a capsule-endoscopy triage system evaluated on tens of thousands of real frames. We publish what problem we solved and exactly how much better the result is, not how it works.",
  },
  {
    lead: "Built to solve what",
    highlight: "off-the-shelf can't.",
    description:
      "From medical imaging to AI inference, we design the algorithm most teams end up working around, then measure exactly how much better it makes the result.",
  },
  {
    lead: "Patent-backed engineering.",
    highlight: "Numbers you can check.",
    description:
      "Solipher Labs builds original algorithms and data structures, from a high-performance data engine measured at 1.83M ops/s under real concurrency, to a triage system evaluated on tens of thousands of real frames. We publish the result, not the recipe.",
  },
  {
    lead: "The problem gets solved.",
    highlight: "The result gets measured.",
    description:
      "Every product on this site started as a problem nobody had solved cleanly. We can show you the one number that proves it's solved now.",
  },
] as const;

export const aboutVariants = [
  {
    title: "We build the hard-to-build parts other companies work around.",
    description:
      "Solipher Labs is an R&D lab that designs original, patent-backed algorithms and data structures, then ships them as deployable products and custom engineering.",
  },
  {
    title: "Most software is assembled. Ours is designed from the ground up.",
    description:
      "Solipher Labs starts where off-the-shelf tools stop, designing the algorithm or data structure a system actually needs, then protecting and shipping it.",
  },
  {
    title: "One founder. Original engineering.",
    description:
      "Solipher Labs is small on purpose. Every product on this site traces back to original, patent-backed work, not integration of someone else's tools.",
  },
  {
    title: "We don't glue tools together. We build the missing piece.",
    description:
      "When speed, memory, or predictability run out on an off-the-shelf approach, Solipher Labs designs the algorithm that gets them back, then ships it.",
  },
] as const;

export const researchVariants = [
  {
    title: "What it solves. How much it solves it.",
    description:
      "Our algorithms and data structures are patent-backed, so we don't publish how they work. We do publish the problem, the scale we tested at, and the measured result.",
  },
  {
    title: "The mechanism is ours. The result is yours to see.",
    description:
      "Every research program here is patent-backed. What's public is the problem it solves and exactly how much better the measured outcome is.",
  },
  {
    title: "Patent-backed. Proven by the number, not the pitch.",
    description:
      "No simulated benchmarks, no back-of-envelope estimates. Real runs, on real hardware and real data, reported as a number, not a story.",
  },
  {
    title: "We don't publish how it works. We publish how well it works.",
    description:
      "Each program below states the problem it was built to solve, the scale it was tested at, and the measured impact, nothing about the mechanism underneath.",
  },
] as const;

export const productsVariants = [
  {
    title: "Patent-backed research, packaged into things you can deploy.",
    description: "Each product solves one named problem. Pricing is quote-based; every deployment is different.",
  },
  {
    title: "Admission control and context compilation, for AI inference that stays predictable.",
    description: "Every product below started as original research before it became something you can license or deploy.",
  },
  {
    title: "Original engineering, shipped as something you can actually buy.",
    description: "AI infrastructure, patent-backed, packaged into a product with a price.",
  },
  {
    title: "Built in the lab. Ready for production.",
    description: "Two products, both AI inference infrastructure, both measured against real hardware.",
  },
] as const;

export const servicesVariants = [
  {
    title: "Consulting and development, engineered to your actual constraints.",
    description:
      "From Odoo implementations to custom AI/ML pipelines, every engagement gets measured against your real performance and reliability requirements, not a generic benchmark.",
  },
  {
    title: "When the off-the-shelf answer isn't good enough, we build the one that is.",
    description: "Custom engineering across ERP, applications, AI/ML, and high-performance systems, scoped to what your system actually needs.",
  },
  {
    title: "Custom engineering, from a team that ships its own products first.",
    description: "We hold client work to the same standard as our own products: built for your real constraints, not a generic template.",
  },
  {
    title: "We build our own systems. Then we build yours.",
    description: "Odoo ERP, custom applications, AI/ML development, and systems consulting, from the same team behind our patent-backed products.",
  },
] as const;

export const portfolioVariants = [
  {
    title: "The problem, and how much the result moved.",
    description: "Two engineering programs, treated as case studies: what we were asked to solve, and the measured outcome.",
  },
  {
    title: "Real engagements. Real numbers. No filler.",
    description: "Two case studies from Solipher Labs' engineering, with the challenge, the outcome, and the results that came out of it.",
  },
  {
    title: "Two hard problems. Two measured outcomes.",
    description: "What we were asked to solve, what we built, and the number that came out the other side.",
  },
  {
    title: "Proof over promises.",
    description: "The challenge we were given, what shipped, and the measured results, not a description of how good it probably is.",
  },
] as const;

export const contactVariants = [
  {
    title: "Tell us what you're building.",
    description:
      "Pilot, production deployment, or a hard performance problem you can't engineer around. We'll tell you honestly whether we're a fit.",
  },
  {
    title: "Got a hard problem? Let's see if we're the right fit.",
    description: "Describe what you're building and where it's stuck. We'll give you a straight answer, not a sales pitch.",
  },
  {
    title: "One message. An honest answer.",
    description: "We read everything ourselves. If we're not the right team for it, we'll tell you that too.",
  },
  {
    title: "Start here. We'll tell you straight if we can help.",
    description: "Pilot, full deployment, or just a second opinion on a hard systems problem. Reach out and we'll reply directly.",
  },
] as const;
