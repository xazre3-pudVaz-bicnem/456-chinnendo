import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // 旧ブログ記事 → 本来の受け皿ページへ集約（キーワードのカニバリ解消）。
      // ブログは「細かいロングテールの疑問」を担当し、下記KWは各ページが担当する。
      {
        source: "/blog/chiba-city-ohakamairi",
        destination: "/area/chiba-city",
        permanent: true,
      },
      {
        source: "/blog/chiba-ohakamairi-daiko",
        destination: "/ohakamairi-daiko",
        permanent: true,
      },
      {
        source: "/blog/obon-ohaka-soji",
        destination: "/column/obon-mae-ohaka-soji",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
