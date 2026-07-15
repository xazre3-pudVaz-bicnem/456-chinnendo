/**
 * 料金情報（トップ・料金ページで共有）
 * 料金の変更は siteConfig.mainPrice と、このファイルの included / notes を編集してください。
 */
import { siteConfig } from "./site";

/** 表示用の金額フォーマット（例: 22,000） */
export function formatYen(value: number): string {
  return value.toLocaleString("ja-JP");
}

export const pricing = {
  /** 基本プラン */
  basic: {
    name: "基本プラン",
    unit: "墓石1基",
    price: siteConfig.mainPrice,
    taxNote: "税込",
    /** 料金に含まれる内容 */
    included: [
      "墓石全体の水洗い・拭き上げ",
      "墓地周辺の雑草取り",
      "落ち葉・枯れ葉・ゴミの回収",
      "香炉・花立てなど墓前用品周辺の清掃",
      "作業前後の写真報告",
      `片道${siteConfig.includedDistanceKm}kmまでの移動費`,
      `片道${siteConfig.includedDistanceKm}kmまでの高速道路料金`,
    ],
  },

  /** 追加費用が発生する可能性のあるケース（推測ではなく「相談・見積もり」として案内） */
  additional: [
    {
      title: "遠方（片道30km超）の場合",
      body: `片道${siteConfig.includedDistanceKm}kmを超える墓地の場合は、距離に応じて別途お見積もりいたします。`,
    },
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
    flowerIncense:
      "供花・線香の扱い（料金に含まれるか等）は、ご希望内容により異なります。お問い合わせ時にご案内します。",
    regularPlan:
      "定期的な清掃・管理のプランについても承っています。ご希望の頻度をお聞かせいただければ、内容と料金を個別にご案内します。",
    payment:
      "お支払い方法については、お問い合わせ時に個別にご案内いたします。",
    cancel: "キャンセルについては、お問い合わせ時に個別にご案内いたします。",
  },
} as const;
