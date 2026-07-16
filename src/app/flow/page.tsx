import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import FlowSteps from "@/components/ui/FlowSteps";
import CTASection from "@/components/ui/CTASection";
import { flowSteps } from "@/data/content";
import { siteConfig } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "ご利用の流れ",
  description:
    "456ちんねん堂のお墓参り代行・お墓掃除代行のご利用の流れ。お問い合わせから墓地情報の確認、料金のご案内、日程調整、作業、写真付きの完了報告まで、初めての方にも分かりやすくご案内します。",
  path: "/flow",
  keywords: ["お墓参り代行 流れ", "お墓掃除代行 依頼 方法", "千葉 お墓参り代行 依頼"],
});

export default function FlowPage() {
  return (
    <>
      <PageHero
        en="Flow"
        title="ご利用の流れ"
        lead="ご相談から完了報告まで、順を追って分かりやすくご案内します。"
        breadcrumb={[{ label: "ご利用の流れ" }]}
        image="flow-hero.jpg"
      />

      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading
              en="6 Steps"
              title="ご依頼から完了報告までの6ステップ"
              lead="遠方にお住まいの方も、基本的に非対面でご相談から報告まで進められます。"
            />
          </Reveal>
          <div className="mt-12">
            <FlowSteps steps={flowSteps} />
          </div>

          <Reveal className="mt-14">
            <div className="border border-paper-300 bg-paper-100 p-6 md:p-8">
              <h2 className="font-heading text-lg text-moss-700">お支払いについて</h2>
              <p className="mt-3 text-sm leading-loose text-ink-600">
                {siteConfig.paymentMethods
                  ? siteConfig.paymentMethods
                  : "お支払い方法については、お問い合わせ時に個別にご案内いたします。"}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
