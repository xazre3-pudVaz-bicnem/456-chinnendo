import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { getColumnSlugs } from "@/lib/columns";
import { areaPages } from "@/data/areas";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/ohakamairi-daiko", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/ohaka-soji", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/price", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/area", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/flow", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/column", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/sitemap", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const columns = getColumnSlugs().map((slug) => ({
    path: `/column/${slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  const areas = areaPages.map((a) => ({
    path: `/area/${a.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPaths, ...columns, ...areas].map((e) => ({
    url: `${SITE_URL}${e.path}`,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
