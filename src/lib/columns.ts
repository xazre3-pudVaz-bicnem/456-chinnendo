import fs from "node:fs";
import path from "node:path";
import { marked, type Tokens } from "marked";

/**
 * /content/columns/*.md を読み込み、コラム記事として提供します。
 * 追加のMarkdownライブラリ設定は不要で、ファイルを置くだけで公開されます。
 *
 * frontmatter:
 *   title / description / date / updatedAt / category / author / keywords / excerpt
 */

const COLUMNS_DIR = path.join(process.cwd(), "content", "columns");

export type ColumnMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** 実際に内容を更新した日（偽装しない） */
  updatedAt: string;
  category: string;
  author: string;
  keywords: string[];
  excerpt: string;
};

export type TocItem = { id: string; text: string };

export type Column = ColumnMeta & { html: string; toc: TocItem[] };

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
        updatedAt: data.updatedAt ?? "",
        category: data.category ?? "コラム",
        author: data.author ?? "456ちんねん堂",
        keywords: (data.keywords ?? "")
          .split(/[,、]/)
          .map((k) => k.trim())
          .filter(Boolean),
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

/** 見出しアンカーID（日本語見出しでも安定するよう連番ベース） */
function headingId(_text: string, index: number): string {
  return `section-${index + 1}`;
}

/** 1記事（本文HTML + 目次付き） */
export function getColumn(slug: string): Column | null {
  const found = readAll().find((c) => c.meta.slug === slug);
  if (!found) return null;

  // h2 見出しに id を付与し、目次を生成
  const toc: TocItem[] = [];
  const tokens = marked.lexer(found.body, { gfm: true });
  for (const t of tokens) {
    if (t.type === "heading" && (t as Tokens.Heading).depth === 2) {
      const text = (t as Tokens.Heading).text;
      toc.push({ id: headingId(text, toc.length), text });
    }
  }

  let h2Index = 0;
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }: Tokens.Heading) {
    const text = this.parser.parseInline(tokens);
    if (depth === 2) {
      const id = headingId(text, h2Index);
      h2Index += 1;
      return `<h2 id="${id}">${text}</h2>\n`;
    }
    return `<h${depth}>${text}</h${depth}>\n`;
  };

  const html = marked.parse(found.body, {
    gfm: true,
    breaks: false,
    renderer,
  }) as string;

  return { ...found.meta, html, toc };
}

/** 静的生成用の slug 一覧 */
export function getColumnSlugs(): string[] {
  return readAll().map((c) => c.meta.slug);
}

/**
 * 関連記事の自動抽出：
 * 同カテゴリ → キーワード一致数 → 新しい順 で最大 limit 件
 */
export function getRelatedColumns(slug: string, limit = 4): ColumnMeta[] {
  const all = getColumnList();
  const current = all.find((c) => c.slug === slug);
  if (!current) return all.slice(0, limit);

  const scored = all
    .filter((c) => c.slug !== slug)
    .map((c) => {
      let score = 0;
      if (c.category === current.category) score += 3;
      const kwMatches = c.keywords.filter((k) => current.keywords.includes(k)).length;
      score += kwMatches;
      return { c, score };
    })
    .sort((a, b) => b.score - a.score || (a.c.date < b.c.date ? 1 : -1));

  return scored.slice(0, limit).map((s) => s.c);
}
