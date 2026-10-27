import type { MetadataRoute } from "next";
import { site, productNavLinks } from "@/lib/data/site";
import { internshipDomains } from "@/lib/data/internships";
import { servicePages } from "@/lib/data/servicePages";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/research",
    "/publications",
    "/products",
    ...productNavLinks.map((l) => l.href).filter((href) => href !== "/products"),
    "/services",
    ...servicePages.map((p) => `/services/${p.slug}`),
    "/portfolio",
    "/internships",
    ...internshipDomains.map((d) => `/internships/${d.slug}`),
    "/internships/apply",
    "/internships/submit",
    "/verify",
    "/careers",
    "/contact",
  ];

  // No lastModified: stamping every URL with the request time tells
  // crawlers every page changed on every fetch, which they learn to ignore.
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/products") ? 0.9 : 0.8,
  }));
}
