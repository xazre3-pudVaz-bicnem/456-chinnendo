import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import BlogCard from "@/components/ui/BlogCard";
import Pagination from "@/components/ui/Pagination";
import CTASection from "@/components/ui/CTASection";
import { getBlogPage, getBlogPageCount, getBlogCategoriesInUse } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  const total = getBlogPageCount();
  // 1ページ目は /blog が担当するため 2ページ目以降のみ生成
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return pageMeta({
    title: `ブログ（${page}ページ目）`,
    description: `千葉県のお墓参り代行・お墓掃除代行に関する記事の一覧（${page}ページ目）です。お墓のお手入れやご依頼に役立つ情報をお届けしています。`,
    path: `/blog/page/${page}`,
  });
}

export default async function BlogPagedPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const current = Number(page);
  const totalPages = getBlogPageCount();
  if (!Number.isInteger(current) || current < 2 || current > totalPages) notFound();

  const posts = getBlogPage(current);
  const categories = getBlogCategoriesInUse();

  return (
    <>
      <PageHero
        en="Blog"
        title="ブログ"
        lead={`お墓参り代行・お墓掃除代行に役立つ情報を、毎日お届けしています。（${current}ページ目）`}
        breadcrumb={[{ label: "ブログ", href: "/blog" }, { label: `${current}ページ目` }]}
        image="blog-hero.jpg"
      />

      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {categories.length > 0 && (
            <Reveal className="mb-10 flex flex-wrap gap-2.5">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/blog/category/${c.slug}`}
                  className="border border-paper-300 bg-paper-50 px-3.5 py-1.5 text-sm text-moss-700 transition-colors hover:border-moss-500"
                >
                  {c.name}
                  <span className="ml-1.5 text-xs text-ink-400">{c.count}</span>
                </Link>
              ))}
            </Reveal>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 70}>
                <BlogCard item={p} />
              </Reveal>
            ))}
          </div>

          <Pagination
            current={current}
            total={totalPages}
            basePath="/blog"
            pageHref={(n) => `/blog/page/${n}`}
          />
        </div>
      </section>

      <CTASection />
    </>
  );
}
