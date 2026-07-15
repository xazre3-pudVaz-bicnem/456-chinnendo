"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera } from "lucide-react";
import { siteConfig } from "@/data/site";

type Props = {
  /** /public/images/ 配下のファイル名（例: "hero-main.jpg"）。無い/読めない場合はプレースホルダー表示 */
  src?: string;
  alt: string;
  /** 管理用ラベル（例: "ヒーロー背景写真"）。siteConfig.showImagePlaceholderLabels で表示制御 */
  label?: string;
  /** アスペクト比（例: "16 / 9"）。fill=false のとき有効 */
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** 親要素いっぱいに敷く（ヒーロー背景など） */
  fill?: boolean;
  /** 文字可読性のための暗いグラデーションオーバーレイ */
  overlay?: boolean;
  /** プレースホルダーの濃淡: "light"=淡いベージュ / "dark"=深緑 */
  tone?: "light" | "dark";
};

const BASE = "/images/";

export default function ImagePlaceholder({
  src,
  alt,
  label,
  ratio = "4 / 3",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
  fill = false,
  overlay = false,
  tone = "light",
}: Props) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  const wrapperStyle = fill ? undefined : { aspectRatio: ratio };
  const wrapperCls = fill
    ? `relative w-full h-full overflow-hidden ${className}`
    : `relative w-full overflow-hidden bg-paper-200 ${className}`;

  return (
    <div className={wrapperCls} style={wrapperStyle}>
      {showImage ? (
        <Image
          src={`${BASE}${src}`}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover ken-burns"
          onError={() => setErrored(true)}
        />
      ) : (
        <div
          // 装飾画像（alt=""）のフォールバックは支援技術から隠す
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${
            tone === "dark"
              ? "bg-moss-800 bg-grid-soft"
              : "bg-gradient-to-br from-paper-200 via-paper-100 to-wakaba-200/50"
          }`}
        >
          <Camera
            className={`h-8 w-8 ${
              tone === "dark" ? "text-paper-200/50" : "text-moss-500/40"
            }`}
            strokeWidth={1.25}
            aria-hidden
          />
          {siteConfig.showImagePlaceholderLabels && label && (
            <span
              className={`px-3 text-center text-[11px] tracking-widest ${
                tone === "dark" ? "text-paper-200/70" : "text-moss-600/70"
              }`}
            >
              {label}
            </span>
          )}
        </div>
      )}

      {overlay && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-moss-900/45 via-moss-900/25 to-moss-900/60"
        />
      )}
    </div>
  );
}
