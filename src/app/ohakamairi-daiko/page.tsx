import type { Metadata } from "next";
import ServiceDetail from "@/components/sections/ServiceDetail";
import { getService } from "@/data/services";
import { pageMeta, serviceSchema } from "@/lib/seo";

const service = getService("ohakamairi-daiko")!;

export const metadata: Metadata = pageMeta({
  title: "千葉のお墓参り代行",
  description:
    "千葉県内のお墓参り代行なら456ちんねん堂。遠方・ご多忙・ご高齢などでお墓へ行けない方に代わり、墓前を整え、心を込めてお参りします。作業の様子は写真でご報告。まずはお気軽にご相談ください。",
  path: "/ohakamairi-daiko",
  keywords: [
    "千葉 お墓参り代行",
    "千葉県 お墓参り代行",
    "お墓参り 代行 千葉",
    "遠方 お墓参り",
    "高齢者 お墓参り代行",
    "命日 お墓参り代行",
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
              name: "お墓参り代行",
              description:
                "千葉県内で、ご家族に代わりお墓を訪問し墓前を整え、心を込めてお参りするサービス。作業の様子は写真で報告します。",
              path: "/ohakamairi-daiko",
            }),
          ),
        }}
      />
      <ServiceDetail service={service} />
    </>
  );
}
