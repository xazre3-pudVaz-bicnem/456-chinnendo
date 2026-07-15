import Image from "next/image";
import { siteConfig } from "@/data/site";

/**
 * ページ遷移・読み込み中のローディング画面。
 * ロゴエンブレムを静かに点滅表示（prefers-reduced-motion では停止）。
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-[100svh] flex-col items-center justify-center gap-5 bg-paper-100"
      role="status"
      aria-label="読み込み中"
    >
      {siteConfig.hasLogo ? (
        <Image
          src="/images/logo-mark.png"
          alt=""
          width={96}
          height={96}
          priority
          className="h-24 w-24 rounded-full border border-paper-300 object-cover motion-safe:animate-pulse"
        />
      ) : (
        <span className="font-heading text-2xl text-moss-700 motion-safe:animate-pulse">
          {siteConfig.name}
        </span>
      )}
      <span className="text-sm tracking-widest text-ink-500">読み込み中…</span>
    </div>
  );
}
