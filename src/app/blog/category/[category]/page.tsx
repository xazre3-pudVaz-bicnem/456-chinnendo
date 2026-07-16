import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import BlogCard from "@/components/ui/BlogCard";
import CTASection from "@/components/ui/CTASection";
import {
  categoryName,
  getBlogPostsByCategory,
  getBlogCategoriesInUse,
} from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  // 記事が1件以上あるカテゴリーのみ生成
  return getBlogCategoriesInUse().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = categoryName(category);
  if (!name) return {};
  return pageMeta({
    title: `${name}の記事一覧`,
    description: `「${name}」に関する千葉県のお墓参り代行・お墓掃除代行の記事一覧です。456ちんねん堂が、お墓のお手入れやご依頼に役立つ情報をお届けします。`,
    path: `/blog/category/${category}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const name = categoryName(category);
  if (!name) notFound();
  const posts = getBlogPostsByCategory(category);

  return (
    <>
      <PageHero
        en="Blog Category"
        title={name}
        lead={`「${name}」に関する記事の一覧です。`}
        breadcrumb={[{ label: "ブログ", href: "/blog" }, { label: name }]}
        image="blog-hero.jpg"
      />

      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* 他カテゴリー */}
          <Reveal className="mb-10 flex flex-wrap gap-2.5">
            {getBlogCategoriesInUse().map((c) => (
              <Link
                key={c.slug}
                href={`/blog/category/${c.slug}`}
                aria-current={c.slug === category ? "page" : undefined}
                className={`border px-3.5 py-1.5 text-sm transition-colors ${
                  c.slug === category
                    ? "border-moss-700 bg-moss-700 text-paper-50"
                    : "border-paper-300 bg-paper-50 text-moss-700 hover:border-moss-500"
                }`}
              >
                {c.name}
                <span
                  className={`ml-1.5 text-xs ${
                    c.slug === category ? "text-paper-200" : "text-ink-400"
                  }`}
                >
                  {c.count}
                </span>
              </Link>
            ))}
          </Reveal>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 70}>
                  <BlogCard item={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-500">このカテゴリーの記事は準備中です。</p>
          )}

          <Reveal className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-moss-600 hover:text-moss-700"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              ブログ一覧へ戻る
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
