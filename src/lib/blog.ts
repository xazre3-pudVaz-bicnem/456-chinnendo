import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * content/blog/*.md（毎日1記事の自動生成ブログ）を読み込みます。
 * frontmatter は gray-matter で解析します。
 *
 * frontmatter 必須項目：title / slug / description / date / category / tags
 * 任意項目：topicId（生成スクリプトの重複回避用）/ updatedAt
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt: string;
  category: string;
  tags: string[];
  topicId: string;
};

export type BlogPost = BlogMeta & { content: string };

/** カテゴリー表示名 → URL用スラッグ（/blog/category/[category]） */
export const BLOG_CATEGORIES: { name: string; slug: string }[] = [
  { name: "お墓参り代行", slug: "daiko" },
  { name: "お墓掃除・墓石清掃", slug: "soji" },
  { name: "遠方・行けない方へ", slug: "enpou" },
  { name: "季節のお墓掃除", slug: "season" },
  { name: "地域別ガイド", slug: "area" },
  { name: "お墓のお手入れ知識", slug: "care" },
  { name: "サービスの選び方", slug: "erabikata" },
];

export function categorySlug(name: string): string {
  return BLOG_CATEGORIES.find((c) => c.name === name)?.slug ?? "care";
}

export function categoryName(slug: string): string | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.name;
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string")
    return value
      .split(/[,、]/)
      .map((v) => v.trim())
      .filter(Boolean);
  return [];
}

function readAll(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slugFromFile = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: String(data.slug ?? slugFromFile),
        title: String(data.title ?? slugFromFile),
        description: String(data.description ?? ""),
        date: String(data.date ?? ""),
        updatedAt: String(data.updatedAt ?? data.date ?? ""),
        category: String(data.category ?? "お墓のお手入れ知識"),
        tags: toArray(data.tags),
        topicId: String(data.topicId ?? ""),
        content: content.trim(),
      };
    });
}

/** 記事メタ一覧（日付降順） */
export function getBlogList(): BlogMeta[] {
  return readAll()
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** 1記事（本文Markdown付き） */
export function getBlogPost(slug: string): BlogPost | null {
  return readAll().find((p) => p.slug === slug) ?? null;
}

/** 静的生成用の slug 一覧 */
export function getBlogSlugs(): string[] {
  return readAll().map((p) => p.slug);
}

/** 記事が存在するカテゴリー（件数付き・記事が1件以上のみ） */
export function getBlogCategoriesInUse(): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of readAll()) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return BLOG_CATEGORIES.map((c) => ({ ...c, count: counts.get(c.name) ?? 0 })).filter(
    (c) => c.count > 0,
  );
}

/** カテゴリー別の記事一覧 */
export function getBlogPostsByCategory(slug: string): BlogMeta[] {
  const name = categoryName(slug);
  if (!name) return [];
  return getBlogList().filter((p) => p.category === name);
}

/**
 * 関連記事：同カテゴリー → タグ一致数 → 新しい順 で最大 limit 件
 */
export function getRelatedBlogPosts(slug: string, limit = 4): BlogMeta[] {
  const all = getBlogList();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, limit);
  return all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 3;
      score += p.tags.filter((t) => current.tags.includes(t)).length;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, limit)
    .map((s) => s.p);
}
