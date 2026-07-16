import Breadcrumb, { type Crumb } from "./Breadcrumb";
import ImagePlaceholder from "./ImagePlaceholder";

type Props = {
  en?: string;
  title: string;
  lead?: string;
  breadcrumb: Crumb[];
  /** 背景写真ファイル名（任意）。無ければ深緑の地紋背景 */
  image?: string;
  imageLabel?: string;
};

/** 下層ページ共通ヒーロー（見出し + パンくず） */
export default function PageHero({
  en,
  title,
  lead,
  breadcrumb,
  image,
  imageLabel,
}: Props) {
  return (
    <>
      <section className="relative overflow-hidden bg-moss-800 text-paper-50">
        <div className="absolute inset-0">
          {image ? (
            <ImagePlaceholder
              src={image}
              alt=""
              label={imageLabel}
              fill
              tone="dark"
              overlay
              priority
              sizes="100vw"
            />
          ) : (
            // 写真未設定のページ（プライバシー等）は、カメラアイコンを出さず
            // 深緑の地紋グラデーションで自然に見せる
            <div className="absolute inset-0 bg-moss-800 bg-grid-soft" aria-hidden>
              <div className="absolute inset-0 bg-gradient-to-b from-moss-900/40 via-transparent to-moss-900/50" />
            </div>
          )}
        </div>
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 md:pb-16 md:pt-32 lg:px-8">
          {en && (
            <span className="font-en mb-3 block text-sm uppercase tracking-[0.3em] text-wakaba-300">
              {en}
            </span>
          )}
          <h1 className="font-heading text-3xl leading-tight md:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          {lead && (
            <p className="mt-5 max-w-2xl text-[15px] leading-loose text-paper-200/90 md:text-base">
              {lead}
            </p>
          )}
        </div>
      </section>
      <Breadcrumb items={breadcrumb} />
    </>
  );
}
