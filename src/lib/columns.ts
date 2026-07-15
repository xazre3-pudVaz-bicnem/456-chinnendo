import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * /content/columns/*.md を読み込み、コラム記事として提供します。
 * 追加のMarkdownライブラリ設定は不要で、ファイルを置くだけで公開されます。
 */

const COLUMNS_DIR = path.join(process.cwd(), "content", "columns");

export type ColumnMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  excerpt: string;
};

export type Column = ColumnMeta & { html: string };

/** 簡易フロントマター解析（--- で囲まれた key: value ） */
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body: match[2] };
}

function readAll(): { meta: ColumnMeta; body: string }[] {
  if (!fs.existsSync(COLUMNS_DIR)) return [];
  return fs
    .readdirSync(COLUMNS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(COLUMNS_DIR, file), "utf-8");
      const { data, body } = parseFrontmatter(raw);
      const meta: ColumnMeta = {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        category: data.category ?? "コラム",
        excerpt: data.excerpt ?? "",
      };
      return { meta, body };
    });
}

/** 公開記事のメタ情報一覧（日付降順） */
export function getColumnList(): ColumnMeta[] {
  return readAll()
    .map((c) => c.meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** 1記事（本文HTML付き） */
export function getColumn(slug: string): Column | null {
  const found = readAll().find((c) => c.meta.slug === slug);
  if (!found) return null;
  marked.setOptions({ breaks: false, gfm: true });
  const html = marked.parse(found.body) as string;
  return { ...found.meta, html };
}

/** 静的生成用の slug 一覧 */
export function getColumnSlugs(): string[] {
  return readAll().map((c) => c.meta.slug);
}
