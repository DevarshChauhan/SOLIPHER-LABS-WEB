import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/data/site";

// The preview card LinkedIn, X and WhatsApp show when a solipherlabs.in link
// is shared. Without it the twitter:card "summary_large_image" declared in
// the root layout had no image to show, so every share rendered blank.
export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 15% 0%, #3a0010 0%, #050506 55%)",
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={96} height={96} alt="" />
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: 4 }}>
            <span>SOLIPHER</span>
            <span style={{ color: "#e4002b", marginLeft: 16 }}>LABS</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>We solve the hard problem.</div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, color: "#ff4d55" }}>
            We show you the number.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#9a9aa2" }}>
          <span>AI infrastructure and patent-backed systems research</span>
          <span>{site.domain}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
