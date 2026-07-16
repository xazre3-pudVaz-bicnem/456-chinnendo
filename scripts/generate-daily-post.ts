/**
 * 毎日1記事を Claude API で自動生成し、content/blog/ に Markdown で保存します。
 * GitHub Actions（.github/workflows/daily-blog.yml）から実行されます。
 *
 * 実行:  npx tsx scripts/generate-daily-post.ts
 * 必要な環境変数:
 *   - ANTHROPIC_API_KEY（必須）
 *   - ANTHROPIC_MODEL（任意。未設定なら Haiku を使用）
 *
 * 方針:
 *   - コスト削減のためデフォルトは claude-haiku-4-5-20251001
 *   - トピックプールから未使用のテーマを選び、重複を避ける
 *   - frontmatter(title/slug/description/date/category/tags/topicId) を必ず付与
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";

// ---- 設定 -------------------------------------------------------------
const DEFAULT_MODEL = "claude-haiku-4-5-20251001";
const MODEL = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

const SITE = {
  name: "456ちんねん堂",
  baseUrl: "https://www.456chinnendo.com",
  business: "お墓参り代行・お墓掃除代行・墓石清掃・供花代行",
  area: "千葉県内全域（千葉市・船橋市・市川市・松戸市・柏市・成田市など）",
  price: "基本プラン 墓石1基 19,800円（税込・お花代/お線香代込み）、定期コース（2回）35,000円",
  fee: "千葉県内は移動費・高速道路料金込みで、距離による追加料金なし",
} as const;

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** 内部リンク（実在するページのみ） */
const INTERNAL_LINKS = [
  { url: "/ohakamairi-daiko", label: "お墓参り代行の作業内容" },
  { url: "/ohaka-soji", label: "お墓掃除代行の作業内容" },
  { url: "/price", label: "料金案内" },
  { url: "/area", label: "対応エリア" },
  { url: "/flow", label: "ご利用の流れ" },
  { url: "/faq", label: "よくある質問" },
  { url: "/contact", label: "お問い合わせ" },
];

// ---- トピックプール（456ちんねん堂用・カテゴリを交互に配置）-----------
type Topic = {
  id: string;
  theme: string;
  slugBase: string;
  category: string;
  areaLink?: { url: string; label: string };
};

const TOPICS: Topic[] = [
  { id: "chiba-ohakamairi-daiko", theme: "千葉県のお墓参り代行とは（サービス全体像）", slugBase: "chiba-ohakamairi-daiko", category: "お墓参り代行" },
  { id: "chiba-ohaka-soji-daiko", theme: "千葉県のお墓掃除代行でできること", slugBase: "chiba-ohaka-soji-daiko", category: "お墓掃除・墓石清掃" },
  { id: "ohakamairi-ikenai-taisho", theme: "お墓参りに行けないときの対処法", slugBase: "ohakamairi-ikenai-taisho", category: "遠方・行けない方へ" },
  { id: "obon-ohaka-soji", theme: "お盆前のお墓掃除で準備しておきたいこと", slugBase: "obon-ohaka-soji", category: "季節のお墓掃除" },
  { id: "chiba-city-ohakamairi", theme: "千葉市でのお墓参り代行・お墓掃除代行", slugBase: "chiba-city-ohakamairi", category: "地域別ガイド", areaLink: { url: "/area/chiba-city", label: "千葉市の対応エリア" } },
  { id: "ohaka-kusamushiri", theme: "お墓の草むしりを代行に頼むという選択", slugBase: "chiba-ohaka-kusamushiri", category: "お墓のお手入れ知識" },
  { id: "ohakamairi-daiko-erabikata", theme: "お墓参り代行の選び方で確認したいこと", slugBase: "ohakamairi-daiko-erabikata-guide", category: "サービスの選び方" },
  { id: "chiba-boseki-seiso", theme: "千葉県の墓石清掃で気をつけたいこと", slugBase: "chiba-boseki-seiso", category: "お墓掃除・墓石清掃" },
  { id: "kourei-ohakamairi", theme: "高齢でお墓参りに行けない場合の選択肢", slugBase: "kourei-ohakamairi", category: "遠方・行けない方へ" },
  { id: "ohigan-ohaka-soji", theme: "お彼岸前のお墓掃除の進め方", slugBase: "ohigan-ohaka-soji", category: "季節のお墓掃除" },
  { id: "funabashi-ohakamairi", theme: "船橋市でのお墓参り代行・お墓掃除代行", slugBase: "funabashi-ohakamairi", category: "地域別ガイド", areaLink: { url: "/area/funabashi", label: "船橋市の対応エリア" } },
  { id: "ohaka-mizuaka", theme: "お墓の水垢が気になるときの考え方", slugBase: "chiba-ohaka-mizuaka", category: "お墓のお手入れ知識" },
  { id: "chiba-kyouka-daiko", theme: "千葉県での供花代行・お花のお供えについて", slugBase: "chiba-kyouka-daiko", category: "お墓参り代行" },
  { id: "chiba-reien-ohaka-soji", theme: "千葉県内の霊園でのお墓掃除の注意点", slugBase: "chiba-reien-ohaka-soji", category: "お墓掃除・墓石清掃" },
  { id: "isogashii-ohakamairi", theme: "忙しくてお墓参りに行けない場合の頼み方", slugBase: "isogashii-ohakamairi", category: "遠方・行けない方へ" },
  { id: "nenmatsu-ohaka-soji", theme: "年末のお墓掃除で見ておきたいポイント", slugBase: "nenmatsu-ohaka-soji-blog", category: "季節のお墓掃除" },
  { id: "ichikawa-ohakamairi", theme: "市川市でのお墓参り代行・お墓掃除代行", slugBase: "ichikawa-ohakamairi", category: "地域別ガイド", areaLink: { url: "/area/ichikawa", label: "市川市の対応エリア" } },
  { id: "ohaka-koke", theme: "お墓の苔が気になるときのお手入れの考え方", slugBase: "chiba-ohaka-koke", category: "お墓のお手入れ知識" },
  { id: "chiba-ohakamairi-service", theme: "千葉県のお墓参り代行サービスの使い方", slugBase: "chiba-ohakamairi-service", category: "お墓参り代行" },
  { id: "ohaka-soji-ryokin-kakunin", theme: "お墓掃除代行の料金で確認すべきこと", slugBase: "ohaka-soji-ryokin-kakunin", category: "サービスの選び方" },
  { id: "enpou-kazoku-ohakamairi", theme: "遠方に住む家族に代わってお墓参りをする方法", slugBase: "enpou-kazoku-ohakamairi", category: "遠方・行けない方へ" },
  { id: "meinichi-ohakamairi-daiko", theme: "命日前のお墓参り代行という選び方", slugBase: "meinichi-ohakamairi-daiko-blog", category: "お墓参り代行" },
  { id: "matsudo-ohakamairi", theme: "松戸市でのお墓参り代行・お墓掃除代行", slugBase: "matsudo-ohakamairi", category: "地域別ガイド", areaLink: { url: "/area/matsudo", label: "松戸市の対応エリア" } },
  { id: "ohaka-soji-yatte-ikenai", theme: "お墓掃除でやってはいけないこと", slugBase: "ohaka-soji-yatte-ikenai", category: "お墓のお手入れ知識" },
  { id: "chiba-ohaka-seiso", theme: "千葉県のお墓清掃を代行するときの流れ", slugBase: "chiba-ohaka-seiso", category: "お墓掃除・墓石清掃" },
  { id: "boseki-kizutsukenai", theme: "墓石を傷つけないお手入れの考え方", slugBase: "boseki-kizutsukenai", category: "お墓のお手入れ知識" },
  { id: "kashiwa-ohakamairi", theme: "柏市でのお墓参り代行・お墓掃除代行", slugBase: "kashiwa-ohakamairi", category: "地域別ガイド", areaLink: { url: "/area/kashiwa", label: "柏市の対応エリア" } },
  { id: "ohaka-soji-nagare", theme: "お墓掃除の一般的な流れ", slugBase: "ohaka-soji-nagare", category: "お墓のお手入れ知識" },
  { id: "chiba-ohakamairi-enpou", theme: "千葉県の遠方のお墓を管理する方法", slugBase: "chiba-ohakamairi-enpou", category: "遠方・行けない方へ" },
  { id: "ohaka-ochiba", theme: "お墓の落ち葉掃除と季節のお手入れ", slugBase: "ohaka-ochiba", category: "季節のお墓掃除" },
  { id: "narita-ohakamairi", theme: "成田市でのお墓参り代行・お墓掃除代行", slugBase: "narita-ohakamairi", category: "地域別ガイド", areaLink: { url: "/area/narita", label: "成田市の対応エリア" } },
  { id: "ohaka-yogore-genin", theme: "お墓の汚れの原因と日頃のお手入れ", slugBase: "ohaka-yogore-genin", category: "お墓のお手入れ知識" },
  { id: "ohaka-zassou", theme: "お墓の雑草対策の考え方", slugBase: "chiba-ohaka-zassou", category: "お墓のお手入れ知識" },
  { id: "kazoku-kawari-ohaka", theme: "家族に代わってお墓をきれいにするサービス", slugBase: "kazoku-kawari-ohaka", category: "お墓参り代行" },
];

// ---- ユーティリティ ---------------------------------------------------
function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function stamp(): string {
  return today().replace(/-/g, "");
}

/** 既存記事の topicId → 最終日付 を取得 */
function existingTopics(): Map<string, string> {
  const map = new Map<string, string>();
  if (!fs.existsSync(BLOG_DIR)) return map;
  for (const file of fs.readdirSync(BLOG_DIR)) {
    if (!file.endsWith(".md")) continue;
    const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf-8"));
    const id = String(data.topicId ?? "");
    const date = String(data.date ?? "");
    if (id && (!map.has(id) || date > (map.get(id) ?? ""))) map.set(id, date);
  }
  return map;
}

/** 未使用トピックを優先し、全て使用済みなら最も古いものを選ぶ */
function pickTopic(): { topic: Topic; fresh: boolean } {
  const used = existingTopics();
  const unused = TOPICS.filter((t) => !used.has(t.id));
  if (unused.length > 0) {
    // 既存記事数でインデックスを進め、カテゴリの偏りを避ける
    const idx = used.size % unused.length;
    return { topic: unused[idx], fresh: true };
  }
  // 全て使用済み：最終掲載日が最も古いテーマを新しい切り口で再執筆
  const sorted = [...TOPICS].sort(
    (a, b) => (used.get(a.id) ?? "").localeCompare(used.get(b.id) ?? ""),
  );
  return { topic: sorted[0], fresh: false };
}

function uniqueSlug(base: string): string {
  const primary = base;
  if (!fs.existsSync(path.join(BLOG_DIR, `${primary}.md`))) return primary;
  return `${base}-${stamp()}`;
}

/** モデル出力からJSONを取り出す（```フェンス等を除去） */
function extractJson(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) return fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text.trim();
}

/** 本文の軽い整形（frontmatter・h1・余分なフェンスを除去） */
function cleanBody(body: string): string {
  let b = body.trim();
  b = b.replace(/^---[\s\S]*?---\s*/, ""); // 誤って入ったfrontmatter
  b = b.replace(/^```(?:markdown|md)?\s*/i, "").replace(/```\s*$/i, "");
  b = b.replace(/^#\s+.*$/m, "").trim(); // h1は削除（titleがh1になる）
  return b;
}

// ---- メイン -----------------------------------------------------------
async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ERROR: ANTHROPIC_API_KEY が設定されていません。");
    process.exit(1);
  }

  fs.mkdirSync(BLOG_DIR, { recursive: true });

  const { topic, fresh } = pickTopic();
  const date = today();
  const slug = uniqueSlug(topic.slugBase);

  console.log("──────────────────────────────────────────────");
  console.log(`使用モデル (model)   : ${MODEL}`);
  console.log(`テーマ    (topic)    : ${topic.theme}`);
  console.log(`カテゴリ  (category) : ${topic.category}`);
  console.log(`slug                 : ${slug}`);
  console.log(`再執筆(全消化後)     : ${fresh ? "no" : "yes"}`);
  console.log("──────────────────────────────────────────────");

  const links = [...INTERNAL_LINKS];
  if (topic.areaLink) links.unshift(topic.areaLink);
  const linkList = links.map((l) => `- ${l.label}: ${l.url}`).join("\n");

  const system = [
    `あなたは千葉県で「お墓参り代行・お墓掃除代行」を営む「${SITE.name}」のWebサイトのSEOライター兼、丁寧な語り口の編集者です。`,
    "読者は、お墓参りやお墓の掃除に行きたくても行けない事情を抱えた方（遠方・多忙・高齢・体調など）や、その代行を検討している方です。",
    "誠実で落ち着いた、押し付けがましくない文章を書きます。次のルールを厳守してください。",
    "- 日本語で執筆する",
    "- 本文（frontmatterを除く）は2,000〜3,000文字程度",
    "- 見出しは ## (H2) と ### (H3) で構成し、H1(#)は使わない",
    "- 冒頭に導入文、中盤に本文、最後に「まとめ」を置く",
    "- 「千葉」「お墓参り代行」「お墓掃除代行」「墓石清掃」と対応エリアの地域名を自然に含める（詰め込みは禁止）",
    "- AIにありがちな定型的な決まり文句・冗長な前置きは避け、自然で具体的な文章にする",
    "- 「必ずきれいになる」「最安」「千葉で一番」「No.1」など根拠のない断定・誇張は禁止",
    "- 料金・対応可否・作業時間を断定しすぎない。現地の状況や霊園の規定によって対応が変わり得ることを自然に触れる",
    "- 墓石清掃について、特定の薬剤や高圧洗浄などの使用を勝手に断定しない。石材や状態を傷めない配慮を前提に書く",
    "- 宗教・供養・法要は断定せず、「地域や宗派、ご家庭によって異なります」といった一般的なマナーとして丁寧に書く",
    "- 他社を根拠なく批判しない",
    `- 事業の事実に矛盾しないこと。料金の目安は「${SITE.price}」、「${SITE.fee}」。相談方法は電話・公式LINE・Instagram・問い合わせフォーム（非対面で完結可）。作業前後の写真報告あり。`,
    "- 本文中に、文脈に合う内部リンクを2〜4個、Markdownリンク（[表示テキスト](URL)）で自然に挿入する。アンカーテキストは具体的にし、「こちら」は使わない",
  ].join("\n");

  const user = [
    `今日の記事テーマ：「${topic.theme}」`,
    fresh
      ? ""
      : "※このテーマは過去に一度書いています。前回とは異なる切り口・見出し構成で、新しい観点から書き直してください。",
    "",
    "利用できる内部リンク（実在するページ。文脈に合うものだけ使う）：",
    linkList,
    "",
    "次のJSON形式**のみ**を出力してください（前後に説明やコードフェンスを付けない）：",
    "{",
    '  "title": "32文字前後の記事タイトル（キーワードを自然に含む・煽らない）",',
    '  "description": "110〜130文字のメタディスクリプション",',
    '  "tags": ["タグ1", "タグ2", "タグ3", "タグ4"],',
    '  "body": "Markdown本文（frontmatterやH1は含めない。## と ### の見出し、導入・本文・まとめ、内部リンクを含む2000〜3000字）"',
    "}",
  ].join("\n");

  const client = new Anthropic({ apiKey });
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    temperature: 0.7,
    system,
    messages: [{ role: "user", content: user }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  let parsed: { title: string; description: string; tags: string[]; body: string };
  try {
    parsed = JSON.parse(extractJson(text));
  } catch (e) {
    console.error("ERROR: モデル出力のJSON解析に失敗しました。");
    console.error(text.slice(0, 800));
    throw e;
  }

  const title = String(parsed.title ?? "").trim();
  const description = String(parsed.description ?? "").trim();
  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 6)
    : [];
  const body = cleanBody(String(parsed.body ?? ""));

  if (!title || body.length < 500) {
    throw new Error(`生成結果が不十分です（title: ${title ? "有" : "無"} / 本文長: ${body.length}）`);
  }

  const fileContent = matter.stringify(`\n${body}\n`, {
    title,
    slug,
    description,
    date,
    updatedAt: date,
    category: topic.category,
    tags,
    topicId: topic.id,
  });

  const outPath = path.join(BLOG_DIR, `${slug}.md`);
  fs.writeFileSync(outPath, fileContent, "utf-8");

  const bodyChars = body.replace(/\s/g, "").length;
  console.log(`✓ 生成完了`);
  console.log(`  ファイル (file)     : content/blog/${slug}.md`);
  console.log(`  タイトル (title)    : ${title}`);
  console.log(`  本文文字数 (chars)  : 約 ${bodyChars} 文字`);
  console.log(`  使用モデル (model)  : ${MODEL}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
