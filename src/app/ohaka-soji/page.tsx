import type { Metadata } from "next";
import ServiceDetail from "@/components/sections/ServiceDetail";
import { requireService } from "@/data/services";
import { pageMeta, serviceSchema } from "@/lib/seo";

const service = requireService("ohaka-soji");

export const metadata: Metadata = pageMeta({
  title: "千葉のお墓掃除代行",
  description:
    "千葉県内のお墓掃除代行なら456ちんねん堂。墓石の水洗い・拭き上げ、雑草取り、落ち葉やゴミの回収、墓地周辺の清掃まで丁寧に対応。作業前後の状態を写真でご報告します。",
  path: "/ohaka-soji",
  keywords: [
    "千葉 お墓掃除代行",
    "千葉県 お墓掃除代行",
    "お墓掃除 代行 千葉",
    "墓石掃除 千葉",
    "墓地清掃 千葉",
    "お墓 草取り 代行",
    "お墓 雑草除去 千葉",
  ],
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceSchema({
              name: "お墓掃除代行",
              description:
                "千葉県内で、墓石の水洗い・拭き上げ、雑草取り、墓地周辺の清掃を行うサービス。作業前後の状態を写真で報告します。",
              path: "/ohaka-soji",
            }),
          ),
        }}
      />
      <ServiceDetail service={service} />
    </>
  );
}
