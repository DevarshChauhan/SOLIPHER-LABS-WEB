import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { ChromeGate } from "@/components/layout/ChromeGate";
import { PageTransition } from "@/components/layout/PageTransition";
import { site } from "@/lib/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-wordmark",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Original Algorithms & Data Structures`,
    template: `%s | ${site.name}`,
  },
  description: site.metaDescription,
  keywords: [
    "original algorithms",
    "resource-bounded systems",
    "medical imaging AI",
    "high-performance data infrastructure",
    "Odoo ERP development",
    "AI inference infrastructure",
    "custom software engineering",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} | Original Algorithms & Data Structures`,
    description: site.metaDescription,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Original Algorithms & Data Structures`,
    description: site.metaDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-red-500 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MotionConfig reducedMotion="user">
            <ChromeGate>
              <main id="main" tabIndex={-1} className="flex-1 outline-none">
                <PageTransition>{children}</PageTransition>
              </main>
            </ChromeGate>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
