import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getIntern } from "@/lib/admin/db";
import { getInternshipDomain } from "@/lib/data/internships";
import { site } from "@/lib/data/site";
import { PrintButton } from "@/components/admin/PrintButton";
import { formatDocDate, describeMode, describeDuration } from "@/lib/internships/documents";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Offer letter",
  robots: { index: false, follow: false },
};

export default async function OfferLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const intern = await getIntern(id);
  if (!intern) notFound();

  const domain = getInternshipDomain(intern.domainSlug);
  const mode = describeMode(intern.mode);
  const duration = describeDuration(intern.startDate, intern.endDate);

  return (
    <div className="min-h-screen bg-zinc-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 print:hidden">
        <Link
          href="/products/shard-gateway/admin/interns"
          className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
        >
          ← Back to interns
        </Link>
        <PrintButton />
      </div>

      <div className="ol-sheet">
        <header className="ol-head">
          <Image src="/logo.png" alt="" width={120} height={120} className="ol-logo" unoptimized />
          <div>
            <p className="ol-company">
              SOLIPHER <span className="ol-accent">LABS</span>
            </p>
            <p className="ol-tagline">{site.tagline}</p>
          </div>
        </header>
        <div className="ol-rule" />

        <div className="ol-meta">
          <span>
            Ref: <strong className="ol-mono">{intern.code}</strong>
          </span>
          <span>{formatDocDate(new Date().toISOString().slice(0, 10))}</span>
        </div>

        <h1 className="ol-title">Internship Offer Letter</h1>

        <p className="ol-para">
          Dear <strong>{intern.fullName}</strong>,
        </p>

        <p className="ol-para">
          Congratulations. We are pleased to offer you an internship with <strong>{site.legalName}</strong> as
          {mode.adjective ? ` ${mode.article} ` : " an "}
          <strong>
            {mode.adjective ? `${mode.adjective} ` : ""}
            {domain?.name ?? intern.domainSlug} Intern
          </strong>
          {intern.startDate ? (
            <>
              , starting <strong>{formatDocDate(intern.startDate)}</strong>
            </>
          ) : null}
          .
        </p>

        <p className="ol-para">
          You will be placed on real work from the start, with your output reviewed by an engineer who works on it
          professionally. Please note that this is a temporary internship position and does not carry the benefits
          available to permanent employees. We expect you to follow our policies on conduct, confidentiality and the
          handling of any client or project information you are given access to.
        </p>

        <p className="ol-para">
          On completing the internship, you will submit the project you built at{" "}
          <strong>{site.domain}/internships/submit</strong> using your intern code below. Once we have reviewed and
          verified that work, your certificate will be issued against that same code, and anyone can confirm it is
          genuine at <strong>{site.domain}/verify</strong>.
        </p>

        <dl className="ol-details">
          <div>
            <dt>Intern code</dt>
            <dd className="ol-mono">{intern.code}</dd>
          </div>
          <div>
            <dt>Domain</dt>
            <dd>{domain?.name ?? intern.domainSlug}</dd>
          </div>
          <div>
            <dt>Start date</dt>
            <dd>{intern.startDate ? formatDocDate(intern.startDate) : "To be confirmed"}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>
              {duration ?? "To be confirmed"}
              {intern.endDate ? ` (until ${formatDocDate(intern.endDate)})` : ""}
            </dd>
          </div>
          <div>
            <dt>Mode</dt>
            <dd>{mode.label}</dd>
          </div>
        </dl>

        <p className="ol-para">
          We are confident this internship will be a rewarding one, and we look forward to working with you.
        </p>

        <div className="ol-sign">
          <p className="ol-para ol-sincerely">Sincerely,</p>
          <Image src="/signature-founder.jpg" alt="" width={260} height={100} className="ol-sign-img" unoptimized />
          <div className="ol-sign-rule" />
          <p className="ol-sign-name">{site.founders[0].name}</p>
          <p className="ol-sign-role">
            {site.founders[0].role}, {site.legalName}
          </p>
        </div>

        <footer className="ol-foot">
          <span>{site.email}</span>
          <span>{site.domain}</span>
          {site.credentials.msme && (
            <span>
              MSME Registered
              {site.credentials.udyamNumber ? ` · Udyam Reg. No. ${site.credentials.udyamNumber}` : ""}
            </span>
          )}
        </footer>
      </div>

      <style>{`
        @page { size: A4 portrait; margin: 0; }
        .ol-sheet {
          width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; color: #18181b;
          box-shadow: 0 10px 40px rgba(0,0,0,.12); padding: 18mm 20mm 14mm;
          display: flex; flex-direction: column;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        }
        .ol-head { display: flex; align-items: center; gap: 10px; }
        .ol-logo { width: 16mm; height: 16mm; object-fit: contain; }
        .ol-company { font-size: 15pt; font-weight: 800; letter-spacing: .1em; line-height: 1.1; }
        .ol-accent { color: #dc2626; }
        .ol-tagline { font-size: 8pt; color: #71717a; }
        .ol-rule { margin-top: 4mm; height: 2px; background: #dc2626; }
        .ol-meta { margin-top: 5mm; display: flex; justify-content: space-between; font-size: 9.5pt; color: #52525b; }
        .ol-mono { font-family: ui-monospace, monospace; letter-spacing: .08em; }
        .ol-title { margin-top: 7mm; font-size: 16pt; font-weight: 700; color: #0f172a; }
        .ol-para { margin-top: 4.5mm; font-size: 10.5pt; line-height: 1.75; text-align: justify; color: #27272a; }
        .ol-details {
          margin-top: 6mm; border: 1px solid #e4e4e7; border-radius: 3mm; padding: 5mm 6mm;
          display: grid; grid-template-columns: 1fr 1fr; gap: 3.5mm 8mm; background: #fafafa;
        }
        .ol-details dt { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .1em; color: #71717a; }
        .ol-details dd { margin-top: .8mm; font-size: 10pt; font-weight: 600; color: #18181b; }
        .ol-sign { margin-top: 8mm; }
        .ol-sincerely { margin-top: 0; }
        .ol-sign-img { height: 16mm; width: auto; object-fit: contain; margin: 1mm 0 -2mm -2mm; }
        .ol-sign-rule { width: 55mm; height: 1px; background: #18181b; }
        .ol-sign-name { margin-top: 1.5mm; font-size: 10pt; font-weight: 700; }
        .ol-sign-role { font-size: 8.5pt; color: #71717a; }
        .ol-foot {
          margin-top: auto; padding-top: 6mm; border-top: 1px solid #e4e4e7;
          display: flex; flex-wrap: wrap; justify-content: space-between; gap: 3mm;
          font-size: 8pt; color: #71717a;
        }
        @media print {
          .ol-sheet { box-shadow: none; margin: 0; }
          html, body { background: #fff; }
        }
      `}</style>
    </div>
  );
}
