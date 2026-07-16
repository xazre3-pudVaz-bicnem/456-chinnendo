import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import BlogCard from "@/components/ui/BlogCard";
import CTASection from "@/components/ui/CTASection";
import Pagination from "@/components/ui/Pagination";
import { getBlogPage, getBlogPageCount, getBlogCategoriesInUse } from "@/lib/blog";
import { pageMeta, collectionPageSchema } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "ブログ",
  description:
    "千葉県のお墓参り代行・お墓掃除代行に関する記事を毎日お届けしています。お墓参りに行けないときの対処法、お墓掃除の流れ、季節のお手入れ、地域別のご案内など、役立つ情報をまとめています。",
  path: "/blog",
  keywords: ["千葉 お墓参り代行 ブログ", "お墓掃除代行 千葉", "墓石清掃 千葉"],
});

export default function BlogListPage() {
  const posts = getBlogPage(1);
  const totalPages = getBlogPageCount();
  const categories = getBlogCategoriesInUse();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageSchema({
              name: "ブログ",
              description:
                "千葉県のお墓参り代行・お墓掃除代行に関する記事の一覧です。",
              path: "/blog",
              items: posts.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })),
            }),
          ),
        }}
      />
      <PageHero
        en="Blog"
        title="ブログ"
        lead="お墓参り代行・お墓掃除代行に役立つ情報を、毎日お届けしています。"
        breadcrumb={[{ label: "ブログ" }]}
        image="blog-hero.jpg"
      />

      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* カテゴリー */}
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

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 70}>
                  <BlogCard item={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-500">記事は準備中です。</p>
          )}

          <Pagination
            current={1}
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
