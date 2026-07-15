import Link from "next/link";
import { Home, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";

export default function NotFound() {
  return (
    <section className="bg-washi">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center lg:px-8">
        <p className="font-en text-6xl tracking-widest text-wakaba-400">404</p>
        <h1 className="mt-6 font-heading text-2xl text-moss-700 md:text-3xl">
          ページが見つかりませんでした
        </h1>
        <p className="mt-4 text-[15px] leading-loose text-ink-600">
          お探しのページは、移動または削除された可能性があります。
          <br />
          お手数ですが、トップページからお進みください。
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-moss-700 px-7 py-3.5 text-sm tracking-wide text-paper-50 transition-colors hover:bg-moss-600"
          >
            <Home className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            トップページへ
          </Link>
          <a
            href={siteConfig.phoneTel}
            className="inline-flex items-center justify-center gap-2 border border-moss-600 px-7 py-3.5 text-sm tracking-wide text-moss-700 transition-colors hover:bg-moss-700 hover:text-paper-50"
          >
            <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            電話で相談する
          </a>
        </div>
      </div>
    </section>
  );
}
