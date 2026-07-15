import type { FlowStep } from "@/data/content";
import Reveal from "./Reveal";

/** ご利用の流れ（縦タイムライン） */
export default function FlowSteps({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <Reveal as="li" key={step.no} delay={i * 60} className="relative flex gap-5 md:gap-8">
            {/* 番号 + 縦線 */}
            <div className="flex flex-col items-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-moss-600 bg-paper-50 font-en text-lg text-moss-700">
                {step.no}
              </span>
              {!last && <span className="my-1 w-px flex-1 bg-paper-300" aria-hidden />}
            </div>
            {/* 本文 */}
            <div className={`pt-1.5 ${last ? "pb-0" : "pb-10"}`}>
              <h3 className="font-heading text-lg text-moss-700 md:text-xl">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-loose text-ink-600">{step.body}</p>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
