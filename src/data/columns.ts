/**
 * コラムの「予定タイトル」管理。
 *
 * 実際の記事本文は /content/columns/*.md（Markdown）で管理します。
 * ここでは、記事一覧に表示する「今後公開予定」のタイトルを持ちます。
 * 記事を追加したら published: true にし、slug と同名の .md を作成してください。
 * （published: false のものは一覧に「準備中」として表示され、リンクしません）
 */

export type PlannedColumn = {
  slug: string;
  title: string;
  published: boolean;
};

export const plannedColumns: PlannedColumn[] = [
  { slug: "ohakamairi-daiko-towa", title: "お墓参り代行とは", published: true },
  { slug: "ohaka-soji-daiko-souba", title: "お墓掃除代行の料金相場", published: true },
  { slug: "enpou-ohaka-kanri", title: "遠方のお墓を管理する方法", published: true },
  { slug: "obon-mae-ohaka-soji", title: "お盆前のお墓掃除", published: true },
  { slug: "chiba-ohakamairi-daiko-nagare", title: "千葉県でお墓参り代行を依頼する流れ", published: true },
  { slug: "ohigan-ohakamairi-junbi", title: "お彼岸のお墓参り準備", published: false },
  { slug: "kourei-ohakamairi-muzukashii", title: "高齢でお墓参りが難しいとき", published: false },
  { slug: "boseki-souji-chuui", title: "墓石を自分で掃除する際の注意点", published: false },
  { slug: "ohaka-zassou-taisaku", title: "お墓の雑草対策", published: false },
  { slug: "ohakamairi-daiko-erabikata", title: "お墓参り代行を選ぶポイント", published: false },
];
