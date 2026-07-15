"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Instagram, Mail } from "lucide-react";
import { siteConfig } from "@/data/site";

/**
 * スマホ画面下部の固定ナビ（電話 / Instagram / 問い合わせ）。
 * - iPhoneのsafe-area-inset-bottomに対応
 * - フォーム入力の邪魔にならないよう、お問い合わせページでは非表示
 */
export default function MobileFixedNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/contact")) return null;

  return (
    <nav
      aria-label="クイックナビゲーション"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-moss-700 bg-moss-800 text-paper-50 shadow-[0_-4px_16px_rgba(0,0,0,0.15)] lg:hidden"
    >
      <a
        href={siteConfig.phoneTel}
        className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] tracking-wide"
      >
        <Phone className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        電話する
      </a>
      <a
        href={siteConfig.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-0.5 border-x border-moss-700 py-2.5 text-[11px] tracking-wide"
      >
        <Instagram className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        Instagram
      </a>
      <Link
        href="/contact"
        className="flex flex-col items-center justify-center gap-0.5 bg-wakaba-500 py-2.5 text-[11px] tracking-wide text-moss-900"
      >
        <Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        問い合わせ
      </Link>
    </nav>
  );
}
