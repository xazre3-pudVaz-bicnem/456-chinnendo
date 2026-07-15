import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
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

  // コラム：実在する .md ファイルから生成（frontmatter の date を lastModified に）
  for (const c of getColumnList()) {
    entries.push({
      url: `${SITE_URL}/column/${c.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
      ...(c.date ? { lastModified: new Date(c.date) } : {}),
    });
  }

  // 注意：エリア個別ページ（/area/[slug]）は、ルート（src/app/area/[slug]/page.tsx）を
  // 実装してからこの sitemap に追加すること。ルートなしで追加すると404をサイトマップに載せてしまう。

  return entries;
}
