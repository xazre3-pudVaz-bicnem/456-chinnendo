import type { WorkCase } from "@/data/content";
import ImagePlaceholder from "./ImagePlaceholder";

/** 作業事例（Before / After）カード */
export default function BeforeAfterCard({ item }: { item: WorkCase }) {
  const preparing = item.status === "preparing";
  return (
    <article className="overflow-hidden border border-paper-300 bg-paper-50">
      <div className="grid grid-cols-2">
        <figure className="relative">
          <ImagePlaceholder
            src={item.beforeImage}
            alt={`${item.service}の清掃前${preparing ? "（イメージ）" : ""}`}
            label={item.beforeLabel}
            ratio="1 / 1"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <figcaption className="absolute left-0 top-0 bg-ink-800/80 px-3 py-1 font-en text-[11px] uppercase tracking-widest text-paper-50">
            Before
          </figcaption>
        </figure>
        <figure className="relative">
          <ImagePlaceholder
            src={item.afterImage}
            alt={`${item.service}の清掃後${preparing ? "（イメージ）" : ""}`}
            label={item.afterLabel}
            ratio="1 / 1"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <figcaption className="absolute left-0 top-0 bg-moss-700/90 px-3 py-1 font-en text-[11px] uppercase tracking-widest text-paper-50">
            After
          </figcaption>
        </figure>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-paper-200 px-2.5 py-1 text-xs text-moss-700">
            {item.area}
          </span>
          <span className="bg-wakaba-200 px-2.5 py-1 text-xs text-moss-700">
            {item.service}
          </span>
          {preparing && (
            <span className="border border-gold-400 px-2.5 py-1 text-xs text-gold-600">
              写真はイメージ・実事例準備中
            </span>
          )}
        </div>
        <dl className="mt-4 space-y-1.5 text-sm text-ink-600">
          <div className="flex gap-2">
            <dt className="shrink-0 text-ink-400">対応内容</dt>
            <dd>{item.work}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 text-ink-400">作業時間</dt>
            <dd>{item.duration}</dd>
          </div>
        </dl>
        <p className="mt-3 border-t border-paper-200 pt-3 text-sm leading-relaxed text-ink-500">
          {item.comment}
        </p>
      </div>
    </article>
  );
}
