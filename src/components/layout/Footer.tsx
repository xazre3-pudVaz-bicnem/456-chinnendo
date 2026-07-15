import Link from "next/link";
import Image from "next/image";
import { Phone, Instagram } from "lucide-react";
import { siteConfig, FOOTER_LINKS } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear(); // ビルド時に確定（静的生成のためハイドレーション差分なし）
  return (
    <footer className="bg-moss-900 text-paper-200">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* ブランド */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              {siteConfig.hasLogo && (
                <Image
                  src="/images/logo-mark.png"
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <p className="font-heading text-xl text-paper-50">{siteConfig.name}</p>
            </div>
            <p className="mt-4 text-sm leading-loose text-paper-200/80">
              {siteConfig.area}のお墓参り代行・お墓掃除代行。
              <br />
              大切な人を想う気持ちを、これからも。
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram（新しいタブで開きます）"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-paper-200/25 transition-colors hover:bg-paper-50/10"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </a>
              <a
                href={siteConfig.phoneTel}
                className="flex items-center gap-2 text-paper-50 transition-colors hover:text-wakaba-300"
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                <span className="font-heading text-lg">{siteConfig.phone}</span>
              </a>
            </div>
          </div>

          {/* サービス */}
          <nav aria-label="サービス">
            <p className="font-en text-xs uppercase tracking-[0.25em] text-wakaba-300">Service</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {FOOTER_LINKS.service.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-paper-200/85 transition-colors hover:text-paper-50">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 会社・その他 */}
          <nav aria-label="サイト案内">
            <p className="font-en text-xs uppercase tracking-[0.25em] text-wakaba-300">About</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {FOOTER_LINKS.about.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-paper-200/85 transition-colors hover:text-paper-50">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 事業情報 */}
          <div>
            <p className="font-en text-xs uppercase tracking-[0.25em] text-wakaba-300">Information</p>
            <dl className="mt-4 space-y-2.5 text-sm text-paper-200/85">
              <div>
                <dt className="text-paper-200/60">屋号</dt>
                <dd>{siteConfig.name}</dd>
              </div>
              <div>
                <dt className="text-paper-200/60">対応エリア</dt>
                <dd>{siteConfig.area}</dd>
              </div>
              <div>
                <dt className="text-paper-200/60">お電話</dt>
                <dd>{siteConfig.phone}</dd>
              </div>
              {/* 住所・営業時間は確定後に siteConfig へ追加すると自動表示されます */}
              {siteConfig.address && (
                <div>
                  <dt className="text-paper-200/60">所在地</dt>
                  <dd>{siteConfig.address}</dd>
                </div>
              )}
              {siteConfig.businessHours && (
                <div>
                  <dt className="text-paper-200/60">受付時間</dt>
                  <dd>{siteConfig.businessHours}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-paper-200/15 pt-6 text-xs text-paper-200/60 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_LINKS.utility.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-paper-50">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="font-en tracking-wide">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
