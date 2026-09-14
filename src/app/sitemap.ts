import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";
import { internshipDomains } from "@/lib/data/internships";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/research",
    "/products",
    "/services",
    "/portfolio",
    "/internships",
    ...internshipDomains.map((d) => `/internships/${d.slug}`),
    "/internships/apply",
    "/internships/submit",
    "/verify",
    "/careers",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
