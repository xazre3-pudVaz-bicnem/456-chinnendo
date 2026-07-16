import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HandHeart,
  Sparkles,
  Camera,
  CalendarCheck,
  MapPin,
  ArrowRight,
  MessageCircle,
  Phone,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import FaqAccordion from "@/components/ui/FaqAccordion";
import CTASection from "@/components/ui/CTASection";
import { areaPages, getAreaPage } from "@/data/areas";
import { pricing, formatYen } from "@/data/pricing";
import { siteConfig } from "@/data/site";
import { getColumnList } from "@/lib/columns";
import { pageMeta, faqSchema, serviceSchema } from "@/lib/seo";

export function generateStaticParams() {
  return areaPages.map((a) => ({ slug: a.slug }));
}

// データに存在しないslugは404（生成済みページ以外を動的レンダリングしない）
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getAreaPage(slug);
  if (!area) return {};
  return pageMeta({
    title: area.title,
    description: area.description,
    path: `/area/${area.slug}`,
    keywords: [
      `${area.city} お墓参り`,
      `${area.city} お墓参り代行`,
      `${area.city} お墓掃除`,
      `${area.city} お墓掃除代行`,
      `${area.city} 墓石掃除`,
      `${area.city} お墓 草むしり`,
      `${area.city} 霊園 墓地 清掃`,
    ],
  });
}

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getAreaPage(slug);
  if (!area) notFound();

  const neighbors = area.neighbors
    .map((s) => getAreaPage(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  // 地域ページと相性の良いコラム（遠方・非対面／選び方／依頼の流れ系）
  const relatedSlugs = [
    "hitaimen-ohakamairi-irai",
    "ohakamairi-daiko-erabikata",
    "kuiki-bangou-wakaranai",
    "chiba-ohakamairi-daiko-nagare",
  ];
  const allColumns = getColumnList();
  const relatedColumns = relatedSlugs
    .map((s) => allColumns.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 3);

  const areaService = {
    ...serviceSchema({
      name: `${area.city}のお墓参り代行・お墓掃除代行`,
      description: area.description,
      path: `/area/${area.slug}`,
    }),
    areaServed: {
      "@type": "City",
      name: area.city,
      containedInPlace: { "@type": "AdministrativeArea", name: "千葉県" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(areaService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(area.faq)) }}
      />

      <PageHero
        en="Service Area"
        title={`${area.city}のお墓参り代行・お墓掃除代行`}
        lead={`${area.city}の墓地・霊園でのお参り・お掃除を、心を込めて代行します。距離による追加料金はありません。`}
        breadcrumb={[{ label: "対応エリア", href: "/area" }, { label: area.city }]}
        image="area-hero.jpg"
      />

      {/* 地域の説明 */}
      <section className="bg-washi py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <div className="space-y-5 text-[15px] leading-loose text-ink-600 md:text-base">
              {area.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 地域固有の追加セクション（データにある場合のみ） */}
      {area.sections && area.sections.length > 0 && (
        <section className="bg-paper-100 py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <div className="space-y-12">
              {area.sections.map((s, i) => (
                <Reveal key={s.heading} delay={i * 60}>
                  <h2 className="font-heading rule-accent text-xl text-moss-700 md:text-2xl">
                    {s.heading}
                  </h2>
                  <div className="mt-5 space-y-4 text-[15px] leading-loose text-ink-600">
                    {s.body.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 対応サービス */}
      <section className="bg-paper-200 py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading
              en="Services"
              title={`${area.city}で承っている内容`}
            />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Reveal>
              <Link
                href="/ohakamairi-daiko"
                className="group flex h-full flex-col border border-paper-300 bg-paper-50 p-6 transition-colors hover:border-moss-500"
              >
                <HandHeart className="h-7 w-7 text-moss-600" strokeWidth={1.5} aria-hidden />
                <h3 className="font-heading mt-3 text-lg text-moss-700">お墓参り代行</h3>
                <p className="mt-2 flex-1 text-sm leading-loose text-ink-600">
                  墓前での合掌、お花・お線香のお供え（代金込み）を行い、様子を写真でご報告します。
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-moss-600">
                  千葉のお墓参り代行の作業内容
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
            <Reveal delay={80}>
              <Link
                href="/ohaka-soji"
                className="group flex h-full flex-col border border-paper-300 bg-paper-50 p-6 transition-colors hover:border-moss-500"
              >
                <Sparkles className="h-7 w-7 text-moss-600" strokeWidth={1.5} aria-hidden />
                <h3 className="font-heading mt-3 text-lg text-moss-700">お墓掃除代行</h3>
                <p className="mt-2 flex-1 text-sm leading-loose text-ink-600">
                  墓石の水洗い・拭き上げ、草むしり、落ち葉やゴミの回収、香炉・花立て周辺の清掃まで対応します。
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-moss-600">
                  お墓掃除代行の作業内容
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          </div>

          {/* 特長 */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: Camera,
                title: "作業前後を写真で報告",
                body: `${area.city}へ行けない方にも、お墓の状態が分かるようご報告します。`,
              },
              {
                icon: CalendarCheck,
                title: "お盆・お彼岸・命日に対応",
                body: "大切な節目に合わせた日程で承ります。お早めのご相談が安心です。",
              },
              {
                icon: MapPin,
                title: "場所が曖昧でも大丈夫",
                body: "墓地名やおおよその場所から、一緒にお墓を特定していきます。",
              },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <div className="h-full border border-paper-300 bg-paper-50 p-5">
                  <f.icon className="h-6 w-6 text-wakaba-500" strokeWidth={1.5} aria-hidden />
                  <h3 className="mt-2.5 text-sm font-medium text-moss-700">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 料金 */}
      <section className="bg-washi py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading en="Price" title={`${area.city}での料金`} />
            <p className="mt-6 text-[15px] leading-loose text-ink-600">
              {area.city}を含む千葉県内全域、同一料金です。基本プランは墓石1基{" "}
              {formatYen(pricing.basic.price)}
              円（税込・お花代・お線香代込み）。移動費・高速道路料金も含まれており、距離による追加料金はいただきません。
            </p>
            <p className="mt-4 text-[15px] leading-loose text-ink-600">
              お彼岸・お盆・年末・命日などに合わせて2回実施する定期コース（
              {formatYen(pricing.regular.price)}円）もございます。
              墓石の数や雑草の状態によって追加が必要な場合は、必ず事前にご案内します。
            </p>
            <Link
              href="/price"
              className="mt-6 inline-flex items-center gap-2 border border-moss-600 px-6 py-3 text-sm tracking-wide text-moss-700 transition-colors hover:bg-moss-700 hover:text-paper-50"
            >
              お墓参り・お墓掃除代行の料金詳細
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 非対面での依頼方法 */}
      <section className="bg-paper-200 py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading en="How to Order" title="遠方からの非対面依頼について" />
            <p className="mt-6 text-[15px] leading-loose text-ink-600">
              {area.city}
              から離れてお住まいの方も、お電話・LINE・Instagram・お問い合わせフォームで、ご相談から作業後の写真報告まで非対面で完結できます。墓地・霊園名、おおよその場所、区画やお墓の目印など、分かる範囲の情報をお聞かせください。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={siteConfig.phoneTel}
                className="inline-flex items-center gap-2 bg-moss-700 px-5 py-3 text-sm text-paper-50 transition-colors hover:bg-moss-600"
              >
                <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {siteConfig.phone}
              </a>
              <a
                href={siteConfig.line}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#06C755] px-5 py-3 text-sm text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                公式LINEで相談
              </a>
              <Link
                href="/flow"
                className="inline-flex items-center gap-2 border border-moss-600 px-5 py-3 text-sm text-moss-700 transition-colors hover:bg-moss-700 hover:text-paper-50"
              >
                ご利用の流れを見る
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 地域FAQ */}
      <section className="bg-washi py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading en="FAQ" title={`${area.city}のご依頼でよくある質問`} />
          </Reveal>
          <Reveal className="mt-6">
            <FaqAccordion items={area.faq} />
          </Reveal>
          <Reveal className="mt-6">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-sm text-moss-600 underline underline-offset-2 hover:text-moss-700"
            >
              よくある質問をすべて見る
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 関連コラム */}
      {relatedColumns.length > 0 && (
        <section className="bg-paper-100 py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <Reveal>
              <SectionHeading en="Column" title="お墓のお手入れに役立つ記事" />
            </Reveal>
            <ul className="mt-6 space-y-2">
              {relatedColumns.map((c) => (
                <Reveal key={c.slug}>
                  <li>
                    <Link
                      href={`/column/${c.slug}`}
                      className="group flex items-start gap-3 border border-paper-300 bg-paper-50 px-4 py-3.5 transition-colors hover:border-moss-500"
                    >
                      <span className="mt-0.5 shrink-0 bg-wakaba-200 px-2 py-0.5 text-[11px] text-moss-700">
                        {c.category}
                      </span>
                      <span className="text-sm leading-relaxed text-ink-700 transition-colors group-hover:text-moss-700">
                        {c.title}
                      </span>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 近隣エリア */}
      <section className="bg-paper-200 py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading en="Nearby Areas" title="近隣の対応エリア" />
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-3">
            {neighbors.map((n) => (
              <Reveal key={n.slug}>
                <Link
                  href={`/area/${n.slug}`}
                  className="inline-flex items-center gap-1.5 border border-paper-300 bg-paper-50 px-4 py-2.5 text-sm text-moss-700 transition-colors hover:border-moss-500"
                >
                  <MapPin className="h-3.5 w-3.5 text-wakaba-500" aria-hidden />
                  {n.city}のお墓参り・お墓掃除代行
                </Link>
              </Reveal>
            ))}
            <Reveal>
              <Link
                href="/area"
                className="inline-flex items-center gap-1.5 border border-moss-600 bg-paper-50 px-4 py-2.5 text-sm text-moss-700 transition-colors hover:bg-moss-700 hover:text-paper-50"
              >
                千葉県内の対応エリア一覧
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
