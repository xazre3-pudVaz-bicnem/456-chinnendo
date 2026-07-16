import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, PenLine } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/ui/CTASection";
import {
  getBlogPost,
  getBlogSlugs,
  getRelatedBlogPosts,
  categorySlug,
} from "@/lib/blog";
import { siteConfig } from "@/data/site";
import { pageMeta, articleSchema } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    ogType: "article",
    ...(post.tags.length ? { keywords: post.tags } : {}),
  });
}

/** 記事下のサービス内部リンク */
const serviceLinks = [
  { href: "/ohakamairi-daiko", label: "千葉のお墓参り代行の作業内容" },
  { href: "/ohaka-soji", label: "お墓掃除代行の作業内容" },
  { href: "/price", label: "お墓参り・お墓掃除代行の料金" },
  { href: "/contact", label: "お問い合わせ" },
];

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedBlogPosts(slug, 4);
  const showUpdated = post.updatedAt && post.updatedAt !== post.date;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleSchema({
              title: post.title,
              description: post.description,
              path: `/blog/${slug}`,
              date: post.date,
              updatedAt: post.updatedAt,
            }),
          ),
        }}
      />

      {/* 固定ヘッダーの高さ分のスペーサー */}
      <div className="h-16 bg-paper-50 lg:h-[4.5rem]" aria-hidden />
      <Breadcrumb
        items={[
          { label: "ブログ", href: "/blog" },
          {
            label: post.category,
            href: `/blog/category/${categorySlug(post.category)}`,
          },
          { label: post.title },
        ]}
      />

      <article className="bg-washi py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
              <Link
                href={`/blog/category/${categorySlug(post.category)}`}
                className="bg-wakaba-200 px-2.5 py-1 text-moss-700 transition-colors hover:bg-wakaba-300"
              >
                {post.category}
              </Link>
              {post.date && (
                <time dateTime={post.date} className="font-en text-ink-400">
                  公開日 {post.date}
                </time>
              )}
              {showUpdated && (
                <time dateTime={post.updatedAt} className="font-en text-ink-400">
                  更新日 {post.updatedAt}
                </time>
              )}
            </div>
            <h1 className="mt-5 font-heading text-2xl leading-relaxed text-moss-700 md:text-3xl md:leading-relaxed">
              {post.title}
            </h1>
          </header>

          <Reveal>
            <div className="prose-column">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </Reveal>

          {/* タグ */}
          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="border border-paper-300 bg-paper-100 px-3 py-1 text-xs text-ink-500"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* 執筆者 */}
          <div className="mt-8 flex items-start gap-3 border border-paper-300 bg-paper-50 p-5">
            <PenLine className="mt-0.5 h-5 w-5 shrink-0 text-wakaba-500" strokeWidth={1.75} aria-hidden />
            <div className="text-sm leading-loose text-ink-600">
              <p className="font-medium text-moss-700">{siteConfig.name}</p>
              <p>
                千葉県内全域でお墓参り代行・お墓掃除代行を行っています。お墓と、ご家族の想いを大切に、作業前後の写真報告まで丁寧に対応します。
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-paper-300 pt-8">
            <p className="text-sm leading-loose text-ink-500">
              ※ 本記事は一般的な情報をまとめたものです。お墓の状態や霊園の規定によって対応が異なる場合があります。個別のご相談は、お気軽にお問い合わせください。
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
                        href={`/blog/${r.slug}`}
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
              href="/blog"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-moss-600 hover:text-moss-700"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              ブログ一覧へ戻る
            </Link>
          </div>
        </div>
      </article>

      <CTASection />
    </>
  );
}
