/**
 * コラムの「予定タイトル」管理。
 *
 * 実際の記事本文は /content/columns/*.md（Markdown）で管理します。
 * 一覧・詳細・sitemapは実在する .md ファイルから自動生成されるため、
 * ここは「今後公開予定」のタイトルを一覧に表示する用途のみです。
 * 記事を追加したら published: true にし、slug と同名の .md を作成してください。
 */

export type PlannedColumn = {
  slug: string;
  title: string;
  published: boolean;
};

export const plannedColumns: PlannedColumn[] = [
  // --- 公開済み ---
  { slug: "ohakamairi-daiko-towa", title: "お墓参り代行とは", published: true },
  { slug: "ohaka-soji-daiko-souba", title: "お墓掃除代行の料金相場", published: true },
  { slug: "enpou-ohaka-kanri", title: "遠方のお墓を管理する方法", published: true },
  { slug: "obon-mae-ohaka-soji", title: "お盆前のお墓掃除", published: true },
  { slug: "chiba-ohakamairi-daiko-nagare", title: "千葉県でお墓参り代行を依頼する流れ", published: true },
  { slug: "ohigan-ohakamairi-junbi", title: "お彼岸のお墓参り準備", published: true },
  { slug: "kourei-ohakamairi-muzukashii", title: "高齢でお墓参りが難しいとき", published: true },
  { slug: "boseki-souji-chuui", title: "墓石を自分で掃除する際の注意点", published: true },
  { slug: "ohaka-zassou-taisaku", title: "お墓の雑草対策", published: true },
  { slug: "ohakamairi-daiko-erabikata", title: "お墓参り代行を選ぶポイント", published: true },
  { slug: "ohakamairi-daiko-dekiru-dekinai", title: "お墓参り代行で依頼できること・できないこと", published: true },
  { slug: "ohakamairi-daiko-ryokin", title: "お墓参り代行の料金は何で決まる？", published: true },
  { slug: "hitaimen-ohakamairi-irai", title: "遠方のお墓参りを非対面で依頼する方法", published: true },
  { slug: "meinichi-ohakamairi-daiko", title: "命日に合わせてお墓参り代行を依頼する方法", published: true },
  { slug: "nenmatsu-ohaka-soji", title: "年末のお墓掃除で確認したいこと", published: true },
  { slug: "ohaka-soji-mitsumori-mae", title: "お墓掃除代行の見積もり前に伝えること", published: true },
  { slug: "kuiki-bangou-wakaranai", title: "お墓の場所や区画番号が分からないときの確認方法", published: true },
  { slug: "shashin-houkoku-kakunin", title: "お墓掃除代行の写真報告では何を確認できる？", published: true },
  { slug: "ohakamairi-daiko-checklist", title: "お墓参り代行のトラブルを防ぐチェックリスト", published: true },
  { slug: "nyuuin-taichou-ohakamairi", title: "入院や体調不良でお墓参りに行けないとき", published: true },
  { slug: "tsuyu-boseki-koke", title: "梅雨に増えやすい墓石の苔や汚れ", published: true },
  { slug: "aki-ochiba-ohaka", title: "秋の落ち葉が多い墓地のお手入れ", published: true },
  { slug: "taifuu-ato-ohaka", title: "台風や強風の後にお墓で確認したいこと", published: true },
  { slug: "ohakamairi-mochimono", title: "お墓参りに持っていくもの", published: true },
  { slug: "ohaka-sonaeru-hana", title: "お墓に供える花の選び方", published: true },

  // --- 今後公開予定（記事作成時に published: true へ） ---
  { slug: "kouro-hanatate-souji", title: "香炉や花立てを掃除するときの注意点", published: false },
  { slug: "ohaka-kusamushiri-anzen", title: "お墓の草むしりを安全に行う方法", published: false },
  { slug: "ohakamairi-nagare-manner", title: "お墓参りの一般的な流れとマナー", published: false },
  { slug: "ohakamairi-senkou-kihon", title: "お墓参りで線香を供える際の基本", published: false },
];
