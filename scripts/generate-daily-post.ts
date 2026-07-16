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

/** 内部リンク：サービス本体・重要ページ（実在するページのみ） */
const INTERNAL_LINKS = [
  { url: "/ohakamairi-daiko", label: "お墓参り代行の作業内容" },
  { url: "/ohaka-soji", label: "お墓掃除代行の作業内容" },
  { url: "/price", label: "料金案内" },
  { url: "/area", label: "対応エリア" },
  { url: "/flow", label: "ご利用の流れ" },
  { url: "/faq", label: "よくある質問" },
  { url: "/contact", label: "お問い合わせ" },
];

/**
 * 内部リンク：常設ガイド（/column）＝トピッククラスターの“柱”。
 * ブログ記事から関連する柱へリンクを張り、サイト内の評価を集約させる。
 * ※実在する記事のみ（content/columns/*.md と一致）
 */
const PILLAR_COLUMNS = [
  { url: "/column/ohakamairi-daiko-towa", label: "お墓参り代行とは（基本の解説）" },
  { url: "/column/ohaka-soji-daiko-souba", label: "お墓掃除代行の料金相場" },
  { url: "/column/ohakamairi-daiko-erabikata", label: "お墓参り代行の選び方" },
  { url: "/column/hitaimen-ohakamairi-irai", label: "非対面で依頼する方法" },
  { url: "/column/enpou-ohaka-kanri", label: "遠方のお墓を管理する方法" },
  { url: "/column/kourei-ohakamairi-muzukashii", label: "高齢でお墓参りが難しいとき" },
  { url: "/column/boseki-souji-chuui", label: "墓石を自分で掃除する際の注意点" },
  { url: "/column/ohaka-zassou-taisaku", label: "お墓の雑草対策" },
  { url: "/column/shashin-houkoku-kakunin", label: "写真報告で確認できること" },
  { url: "/column/kuiki-bangou-wakaranai", label: "お墓の場所が分からないときの確認方法" },
];

// ---- トピックプール（456ちんねん堂用・カテゴリを交互に配置）-----------
//
// 【重要・キーワードのすみ分け】
//  このブログは「トピッククラスター」の“支援記事”を担当します。
//   - /ohakamairi-daiko, /ohaka-soji, /price … サービス本体（最重要KW）
//   - /column（常設ガイド25本）… 「お墓参り代行とは/相場/選び方/遠方/高齢/
//     お盆/お彼岸/命日/年末/雑草/墓石掃除の注意/苔/落ち葉/持ち物/供花」など汎用テーマ
//   - /area/[slug]（27市）… 「〇〇市 お墓参り代行」など地域KW
//  よって本プールでは上記と重複するテーマ・地域名KWは扱わず、
//  **より具体的で細かいロングテールの疑問**のみを扱います（カニバリ防止）。
//  新しいテーマを足すときは SEO_KEYWORD_MAP.md を確認し、重複しないこと。
type Topic = {
  id: string;
  theme: string;
  slugBase: string;
  category: string;
};

const TOPICS: Topic[] = [
  // --- 墓前用品・お墓の各部位（column / area が扱っていない細かい疑問）---
  { id: "hanatate-yogore", theme: "花立ての水が濁る・ぬめるときのお手入れ", slugBase: "hanatate-yogore", category: "お墓のお手入れ知識" },
  { id: "kouro-hai", theme: "香炉にたまった灰はどうする？扱い方の考え方", slugBase: "kouro-hai", category: "お墓のお手入れ知識" },
  { id: "tamajari-yogore", theme: "お墓の玉砂利が汚れてきたときに考えること", slugBase: "tamajari-yogore", category: "お墓のお手入れ知識" },
  { id: "bosi-moji-yomizurai", theme: "墓誌や墓石の文字が読みにくくなってきたら", slugBase: "bosi-moji-yomizurai", category: "お墓のお手入れ知識" },
  { id: "boseki-tsuya", theme: "墓石の艶がなくなってきたと感じたときの考え方", slugBase: "boseki-tsuya", category: "お墓のお手入れ知識" },
  { id: "boseki-kabi-koke-chigai", theme: "墓石の「カビ」と「苔」はどう違う？", slugBase: "boseki-kabi-koke-chigai", category: "お墓のお手入れ知識" },

  // --- 墓地の環境まわり ---
  { id: "bochi-suidou-nai", theme: "墓地に水道や手桶がないときのお墓掃除", slugBase: "bochi-suidou-nai", category: "お墓掃除・墓石清掃" },
  { id: "ki-no-ne-bochi", theme: "墓地に木の根や枝が伸びてきたときの相談先", slugBase: "ki-no-ne-bochi", category: "お墓掃除・墓石清掃" },
  { id: "tonari-kukaku-ochiba", theme: "隣の区画に落ち葉や草が入ってしまうとき", slugBase: "tonari-kukaku-ochiba", category: "お墓掃除・墓石清掃" },
  { id: "bochi-tsuuro-kusa", theme: "墓地の通路の草はどこまで掃除する？", slugBase: "bochi-tsuuro-kusa", category: "お墓掃除・墓石清掃" },
  { id: "ohaka-mushi-taisaku", theme: "お墓まわりの虫が気になるときの考え方", slugBase: "ohaka-mushi-taisaku", category: "お墓のお手入れ知識" },
  { id: "shibafu-bochi-teire", theme: "芝生墓地・洋型墓石のお手入れで気をつけたいこと", slugBase: "shibafu-bochi-teire", category: "お墓掃除・墓石清掃" },

  // --- 天候・時期の実務（column の季節記事とは別角度）---
  { id: "natsu-ohakamairi-anzen", theme: "夏のお墓参りを安全に行うために", slugBase: "natsu-ohakamairi-anzen", category: "季節のお墓掃除" },
  { id: "fuyu-ohaka-soji", theme: "冬の寒い時期のお墓掃除で気をつけること", slugBase: "fuyu-ohaka-soji", category: "季節のお墓掃除" },
  { id: "ame-no-hi-ohakamairi", theme: "雨の日のお墓参り・お墓掃除はどうする？", slugBase: "ame-no-hi-ohakamairi", category: "季節のお墓掃除" },
  { id: "shinbon-junbi", theme: "新盆（初盆）を迎えるお墓の準備", slugBase: "shinbon-junbi", category: "季節のお墓掃除" },
  { id: "shougatsu-ohakamairi", theme: "年始・お正月のお墓参りという習わし", slugBase: "shougatsu-ohakamairi", category: "季節のお墓掃除" },
  { id: "isshuki-junbi", theme: "一周忌や法要の前にお墓を整えておく", slugBase: "isshuki-junbi", category: "季節のお墓掃除" },

  // --- 暮らしの事情（column の遠方/高齢/入院とは別のシーン）---
  { id: "tenkin-ohaka-kanri", theme: "転勤が決まったときのお墓の管理をどうするか", slugBase: "tenkin-ohaka-kanri", category: "遠方・行けない方へ" },
  { id: "kaigai-funin-ohaka", theme: "海外赴任中に日本のお墓をどう見守るか", slugBase: "kaigai-funin-ohaka", category: "遠方・行けない方へ" },
  { id: "shisetsu-nyuukyo-oya-ohaka", theme: "親が施設に入居したあとのお墓の管理", slugBase: "shisetsu-nyuukyo-oya-ohaka", category: "遠方・行けない方へ" },
  { id: "shinzoku-buntan", theme: "親族でお墓の管理を分担するときの話し合い", slugBase: "shinzoku-buntan", category: "遠方・行けない方へ" },
  { id: "kikyou-higaeri-dandori", theme: "遠方から日帰りでお墓参りするときの段取り", slugBase: "kikyou-higaeri-dandori", category: "遠方・行けない方へ" },
  { id: "hajimete-jikka-ohaka", theme: "実家のお墓を初めて訪ねるときに確認したいこと", slugBase: "hajimete-jikka-ohaka", category: "遠方・行けない方へ" },

  // --- お参りの疑問（column の持ち物・供花とは別角度）---
  { id: "ohakamairi-hindo", theme: "お墓参りの頻度はどれくらいがいい？", slugBase: "ohakamairi-hindo", category: "お墓のお手入れ知識" },
  { id: "osonaemono-mochikaeri", theme: "お供え物を持ち帰るのはなぜ？", slugBase: "osonaemono-mochikaeri", category: "お墓のお手入れ知識" },
  { id: "reien-rule-chigai", theme: "霊園ごとにルールが違うのはなぜ？確認のしかた", slugBase: "reien-rule-chigai", category: "お墓のお手入れ知識" },
  { id: "zouka-ohaka", theme: "お墓に造花を供えてもいい？考え方と確認先", slugBase: "zouka-ohaka", category: "お墓のお手入れ知識" },
  { id: "ohakamairi-fukusou", theme: "お墓参りの服装に決まりはある？", slugBase: "ohakamairi-fukusou", category: "お墓のお手入れ知識" },
  { id: "kodomo-to-ohakamairi", theme: "子どもと一緒にお墓参りをするとき", slugBase: "kodomo-to-ohakamairi", category: "お墓のお手入れ知識" },

  // --- 代行サービスの実務（column の選び方/料金とは別の細部）---
  { id: "daiko-hajimete-fuan", theme: "はじめてお墓参り代行を頼むときの不安と、その解消", slugBase: "daiko-hajimete-fuan", category: "サービスの選び方" },
  { id: "daiko-mae-jibun-de", theme: "代行を頼む前に、自分でできることはある？", slugBase: "daiko-mae-jibun-de", category: "サービスの選び方" },
  { id: "houkoku-shinzoku-kyouyuu", theme: "作業報告の写真を親族と共有するという使い方", slugBase: "houkoku-shinzoku-kyouyuu", category: "サービスの選び方" },
  { id: "daiko-tachiai", theme: "お墓参り代行に立ち会うことはできる？", slugBase: "daiko-tachiai", category: "サービスの選び方" },
  { id: "teiki-hindo-kimekata", theme: "定期的なお墓の管理は、どのくらいの頻度がいい？", slugBase: "teiki-hindo-kimekata", category: "サービスの選び方" },
  { id: "boseki-fukusuu-souden", theme: "墓石が複数ある区画をお願いするとき", slugBase: "boseki-fukusuu-souden", category: "サービスの選び方" },

  // --- 状態別の相談 ---
  { id: "nagaku-ikenai-ohaka", theme: "何年も行けていないお墓は、どこから手をつける？", slugBase: "nagaku-ikenai-ohaka", category: "お墓掃除・墓石清掃" },
  { id: "ohaka-joutai-wakaranai", theme: "お墓の今の状態が分からないときの確認方法", slugBase: "ohaka-joutai-wakaranai", category: "お墓掃除・墓石清掃" },
  { id: "kusa-nobihoudai", theme: "草が伸びきってしまったお墓の整え方", slugBase: "kusa-nobihoudai", category: "お墓のお手入れ知識" },
  { id: "ohakamairi-daiko-gimon", theme: "お墓参り代行は「失礼では？」と感じたときに", slugBase: "ohakamairi-daiko-gimon", category: "サービスの選び方" },
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
  const linkList = links.map((l) => `- ${l.label}: ${l.url}`).join("\n");
  // クラスター構造：関連する常設ガイド（/column）へも上位リンクを張る
  const pillarList = PILLAR_COLUMNS.map((l) => `- ${l.label}: ${l.url}`).join("\n");

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
    "- 本文中に、文脈に合う内部リンクを3〜5個、Markdownリンク（[表示テキスト](URL)）で自然に挿入する。アンカーテキストは具体的にし、「こちら」は使わない",
    "",
    "【重要・記事の役割（キーワードのすみ分け）】",
    "この記事は、サイト内の“細かい疑問に答える支援記事”です。次を厳守してください。",
    "- 与えられたテーマの具体的な疑問に絞って答える。サービス全体の総合解説にしない",
    "- タイトルに市区町村名（千葉市・船橋市など）を入れない。地域特化ページは別に存在するため",
    "- 「お墓参り代行とは」「料金相場」「選び方」といった総合テーマを主題にしない（それらは常設ガイドが担当）。関連して触れる場合は、深入りせず該当ガイドへリンクする",
    "- 本文中では、地域の話題は「千葉県内」程度にとどめる",
  ].join("\n");

  const user = [
    `今日の記事テーマ：「${topic.theme}」`,
    fresh
      ? ""
      : "※このテーマは過去に一度書いています。前回とは異なる切り口・見出し構成で、新しい観点から書き直してください。",
    "",
    "利用できる内部リンク①：サービス・重要ページ（文脈に合うものだけ使う）",
    linkList,
    "",
    "利用できる内部リンク②：関連する常設ガイド（テーマに関係するものを1〜2個は必ず使う）",
    pillarList,
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
