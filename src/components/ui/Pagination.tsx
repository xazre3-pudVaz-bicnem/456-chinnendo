import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  current: number;
  total: number;
  /** 1ページ目のURL（例: "/blog"） */
  basePath: string;
  /** 2ページ目以降のURL生成（例: (n) => `/blog/page/${n}`） */
  pageHref: (page: number) => string;
};

/** ページネーション（記事一覧用） */
export default function Pagination({ current, total, basePath, pageHref }: Props) {
  if (total <= 1) return null;

  const href = (n: number) => (n === 1 ? basePath : pageHref(n));

  // 現在ページの前後1ページ＋最初と最後を表示
  const pages: (number | "…")[] = [];
  for (let n = 1; n <= total; n++) {
    if (n === 1 || n === total || Math.abs(n - current) <= 1) {
      pages.push(n);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const itemCls =
    "inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm transition-colors";

  return (
    <nav aria-label="ページ送り" className="mt-14 flex justify-center">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          {current > 1 ? (
            <Link
              href={href(current - 1)}
              rel="prev"
              aria-label="前のページ"
              className={`${itemCls} border-paper-300 bg-paper-50 text-moss-700 hover:border-moss-500`}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          ) : (
            <span
              aria-hidden
              className={`${itemCls} border-paper-200 bg-paper-100 text-ink-400`}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </span>
          )}
        </li>

        {pages.map((p, i) =>
          p === "…" ? (
            <li key={`gap-${i}`} className="px-1 text-sm text-ink-400" aria-hidden>
              …
            </li>
          ) : (
            <li key={p}>
              {p === current ? (
                <span
                  aria-current="page"
                  className={`${itemCls} border-moss-700 bg-moss-700 font-medium text-paper-50`}
                >
                  {p}
                </span>
              ) : (
                <Link
                  href={href(p)}
                  aria-label={`${p}ページ目`}
                  className={`${itemCls} border-paper-300 bg-paper-50 text-moss-700 hover:border-moss-500`}
                >
                  {p}
                </Link>
              )}
            </li>
          ),
        )}

        <li>
          {current < total ? (
            <Link
              href={href(current + 1)}
              rel="next"
              aria-label="次のページ"
              className={`${itemCls} border-paper-300 bg-paper-50 text-moss-700 hover:border-moss-500`}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          ) : (
            <span
              aria-hidden
              className={`${itemCls} border-paper-200 bg-paper-100 text-ink-400`}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
