# Search Console・計測セットアップ手順（456ちんねん堂）

コード側の実装は完了しています。以下は**手動で行う設定**の手順です。

## 1. 本番ドメインの設定（最優先）

Vercel の環境変数に以下を設定して再デプロイ：

```
NEXT_PUBLIC_SITE_URL=https://www.456chinnendo.com
```

※未設定の場合、canonical・OGP・sitemap・構造化データのURLがプレースホルダードメインを向きます。

## 2. Google Search Console 登録

1. https://search.google.com/search-console を開き、Googleアカウントでログイン
2. プロパティ追加は「**ドメイン**」を選択し `456chinnendo.com` を入力（www有無・http/httpsをまとめて計測できる）
3. **DNS認証**：表示された TXT レコードを、ドメインを購入したサービス（お名前.com等）のDNS設定に追加 → 「確認」
   - DNSを触れない場合は「URLプレフィックス」で `https://www.456chinnendo.com` を追加し、**HTMLタグ認証**を選択。`content="..."` の値を Vercel の環境変数 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` に設定して再デプロイ → 「確認」

## 3. sitemap.xml の送信

1. Search Console 左メニュー「サイトマップ」
2. `https://www.456chinnendo.com/sitemap.xml` を入力して送信
3. ステータスが「成功しました」になることを確認（数日かかる場合あり）

## 4. 主要ページのインデックス登録リクエスト

左メニュー「URL検査」に以下を1件ずつ入力 →「インデックス登録をリクエスト」：

- `/`（トップ）
- `/ohakamairi-daiko`
- `/ohaka-soji`
- `/price`
- `/area`
- 優先エリアページ数件（例：`/area/chiba-city` `/area/funabashi` `/area/matsudo`）

※1日にリクエストできる件数には上限があります。残りはsitemap経由の自然なクロールを待ちます。

## 5. 定期的に確認する項目（月1回目安）

- **検索パフォーマンス**：クリック数／表示回数／CTR／平均掲載順位。「クエリ」タブで「千葉 お墓参り代行」等の順位推移、「ページ」タブでエリアページの流入を確認
- **ページのインデックス登録**：未登録ページとその理由（クロール済み-未登録が多い場合はコンテンツ改善候補）
- **拡張（構造化データ）**：FAQ・パンくず・Articleのエラー有無
- **ウェブに関する主な指標**：Core Web Vitals（LCP/CLS/INP）のモバイル評価
- **リンク**：外部リンクの獲得状況

## 6. GA4（アクセス解析）

1. https://analytics.google.com でプロパティ作成（タイムゾーン：日本）
2. データストリームで「ウェブ」を追加 → 測定ID（`G-XXXXXXXXXX`）を取得
3. Vercel 環境変数 `NEXT_PUBLIC_GA_MEASUREMENT_ID` に設定して再デプロイ
4. 自動計測されるイベント：
   - `click_tel`（電話タップ）／`click_line`（LINE）／`click_instagram`／`click_contact`（問い合わせページへ）／`contact_mailto_open`（フォームからメール作成）
   - GA4管理画面 →「イベント」で上記を「キーイベント（コンバージョン）」に指定する
5. 個人情報・問い合わせ内容は送信されない実装です

## 7. Googleビジネスプロフィール（GBP）との統一

- GBPの「ウェブサイト」欄を `https://www.456chinnendo.com` に設定
- GBPとサイトで **屋号（456ちんねん堂）・電話番号（090-3855-4560）・サービス内容・料金** の表記を一致させる
- GBPの投稿にコラム記事のリンクを流用すると更新シグナルになる

## 注意

- 順位・検索ボリュームは Search Console / GA4 の実データで判断してください（事前の推測で施策を決めない）
- sitemap の lastModified はコラムのfrontmatter（date/updatedAt）から生成しています。**記事を実際に更新したときだけ** updatedAt を変更してください
