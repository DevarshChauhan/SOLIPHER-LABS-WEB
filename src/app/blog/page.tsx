import { permanentRedirect } from "next/navigation";

// Publications now live at /publications. This route only exists so old
// links to /blog land there instead of a 404.
export default function BlogPage() {
  permanentRedirect("/publications");
}
