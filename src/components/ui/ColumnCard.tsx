import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ColumnMeta } from "@/lib/columns";

/** コラム一覧カード */
export default function ColumnCard({ item }: { item: ColumnMeta }) {
  return (
    <article className="group relative flex h-full flex-col border border-paper-300 bg-paper-50 p-6 transition-shadow hover:shadow-[0_10px_30px_rgba(47,72,52,0.08)] md:p-7">
      <div className="flex items-center gap-3 text-xs">
        <span className="bg-wakaba-200 px-2.5 py-1 text-moss-700">{item.category}</span>
        {item.date && <time className="font-en text-ink-400">{item.date}</time>}
      </div>
      <h3 className="mt-4 font-heading text-lg leading-snug text-moss-700">
        <Link href={`/column/${item.slug}`} className="after:absolute after:inset-0">
          {item.title}
        </Link>
      </h3>
      {item.excerpt && (
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-600">
          {item.excerpt}
        </p>
      )}
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-moss-600">
        続きを読む
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          strokeWidth={1.75}
          aria-hidden
        />
      </span>
    </article>
  );
}
