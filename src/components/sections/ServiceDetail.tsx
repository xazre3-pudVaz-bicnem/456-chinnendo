import Link from "next/link";
import { Check, ArrowRight, AlertCircle } from "lucide-react";
import type { Service } from "@/data/services";
import { services } from "@/data/services";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import CTASection from "@/components/ui/CTASection";

/** サービス詳細ページ共通テンプレート */
export default function ServiceDetail({ service }: { service: Service }) {
  const other = services.find((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        en={service.en}
        title={service.title}
        lead={service.lead}
        breadcrumb={[{ label: service.title }]}
        image={service.image}
        imageLabel={service.imageLabel}
      />

      {/* 作業内容 */}
      <section className="bg-washi py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal>
            <SectionHeading en="Menu" title="主な作業内容" />
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {service.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 border border-paper-300 bg-paper-50 px-4 py-3 text-[15px] text-ink-700"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-wakaba-500" strokeWidth={2} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <ImagePlaceholder
              src={service.image}
              alt={`${service.title}の作業イメージ`}
              label={service.imageLabel}
              ratio="4 / 3"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="border border-paper-300"
            />
          </Reveal>
        </div>
      </section>

      {/* 説明ブロック */}
      <section className="bg-paper-200 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="space-y-12">
            {service.sections.map((sec, i) => (
              <Reveal key={i}>
                <h2 className="font-heading rule-accent text-xl text-moss-700 md:text-2xl">
                  {sec.heading}
                </h2>
                <div className="mt-4 space-y-4 text-[15px] leading-loose text-ink-600">
                  {sec.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          {/* 注意事項 */}
          {service.notes.length > 0 && (
            <Reveal className="mt-12">
              <div className="border border-gold-400/60 bg-paper-50 p-6">
                <p className="flex items-center gap-2 font-medium text-moss-700">
                  <AlertCircle className="h-5 w-5 text-gold-500" strokeWidth={1.75} aria-hidden />
                  ご確認ください
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-600">
                  {service.notes.map((n, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-gold-500" aria-hidden>・</span>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* もう一方のサービスへの導線 */}
      {other && (
        <section className="bg-washi py-14">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Link
              href={other.href}
              className="group flex flex-col items-start justify-between gap-4 border border-paper-300 bg-paper-50 p-7 transition-shadow hover:shadow-[0_10px_30px_rgba(47,72,52,0.08)] sm:flex-row sm:items-center"
            >
              <div>
                <span className="font-en text-xs uppercase tracking-[0.25em] text-moss-500">
                  {other.en}
                </span>
                <p className="mt-1 font-heading text-xl text-moss-700">{other.title}</p>
                <p className="mt-1 text-sm text-ink-600">{other.short}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-moss-600">
                詳しく見る
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
              </span>
            </Link>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
