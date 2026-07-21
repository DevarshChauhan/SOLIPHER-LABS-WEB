import { notFound } from "next/navigation";

// Publications is hidden until there are real papers/whitepapers to list.
// The previous version of this page just pointed back at /research for
// each entry, which duplicated that page instead of adding anything.
// When real publications exist, replace this with a page that lists, per
// entry: title, abstract, PDF, DOI, citation, authors, and venue. Also
// add "/blog" back into navLinks in src/lib/data/site.ts at that point.
export default function BlogPage() {
  notFound();
}
