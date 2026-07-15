import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ColumnCard from "@/components/ui/ColumnCard";
import CTASection from "@/components/ui/CTASection";
import { getColumnList } from "@/lib/columns";
import { plannedColumns } from "@/data/columns";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "お知らせ・コラム",
  description:
    "お墓参りとお墓のお手入れに役立つ情報をお届けします。お墓参り代行とは、料金相場、遠方のお墓の管理方法、お盆・お彼岸の準備など、千葉県でお墓参り代行・お墓掃除代行をご検討中の方に向けたコラムです。",
  path: "/column",
  keywords: ["お墓参り代行 とは", "お墓掃除代行 相場", "遠方 お墓 管理"],
});

export default function ColumnListPage() {
  const columns = getColumnList();
  const publishedSlugs = new Set(columns.map((c) => c.slug));
  const upcoming = plannedColumns.filter(
    (p) => !p.published && !publishedSlugs.has(p.slug),
  );

  return (
    <>
      <PageHero
        en="Column"
        title="お知らせ・コラム"
        lead="お墓参りとお墓のお手入れに役立つ情報をお届けします。"
        breadcrumb={[{ label: "お知らせ・コラム" }]}
      />

      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {columns.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {columns.map((c, i) => (
                <Reveal key={c.slug} delay={(i % 3) * 70}>
                  <ColumnCard item={c} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-500">記事は準備中です。</p>
          )}

          {/* 今後公開予定 */}
          {upcoming.length > 0 && (
            <Reveal className="mt-16">
              <h2 className="font-heading rule-accent mb-5 text-lg text-moss-700">
                今後公開予定のテーマ
              </h2>
              <ul className="flex flex-wrap gap-2.5">
                {upcoming.map((p) => (
                  <li
                    key={p.slug}
                    className="border border-paper-300 bg-paper-100 px-3.5 py-2 text-sm text-ink-500"
                  >
                    {p.title}
                    <span className="ml-2 text-xs text-gold-600">準備中</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
