import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/ui/CTASection";
import { getColumn, getColumnSlugs } from "@/lib/columns";
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
  });
}

export default async function ColumnDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const column = getColumn(slug);
  if (!column) notFound();

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
            }),
          ),
        }}
      />

      {/* ヘッダー余白確保のためのスペーサー */}
      <div className="bg-moss-800 pt-20" aria-hidden />
      <Breadcrumb
        items={[
          { label: "お知らせ・コラム", href: "/column" },
          { label: column.title },
        ]}
      />

      <article className="bg-washi py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <header className="mb-10">
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-wakaba-200 px-2.5 py-1 text-moss-700">
                {column.category}
              </span>
              {column.date && (
                <time className="font-en text-ink-400">{column.date}</time>
              )}
            </div>
            <h1 className="mt-5 font-heading text-2xl leading-relaxed text-moss-700 md:text-3xl md:leading-relaxed">
              {column.title}
            </h1>
          </header>

          <Reveal>
            <div
              className="prose-column"
              dangerouslySetInnerHTML={{ __html: column.html }}
            />
          </Reveal>

          <div className="mt-14 border-t border-paper-300 pt-8">
            <p className="text-sm leading-loose text-ink-500">
              ※ 本記事は一般的な情報をまとめたものです。お墓の状態やご事情によって最適な対応は異なります。個別のご相談は、お気軽にお問い合わせください。
            </p>
            <Link
              href="/column"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-moss-600 hover:text-moss-700"
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
