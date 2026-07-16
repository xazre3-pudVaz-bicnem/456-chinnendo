import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, List, PenLine } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/ui/CTASection";
import { getColumn, getColumnSlugs, getRelatedColumns } from "@/lib/columns";
import { pageMeta, articleSchema } from "@/lib/seo";

export function generateStaticParams() {
  return getColumnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const column = getColumn(slug);
  if (!column) return {};
  return pageMeta({
    title: column.title,
    description: column.description || column.excerpt,
    path: `/column/${slug}`,
    ogType: "article",
    ...(column.keywords.length ? { keywords: column.keywords } : {}),
  });
}

/** 記事下のサービス内部リンク */
const serviceLinks = [
  { href: "/ohakamairi-daiko", label: "千葉のお墓参り代行の作業内容" },
  { href: "/ohaka-soji", label: "お墓掃除代行の作業内容" },
  { href: "/price", label: "お墓参り・お墓掃除代行の料金" },
  { href: "/area", label: "千葉県内の対応エリア" },
];

export default async function ColumnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const column = getColumn(slug);
  if (!column) notFound();

  const related = getRelatedColumns(slug, 4);
  const showUpdated = column.updatedAt && column.updatedAt !== column.date;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleSchema({
              title: column.title,
              description: column.description || column.excerpt,
              path: `/column/${slug}`,
              date: column.date,
              updatedAt: column.updatedAt,
            }),
          ),
        }}
      />

      {/* 固定ヘッダーの高さ分のスペーサー（ヘッダーと同系色で自然につなぐ） */}
      <div className="h-16 bg-paper-50 lg:h-[4.5rem]" aria-hidden />
      <Breadcrumb
        items={[
          { label: "お知らせ・コラム", href: "/column" },
          { label: column.title },
        ]}
      />

      <article className="bg-washi py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
              <span className="bg-wakaba-200 px-2.5 py-1 text-moss-700">
                {column.category}
              </span>
              {column.date && (
                <time dateTime={column.date} className="font-en text-ink-400">
                  公開日 {column.date}
                </time>
              )}
              {showUpdated && (
                <time dateTime={column.updatedAt} className="font-en text-ink-400">
                  更新日 {column.updatedAt}
                </time>
              )}
            </div>
            <h1 className="mt-5 font-heading text-2xl leading-relaxed text-moss-700 md:text-3xl md:leading-relaxed">
              {column.title}
            </h1>
          </header>

          {/* 目次（h2見出しから自動生成） */}
          {column.toc.length >= 3 && (
            <nav
              aria-label="目次"
              className="mb-10 border border-paper-300 bg-paper-50 p-5 md:p-6"
            >
              <p className="flex items-center gap-2 text-sm font-medium text-moss-700">
                <List className="h-4 w-4 text-wakaba-500" strokeWidth={1.75} aria-hidden />
                目次
              </p>
              <ol className="mt-3 space-y-1.5 text-sm">
                {column.toc.map((t, i) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="inline-flex gap-2 py-0.5 text-ink-600 transition-colors hover:text-moss-600"
                    >
                      <span className="font-en text-gold-600">{String(i + 1).padStart(2, "0")}</span>
                      {t.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <Reveal>
            <div
              className="prose-column"
              dangerouslySetInnerHTML={{ __html: column.html }}
            />
          </Reveal>

          {/* 執筆者 */}
          <div className="mt-12 flex items-start gap-3 border border-paper-300 bg-paper-50 p-5">
            <PenLine className="mt-0.5 h-5 w-5 shrink-0 text-wakaba-500" strokeWidth={1.75} aria-hidden />
            <div className="text-sm leading-loose text-ink-600">
              <p className="font-medium text-moss-700">執筆：{column.author}</p>
              <p>
                千葉県内全域でお墓参り代行・お墓掃除代行を行っています。一基一基のお墓と、ご家族の想いを大切に、作業前後の写真報告まで丁寧に対応します。
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-paper-300 pt-8">
            <p className="text-sm leading-loose text-ink-500">
              ※ 本記事は一般的な情報をまとめたものです。お墓の状態やご事情によって最適な対応は異なります。個別のご相談は、お気軽にお問い合わせください。
            </p>

            {/* サービスへの内部リンク */}
            <div className="mt-8">
              <p className="text-sm font-medium text-moss-700">サービスのご案内</p>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {serviceLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group flex items-center justify-between border border-paper-300 bg-paper-50 px-4 py-3 text-sm text-ink-700 transition-colors hover:border-moss-500 hover:text-moss-700"
                    >
                      {l.label}
                      <ArrowRight className="h-3.5 w-3.5 text-wakaba-500 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 関連記事 */}
            {related.length > 0 && (
              <div className="mt-10">
                <p className="text-sm font-medium text-moss-700">関連記事</p>
                <ul className="mt-3 space-y-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/column/${r.slug}`}
                        className="group flex items-start gap-3 border border-paper-300 bg-paper-50 px-4 py-3.5 transition-colors hover:border-moss-500"
                      >
                        <span className="mt-0.5 shrink-0 bg-wakaba-200 px-2 py-0.5 text-[11px] text-moss-700">
                          {r.category}
                        </span>
                        <span className="text-sm leading-relaxed text-ink-700 transition-colors group-hover:text-moss-700">
                          {r.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href="/column"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-moss-600 hover:text-moss-700"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              コラム一覧へ戻る
            </Link>
          </div>
        </div>
      </article>

      <CTASection />
    </>
  );
}
