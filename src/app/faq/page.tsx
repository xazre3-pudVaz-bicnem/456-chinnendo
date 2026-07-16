import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import FaqAccordion from "@/components/ui/FaqAccordion";
import CTASection from "@/components/ui/CTASection";
import { faqs, faqCategories } from "@/data/faq";
import { pageMeta, faqSchema } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "よくある質問",
  description:
    "456ちんねん堂のお墓参り代行・お墓掃除代行に関するよくある質問。遠方からの依頼、非対面での相談、料金、対応エリア、作業内容などについてお答えします。掲載のないご質問もお気軽にお問い合わせください。",
  path: "/faq",
  keywords: ["お墓参り代行 よくある質問", "お墓掃除代行 千葉 質問"],
});

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />
      <PageHero
        en="FAQ"
        title="よくある質問"
        lead="ご相談の前によくいただくご質問をまとめました。掲載のない内容もお気軽にお問い合わせください。"
        breadcrumb={[{ label: "よくある質問" }]}
        image="faq-hero.jpg"
      />

      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="space-y-14">
            {faqCategories.map((cat) => {
              const items = faqs.filter((f) => f.category === cat);
              if (items.length === 0) return null;
              return (
                <Reveal key={cat} as="div">
                  <h2 className="font-heading rule-accent mb-5 text-xl text-moss-700">
                    {cat}
                  </h2>
                  <FaqAccordion items={items} />
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-14">
            <div className="border border-paper-300 bg-paper-100 p-6 text-center text-sm leading-loose text-ink-600 md:p-8">
              料金・キャンセル・お支払い・供花・定期清掃など、記載のない内容や個別のご事情については、お問い合わせ時に個別にご案内いたします。どうぞお気軽にご相談ください。
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
