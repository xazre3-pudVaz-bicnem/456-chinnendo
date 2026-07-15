import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "プライバシーポリシー",
  description:
    "456ちんねん堂のプライバシーポリシー。お客様からお預かりする個人情報の取り扱い方針について定めています。",
  path: "/privacy",
});

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. 個人情報の取得について",
    body: [
      "456ちんねん堂（以下「当方」といいます）は、お問い合わせやサービスのご依頼の際に、お名前、電話番号、メールアドレス、墓地に関する情報など、対応に必要な範囲で個人情報を取得します。",
    ],
  },
  {
    heading: "2. 利用目的",
    body: [
      "取得した個人情報は、以下の目的で利用します。",
      "・お問い合わせへの回答、ご連絡のため",
      "・サービスのご案内、お見積もり、日程調整、作業のため",
      "・作業後のご報告、アフターフォローのため",
    ],
  },
  {
    heading: "3. 第三者への提供",
    body: [
      "当方は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。",
    ],
  },
  {
    heading: "4. 個人情報の管理",
    body: [
      "当方は、取得した個人情報を適切に管理し、漏えい・滅失・毀損の防止に努めます。利用目的の達成に必要な範囲を超えて保有しないよう努めます。",
    ],
  },
  {
    heading: "5. 開示・訂正・削除",
    body: [
      "ご本人から個人情報の開示、訂正、削除等のご請求があった場合は、ご本人であることを確認のうえ、法令に従い速やかに対応します。",
    ],
  },
  {
    heading: "6. お問い合わせ窓口",
    body: [
      "個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。",
      `${siteConfig.name}　電話：${siteConfig.phone}`,
    ],
  },
  {
    heading: "7. 本ポリシーの変更",
    body: [
      "本ポリシーの内容は、法令の変更や運用の見直しに応じて、予告なく変更する場合があります。変更後の内容は本ページに掲載した時点で効力を生じます。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        en="Privacy Policy"
        title="プライバシーポリシー"
        breadcrumb={[{ label: "プライバシーポリシー" }]}
      />

      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="space-y-10">
            {sections.map((s) => (
              <Reveal key={s.heading}>
                <h2 className="font-heading text-lg text-moss-700 md:text-xl">{s.heading}</h2>
                <div className="mt-3 space-y-2 text-[15px] leading-loose text-ink-600">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-12 text-sm text-ink-400">制定日：確認中 {/* 要確認 */}</p>
        </div>
      </section>
    </>
  );
}
