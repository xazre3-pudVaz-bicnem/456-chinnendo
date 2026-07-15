type Props = {
  en?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  as?: "h1" | "h2";
};

/** セクション見出し（英字ラベル + 和文見出し + リード文） */
export default function SectionHeading({
  en,
  title,
  lead,
  align = "left",
  tone = "dark",
  className = "",
  as = "h2",
}: Props) {
  const isCenter = align === "center";
  const isLight = tone === "light";
  const Tag = as;
  return (
    <div className={`${isCenter ? "mx-auto max-w-2xl text-center" : ""} ${className}`}>
      {en && (
        <span
          className={`font-en mb-3 block text-sm uppercase tracking-[0.3em] ${
            isLight ? "text-wakaba-300" : "text-moss-500"
          }`}
        >
          {en}
        </span>
      )}
      <Tag
        className={`font-heading text-2xl leading-snug md:text-3xl lg:text-[2rem] ${
          isLight ? "text-paper-50" : "text-moss-700"
        }`}
      >
        {title}
      </Tag>
      {lead && (
        <p
          className={`mt-5 text-[15px] leading-loose md:text-base ${
            isLight ? "text-paper-200/90" : "text-ink-600"
          } ${isCenter ? "" : "max-w-2xl"}`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
