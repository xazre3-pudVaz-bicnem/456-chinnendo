# 456ちんねん堂 公式サイト

千葉県内のお墓参り代行・お墓掃除代行「456ちんねん堂」の公式ホームページ。

- **技術構成**：Next.js 16（App Router）/ TypeScript / Tailwind CSS v4 / React Hook Form + Zod / Markdown コラム
- **設計方針**：屋号・電話・料金・エリアなどは `src/data/` に集約し、1か所の変更でサイト全体に反映。

## 開発・ビルド

```bash
npm install
npm run dev     # 開発サーバー（http://localhost:3000）
npm run lint    # ESLint
npm run build   # 本番ビルド
npm start       # 本番サーバー
```

## よく使う変更箇所（管理ガイド）

| 変更したいもの | 編集するファイル |
| --- | --- |
| 屋号・電話番号・Instagram・住所・営業時間・代表者・エリア・基本料金 | `src/data/site.ts` |
| 料金・追加料金の説明・含まれる内容 | `src/data/pricing.ts`（金額は `site.ts` の `mainPrice`） |
| サービス内容・詳細ページ本文 | `src/data/services.ts` |
| 対応エリア（市区町村・エリアページ） | `src/data/areas.ts` |
| よくある質問 | `src/data/faq.ts` |
| お悩み・選ばれる理由・流れ・作業事例・Instagram疑似カード | `src/data/content.ts` |
| コラム記事 | `content/columns/*.md`（Markdown）＋ `src/data/columns.ts`（公開設定） |
| 写真・ロゴ | `public/images/`（→ `public/images/README.md` 参照） |

### 電話番号を変える
`src/data/site.ts` の `phone` / `phoneTel` / `phoneIntl` を編集（他ファイルに直書きなし）。

### 料金を変える
`src/data/site.ts` の `mainPrice` を編集すれば、トップ・料金ページ・FAQ・構造化データすべてに反映されます。

### ロゴを表示する
`public/images/logo.png` を置き、`src/data/site.ts` の `hasLogo` を `true` に。

### 画像の管理用ラベルを消す（本番公開時）
`src/data/site.ts` の `showImagePlaceholderLabels` を `false` に。

## お問い合わせフォームを有効化する

初期状態ではメール送信先が未設定のため、送信すると「準備中」メッセージ（電話・Instagram誘導）が表示されます。
有効化するには、環境変数（`.env.local` または Vercel の環境変数）を設定します。

```
RESEND_API_KEY=re_xxxxxxxx        # Resend（https://resend.com）のAPIキー
CONTACT_TO_EMAIL=owner@example.com # 受信先メールアドレス
CONTACT_FROM_EMAIL=info@あなたのドメイン  # Resendで認証済みの送信元（任意）
```

設定後は、フォーム送信時に Resend 経由でメールが届きます。

## Vercel へのデプロイ

1. GitHub 等にプッシュし、Vercel でインポート。
2. 環境変数を設定：
   - `NEXT_PUBLIC_SITE_URL`（本番ドメイン。例：`https://456chinnendo.jp`）
   - `RESEND_API_KEY`（フォーム有効化時）
   - `CONTACT_TO_EMAIL`（フォーム有効化時）
   - `CONTACT_FROM_EMAIL`（任意）
3. デプロイ。

## 確定済みの事業情報（2026-07-16 更新）

- 料金：基本プラン **¥19,800**（墓石1基・税込表示・お花代/お線香代込み）／定期コース（2回）**¥35,000**（¥4,600お得）… Instagram料金表スクショに準拠。`src/data/site.ts` の `mainPrice` / `regularPrice` で変更可。
- 問い合わせメールアドレス：`chinnen.456@au.com`（`site.ts` の `email`。フォーム送信先は env `CONTACT_TO_EMAIL` が優先）

## 未確定（要確認）の事業情報

`要確認` コメント付きで空欄にしてあります。確定後に `src/data/` を編集してください。

- 住所 / 郵便番号 / 営業時間 / 代表者名 / 創業年
- 支払い方法 / キャンセル規定
- 料金の「税込」表記の正否（Instagram料金表に税表記がないため、現状は税込として表示）
