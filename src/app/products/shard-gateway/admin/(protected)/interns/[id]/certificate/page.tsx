import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getIntern } from "@/lib/admin/db";
import { getInternshipDomain } from "@/lib/data/internships";
import { site } from "@/lib/data/site";
import { PrintButton } from "@/components/admin/PrintButton";
import { formatDocDate, describeMode } from "@/lib/internships/documents";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Certificate",
  robots: { index: false, follow: false },
};

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const intern = await getIntern(id);
  if (!intern) notFound();

  const domain = getInternshipDomain(intern.domainSlug);
  const mode = describeMode(intern.mode);

  return (
    <div className="min-h-screen bg-zinc-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-6 flex max-w-[297mm] flex-wrap items-center justify-between gap-3 px-4 print:hidden">
        <Link
          href="/products/shard-gateway/admin/interns"
          className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
        >
          ← Back to interns
        </Link>
        <div className="flex items-center gap-3">
          {intern.status !== "verified" && (
            <span className="text-xs text-amber-700">
              No certificate has been issued for this intern yet.
            </span>
          )}
          <PrintButton />
        </div>
      </div>

      <div className="cert-sheet">
        <div className="cert-frame">
          <div className="cert-corner cert-corner-tl" />
          <div className="cert-corner cert-corner-br" />

          <header className="cert-head">
            <Image src="/logo.png" alt="" width={120} height={120} className="cert-logo" unoptimized />
            <div>
              <p className="cert-company">
                SOLIPHER <span className="cert-company-accent">LABS</span>
              </p>
              <p className="cert-domain">{site.domain}</p>
            </div>
          </header>

          <h1 className="cert-title">Certificate of Completion</h1>
          <div className="cert-rule" />
          <p className="cert-serial">{intern.code}</p>

          <p className="cert-presented">This is presented to</p>
          <p className="cert-name">{intern.fullName}</p>
          <div className="cert-name-rule" />

          <p className="cert-body">
            for successfully completing {mode.article} <strong>{mode.adjective} internship</strong> in{" "}
            <strong>{domain?.name ?? intern.domainSlug}</strong> at <strong>{site.legalName}</strong>
            {intern.startDate && intern.endDate ? (
              <>
                , from <strong>{formatDocDate(intern.startDate)}</strong> to{" "}
                <strong>{formatDocDate(intern.endDate)}</strong>
              </>
            ) : intern.startDate ? (
              <>
                , commencing <strong>{formatDocDate(intern.startDate)}</strong>
              </>
            ) : null}
            .
          </p>
          <p className="cert-body cert-body-sub">
            The project submitted for this internship was reviewed and verified by the team.
          </p>

          <footer className="cert-foot">
            <div className="cert-sign">
              <Image src="/signature-founder.jpg" alt="" width={260} height={100} className="cert-sign-img" unoptimized />
              <div className="cert-sign-rule" />
              <p className="cert-sign-name">{site.founders[0].name}</p>
              <p className="cert-sign-role">{site.founders[0].role}, {site.legalName}</p>
            </div>

            <div className="cert-verify">
              <p className="cert-verify-label">Verify this certificate</p>
              <p className="cert-verify-url">{site.domain}/verify</p>
              <p className="cert-verify-code">Code: {intern.code}</p>
              {site.credentials.msme && (
                <p className="cert-msme">
                  MSME Registered
                  {site.credentials.udyamNumber ? ` · Udyam Reg. No. ${site.credentials.udyamNumber}` : ""}
                </p>
              )}
            </div>
          </footer>
        </div>
      </div>

      <style>{`
        @page { size: A4 landscape; margin: 0; }
        .cert-sheet {
          width: 297mm; height: 210mm; margin: 0 auto; background: #fff;
          box-shadow: 0 10px 40px rgba(0,0,0,.12); padding: 10mm; color: #18181b;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        }
        .cert-frame {
          position: relative; height: 100%; border: 2px solid #dc2626; padding: 12mm 16mm;
          display: flex; flex-direction: column; align-items: center; text-align: center;
        }
        .cert-corner { position: absolute; width: 26mm; height: 26mm; border: 4px solid #dc2626; }
        .cert-corner-tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
        .cert-corner-br { bottom: -2px; right: -2px; border-left: none; border-top: none; }
        .cert-head { display: flex; align-items: center; gap: 10px; }
        .cert-logo { width: 16mm; height: 16mm; object-fit: contain; }
        .cert-company { font-size: 15pt; font-weight: 800; letter-spacing: .1em; line-height: 1.1; }
        .cert-company-accent { color: #dc2626; }
        .cert-domain { font-size: 8pt; color: #71717a; letter-spacing: .08em; }
        .cert-title {
          margin-top: 7mm; font-size: 30pt; font-weight: 800; letter-spacing: .04em;
          text-transform: uppercase; color: #0f172a;
        }
        .cert-rule { width: 46mm; height: 2px; background: #dc2626; margin-top: 3mm; }
        .cert-serial { margin-top: 3mm; font-size: 10pt; letter-spacing: .18em; color: #52525b; font-family: ui-monospace, monospace; }
        .cert-presented { margin-top: 6mm; font-size: 10pt; color: #71717a; }
        .cert-name { margin-top: 2mm; font-size: 26pt; font-weight: 700; color: #dc2626; }
        .cert-name-rule { width: 120mm; height: 1px; background: #d4d4d8; margin-top: 2mm; }
        .cert-body { margin-top: 5mm; max-width: 190mm; font-size: 11.5pt; line-height: 1.7; color: #27272a; }
        .cert-body-sub { margin-top: 2mm; font-size: 9.5pt; color: #71717a; }
        .cert-foot {
          margin-top: auto; width: 100%; display: flex; align-items: flex-end;
          justify-content: space-between; gap: 12mm; text-align: left;
        }
        .cert-sign-img { height: 16mm; width: auto; object-fit: contain; margin-bottom: -2mm; }
        .cert-sign-rule { width: 55mm; height: 1px; background: #18181b; }
        .cert-sign-name { margin-top: 1.5mm; font-size: 10pt; font-weight: 700; }
        .cert-sign-role { font-size: 8.5pt; color: #71717a; }
        .cert-verify { text-align: right; }
        .cert-verify-label { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .12em; color: #71717a; }
        .cert-verify-url { font-size: 10pt; font-weight: 600; color: #dc2626; }
        .cert-verify-code { font-size: 9pt; font-family: ui-monospace, monospace; letter-spacing: .1em; color: #3f3f46; }
        .cert-msme { margin-top: 2mm; font-size: 8pt; color: #52525b; }
        @media print {
          .cert-sheet { box-shadow: none; margin: 0; }
          html, body { background: #fff; }
        }
      `}</style>
    </div>
  );
}
