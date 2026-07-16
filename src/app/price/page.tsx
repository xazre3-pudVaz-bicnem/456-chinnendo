import type { Metadata } from "next";
import { Info } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import PriceCard from "@/components/ui/PriceCard";
import CTASection from "@/components/ui/CTASection";
import { pricing, formatYen } from "@/data/pricing";
import { siteConfig } from "@/data/site";
import { pageMeta, priceServiceSchema } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "料金案内",
  description: `456ちんねん堂のお墓参り代行・お墓掃除代行の料金。基本プランは墓石1基 ${formatYen(pricing.basic.price)}円（税込）。追加料金が発生するケースや見積もりについても分かりやすくご案内します。`,
  path: "/price",
  keywords: ["お墓掃除 代行 料金 千葉", "お墓参り代行 料金", "墓石掃除 料金 千葉"],
});

export default function PricePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            priceServiceSchema({
              basicPrice: pricing.basic.price,
              regularPrice: pricing.regular.price,
              regularTimes: siteConfig.regularTimes,
            }),
          ),
        }}
      />
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
              lead="お参り・お掃除・写真報告に加え、お花代・お線香代、千葉県内の移動費・高速道路料金まで含めた分かりやすい料金です。距離による追加料金はいただきません。"
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

          {/* プラン比較表 */}
          <Reveal className="mt-16">
            <SectionHeading
              en="Comparison"
              title="基本プランと定期コースの比較"
            />
          </Reveal>
          <Reveal className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <caption className="sr-only">基本プランと定期コースの比較表</caption>
              <thead>
                <tr className="bg-moss-800 text-paper-50">
                  <th scope="col" className="border border-moss-700 px-4 py-3 text-left font-medium">項目</th>
                  <th scope="col" className="border border-moss-700 px-4 py-3 text-left font-medium">基本プラン</th>
                  <th scope="col" className="border border-moss-700 px-4 py-3 text-left font-medium">定期コース（{siteConfig.regularTimes}回）</th>
                </tr>
              </thead>
              <tbody className="bg-paper-50">
                {[
                  ["料金（税込）", `${formatYen(pricing.basic.price)}円`, `${formatYen(pricing.regular.price)}円（${pricing.regular.highlight}）`],
                  ["実施回数", "1回", `${siteConfig.regularTimes}回（時期はご希望に合わせて）`],
                  ["お参り・供花・線香", "含まれます（お花代・お線香代込み）", "毎回含まれます"],
                  ["墓石・敷地の清掃、草むしり", "含まれます", "毎回含まれます"],
                  ["作業前後の写真報告", "あり", "毎回あり"],
                  ["移動費・高速道路料金", "千葉県内込み（距離追加なし）", "千葉県内込み（距離追加なし）"],
                  ["向いている方", "まず1回試したい方、単発のご依頼", "お彼岸とお盆など、節目ごとに整えたい方"],
                ].map(([label, basic, regular]) => (
                  <tr key={label} className="border-b border-paper-300">
                    <th scope="row" className="border border-paper-300 bg-paper-100 px-4 py-3 text-left font-medium text-moss-700">
                      {label}
                    </th>
                    <td className="border border-paper-300 px-4 py-3 text-ink-600">{basic}</td>
                    <td className="border border-paper-300 px-4 py-3 text-ink-600">{regular}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          {/* 料金の考え方の例 */}
          <Reveal className="mt-16">
            <SectionHeading
              en="Example"
              title="料金の考え方の例"
              lead="実際の施工事例ではなく、料金の計算方法を分かりやすくするための例です。"
            />
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Reveal>
              <div className="h-full border border-paper-300 bg-paper-50 p-6">
                <p className="text-sm text-ink-500">例1：墓石1基を1回お願いする場合</p>
                <p className="mt-2 font-heading text-2xl text-moss-700">
                  {formatYen(pricing.basic.price)}円
                  <span className="ml-1 text-sm font-normal text-ink-500">（税込）</span>
                </p>
                <p className="mt-2 text-sm leading-loose text-ink-600">
                  お参り・供花・線香・清掃・写真報告・移動費まですべて込みの金額です。
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="h-full border border-paper-300 bg-paper-50 p-6">
                <p className="text-sm text-ink-500">例2：墓石1基を年2回（お盆前・お彼岸）お願いする場合</p>
                <p className="mt-2 font-heading text-2xl text-moss-700">
                  {formatYen(pricing.regular.price)}円
                  <span className="ml-1 text-sm font-normal text-ink-500">（税込・定期コース）</span>
                </p>
                <p className="mt-2 text-sm leading-loose text-ink-600">
                  基本プランを2回別々にご依頼いただくより
                  {formatYen(pricing.basic.price * siteConfig.regularTimes - pricing.regular.price)}
                  円お得になります。
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal className="mt-4">
            <p className="text-xs leading-relaxed text-ink-500">
              ※ 墓石が複数ある場合や、雑草・汚れの状態によって追加作業が必要な場合の金額は、状況により異なるため事前見積もりでご案内します。上記は料金の考え方を示す例であり、施工実績ではありません。
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
