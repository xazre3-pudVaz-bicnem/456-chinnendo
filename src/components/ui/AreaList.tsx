import { MapPin } from "lucide-react";
import { chibaCities } from "@/data/areas";

/** 対応エリア一覧（千葉県内の主要市を目安として掲載） */
export default function AreaList() {
  return (
    <div className="border border-paper-300 bg-paper-50 p-7 md:p-9">
      <div className="flex items-center gap-2 text-moss-700">
        <MapPin className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        <p className="font-heading text-lg">千葉県内の主なエリア</p>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2">
        {chibaCities.map((city) => (
          <li
            key={city}
            className="border border-paper-300 bg-paper-100 px-3 py-1.5 text-sm text-ink-600"
          >
            {city}
          </li>
        ))}
        <li className="border border-wakaba-300 bg-wakaba-200/50 px-3 py-1.5 text-sm text-moss-700">
          その他 千葉県内
        </li>
      </ul>
      <p className="mt-6 text-sm leading-loose text-ink-500">
        上記は千葉県内の主なエリアの一例です。記載のない地域でもご相談いただけます。
        墓地の場所や作業内容によって、対応の可否や出張費用が変わる場合がありますので、
        まずはお気軽にお問い合わせください。
      </p>
    </div>
  );
}
