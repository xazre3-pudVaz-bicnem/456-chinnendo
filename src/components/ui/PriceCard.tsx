import { Check } from "lucide-react";
import { pricing, formatYen } from "@/data/pricing";

/** 基本料金カード */
export default function PriceCard() {
  const { basic } = pricing;
  return (
    <div className="overflow-hidden border border-paper-300 bg-paper-50">
      <div className="border-b border-paper-300 bg-moss-800 px-7 py-8 text-center text-paper-50">
        <p className="font-en text-xs uppercase tracking-[0.3em] text-wakaba-300">
          Basic Plan
        </p>
        <p className="mt-3 text-sm text-paper-200/90">{basic.name}・{basic.unit}</p>
        <p className="mt-2 flex items-baseline justify-center gap-1">
          <span className="font-heading text-5xl leading-none tracking-tight">
            {formatYen(basic.price)}
          </span>
          <span className="text-lg">円</span>
          <span className="ml-1 text-xs text-paper-200/80">（{basic.taxNote}）</span>
        </p>
      </div>
      <div className="px-7 py-8">
        <p className="mb-4 text-sm font-medium text-moss-700">料金に含まれる内容</p>
        <ul className="grid grid-cols-1 gap-y-3">
          {basic.included.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[15px] text-ink-600">
              <Check className="mt-1 h-4 w-4 shrink-0 text-wakaba-500" strokeWidth={2} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
