import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import CTASection from "@/components/ui/CTASection";
import { reasons } from "@/data/content";
import { siteConfig } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "456ちんねん堂について",
  description:
    "456ちんねん堂は、お墓参りやお墓掃除を通して、ご先祖様や大切な方とのご縁をつなぐお手伝いをするサービスです。ご家族の想いをお預かりし、一基一基心を込めてお参りとお掃除を行います。",
  path: "/about",
  keywords: ["456ちんねん堂", "お墓参り代行 千葉 会社", "お墓掃除代行 千葉 事業者"],
});

/** 事業者情報（未確定項目は siteConfig を参照し、空なら「確認中」を表示） */
const infoRows: { label: string; value: string }[] = [
  { label: "屋号", value: siteConfig.name },
  { label: "対応エリア", value: siteConfig.area },
  {
    label: "サービス内容",
    value: "お墓参り代行／お墓掃除代行／墓地周辺の清掃・雑草取り／作業前後の写真報告",
  },
  { label: "お電話", value: siteConfig.phone },
  { label: "Instagram", value: siteConfig.instagramHandle },
  { label: "代表者", value: siteConfig.representative || "確認中" },
  { label: "所在地", value: siteConfig.address || "確認中" },
  { label: "営業時間", value: siteConfig.businessHours || "確認中" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        en="About Us"
        title="456ちんねん堂について"
        lead="ご家族の想いまで、大切にお預かりします。"
        breadcrumb={[{ label: "私たちについて" }]}
        image="staff-main.jpg"
        imageLabel="スタッフ写真"
      />

      {/* 想い */}
      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal>
            <SectionHeading en="Our Mission" title="大切な人を想う気持ちを、これからも。" />
            <div className="mt-6 space-y-5 text-[15px] leading-loose text-ink-600">
              <p>
                お墓は、ご先祖様や大切な方とのつながりを感じられる大切な場所です。456ちんねん堂は、お墓参りやお墓掃除を通して、そのご縁をつなぐお手伝いをするサービスです。
              </p>
              <p>
                遠方にお住まいの方、ご多忙な方、お身体の事情でお墓へ行くことが難しい方に代わり、お墓参りに行くことが難しい方の想いをお預かりし、一基一基心を込めてお参りとお掃除を行っています。
              </p>
              <p>
                清掃の仕上がりだけでなく、依頼される方が安心して任せられることを大切にしています。作業前後の写真とともに、丁寧にご報告します。
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <ImagePlaceholder
              src="staff-main.jpg"
              alt="456ちんねん堂のスタッフ"
              label="スタッフ写真"
              ratio="4 / 5"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="mx-auto max-w-sm border border-paper-300"
            />
          </Reveal>
        </div>
      </section>

      {/* 大切にしていること（reasons を流用） */}
      <section className="bg-paper-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading en="Our Promise" title="私たちが大切にしていること" align="center" />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <Reveal key={r.no} delay={i * 60}>
                <div className="flex h-full flex-col border border-paper-300 bg-paper-50 p-7">
                  <span className="font-en text-2xl text-paper-400">{r.no}</span>
                  <h3 className="mt-3 font-heading text-lg text-moss-700">{r.title}</h3>
                  <p className="mt-3 text-[15px] leading-loose text-ink-600">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 事業者情報 */}
      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <SectionHeading en="Information" title="事業者情報" align="center" />
          <Reveal className="mt-10">
            <dl className="divide-y divide-paper-300 border-y border-paper-300">
              {infoRows.map((row) => (
                <div key={row.label} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="text-sm font-medium text-moss-700">{row.label}</dt>
                  <dd className="text-[15px] text-ink-600">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-ink-400">
              ※「確認中」の項目は、確定次第このページに掲載します。
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
