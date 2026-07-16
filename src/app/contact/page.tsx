import type { Metadata } from "next";
import { Phone, Instagram, MessageCircle, Clock } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import { siteConfig } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "お問い合わせ",
  description:
    "456ちんねん堂へのお問い合わせ。千葉県内のお墓参り代行・お墓掃除代行のご相談は、お電話・Instagram・フォームから承ります。お墓の場所が分からない場合も、まずは分かる範囲でお聞かせください。",
  path: "/contact",
  keywords: ["お墓参り代行 千葉 問い合わせ", "お墓掃除代行 千葉 相談"],
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        en="Contact"
        title="お問い合わせ"
        lead="お墓の場所や状態が分からない場合も、まずは分かる範囲でお聞かせください。ご希望を確認したうえで、対応内容と料金をご案内します。"
        breadcrumb={[{ label: "お問い合わせ" }]}
      />

      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          {/* 電話・LINE・Instagram */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Reveal>
              <a
                href={siteConfig.phoneTel}
                className="flex h-full flex-col items-center justify-center gap-2 border border-paper-300 bg-paper-50 p-7 text-center transition-colors hover:border-moss-500"
              >
                <Phone className="h-7 w-7 text-moss-600" strokeWidth={1.5} aria-hidden />
                <span className="mt-1 text-sm text-ink-500">お電話でのご相談</span>
                <span className="font-heading text-2xl tracking-wide text-moss-700">
                  {siteConfig.phone}
                </span>
              </a>
            </Reveal>
            <Reveal delay={60}>
              <a
                href={siteConfig.line}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col items-center justify-center gap-2 border border-[#06C755]/40 bg-paper-50 p-7 text-center transition-colors hover:border-[#06C755]"
              >
                <MessageCircle className="h-7 w-7 text-[#06C755]" strokeWidth={1.5} aria-hidden />
                <span className="mt-1 text-sm text-ink-500">公式LINEでのご相談</span>
                <span className="font-heading text-xl tracking-wide text-moss-700">
                  {siteConfig.lineId}
                </span>
              </a>
            </Reveal>
            <Reveal delay={120}>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col items-center justify-center gap-2 border border-paper-300 bg-paper-50 p-7 text-center transition-colors hover:border-moss-500"
              >
                <Instagram className="h-7 w-7 text-moss-600" strokeWidth={1.5} aria-hidden />
                <span className="mt-1 text-sm text-ink-500">Instagramでのご相談</span>
                <span className="font-heading text-xl tracking-wide text-moss-700">
                  {siteConfig.instagramHandle}
                </span>
              </a>
            </Reveal>
          </div>

          <Reveal className="mt-6">
            <div className="flex items-start gap-3 border border-paper-300 bg-paper-100 p-5 text-sm leading-loose text-ink-600">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-wakaba-500" strokeWidth={1.75} aria-hidden />
              <p>{siteConfig.phoneNote}</p>
            </div>
          </Reveal>

          {/* フォーム */}
          <Reveal className="mt-14">
            <h2 className="font-heading rule-accent mb-2 text-xl text-moss-700 md:text-2xl">
              お問い合わせフォーム
            </h2>
            <p className="mb-8 text-sm leading-loose text-ink-600">
              下記フォームからもご相談いただけます。必須項目以外は、分かる範囲でご記入ください。
            </p>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
