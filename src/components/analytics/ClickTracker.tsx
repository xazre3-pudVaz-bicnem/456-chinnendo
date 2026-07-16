"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * 電話・LINE・Instagram・問い合わせリンクのクリックをGA4イベントとして計測。
 * リンク先URLから自動判定するため、各コンポーネントへの属性追加は不要。
 */
export default function ClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest?.("a");
      if (!anchor || typeof window.gtag !== "function") return;
      const href = anchor.getAttribute("href") ?? "";

      let event: string | null = null;
      if (href.startsWith("tel:")) event = "click_tel";
      else if (href.includes("line.me")) event = "click_line";
      else if (href.includes("instagram.com")) event = "click_instagram";
      else if (href === "/contact" || href.startsWith("/contact#")) event = "click_contact";

      if (event) {
        window.gtag("event", event, {
          link_url: href,
          page_path: window.location.pathname,
        });
      }
    }
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
