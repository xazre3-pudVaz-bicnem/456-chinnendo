import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  Camera,
  HeartHandshake,
  ClipboardCheck,
  MapPinned,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ServiceCard from "@/components/ui/ServiceCard";
import PriceCard from "@/components/ui/PriceCard";
import FlowSteps from "@/components/ui/FlowSteps";
import BeforeAfterCard from "@/components/ui/BeforeAfterCard";
import AreaList from "@/components/ui/AreaList";
import InstagramCard from "@/components/ui/InstagramCard";
import ColumnCard from "@/components/ui/ColumnCard";
import FaqAccordion from "@/components/ui/FaqAccordion";
import CTASection from "@/components/ui/CTASection";
import { services } from "@/data/services";
import { pricing, formatYen } from "@/data/pricing";
import {
  worries,
  reasons,
  flowSteps,
  workCases,
  instaPosts,
} from "@/data/content";
import { faqs, topFaqSlugs } from "@/data/faq";
import { siteConfig } from "@/data/site";
import { getColumnList } from "@/lib/columns";

const reasonIcons = [Sprout, Camera, HeartHandshake, MapPinned, ShieldCheck];

export default function HomePage() {
  const topFaqs = topFaqSlugs
    .map((q) => faqs.find((f) => f.q === q))
    .filter((f): f is (typeof faqs)[number] => Boolean(f));
  const columns = getColumnList().slice(0, 3);

  return (
    <>
      {/* FAQPage構造化データは /faq のみに掲載（重複マークアップ回避） */}

      {/* ============ 02 ヒーロー ============ */}
      <section className="relative flex min-h-[88svh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <ImagePlaceholder
            src="hero-main.jpg"
            alt="千葉県で心を込めてお参りとお掃除を行う、清められたお墓"
            label="ヒーロー背景写真"
            fill
            tone="dark"
            priority
            sizes="100vw"
          />
          {/* 文字可読性のためのグラデーションオーバーレイ */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-moss-900/70 via-moss-900/35 to-moss-900/45"
          />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-32 lg:px-8">
          <Reveal>
            <p className="font-en mb-6 flex items-center gap-3 text-sm tracking-[0.35em] text-wakaba-200">
              <span className="h-px w-8 bg-wakaba-300" aria-hidden />
              CHIBA
            </p>
            <h1 className="font-heading text-3xl leading-[1.5] text-paper-50 sm:text-4xl md:text-5xl md:leading-[1.45]">
              大切な人を想う気持ちを、
              <br />
              これからも。
            </h1>
            <p className="mt-7 max-w-xl text-base leading-loose text-paper-100/95 md:text-lg">
              千葉県のお墓参り・お墓掃除を、
              <br className="hidden sm:block" />
              心を込めてお手伝いします。
            </p>
            <p className="mt-5 max-w-xl text-sm leading-loose text-paper-100/85">
              遠方にお住まいの方、ご多忙な方、お身体の事情でお墓へ行くことが難しい方に代わり、一基一基丁寧にお参りとお掃除を行います。
            </p>
            <p className="font-en mt-8 text-xs tracking-[0.25em] text-paper-100/70">
              GRAVE VISIT &amp; CLEANING SERVICE
            </p>
          </Reveal>
        </div>

        {/* 控えめなスクロール誘導 */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-paper-100/70">
          <ArrowDown className="h-5 w-5 animate-bounce" strokeWidth={1.25} aria-hidden />
        </div>
      </section>

      {/* ============ 02.5 サービス要約（30秒で分かる回答ブロック）============ */}
      <section className="border-b border-paper-300 bg-paper-50">
        <div className="mx-auto max-w-7xl px-5 py-10 md:py-12 lg:px-8">
          <p className="text-[15px] leading-loose text-ink-700 md:text-base">
            <strong className="text-moss-700">456ちんねん堂</strong>
            は、千葉県内全域でお墓参り代行・お墓掃除代行を行っています。心を込めたお参り、お花・お線香のお供え、墓石や敷地の清掃、草むしり、作業前後の写真報告まで対応。ご相談から報告まで非対面で完結できます。
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            <div className="border border-paper-300 bg-paper-100 p-3.5">
              <dt className="text-xs text-ink-500">基本料金（墓石1基）</dt>
              <dd className="mt-1 font-heading text-lg text-moss-700">
                {formatYen(pricing.basic.price)}円
                <span className="ml-1 text-xs font-normal text-ink-500">税込</span>
              </dd>
              <dd className="mt-0.5 text-xs text-ink-500">お花代・お線香代込み</dd>
            </div>
            <div className="border border-paper-300 bg-paper-100 p-3.5">
              <dt className="text-xs text-ink-500">対応エリア</dt>
              <dd className="mt-1 font-heading text-lg text-moss-700">千葉県内全域</dd>
              <dd className="mt-0.5 text-xs text-ink-500">距離による追加料金なし</dd>
            </div>
            <div className="border border-paper-300 bg-paper-100 p-3.5">
              <dt className="text-xs text-ink-500">ご報告</dt>
              <dd className="mt-1 font-heading text-lg text-moss-700">作業前後の写真</dd>
              <dd className="mt-0.5 text-xs text-ink-500">遠方の方も状態を確認できます</dd>
            </div>
            <div className="border border-paper-300 bg-paper-100 p-3.5">
              <dt className="text-xs text-ink-500">ご相談方法</dt>
              <dd className="mt-1 font-heading text-lg text-moss-700">非対面でOK</dd>
              <dd className="mt-0.5 text-xs text-ink-500">電話・LINE・Instagram・フォーム</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ============ 03 導入セクション ============ */}
      <section className="bg-washi py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal>
            <SectionHeading
              en="Our Thoughts"
              title={
                <>
                  お墓へ行けないときも、
                  <br />
                  想う気持ちは届けられます。
                </>
              }
            />
            <div className="mt-6 space-y-5 text-[15px] leading-loose text-ink-600">
              <p>
                遠方に住んでいる。仕事や子育てで時間が取れない。足腰や体調に不安がある。さまざまな事情でお墓参りへ行けない方に代わり、456ちんねん堂が心を込めてお参りとお掃除を行います。
              </p>
              <p>
                単なる清掃作業としてではなく、ご家族の大切な想いをお預かりする仕事として、一つひとつ丁寧に対応します。作業の様子は、作業前後の写真でご報告します。
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <ImagePlaceholder
              src="about-main.jpg"
              alt="手を合わせてお参りする様子"
              label="お参りの様子写真"
              ratio="5 / 4"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="border border-paper-300"
            />
          </Reveal>
        </div>
      </section>

      {/* ============ 04 お悩みセクション ============ */}
      <section className="bg-paper-200 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            en="For You"
            title={<>このようなお悩みは<br className="sm:hidden" />ありませんか？</>}
            align="center"
          />
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {worries.map((w, i) => (
              <Reveal as="li" key={w} delay={i * 60}>
                <div className="flex h-full items-start gap-4 border border-paper-300 bg-paper-50 p-6">
                  <span className="font-en mt-0.5 shrink-0 text-lg text-wakaba-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-relaxed text-ink-700">{w}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10 text-center">
            <p className="text-[15px] leading-loose text-ink-600">
              一つでも当てはまる方は、どうぞお気軽にご相談ください。
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 05 サービス紹介 ============ */}
      <section className="bg-washi py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            en="Services"
            title={<>想いに合わせて選べる<br className="sm:hidden" />お墓参り・お掃除代行</>}
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 80}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 06 料金案内 ============ */}
      <section className="bg-moss-800 py-20 text-paper-50 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal>
            <SectionHeading
              en="Price"
              title={<>分かりやすい料金で、<br />丁寧に対応します。</>}
              tone="light"
            />
            <p className="mt-6 text-[15px] leading-loose text-paper-200/90">
              基本プランは墓石1基あたり{formatYen(pricing.basic.price)}円（税込・お花代・お線香代込み）。心を込めたお参りから敷地全体の徹底清掃、作業前後の写真報告、千葉県内の移動費・高速道路料金まで含まれます。
            </p>
            <p className="mt-4 text-[15px] leading-loose text-paper-200/90">
              お彼岸・お盆・年末・命日などに合わせてご利用いただける、定期コース（{siteConfig.regularTimes}回 {formatYen(pricing.regular.price)}円）もご用意しています。
            </p>
            <p className="mt-4 text-sm leading-loose text-paper-200/75">
              千葉県内は距離による追加料金なし。墓地の広さ、墓石の数、汚れや雑草の状態によっては、事前に追加料金をご案内する場合があります。
            </p>
            <Link
              href="/price"
              className="mt-8 inline-flex items-center gap-2 border border-paper-50/40 px-6 py-3 text-sm tracking-wide text-paper-50 transition-colors hover:bg-paper-50/10"
            >
              料金の詳細を見る
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <PriceCard />
          </Reveal>
        </div>
      </section>

      {/* ============ 07 選ばれる理由 ============ */}
      <section className="bg-washi py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            en="Why Chinnendo"
            title={<>大切なお墓を<br className="sm:hidden" />安心して任せていただくために。</>}
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => {
              const Icon = reasonIcons[i] ?? ShieldCheck;
              return (
                <Reveal key={r.no} delay={i * 70}>
                  <div className="flex h-full flex-col border border-paper-300 bg-paper-50 p-7">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wakaba-200 text-moss-700">
                        <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="font-en text-2xl text-paper-400">{r.no}</span>
                    </div>
                    <h3 className="mt-5 font-heading text-lg text-moss-700">{r.title}</h3>
                    <p className="mt-3 text-[15px] leading-loose text-ink-600">{r.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 08 作業事例（Before & After）============ */}
      <section className="bg-paper-200 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            en="Before &amp; After"
            title={<>作業前後の様子を<br className="sm:hidden" />写真でご報告します。</>}
            lead="ご依頼の際は、作業前と作業後の写真を撮影してご報告します。※下記の写真はイメージです。実際の施工事例は準備中です。"
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2">
            {workCases.map((c, i) => (
              <Reveal key={i} delay={i * 80}>
                <BeforeAfterCard item={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 09 ご利用の流れ ============ */}
      <section className="bg-washi py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20 lg:px-8">
          <Reveal>
            <SectionHeading
              en="Flow"
              title={<>ご相談から完了報告まで<br />分かりやすくご案内します。</>}
            />
            <p className="mt-6 text-[15px] leading-loose text-ink-600">
              初めての方にも安心してご利用いただけるよう、ご相談から作業後のご報告まで、順を追ってご案内します。
            </p>
            <Link
              href="/flow"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-moss-600 hover:text-moss-700"
            >
              流れの詳細を見る
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </Reveal>
          <div>
            <FlowSteps steps={flowSteps} />
          </div>
        </div>
      </section>

      {/* ============ 10 対応エリア ============ */}
      <section className="bg-paper-200 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal>
            <SectionHeading
              en="Service Area"
              title={<>千葉県内全域から<br />ご相談いただけます。</>}
            />
            <p className="mt-6 text-[15px] leading-loose text-ink-600">
              456ちんねん堂は、千葉県内全域でお墓参り代行・お墓掃除代行のご相談を承っています。県内は距離による追加料金なしで対応します。墓地の場所や作業内容の確認がありますので、まずはお気軽にご相談ください。
            </p>
            <Link
              href="/area"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-moss-600 hover:text-moss-700"
            >
              対応エリアの詳細を見る
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <AreaList />
          </Reveal>
        </div>
      </section>

      {/* ============ 11 代表・事業者紹介 ============ */}
      <section className="bg-washi py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal className="order-2 lg:order-1">
            <ImagePlaceholder
              src="staff-main.jpg"
              alt="456ちんねん堂のスタッフ"
              label="スタッフ写真"
              ratio="4 / 5"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="mx-auto max-w-sm border border-paper-300"
            />
          </Reveal>
          <Reveal delay={100} className="order-1 lg:order-2">
            <SectionHeading
              en="About Us"
              title={<>ご家族の想いまで<br />大切にお預かりします。</>}
            />
            <div className="mt-6 space-y-5 text-[15px] leading-loose text-ink-600">
              <p>
                お墓は、ご先祖様や大切な方とのつながりを感じられる大切な場所です。456ちんねん堂では、お墓参りに行くことが難しい方の想いをお預かりし、一基一基心を込めてお参りとお掃除を行っています。
              </p>
              <p>
                清掃の仕上がりだけでなく、依頼される方が安心して任せられることを大切にし、作業前後の写真とともに丁寧にご報告します。
              </p>
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-moss-600 hover:text-moss-700"
            >
              私たちについて
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ 12 よくある質問 ============ */}
      <section className="bg-paper-200 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <SectionHeading en="FAQ" title="よくあるご質問" align="center" />
          <div className="mt-10">
            <FaqAccordion items={topFaqs} />
          </div>
          <Reveal className="mt-10 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 border border-moss-600 px-6 py-3 text-sm tracking-wide text-moss-700 transition-colors hover:bg-moss-700 hover:text-paper-50"
            >
              すべての質問を見る
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </Reveal>

          {/* ご相談前の案内（準備情報・対応が難しい場合） */}
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Reveal>
              <div className="h-full border border-paper-300 bg-paper-50 p-6">
                <h3 className="font-heading text-lg text-moss-700">
                  ご相談前にご準備いただきたい情報
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-600">
                  {[
                    "墓地・霊園名（分かる範囲で大丈夫です）",
                    "墓地のおおよその所在地",
                    "区画番号やお墓の目印（分かれば）",
                    "墓石の数",
                    "ご希望の作業と時期（お盆前・命日など）",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-wakaba-400" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  すべて揃っていなくても構いません。一緒に確認しながら進められます。
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="h-full border border-paper-300 bg-paper-50 p-6">
                <h3 className="font-heading text-lg text-moss-700">
                  対応が難しい場合があること
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-600">
                  {[
                    "墓石の修理・彫刻・据え直しなどの石材工事",
                    "墓地・霊園の規則で立ち入りや作業が制限されている場合",
                    "強い薬剤や研磨が必要になる汚れの除去（墓石を傷めないため行いません）",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  対応可否が分からない場合も、まずはご相談ください。状況を確認のうえご案内します。
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 13 Instagram ============ */}
      <section className="bg-washi py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            en="Instagram"
            title={<>日々の活動を<br className="sm:hidden" />Instagramでご紹介しています。</>}
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {instaPosts.map((p, i) => (
              <Reveal key={i} delay={i * 70}>
                <InstagramCard post={p} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-moss-600 hover:text-moss-700"
            >
              Instagramをもっと見る（{siteConfig.instagramHandle}）
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ============ 14 コラム ============ */}
      {columns.length > 0 && (
        <section className="bg-paper-200 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionHeading
              en="Column"
              title={<>お墓参りとお墓のお手入れに<br className="sm:hidden" />役立つ情報</>}
              align="center"
            />
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {columns.map((c, i) => (
                <Reveal key={c.slug} delay={i * 70}>
                  <ColumnCard item={c} />
                </Reveal>
              ))}
            </div>
            {/* 時期別の読みもの */}
            <Reveal className="mt-10">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <span className="text-sm text-ink-500">時期から探す：</span>
                {[
                  { href: "/column/obon-mae-ohaka-soji", label: "お盆前のお墓掃除" },
                  { href: "/column/ohigan-ohakamairi-junbi", label: "お彼岸の準備" },
                  { href: "/column/meinichi-ohakamairi-daiko", label: "命日のお参り" },
                  { href: "/column/nenmatsu-ohaka-soji", label: "年末のお墓掃除" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="border border-paper-300 bg-paper-50 px-3.5 py-1.5 text-sm text-moss-700 transition-colors hover:border-moss-500"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </Reveal>
            <Reveal className="mt-8 text-center">
              <Link
                href="/column"
                className="inline-flex items-center gap-2 text-sm font-medium text-moss-600 hover:text-moss-700"
              >
                コラム一覧を見る
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ 15 最終問い合わせ ============ */}
      <CTASection />

      {/* 補足：写真報告の一文（信頼要素） */}
      <div className="border-t border-paper-300 bg-paper-100 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-5 text-center text-sm text-ink-500 lg:px-8">
          <ClipboardCheck className="h-5 w-5 shrink-0 text-wakaba-500" strokeWidth={1.5} aria-hidden />
          追加作業が必要な場合は、勝手に進めず、必ず事前に内容と料金をご案内します。
        </div>
      </div>
    </>
  );
}
