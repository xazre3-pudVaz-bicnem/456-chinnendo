import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { NAV_ITEMS, FOOTER_LINKS } from "@/data/site";
import { plannedColumns } from "@/data/columns";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "サイトマップ",
  description: "456ちんねん堂の公式サイトのページ一覧です。",
  path: "/sitemap",
});

const mainPages = [
  { label: "ホーム", href: "/" },
  { label: "お墓参り代行", href: "/ohakamairi-daiko" },
  { label: "お墓掃除代行", href: "/ohaka-soji" },
  { label: "料金案内", href: "/price" },
  { label: "対応エリア", href: "/area" },
  { label: "ご利用の流れ", href: "/flow" },
  { label: "456ちんねん堂について", href: "/about" },
  { label: "よくある質問", href: "/faq" },
  { label: "お知らせ・コラム", href: "/column" },
  { label: "お問い合わせ", href: "/contact" },
];

export default function SitemapPage() {
  const publishedColumns = plannedColumns.filter((c) => c.published);

  return (
    <>
      <PageHero en="Sitemap" title="サイトマップ" breadcrumb={[{ label: "サイトマップ" }]} />

      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 md:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="font-heading rule-accent mb-5 text-lg text-moss-700">
              主なページ
            </h2>
            <ul className="space-y-3">
              {mainPages.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="inline-flex items-center gap-2 text-[15px] text-ink-700 transition-colors hover:text-moss-600"
                  >
                    <ArrowRight className="h-4 w-4 text-wakaba-500" strokeWidth={1.75} aria-hidden />
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="font-heading rule-accent mb-5 mt-12 text-lg text-moss-700">
              ご利用案内
            </h2>
            <ul className="space-y-3">
              {FOOTER_LINKS.utility.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="inline-flex items-center gap-2 text-[15px] text-ink-700 transition-colors hover:text-moss-600"
                  >
                    <ArrowRight className="h-4 w-4 text-wakaba-500" strokeWidth={1.75} aria-hidden />
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="font-heading rule-accent mb-5 text-lg text-moss-700">
              コラム記事
            </h2>
            {publishedColumns.length > 0 ? (
              <ul className="space-y-3">
                {publishedColumns.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/column/${c.slug}`}
                      className="inline-flex items-center gap-2 text-[15px] text-ink-700 transition-colors hover:text-moss-600"
                    >
                      <ArrowRight className="h-4 w-4 text-wakaba-500" strokeWidth={1.75} aria-hidden />
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-500">記事は準備中です。</p>
            )}
            {/* NAV_ITEMS を参照しリンク網羅を担保（保守性） */}
            <p className="mt-10 text-xs leading-relaxed text-ink-400">
              主要ナビゲーション：
              {NAV_ITEMS.map((n) => n.label).join("・")}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
