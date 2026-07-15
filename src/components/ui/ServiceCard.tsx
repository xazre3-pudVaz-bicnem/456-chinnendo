import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/data/services";
import ImagePlaceholder from "./ImagePlaceholder";

/** サービス紹介カード（トップ・一覧で使用） */
export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-paper-300 bg-paper-50 transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(47,72,52,0.10)]">
      <ImagePlaceholder
        src={service.image}
        alt={`${service.title}の作業イメージ`}
        label={service.imageLabel}
        ratio="16 / 10"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <span className="font-en text-xs uppercase tracking-[0.25em] text-moss-500">
          {service.en}
        </span>
        <h3 className="mt-2 font-heading text-xl text-moss-700 md:text-2xl">
          {service.title}
        </h3>
        <p className="mt-3 text-[15px] leading-loose text-ink-600">{service.short}</p>

        <ul className="mt-5 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          {service.items.slice(0, 6).map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-600">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-wakaba-500" strokeWidth={2} aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={service.href}
          className="mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-moss-600 transition-colors hover:text-moss-700"
        >
          詳しく見る
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            strokeWidth={1.75}
            aria-hidden
          />
        </Link>
      </div>
    </article>
  );
}
