import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifySessionCookieValue } from "@/lib/admin/session";

export const metadata = {
  title: "Admin — SHARD Gateway",
  robots: { index: false, follow: false },
};

// A route group ("(protected)") so this gate never wraps
// admin/login/page.tsx -- that page must stay reachable even when
// unauthenticated, or the redirect below would loop against itself.
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  const authed = verifySessionCookieValue(session);

  if (!authed) {
    redirect("/products/shard-gateway/admin/login");
  }

  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
