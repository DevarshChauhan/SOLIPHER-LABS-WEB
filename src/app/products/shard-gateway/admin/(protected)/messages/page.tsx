import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { listContactMessages, hasDb } from "@/lib/admin/db";
import { Mail, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact messages",
  robots: { index: false, follow: false },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default async function ContactMessagesPage() {
  const messages = hasDb ? await listContactMessages() : [];

  return (
    <>
      <AdminHeader crumb="Contact messages" />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Contact messages</h1>
            <p className="mt-1 text-sm text-muted">
              {messages.length} {messages.length === 1 ? "message" : "messages"} sent from the public contact form.
            </p>
          </div>
          <Link href="/products/shard-gateway/admin" className="text-sm text-muted transition-colors hover:text-foreground">
            Back to licensing
          </Link>
        </div>

        {!hasDb && (
          <p className="mt-8 rounded-xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-foreground/90">
            No database is configured, so the contact form is asking people to email instead of silently dropping
            their message. Set DATABASE_URL to start accepting them.
          </p>
        )}

        {hasDb && messages.length === 0 && (
          <p className="mt-8 rounded-xl border border-border bg-surface p-6 text-sm text-muted">
            No messages yet. They&rsquo;ll appear here as soon as someone submits the form at /contact.
          </p>
        )}

        <div className="mt-8 space-y-4">
          {messages.map((m) => (
            <article key={m.id} className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-foreground">{m.name}</h2>
                  {m.projectType && <p className="mt-1 text-sm font-medium text-red-400">{m.projectType}</p>}
                </div>
                <span className="text-xs text-muted">{formatDate(m.createdAt)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 text-foreground/85 hover:text-red-400">
                  <Mail size={14} className="text-red-500" />
                  {m.email}
                </a>
                {m.company && (
                  <span className="inline-flex items-center gap-1.5 text-foreground/85">
                    <Building2 size={14} className="text-red-500" />
                    {m.company}
                  </span>
                )}
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">{m.message}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
