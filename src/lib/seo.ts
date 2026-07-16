import type { Metadata } from "next";
import { siteConfig, SITE_URL } from "@/data/site";

type PageMetaArgs = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** OGタイプ（記事ページは "article"） */
  ogType?: "website" | "article";
};

/** 各ページ共通の metadata 生成（canonical / OGP 含む） */
export function pageMeta({
  title,
  description,
  path,
  keywords,
  ogType = "website",
}: PageMetaArgs): Metadata {
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
      type: ogType,
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
      servicePhone: {
        "@type": "ContactPoint",
        telephone: siteConfig.phoneIntl,
      },
      serviceUrl: `${SITE_URL}/contact`,
    },
  };
}

/** 料金ページ用：Service + Offer 構造化データ（表示内容と一致させる） */
export function priceServiceSchema(args: {
  basicPrice: number;
  regularPrice: number;
  regularTimes: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/price/#service`,
    serviceType: "お墓参り代行・お墓掃除代行",
    name: "お墓参り代行・お墓掃除代行",
    url: `${SITE_URL}/price`,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: { "@type": "AdministrativeArea", name: siteConfig.areaRegion },
    offers: [
      {
        "@type": "Offer",
        name: "基本プラン（墓石1基）",
        price: String(args.basicPrice),
        priceCurrency: "JPY",
        description:
          "心を込めたお参り、お花・お線香のお供え（代金込み）、敷地全体の草むしり、水垢・苔などの汚れ除去、敷地全体の徹底清掃、作業前後の写真報告、千葉県内の移動費・高速道路料金を含む。",
        url: `${SITE_URL}/price`,
      },
      {
        "@type": "Offer",
        name: `定期コース（${args.regularTimes}回）`,
        price: String(args.regularPrice),
        priceCurrency: "JPY",
        description: `基本プランの内容を${args.regularTimes}回実施。お彼岸・お盆・年末・命日などご希望の時期に対応。`,
        url: `${SITE_URL}/price`,
      },
    ],
  };
}

/** Article 構造化データ（コラム記事） */
export function articleSchema(args: {
  title: string;
  description: string;
  path: string;
  date: string;
  updatedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    ...(args.date
      ? {
          datePublished: args.date,
          dateModified: args.updatedAt || args.date,
        }
      : {}),
    mainEntityOfPage: `${SITE_URL}${args.path}`,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
    image: `${SITE_URL}/images/og-image.jpg`,
  };
}

/**
 * LocalBusiness / ProfessionalService 構造化データ（全ページ共通）
 * 事業者情報（住所・営業時間・代表者）はご本人確認済みの内容のみ掲載。
 */
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  name: siteConfig.name,
  url: SITE_URL,
  telephone: siteConfig.phoneIntl,
  email: siteConfig.email,
  image: `${SITE_URL}/images/og-image.jpg`,
  description:
    "千葉県内でお墓参り代行・お墓掃除代行を行うサービス。遠方・ご多忙・ご高齢などでお墓へ行くことが難しい方に代わり、墓石の水洗いや雑草取り、墓地周辺の清掃を丁寧に行い、作業前後の写真でご報告します。",
  areaServed: { "@type": "AdministrativeArea", name: siteConfig.areaRegion },
  address: {
    "@type": "PostalAddress",
    ...(siteConfig.postalCode ? { postalCode: siteConfig.postalCode } : {}),
    addressRegion: "千葉県",
    addressLocality: "千葉市花見川区",
    streetAddress: "三角町178-19",
    addressCountry: "JP",
  },
  // 営業時間 12:00〜20:00（全日）
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "12:00",
    closes: "20:00",
  },
  founder: { "@type": "Person", name: siteConfig.representative },
  sameAs: [siteConfig.instagram, siteConfig.line],
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
  logo: `${SITE_URL}/images/logo.png`,
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
