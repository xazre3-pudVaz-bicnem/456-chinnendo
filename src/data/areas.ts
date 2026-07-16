/**
 * 対応エリア（対応エリアページ・市区町村別ページ・フッター等で共有）
 *
 * - 千葉県内全域対応・距離による追加料金なし
 * - 市区町村別ページのデータは src/data/areas/<slug>.ts に1市1ファイルで管理
 * - ページを追加する場合：新しいファイルを作成し、下の import と areaPages に追加
 * - 市名だけを置換した重複ページを作らない（各ページに固有の intro / faq を書く）
 * - 存在確認をしていない墓地名・霊園名は掲載しない
 */

import { chibaCity } from "./areas/chiba-city";
import { funabashi } from "./areas/funabashi";
import { ichikawa } from "./areas/ichikawa";
import { matsudo } from "./areas/matsudo";
import { kashiwa } from "./areas/kashiwa";
import { nagareyama } from "./areas/nagareyama";
import { urayasu } from "./areas/urayasu";
import { narashino } from "./areas/narashino";
import { yachiyo } from "./areas/yachiyo";
import { kamagaya } from "./areas/kamagaya";
import { ichihara } from "./areas/ichihara";
import { kisarazu } from "./areas/kisarazu";
import { narita } from "./areas/narita";
import { sakura } from "./areas/sakura";
import { inzai } from "./areas/inzai";
import { yotsukaido } from "./areas/yotsukaido";
import { sodegaura } from "./areas/sodegaura";
import { kimitsu } from "./areas/kimitsu";
import { futtsu } from "./areas/futtsu";
import { yachimata } from "./areas/yachimata";
import { togane } from "./areas/togane";
import { mobara } from "./areas/mobara";
import { tateyama } from "./areas/tateyama";
import { kamogawa } from "./areas/kamogawa";
import { choshi } from "./areas/choshi";
import { asahi } from "./areas/asahi";
import { katori } from "./areas/katori";

export type AreaFaq = { q: string; a: string };

export type AreaPage = {
  /** URL: /area/<slug> */
  slug: string;
  /** 市区町村名（例: 千葉市） */
  city: string;
  /** 所属地域（areaRegions の name と一致させる） */
  region: string;
  /** ページ固有の title（メタ用・「｜456ちんねん堂」は自動付与） */
  title: string;
  /** ページ固有の description */
  description: string;
  /**
   * その地域向けの固有の説明（3〜5段落）。
   * 市名置換の使い回しは禁止。地域の検索意図・利用シーンに合わせて書く。
   * 未確認の墓地名・人口・地域事情は書かない。
   */
  intro: string[];
  /** その地域向けの固有FAQ（2〜3問。全ページ共通FAQの使い回し禁止） */
  faq: AreaFaq[];
  /** 近隣エリアのslug（内部リンク用） */
  neighbors: string[];
};

/** 千葉県内の地域区分（/area 親ページの構成） */
export type AreaRegion = {
  name: string;
  /** 地域の対応方針の説明（固有） */
  description: string;
  /** ページがある市のslug */
  citySlugs: string[];
  /** ページ未作成だが対応している市町村名（テキスト表示のみ） */
  otherCities: string[];
};

export const areaRegions: AreaRegion[] = [
  {
    name: "千葉市周辺",
    description:
      "県庁所在地の千葉市とその周辺は、区ごとに墓地や霊園の環境が異なります。市街地の寺院墓地から郊外の霊園まで、場所を問わずご相談いただけます。",
    citySlugs: ["chiba-city", "yotsukaido"],
    otherCities: [],
  },
  {
    name: "東葛・葛南地域（県北西部）",
    description:
      "船橋・市川・松戸・柏など東京に近いエリアは、県外にお住まいのご家族からの非対面のご依頼が特に多い地域です。ご実家のお墓の管理も、写真報告付きで安心してお任せいただけます。",
    citySlugs: [
      "funabashi",
      "ichikawa",
      "matsudo",
      "kashiwa",
      "nagareyama",
      "urayasu",
      "narashino",
      "yachiyo",
      "kamagaya",
    ],
    otherCities: ["我孫子市", "野田市"],
  },
  {
    name: "印旛・北総地域",
    description:
      "成田・佐倉・印西など北総エリアには、歴史ある寺院墓地から新しい霊園まで幅広い墓地があります。ご遠方からのご依頼も、墓地情報を確認しながら丁寧に進めます。",
    citySlugs: ["narita", "sakura", "inzai", "yachimata"],
    otherCities: ["白井市", "富里市"],
  },
  {
    name: "内房地域",
    description:
      "市原から木更津・君津方面の内房エリアは、都心からアクアラインを利用して帰省される方も多い地域です。なかなか帰れない時期のお墓のお手入れをお手伝いします。",
    citySlugs: ["ichihara", "kisarazu", "sodegaura", "kimitsu", "futtsu"],
    otherCities: [],
  },
  {
    name: "外房地域",
    description:
      "茂原・東金など外房エリアの墓地にも、県内一律の料金で伺います。海風や落ち葉など、地域の環境に合わせたお手入れをご相談ください。",
    citySlugs: ["togane", "mobara"],
    otherCities: ["大網白里市", "いすみ市", "勝浦市"],
  },
  {
    name: "南房総地域",
    description:
      "館山・鴨川など房総半島南部も対応エリアです。距離による追加料金はいただきませんので、ご遠方のお墓もあきらめずにご相談ください。",
    citySlugs: ["tateyama", "kamogawa"],
    otherCities: ["南房総市"],
  },
  {
    name: "東総地域",
    description:
      "銚子・旭・香取方面の東総エリアにも同じ料金で伺います。長くお参りできていないお墓の状態確認からでもご相談いただけます。",
    citySlugs: ["choshi", "asahi", "katori"],
    otherCities: ["匝瑳市"],
  },
];

/** 市区町村別ページ（全27市） */
export const areaPages: AreaPage[] = [
  chibaCity,
  funabashi,
  ichikawa,
  matsudo,
  kashiwa,
  nagareyama,
  urayasu,
  narashino,
  yachiyo,
  kamagaya,
  ichihara,
  kisarazu,
  narita,
  sakura,
  inzai,
  yotsukaido,
  sodegaura,
  kimitsu,
  futtsu,
  yachimata,
  togane,
  mobara,
  tateyama,
  kamogawa,
  choshi,
  asahi,
  katori,
];

export function getAreaPage(slug: string): AreaPage | undefined {
  return areaPages.find((a) => a.slug === slug);
}

/** 一覧表示用（/area 親ページで使用する市名リスト。ページがある市はリンク化） */
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

/** 市名 → ページslug の対応（AreaList でのリンク化に使用） */
export const cityToSlug: Record<string, string> = Object.fromEntries(
  areaPages.map((a) => [a.city, a.slug]),
);
