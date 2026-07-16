/**
 * トップ・各ページで使う定型コンテンツ（お悩み・選ばれる理由・流れ・作業事例・Instagram）
 * 文言の変更はこのファイルで行ってください。
 */

/* ------------------------------------------------------------------ */
/*  お悩み（For You）                                                  */
/* ------------------------------------------------------------------ */
export const worries: string[] = [
  "お墓が遠く、なかなか足を運べない",
  "忙しくてお盆やお彼岸に間に合わない",
  "高齢や体調の事情で掃除が難しい",
  "長期間、お墓の状態を確認できていない",
  "家族に代わって定期的に管理してほしい",
  "作業後の状態を写真で確認したい",
];

/* ------------------------------------------------------------------ */
/*  選ばれる理由（Why Chinnendo）                                       */
/* ------------------------------------------------------------------ */
export type Reason = { no: string; title: string; body: string };

export const reasons: Reason[] = [
  {
    no: "01",
    title: "一基一基、丁寧に清掃",
    body: "流れ作業ではなく、お墓の状態を確認しながら一基一基丁寧に作業します。石を傷めないことを大切にしています。",
  },
  {
    no: "02",
    title: "作業前後を写真で報告",
    body: "現地へ行けない方にも、作業内容と完了後の状態が分かるよう、作業前後を写真でご報告します。",
  },
  {
    no: "03",
    title: "基本的に非対面で依頼可能",
    body: "遠方にお住まいの場合でも、電話・LINE・Instagram・お問い合わせフォームで、ご相談から報告まで進められます。",
  },
  {
    no: "04",
    title: "千葉県内全域に対応",
    body: "千葉県内の墓地・霊園について幅広くご相談いただけます。場所や状況に合わせて対応をご案内します。",
  },
  {
    no: "05",
    title: "事前に内容と料金を案内",
    body: "追加の作業が必要な場合も、勝手に進めることはありません。必ず事前に内容と料金をご案内してから作業します。",
  },
];

/* ------------------------------------------------------------------ */
/*  ご利用の流れ（Flow）                                               */
/* ------------------------------------------------------------------ */
export type FlowStep = { no: string; title: string; body: string };

export const flowSteps: FlowStep[] = [
  {
    no: "01",
    title: "お問い合わせ",
    body: "電話・LINE・Instagram・お問い合わせフォームから、お気軽にご相談ください。分かる範囲のことをお聞かせいただければ大丈夫です。",
  },
  {
    no: "02",
    title: "墓地情報の確認",
    body: "墓地・霊園名、所在地、区画、お墓の目印などを確認します。場所の特定が難しい場合も一緒に確認します。",
  },
  {
    no: "03",
    title: "内容と料金のご案内",
    body: "ご希望の作業と現地の状況を確認し、作業内容と料金をご案内します。追加が必要な場合も事前にお伝えします。",
  },
  {
    no: "04",
    title: "日程調整",
    body: "ご希望やお墓の状態、天候を踏まえて作業日を調整します。お盆・お彼岸・命日などのご希望も承ります。",
  },
  {
    no: "05",
    title: "お参り・お掃除",
    body: "現地で作業前の写真を撮影し、心を込めてお参り・お掃除を行います。墓石をいたわりながら丁寧に作業します。",
  },
  {
    no: "06",
    title: "写真付き完了報告",
    body: "作業後の写真とともに、完了内容をご報告します。遠方にお住まいでも、整った様子をご確認いただけます。",
  },
];

/* ------------------------------------------------------------------ */
/*  作業事例（Before & After）— 実データが無いため準備中               */
/* ------------------------------------------------------------------ */
export type WorkCase = {
  status: "ready" | "preparing";
  area: string; // 例: "千葉県内" ※架空の地名は入れない
  service: string;
  duration: string;
  condition: string;
  work: string;
  comment: string;
  beforeImage: string; // /public/images/ 配下
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
};

// 要確認：実際の作業写真・内容が揃うまでは status:"preparing" のまま
// （「施工事例準備中」の表示が付き、写真は「イメージ」である旨を明記します）。
// 実事例に切り替える際は、実際の写真に差し替えたうえで status:"ready" にし、
// エリア・作業時間・コメントを実データへ更新してください。架空の地名・実績は掲載しない。
export const workCases: WorkCase[] = [
  {
    status: "preparing",
    area: "千葉県内",
    service: "お墓掃除代行",
    duration: "—",
    condition: "実事例は準備中",
    work: "墓石の水洗い・拭き上げ、雑草取り、ゴミの回収",
    comment:
      "写真はイメージです。実際の作業写真が準備でき次第、Before / After を掲載します。",
    beforeImage: "before-01.jpg",
    afterImage: "after-01.jpg",
    beforeLabel: "清掃前写真①",
    afterLabel: "清掃後写真①",
  },
  {
    status: "preparing",
    area: "千葉県内",
    service: "お墓掃除代行",
    duration: "—",
    condition: "実事例は準備中",
    work: "墓石まわりの清掃、香炉・花立て周辺のお手入れ",
    comment:
      "写真はイメージです。施工事例の写真が揃い次第、こちらでご紹介します。",
    beforeImage: "before-02.jpg",
    afterImage: "after-02.jpg",
    beforeLabel: "清掃前写真②",
    afterLabel: "清掃後写真②",
  },
];

/* ------------------------------------------------------------------ */
/*  Instagram（疑似カード。API未使用の静的データ）                     */
/* ------------------------------------------------------------------ */
export type InstaPost = {
  image: string; // /public/images/ 配下
  imageLabel: string;
  date: string; // 例: "2025.06" ※未確認の日付は空欄可
  caption: string;
  url: string; // 投稿URL（未確定はアカウントURL）
};

// 要確認：実際の投稿画像・日付・URLに差し替えてください。
export const instaPosts: InstaPost[] = [
  {
    image: "insta-01.jpg",
    imageLabel: "Instagram投稿①",
    date: "",
    caption: "日々の作業の様子やお墓のお手入れに役立つ情報を発信しています。",
    url: "https://www.instagram.com/456.chinnendo/?hl=ja",
  },
  {
    image: "insta-02.jpg",
    imageLabel: "Instagram投稿②",
    date: "",
    caption: "作業前後の様子など、Instagramでご覧いただけます。",
    url: "https://www.instagram.com/456.chinnendo/?hl=ja",
  },
  {
    image: "insta-03.jpg",
    imageLabel: "Instagram投稿③",
    date: "",
    caption: "お墓参り・お墓掃除に関するお知らせを掲載しています。",
    url: "https://www.instagram.com/456.chinnendo/?hl=ja",
  },
];
