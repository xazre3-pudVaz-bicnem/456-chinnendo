"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Phone, Instagram, Menu, X, ChevronDown } from "lucide-react";
import { siteConfig, NAV_ITEMS } from "@/data/site";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // メニュー開閉に伴うスクロールロック & フォーカス制御 & Escで閉じる
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-paper-300 bg-paper-50/95 shadow-sm backdrop-blur-sm"
          : "border-b border-transparent bg-paper-50/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:h-[4.5rem] lg:px-8">
        {/* Logo / 屋号 */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${siteConfig.name} トップへ`}>
          {siteConfig.hasLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/images/logo.png" alt={`${siteConfig.name} ロゴ`} className="h-9 w-auto lg:h-10" />
          ) : (
            <span className="flex flex-col leading-none">
              <span className="font-heading text-lg tracking-wide text-moss-700 transition-colors group-hover:text-moss-600 lg:text-xl">
                {siteConfig.name}
              </span>
              <span className="mt-1 font-en text-[10px] tracking-[0.22em] text-ink-400">
                CHIBA GRAVE VISIT &amp; CLEANING
              </span>
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 text-sm lg:flex xl:gap-6" aria-label="メインナビゲーション">
          {NAV_ITEMS.filter((i) => i.label !== "お問い合わせ").map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => "children" in item && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex items-center gap-1 whitespace-nowrap py-2 tracking-wide transition-colors ${
                  isActive(item.href)
                    ? "text-moss-700"
                    : "text-ink-600 hover:text-moss-600"
                }`}
              >
                {item.label}
                {"children" in item && <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
              </Link>
              {"children" in item && openDropdown === item.label && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-1">
                  <div className="min-w-44 border border-paper-300 bg-paper-50 py-2 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block whitespace-nowrap px-5 py-2.5 text-sm text-ink-600 transition-colors hover:bg-paper-100 hover:text-moss-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop right: Instagram + phone（控えめ）+ CTA */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram（新しいタブで開きます）"
            className="text-ink-500 transition-colors hover:text-moss-600"
          >
            <Instagram className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </a>
          <a
            href={siteConfig.phoneTel}
            className="flex items-center gap-1.5 text-moss-700 transition-colors hover:text-moss-600"
          >
            <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            <span className="font-heading text-base tracking-wide">{siteConfig.phone}</span>
          </a>
          <Link
            href="/contact"
            className="bg-moss-700 px-4 py-2.5 text-sm tracking-wide text-paper-50 transition-colors hover:bg-moss-600"
          >
            お問い合わせ
          </Link>
        </div>

        {/* Hamburger */}
        <button
          ref={closeBtnRef}
          type="button"
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="-mr-2 flex h-11 w-11 items-center justify-center text-moss-700 lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-paper-300 bg-paper-50 lg:hidden"
        >
          <nav className="flex flex-col px-5 py-5" aria-label="モバイルナビゲーション">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block border-b border-paper-200 py-3.5 tracking-wide ${
                    isActive(item.href) ? "text-moss-700" : "text-ink-700"
                  }`}
                >
                  {item.label}
                </Link>
                {"children" in item && (
                  <div className="bg-paper-100 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMenuOpen(false)}
                        className="block border-b border-paper-200 py-3 text-sm text-ink-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <a
              href={siteConfig.phoneTel}
              className="mt-5 flex items-center justify-center gap-2 bg-moss-700 py-3.5 tracking-wider text-paper-50"
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              電話する（{siteConfig.phone}）
            </a>
            <p className="mt-2 text-center text-xs leading-relaxed text-ink-500">
              {siteConfig.phoneNote}
            </p>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 border border-paper-300 py-3.5 tracking-wide text-moss-700"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Instagram を見る
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
