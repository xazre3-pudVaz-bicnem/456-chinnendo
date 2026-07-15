import type { Metadata } from "next";
import { siteConfig, SITE_URL } from "@/data/site";

type PageMetaArgs = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

/** 各ページ共通の metadata 生成（canonical / OGP 含む） */
export function pageMeta({ title, description, path, keywords }: PageMetaArgs): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title: `${title}｜${siteConfig.name}`,
      description,
      url,
      type: "website",
      locale: "ja_JP",
      siteName: siteConfig.name,
      images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

/** FAQPage 構造化データ */
export function faqSchema(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Service 構造化データ */
export function serviceSchema(args: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${args.path}/#service`,
    serviceType: args.name,
    name: args.name,
    description: args.description,
    url: `${SITE_URL}${args.path}`,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "AdministrativeArea", name: siteConfig.areaRegion },
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: siteConfig.phoneIntl,
      serviceUrl: `${SITE_URL}/contact`,
    },
  };
}

/** Article 構造化データ（コラム記事） */
export function articleSchema(args: {
  title: string;
  description: string;
  path: string;
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    ...(args.date ? { datePublished: args.date, dateModified: args.date } : {}),
    mainEntityOfPage: `${SITE_URL}${args.path}`,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
    image: `${SITE_URL}/images/og-image.jpg`,
  };
}

/**
 * LocalBusiness / ProfessionalService 構造化データ（全ページ共通）
 * 住所・営業時間は未確定のため掲載しない（架空情報を入れない）。
 */
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  name: siteConfig.name,
  url: SITE_URL,
  telephone: siteConfig.phoneIntl,
  image: `${SITE_URL}/images/og-image.jpg`,
  description:
    "千葉県内でお墓参り代行・お墓掃除代行を行うサービス。遠方・ご多忙・ご高齢などでお墓へ行くことが難しい方に代わり、墓石の水洗いや雑草取り、墓地周辺の清掃を丁寧に行い、作業前後の写真でご報告します。",
  areaServed: { "@type": "AdministrativeArea", name: siteConfig.areaRegion },
  address: {
    "@type": "PostalAddress",
    addressRegion: siteConfig.areaRegion,
    addressCountry: "JP",
    // 要確認：住所が確定したら streetAddress / addressLocality / postalCode を追加
  },
  sameAs: [siteConfig.instagram],
  knowsAbout: [
    "お墓参り代行",
    "お墓掃除代行",
    "墓石清掃",
    "墓地清掃",
    "雑草取り",
    "お墓の管理代行",
  ],
};

/** Organization 構造化データ */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: siteConfig.name,
  url: SITE_URL,
  logo: `${SITE_URL}/images/og-image.jpg`,
  telephone: siteConfig.phoneIntl,
  sameAs: [siteConfig.instagram],
};

/** WebSite 構造化データ */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: siteConfig.name,
  inLanguage: "ja",
  publisher: { "@id": `${SITE_URL}/#organization` },
};
