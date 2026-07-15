import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileFixedNav from "@/components/layout/MobileFixedNav";
import { siteConfig, SITE_URL } from "@/data/site";
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "千葉のお墓参り代行・お墓掃除代行｜456ちんねん堂",
    template: `%s｜${siteConfig.name}`,
  },
  description:
    "456ちんねん堂は、千葉県内でお墓参り代行・お墓掃除代行を承っています。遠方、ご多忙、ご高齢などでお墓へ行くことが難しい方に代わり、墓石の水洗い、雑草取り、墓地周辺の清掃を丁寧に行い、作業前後の写真でご報告します。",
  keywords: [
    "千葉 お墓参り代行",
    "千葉 お墓掃除代行",
    "千葉県 お墓参り代行",
    "千葉県 お墓掃除代行",
    "お墓参り 代行 千葉",
    "墓石掃除 千葉",
    "墓地清掃 千葉",
    "お墓 草取り 代行",
    "遠方 お墓参り",
    "高齢者 お墓参り代行",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { telephone: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: siteConfig.name,
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${notoSans.variable} ${notoSerif.variable} ${cormorant.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-paper-100 text-ink-700 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-moss-700 focus:px-4 focus:py-2 focus:text-paper-50"
        >
          本文へスキップ
        </a>
        <Header />
        <main id="main" className="flex-1 pb-16 lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileFixedNav />
      </body>
    </html>
  );
}
