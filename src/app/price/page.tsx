import type { Metadata } from "next";
import { Info } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import PriceCard from "@/components/ui/PriceCard";
import CTASection from "@/components/ui/CTASection";
import { pricing, formatYen } from "@/data/pricing";
import { siteConfig } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "料金案内",
  description: `456ちんねん堂のお墓参り代行・お墓掃除代行の料金。基本プランは墓石1基 ${formatYen(pricing.basic.price)}円（税込）。追加料金が発生するケースや見積もりについても分かりやすくご案内します。`,
  path: "/price",
  keywords: ["お墓掃除 代行 料金 千葉", "お墓参り代行 料金", "墓石掃除 料金 千葉"],
});

export default function PricePage() {
  return (
    <>
      <PageHero
        en="Price"
        title="料金案内"
        lead="分かりやすい料金で、丁寧に対応します。追加料金が発生する場合も、事前に必ずご案内します。"
        breadcrumb={[{ label: "料金案内" }]}
      />

      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          {/* 料金プラン */}
          <Reveal>
            <SectionHeading
              en="Plans"
              title="料金プラン"
              lead={`お参り・お掃除・写真報告に加え、お花代・お線香代、片道${siteConfig.includedDistanceKm}kmまでの移動費・高速道路料金まで含めた分かりやすい料金です。`}
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
            {pricing.plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 100}>
                <PriceCard plan={plan} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6">
            <p className="text-sm leading-loose text-ink-600">
              定期コースは、基本プランの内容を{siteConfig.regularTimes}
              回実施するお得なコースです。お彼岸・お盆・年末・命日など、ご希望の時期をお聞かせください。安さだけを追う清掃ではなく、一基一基を丁寧に、お墓をいたわりながら作業することを大切にしています。
            </p>
          </Reveal>

          {/* 追加料金が発生するケース */}
          <Reveal className="mt-16 md:mt-24">
            <SectionHeading
              en="Additional"
              title="追加料金が発生する場合"
              lead="下記のような場合は、事前にお見積もり・ご相談のうえで対応します。当日に無断で追加費用をいただくことはありません。"
            />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {pricing.additional.map((a, i) => (
              <Reveal key={a.title} delay={i * 60}>
                <div className="h-full border border-paper-300 bg-paper-50 p-6">
                  <h3 className="font-heading text-lg text-moss-700">{a.title}</h3>
                  <p className="mt-2 text-sm leading-loose text-ink-600">{a.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* お問い合わせ時にご案内 */}
          <Reveal className="mt-12">
            <div className="border border-paper-300 bg-paper-100 p-6 md:p-8">
              <p className="flex items-center gap-2 font-medium text-moss-700">
                <Info className="h-5 w-5 text-wakaba-500" strokeWidth={1.75} aria-hidden />
                お問い合わせ時にご案内する内容
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-loose text-ink-600">
                <li>{pricing.toConfirm.payment}</li>
                <li>{pricing.toConfirm.cancel}</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
