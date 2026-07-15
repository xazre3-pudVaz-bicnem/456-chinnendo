"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Faq } from "@/data/faq";

/** FAQアコーディオン（details/summaryベースでキーボード操作・JS無効でも開閉可） */
export default function FaqAccordion({ items }: { items: Pick<Faq, "q" | "a">[] }) {
  return (
    <div className="divide-y divide-paper-300 border-y border-paper-300">
      {items.map((f, i) => (
        <FaqItem key={i} q={f.q} a={f.a} />
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="group"
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
        <span className="flex gap-3 text-[15px] font-medium leading-relaxed text-moss-700 md:text-base">
          <span className="font-en shrink-0 text-gold-500" aria-hidden>
            Q.
          </span>
          {q}
        </span>
        <Plus
          className={`mt-0.5 h-5 w-5 shrink-0 text-moss-500 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          strokeWidth={1.5}
          aria-hidden
        />
      </summary>
      <div className="flex gap-3 pb-6 pr-8 text-[15px] leading-loose text-ink-600">
        <span className="font-en shrink-0 text-wakaba-500" aria-hidden>
          A.
        </span>
        <p>{a}</p>
      </div>
    </details>
  );
}
