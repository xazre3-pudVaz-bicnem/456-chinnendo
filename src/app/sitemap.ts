import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { areaPages } from "@/data/areas";
import { getColumnList } from "@/lib/columns";

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

  const entries: MetadataRoute.Sitemap = staticPaths.map((e) => ({
    url: `${SITE_URL}${e.path}`,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));

  // 市区町村別エリアページ（src/app/area/[slug]/page.tsx で静的生成）
  for (const a of areaPages) {
    entries.push({
      url: `${SITE_URL}/area/${a.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // コラム：実在する .md ファイルから生成（frontmatter の date / updatedAt を lastModified に）
  for (const c of getColumnList()) {
    const lastMod = c.updatedAt || c.date;
    entries.push({
      url: `${SITE_URL}/column/${c.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
      ...(lastMod ? { lastModified: new Date(lastMod) } : {}),
    });
  }

  return entries;
}
