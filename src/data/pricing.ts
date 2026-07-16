/**
 * 料金情報（トップ・料金ページで共有）
 * 料金の変更は siteConfig.mainPrice / regularPrice と、このファイルの
 * included / notes を編集してください。
 *
 * ※Instagram掲載の料金表（2026年7月確認）に準拠：
 *   基本プラン ¥19,800（お花代・お線香代込み）
 *   定期コース（2回）¥35,000（お花代・お線香代込み・¥4,600お得）
 */
import { siteConfig } from "./site";

/** 表示用の金額フォーマット（例: 19,800） */
export function formatYen(value: number): string {
  return value.toLocaleString("ja-JP");
}

export type Plan = {
  /** 英語ラベル */
  en: string;
  name: string;
  unit: string;
  price: number;
  taxNote: string; // 要確認：税込かどうか（Instagram料金表に明記なし）
  /** 価格の下に添える一言 */
  priceNote: string;
  /** プランの説明 */
  description: string;
  /** 料金に含まれる内容 */
  included: string[];
  /** お得額など（任意） */
  highlight?: string;
};

/** 基本プラン */
const basic: Plan = {
  en: "Basic Plan",
  name: "基本プラン",
  unit: "墓石1基",
  price: siteConfig.mainPrice,
  taxNote: "税込",
  priceNote: "お花代・お線香代込み",
  description:
    "お墓参り・お墓掃除の基本プランです。お参りからお掃除、写真報告まで、ひとつのプランにまとめています。",
  included: [
    "心を込めたお参り",
    "お花・お線香のお供え（代金込み）",
    "敷地全体の草むしり",
    "しつこい水垢・苔などの汚れ除去",
    "敷地全体の徹底清掃",
    "作業前後の写真報告",
    "千葉県内の移動費・高速道路料金（距離による追加なし）",
  ],
};

/** 定期コース（基本プランの内容を2回実施） */
const regular: Plan = {
  en: "Regular Course",
  name: `定期コース（${siteConfig.regularTimes}回）`,
  unit: `基本プラン${siteConfig.regularTimes}回分`,
  price: siteConfig.regularPrice,
  taxNote: "税込",
  priceNote: "お花代・お線香代込み",
  description:
    "基本プランの内容を2回実施する、まとめてお得なコースです。お彼岸・お盆・年末・命日など、ご希望の時期を承ります。",
  included: [
    "基本プランの内容を2回実施",
    "お彼岸・お盆・年末・命日などご希望の時期に対応",
    "毎回、作業前後の写真報告",
  ],
  highlight: `¥${formatYen(
    siteConfig.mainPrice * siteConfig.regularTimes - siteConfig.regularPrice,
  )}お得`,
};

export const pricing = {
  basic,
  regular,
  plans: [basic, regular] as Plan[],

  /** 追加費用が発生する可能性のあるケース（推測ではなく「相談・見積もり」として案内）
   *  ※移動距離による追加料金はなし（千葉県内全域、移動費・高速道路料金込み） */
  additional: [
    {
      title: "墓石が複数ある場合",
      body: "墓石の基数に応じて費用が変わります。基数をお知らせいただければ事前にご案内します。",
    },
    {
      title: "雑草・汚れの状態によって",
      body: "長期間手入れがされていない、雑草が非常に多いなど、状況によっては追加作業をご相談する場合があります。",
    },
    {
      title: "墓地の広さによって",
      body: "区画が広い場合や墓地周辺の清掃範囲が広い場合は、事前にお見積もりいたします。",
    },
  ],

  /** 未確定のため断定しない項目（表示は「お問い合わせ時にご案内」） */ // 要確認
  toConfirm: {
    payment:
      "お支払い方法については、お問い合わせ時に個別にご案内いたします。",
    cancel: "キャンセルについては、お問い合わせ時に個別にご案内いたします。",
  },
} as const;
