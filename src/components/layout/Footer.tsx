import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LinkedInIcon, GitHubIcon, XIcon } from "@/components/ui/BrandIcons";
import { site, navLinks } from "@/lib/data/site";

const footerLinks = [
  navLinks[0],
  navLinks[1],
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  ...navLinks.slice(2),
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Logo />

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/70 transition-colors hover:text-red-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="hidden text-sm text-foreground/70 transition-colors hover:text-red-400 sm:inline"
            >
              {site.email}
            </a>
            <SocialIcon href={site.social.linkedin} label="LinkedIn">
              <LinkedInIcon size={15} />
            </SocialIcon>
            <SocialIcon href={site.social.github} label="GitHub">
              <GitHubIcon size={15} />
            </SocialIcon>
            <SocialIcon href={site.social.x} label="X">
              <XIcon size={15} />
            </SocialIcon>
            <SocialIcon href={`mailto:${site.email}`} label="Email">
              <Mail size={15} />
            </SocialIcon>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <p>Patent-backed algorithms and data structures.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-red-500/50 hover:text-red-400"
    >
      {children}
    </a>
  );
}
