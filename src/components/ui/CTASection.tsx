import Link from "next/link";
import { Phone, Instagram, Mail, MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/site";
import ImagePlaceholder from "./ImagePlaceholder";
import Reveal from "./Reveal";

/** 最終問い合わせセクション（全ページ末尾で再利用） */
export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-moss-800 text-paper-50">
      <div className="absolute inset-0">
        <ImagePlaceholder
          src="contact-background.jpg"
          alt=""
          label="お問い合わせ背景写真"
          fill
          tone="dark"
          overlay
          sizes="100vw"
        />
      </div>
      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center md:py-28 lg:px-8">
        <Reveal>
          <span className="font-en mb-4 block text-sm uppercase tracking-[0.3em] text-wakaba-300">
            Contact
          </span>
          <h2 className="font-heading text-2xl leading-relaxed md:text-3xl">
            行けないときも、
            <br />
            想う気持ちを届けるために。
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-loose text-paper-200/90">
            お墓の場所や状態が分からない場合も、まずは分かる範囲でお聞かせください。
            ご希望を確認したうえで、対応内容と料金をご案内します。
          </p>

          <div className="mx-auto mt-10 flex max-w-md flex-col gap-3">
            <a
              href={siteConfig.phoneTel}
              className="flex items-center justify-center gap-2.5 bg-paper-50 px-6 py-4 text-moss-700 transition-colors hover:bg-paper-200"
            >
              <Phone className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              <span className="font-heading text-lg tracking-wide">
                {siteConfig.phone}
              </span>
            </a>
            <a
              href={siteConfig.line}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-[#06C755] px-6 py-4 text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              <span className="text-sm tracking-wide">公式LINEで相談する（{siteConfig.lineId}）</span>
            </a>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 border border-paper-50/40 px-4 py-3.5 text-sm tracking-wide text-paper-50 transition-colors hover:bg-paper-50/10"
              >
                <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                お問い合わせ
              </Link>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-paper-50/40 px-4 py-3.5 text-sm tracking-wide text-paper-50 transition-colors hover:bg-paper-50/10"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Instagram
              </a>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-paper-200/70">
            {siteConfig.phoneNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
