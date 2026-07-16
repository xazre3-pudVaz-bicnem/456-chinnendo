# SEO監査結果（456ちんねん堂公式サイト）

監査日：2026-07-16 ／ 対象：`https://www.456chinnendo.com/`（リポジトリ全体）

## 1. サイト構成の現状

- Next.js 16.2.9（App Router）+ React 19 + Tailwind CSS v4 + TypeScript
- 全ページ静的生成（SSG）。Client Component は Header / MobileFixedNav / ContactForm / Reveal / FaqAccordion / ImagePlaceholder / ClickTracker のみで、本文コンテンツはすべて Server Component → **JS無効でも主要文章はHTMLに出力される**
- コラムは `content/columns/*.md`（Markdown + 自作frontmatterパーサ + marked）
- データは `src/data/`（site / services / pricing / areas / faq / content / columns）に一元管理

## 2. 監査で確認した項目と結果

| 項目 | 監査時の状態 | 対応 |
|---|---|---|
| title / description | 全ページ固有・重複なし | ✅ 維持（新規ページも固有に作成） |
| canonical | 全ページ設定済み（pageMeta共通関数） | ✅ 維持 |
| robots.txt / sitemap.xml | Metadata Routesで実装済み | ✅ エリアページ15件を追加、コラムに実更新日のlastmod付与 |
| 構造化データ | WebSite / Organization / ProfessionalService / Service / FAQPage / Article / BreadcrumbList | ✅ 料金ページに **Offer** を追加、エリアページに **Service（areaServed=市）+ FAQPage** を追加、Articleに dateModified 追加 |
| OGP / X Card | 全ページ設定済み | ✅ 維持 |
| パンくず | 表示 + BreadcrumbList JSON-LD | ✅ 維持（エリアページにも設置） |
| h1 | 1ページ1つ | ✅ 維持（エリアページは「〇〇市のお墓参り代行・お墓掃除代行」固有h1） |
| 画像 | next/image・alt・アスペクト比固定・hero のみ priority | ✅ 維持 |
| 404 / リンク切れ | 実ファイル連動で検出なし | ✅ sitemapページ・sitemap.xmlとも実データから生成 |
| ローディング演出 | app/loading.tsx はルート遷移時のみ。初回表示（LCP）はブロックしない | ✅ 問題なし |
| LCP | hero-main.jpg（154KB・priority・AVIF/WebP変換） | ✅ 問題なし |
| CLS | 画像は全てアスペクト比固定 | ✅ 問題なし |
| モバイル | viewport-fit=cover・下部固定ナビ・入力16px | ✅ 問題なし |
| フォーム | mailto方式（設定不要）・RHF+Zod検証 | ✅ GA4イベント計測を追加 |

## 3. 監査で見つかった課題と実施した修正

1. **エリアページ不在**：「〇〇市 お墓参り代行」の検索意図に応えるページがなかった → **27市**の個別ページ（優先度A15市＋B12市）+ `/area` の7地域別構成を実装。各ページ固有h1・書き下ろし紹介文・地域FAQ・近隣市/関連コラムの内部リンク・Service(areaServed=市)+FAQPage構造化データ
2. **コラムの薄さ**：5記事のみ・執筆者/更新日/目次/関連記事なし → 記事20本追加（**計25本**）、目次自動生成・執筆者表示・公開/更新日・関連記事の自動抽出・サービス内部リンク・OGを article型に
3. **トップの回答性**：ファーストビュー直後に要点集約がなかった → 「30秒で分かる」回答ブロック（料金・エリア・写真報告・非対面）を追加
4. **料金ページ**：プラン比較・料金例がなかった → 比較表 + 「料金の考え方の例」（施工実績ではない旨を明記）+ Offer構造化データ
5. **計測**：GA4/GSC未対応 → 環境変数（`NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`）で有効化する仕組みを実装。電話/LINE/Instagram/問い合わせクリックとフォーム送信をイベント計測（個人情報は送信しない）
6. **AI検索対応**：`public/llms.txt` を追加（基本情報・料金・主要ページの要約）
7. **E-E-A-T**：事業者情報に料金・メール・LINE・作業方針を追記。コラムに執筆者ボックスを追加

## 3-2. 第2次監査（2026-07-16 追加）で見つかった重大な課題と対応

1. **【重大】ブログ ↔ コラム／エリアのキーワードカニバリゼーション**
   - 毎日自動生成のブログのトピックプールが、`/column`（25本）や `/area`（27市）と大量に重複していた（完全重複3件＋意味的重複約10件）。とくに公開済みの「千葉市でのお墓参り代行…」は `/area/chiba-city`（ほぼ同一タイトル）と同じクエリを奪い合っていた
   - 放置すると毎日1本ずつ競合が増える構造だったため、以下を実施：
     - トピックプールを**非重複のロングテール40件へ全面差し替え**（市区町村名・総合テーマを除外）
     - 重複していた3記事を削除し、`next.config.ts` の `redirects()` で本来の受け皿へ**恒久リダイレクト**（/area/chiba-city・/ohakamairi-daiko・/column/obon-mae-ohaka-soji）
     - 生成プロンプトに「市名をtitleに入れない」「総合テーマを主題にしない」「関連する常設ガイドへ必ずリンク」を明記し、`areaLink` を型ごと削除して再発を防止
     - 非重複の新シード記事2本を書き下ろし（花立ての水／水道のない墓地）
2. **トピッククラスター構造の確立**：サービス本体 ← 常設ガイド(/column)・地域(/area) ← ブログ(/blog) の3層に整理。ブログ記事から関連ガイドへ上位リンクを張り、評価をサービス本体へ集約
3. **ブログ一覧の肥大化リスク**：毎日更新で年300本規模になるため、12件/ページのページネーション（`/blog/page/[n]`）を実装し、sitemapにも追加
4. **構造化データの追加**：`AboutPage` + `Person`（確定した代表者名でE-E-A-T強化）、一覧ページに `CollectionPage` + `ItemList`（/blog・/column・/area）
5. **LocalBusiness の充実**：確定した住所・営業時間・代表者を `address` / `openingHoursSpecification` / `founder` に反映（表示内容と一致）

## 4. 残課題（手動対応・要確認）

- `NEXT_PUBLIC_SITE_URL` を本番ドメイン `https://www.456chinnendo.com` に設定（Vercel環境変数）※未設定だとcanonical等がプレースホルダードメインを向く
- Google Search Console 登録・sitemap送信（→ SEO_SETUP.md）
- GA4 プロパティ作成と測定IDの設定
- 料金の「税込」表記の正否確認
- 実際の作業写真（Before/After）への差し替え（現在は「写真はイメージ」表記）
- 住所・営業時間・代表者名の確定と掲載
- Googleビジネスプロフィール（GBP）のWebサイトURL・屋号・電話番号の統一
