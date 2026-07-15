/**
 * 対応エリア（対応エリアページ・フッター等で共有）
 *
 * 千葉県内全域対応。市区町村名の羅列はSEOスパムにならないよう、
 * 「まずご相談ください」という導線を主目的にしています。
 *
 * 将来のエリア個別ページ（/area/[slug]）はこの areaPages に追加してください。
 * ※ 内容がほぼ同じページの機械的な量産は避け、各エリア固有の情報を持たせること。
 */

/** 千葉県内の主要市（相談の目安として掲載。羅列SEO目的ではない） */
export const chibaCities = [
  "千葉市",
  "船橋市",
  "市川市",
  "松戸市",
  "柏市",
  "流山市",
  "我孫子市",
  "浦安市",
  "習志野市",
  "八千代市",
  "鎌ケ谷市",
  "市原市",
  "木更津市",
  "袖ケ浦市",
  "君津市",
  "富津市",
  "佐倉市",
  "成田市",
  "印西市",
  "白井市",
  "四街道市",
  "八街市",
  "東金市",
  "茂原市",
  "館山市",
  "鴨川市",
  "銚子市",
  "香取市",
  "旭市",
] as const;

/**
 * エリア個別ページ用データ（初期は空 = ページを量産しない）。
 * 追加する場合の型の例：
 *   {
 *     slug: "chiba-city",
 *     city: "千葉市",
 *     title: "千葉市のお墓参り代行・お墓掃除代行",
 *     description: "...",
 *     intro: ["..."],
 *     faq: [{ q: "...", a: "..." }],
 *   }
 */
export type AreaPage = {
  slug: string;
  city: string;
  title: string;
  description: string;
  intro: string[];
  faq: { q: string; a: string }[];
};

export const areaPages: AreaPage[] = [
  // 要確認：エリアページは、実際に対応した内容に合わせて1ページずつ丁寧に追加する。
  // 存在確認をしていない霊園・墓地名は掲載しない。
];

export function getAreaPage(slug: string): AreaPage | undefined {
  return areaPages.find((a) => a.slug === slug);
}
