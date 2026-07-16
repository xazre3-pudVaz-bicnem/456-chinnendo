import type { Metadata } from "next";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import AreaList from "@/components/ui/AreaList";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import CTASection from "@/components/ui/CTASection";
import { siteConfig } from "@/data/site";
import { areaRegions, getAreaPage } from "@/data/areas";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "対応エリア（千葉県内全域）",
  description:
    "456ちんねん堂は千葉県内全域でお墓参り代行・お墓掃除代行を承っています。千葉市・船橋市・松戸市・柏市・市原市・木更津市など、県内各地から距離による追加料金なしでご相談いただけます。",
  path: "/area",
  keywords: ["千葉県 お墓参り代行", "千葉 墓地 管理代行", "お墓 定期清掃 千葉"],
});

export default function AreaPage() {
  return (
    <>
      <PageHero
        en="Service Area"
        title="対応エリア"
        lead="千葉県内全域からご相談いただけます。まずはお墓の場所をお聞かせください。"
        breadcrumb={[{ label: "対応エリア" }]}
        image="area-chiba.jpg"
        imageLabel="千葉県内の風景写真"
      />

      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading
                en="Chiba"
                title={<>千葉県内全域に<br />対応しています。</>}
              />
              <div className="mt-6 space-y-4 text-[15px] leading-loose text-ink-600">
                <p>
                  456ちんねん堂は、{siteConfig.area}でお墓参り代行・お墓掃除代行のご相談を承っています。都市部から沿岸部、内陸部まで、千葉県内の墓地・霊園について幅広くお問い合わせいただけます。
                </p>
                <p>
                  千葉県内の移動費・高速道路料金は基本料金に含まれており、距離による追加料金はいただきません。県内のどこからでも同じ料金でご依頼いただけます。
                </p>
                <p>
                  墓地の場所や作業内容の確認がありますので、まずはお気軽にご相談ください。
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <ImagePlaceholder
                src="area-chiba.jpg"
                alt="千葉県内の風景"
                label="千葉県内の風景写真"
                ratio="4 / 3"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="border border-paper-300"
              />
            </Reveal>
          </div>

          {/* 地域別のご案内 */}
          <Reveal className="mt-16">
            <SectionHeading
              en="Regions"
              title="地域別のご案内"
              lead="千葉県内を7つの地域に分けてご案内しています。市名のリンクから、各市の詳しいご案内をご覧いただけます。"
            />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {areaRegions.map((region, i) => (
              <Reveal key={region.name} delay={i * 40}>
                <div className="h-full border border-paper-300 bg-paper-50 p-6">
                  <h3 className="font-heading text-lg text-moss-700">{region.name}</h3>
                  <p className="mt-2 text-sm leading-loose text-ink-600">
                    {region.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {region.citySlugs.map((slug) => {
                      const a = getAreaPage(slug);
                      if (!a) return null;
                      return (
                        <Link
                          key={slug}
                          href={`/area/${slug}`}
                          className="inline-block border border-wakaba-300 bg-paper-50 px-3 py-1.5 text-sm text-moss-700 transition-colors hover:border-moss-500 hover:bg-wakaba-200/40"
                        >
                          {a.city}
                        </Link>
                      );
                    })}
                    {region.otherCities.map((city) => (
                      <span
                        key={city}
                        className="inline-block border border-paper-300 bg-paper-100 px-3 py-1.5 text-sm text-ink-500"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14">
            <AreaList />
          </Reveal>

          {/* 出張費について */}
          <Reveal className="mt-10">
            <div className="flex items-start gap-3 border border-paper-300 bg-paper-100 p-6 text-sm leading-loose text-ink-600">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-wakaba-500" strokeWidth={1.75} aria-hidden />
              <p>
                千葉県内であれば、距離による追加費用はいただきません。お墓の所在地をお知らせいただければ、対応内容を事前にご案内します。県外の墓地についてはご相談ください。
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-10 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-moss-700 px-8 py-4 text-sm tracking-wide text-paper-50 transition-colors hover:bg-moss-600"
            >
              お墓の場所を相談する
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
