import { Check } from "lucide-react";
import { pricing, formatYen, type Plan } from "@/data/pricing";

type Props = {
  /** 表示するプラン（省略時は基本プラン） */
  plan?: Plan;
};

/** 料金プランカード（基本プラン・定期コース共用） */
export default function PriceCard({ plan = pricing.basic }: Props) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden border border-paper-300 bg-paper-50">
      {plan.highlight && (
        <span className="absolute right-0 top-0 bg-gold-400 px-3 py-1.5 text-xs font-medium tracking-wide text-moss-900">
          {plan.highlight}
        </span>
      )}
      <div className="border-b border-paper-300 bg-moss-800 px-7 py-8 text-center text-paper-50">
        <p className="font-en text-xs uppercase tracking-[0.3em] text-wakaba-300">
          {plan.en}
        </p>
        <p className="mt-3 text-sm text-paper-200/90">
          {plan.name}・{plan.unit}
        </p>
        <p className="mt-2 flex items-baseline justify-center gap-1">
          <span className="font-heading text-5xl leading-none tracking-tight">
            {formatYen(plan.price)}
          </span>
          <span className="text-lg">円</span>
          <span className="ml-1 text-xs text-paper-200/80">（{plan.taxNote}）</span>
        </p>
        <p className="mt-3 text-xs tracking-wide text-wakaba-200">{plan.priceNote}</p>
      </div>
      <div className="flex-1 px-7 py-8">
        <p className="mb-4 text-sm font-medium text-moss-700">料金に含まれる内容</p>
        <ul className="grid grid-cols-1 gap-y-3">
          {plan.included.map((item) => (
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
