"use client";

import { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { navLinks, productNavLinks, serviceNavLinks } from "@/lib/data/site";
import { liquidGlass, type LiquidGlassHandle } from "@/lib/liquidGlass";

interface NavDropdownLink {
  href: string;
  label: string;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const pillRef = useRef<HTMLDivElement>(null);
  const productsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpen(false);
    setProductsOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!pillRef.current) return;
    const handle: LiquidGlassHandle = liquidGlass(pillRef.current, {
      scale: -70,
      chroma: 3,
      border: 0.1,
      mapBlur: 16,
      blur: 5,
      saturate: 1.3,
      fallbackBlur: 20,
    });
    return () => handle.destroy();
  }, []);

  function openProducts() {
    if (productsCloseTimer.current) clearTimeout(productsCloseTimer.current);
    setProductsOpen(true);
  }
  function scheduleCloseProducts() {
    productsCloseTimer.current = setTimeout(() => setProductsOpen(false), 150);
  }

  function openServices() {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    setServicesOpen(true);
  }
  function scheduleCloseServices() {
    servicesCloseTimer.current = setTimeout(() => setServicesOpen(false), 150);
  }

  const productsActive = pathname.startsWith("/products");
  const servicesActive = pathname.startsWith("/services");

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 pb-2">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div
          ref={pillRef}
          className="lg-pill relative flex w-full items-center justify-between gap-4 rounded-full border border-border/70 bg-background/45 px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
        >
          <Logo />

          <nav className="hidden items-center gap-1.5 lg:flex">
            {navLinks.slice(0, 2).map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href} />
            ))}

            <NavDropdown
              label="Products"
              links={productNavLinks}
              active={productsActive}
              open={productsOpen}
              onOpen={openProducts}
              onClose={scheduleCloseProducts}
              onToggle={() => setProductsOpen((v) => !v)}
            />

            <NavDropdown
              label="Services"
              links={serviceNavLinks}
              active={servicesActive}
              open={servicesOpen}
              onOpen={openServices}
              onClose={scheduleCloseServices}
              onToggle={() => setServicesOpen((v) => !v)}
            />

            {navLinks.slice(2).map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href} />
            ))}
          </nav>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-border bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.slice(0, 2).map((link) => (
                <NextLink
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-3 text-base text-foreground/90 transition-colors hover:bg-surface-raised hover:text-red-400"
                >
                  {link.label}
                </NextLink>
              ))}

              <div className="mt-1 border-t border-border pt-2">
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted">Products</p>
                {productNavLinks.map((link) => (
                  <NextLink
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-base text-foreground/90 transition-colors hover:bg-surface-raised hover:text-red-400"
                  >
                    {link.label}
                  </NextLink>
                ))}
              </div>

              <div className="mt-1 border-t border-border pt-2">
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted">Services</p>
                {serviceNavLinks.map((link) => (
                  <NextLink
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-base text-foreground/90 transition-colors hover:bg-surface-raised hover:text-red-400"
                  >
                    {link.label}
                  </NextLink>
                ))}
              </div>

              <div className="mt-1 border-t border-border pt-2">
                {navLinks.slice(2).map((link) => (
                  <NextLink
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg px-3 py-3 text-base text-foreground/90 transition-colors hover:bg-surface-raised hover:text-red-400"
                  >
                    {link.label}
                  </NextLink>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <NextLink
      href={href}
      className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
        active ? "bg-foreground/[0.06] text-foreground" : "text-foreground/60 hover:bg-foreground/[0.04] hover:text-foreground"
      }`}
    >
      {label}
    </NextLink>
  );
}

function NavDropdown({
  label,
  links,
  active,
  open,
  onOpen,
  onClose,
  onToggle,
}: {
  label: string;
  links: readonly NavDropdownLink[];
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        onClick={onToggle}
        className={`relative flex items-center gap-1 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
          active ? "bg-foreground/[0.06] text-foreground" : "text-foreground/60 hover:bg-foreground/[0.04] hover:text-foreground"
        }`}
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-2xl border border-border bg-surface/95 p-2 shadow-xl backdrop-blur-xl"
          >
            {links.map((link, i) => (
              <NextLink
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-foreground/[0.06] hover:text-red-400 ${
                  i === links.length - 1 ? "mt-1 border-t border-border pt-3 text-foreground/70" : "text-foreground/85"
                }`}
              >
                {link.label}
              </NextLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
