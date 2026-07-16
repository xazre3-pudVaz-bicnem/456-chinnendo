import Script from "next/script";
import ClickTracker from "./ClickTracker";

/**
 * GA4 計測（環境変数 NEXT_PUBLIC_GA_MEASUREMENT_ID が設定された場合のみ読み込み）。
 *
 * 計測されるコンバージョン行動：
 * - click_tel：電話番号リンク（tel:）のクリック
 * - click_line：公式LINEリンクのクリック
 * - click_instagram：Instagramリンクのクリック
 * - click_contact：お問い合わせページへのリンククリック
 * - contact_mailto_open：フォームからメール作成画面を開いた
 * ページ閲覧（料金・エリアなど）はGA4標準のpage_viewで確認できます。
 * 個人情報・問い合わせ内容は送信しません。
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
      <ClickTracker />
    </>
  );
}
