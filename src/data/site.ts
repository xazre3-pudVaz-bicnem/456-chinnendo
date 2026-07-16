/**
 * ============================================================
 *  サイト全体の基本情報（シングルソース）
 * ------------------------------------------------------------
 *  屋号・電話番号・料金・エリアなどは、必ずこのファイルを
 *  書き換えてください。各ページ・構造化データ・フッター等へ
 *  自動で反映されます。
 *
 *  「要確認」コメントが付いた項目は、現時点で未確定の情報です。
 *  Instagram / ご本人への確認後に値を入れてください。
 * ============================================================
 */

export const siteConfig = {
  /** 屋号 */
  name: "456ちんねん堂",
  /** 読み仮名（未確認） */ // 要確認
  nameKana: "",
  /** 英語表記ラベル（ヒーロー等で使用） */
  nameEn: "CHINNENDO",

  /** キャッチコピー */
  tagline: "大切な人を想う気持ちを、これからも。",

  /** 電話番号（表示用） */
  phone: "090-3855-4560",
  /** tel: リンク用 */
  phoneTel: "tel:09038554560",
  /** 構造化データ用（国際形式） */
  phoneIntl: "+81-90-3855-4560",
  /** 電話に関する案内（営業時間が未確認のため、折り返し案内を掲載） */
  phoneNote:
    "作業中や移動中などで電話に出られない場合があります。着信を確認後、折り返しご連絡いたします。",

  /** Instagram */
  instagram: "https://www.instagram.com/456.chinnendo/?hl=ja",
  instagramHandle: "@456.chinnendo",

  /** 対応エリア（概要） */
  area: "千葉県内全域",
  areaRegion: "千葉県",

  /**
   * 基本料金（墓石1基・お花代/お線香代込み）— 料金の変更はこの値だけでOK
   * ※Instagram掲載の料金表（2026年7月確認）に準拠
   * 要確認：税込表記かどうか（現状サイトでは「税込」と表示）
   */
  mainPrice: 19800,
  /** 定期コース（基本プランの内容を2回実施・お花代/お線香代込み） */
  regularPrice: 35000,
  /** 定期コースの実施回数 */
  regularTimes: 2,
  /** 料金に含まれる移動距離（片道・km） */
  includedDistanceKm: 30,

  // ---- 以下は未確定。確認後に入力してください ----
  address: "", // 要確認（Instagram掲載の住所は未検証のため空欄）
  postalCode: "", // 要確認
  businessHours: "", // 要確認（営業時間は勝手に作らない）
  representative: "", // 要確認（代表者名）
  /** 問い合わせ受信先（フォームの送信先は環境変数 CONTACT_TO_EMAIL が優先） */
  email: "chinnen.456@au.com",
  established: "", // 要確認（創業年）
  paymentMethods: "", // 要確認（支払い方法）

  /**
   * 画像プレースホルダーの管理用ラベル表示。
   * 写真差し替え位置を確認するときは true。本番公開時は false にすると
   * 「◯◯写真」などの管理ラベルが非表示になります。
   */
  showImagePlaceholderLabels: false,

  /**
   * ロゴ画像の有無。true でヘッダー・フッター・ローディング画面に
   * エンブレム（/images/logo-mark.png：ブランドビジュアル中央の切り出し）を表示。
   * 屋号テキストは可読性のため常に併記します。
   *
   * 要確認：元のブランドビジュアルはAI生成のため一部文字が崩れています
   * （「お葉参り」等）。小さい表示では目立ちませんが、修正版ロゴが用意でき次第
   * logo.png / logo-mark.png を差し替えてください。
   */
  hasLogo: true,
} as const;

/** 本番URL（環境変数優先） */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://456chinnendo.jp"; // 要確認：本番ドメイン確定後に .env / Vercel で設定

/** グローバルナビゲーション */
export const NAV_ITEMS = [
  { label: "ホーム", href: "/" },
  {
    label: "サービス",
    href: "/ohakamairi-daiko",
    children: [
      { label: "お墓参り代行", href: "/ohakamairi-daiko" },
      { label: "お墓掃除代行", href: "/ohaka-soji" },
    ],
  },
  { label: "料金", href: "/price" },
  { label: "対応エリア", href: "/area" },
  { label: "ご利用の流れ", href: "/flow" },
  { label: "私たちについて", href: "/about" },
  { label: "よくある質問", href: "/faq" },
  { label: "お問い合わせ", href: "/contact" },
] as const;

/** フッター用リンク（サービス） */
export const FOOTER_LINKS = {
  service: [
    { label: "お墓参り代行", href: "/ohakamairi-daiko" },
    { label: "お墓掃除代行", href: "/ohaka-soji" },
    { label: "料金案内", href: "/price" },
    { label: "対応エリア", href: "/area" },
    { label: "ご利用の流れ", href: "/flow" },
  ],
  about: [
    { label: "456ちんねん堂について", href: "/about" },
    { label: "よくある質問", href: "/faq" },
    { label: "お知らせ・コラム", href: "/column" },
    { label: "お問い合わせ", href: "/contact" },
  ],
  utility: [
    { label: "プライバシーポリシー", href: "/privacy" },
    { label: "サイトマップ", href: "/sitemap" },
  ],
} as const;
