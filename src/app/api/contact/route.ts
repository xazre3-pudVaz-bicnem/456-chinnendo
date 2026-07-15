import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contactSchema";

/**
 * お問い合わせ受信エンドポイント。
 *
 * - RESEND_API_KEY と CONTACT_TO_EMAIL が設定されている場合：Resend でメール送信
 * - 未設定の場合：{ ok:false, reason:"not_configured" } を返し、
 *   フロント側で「準備中」メッセージを表示（電話・Instagram誘導）
 *
 * スパム対策：ハニーポット / サーバー側バリデーション / 簡易レート制限。
 */

// --- 簡易レート制限（同一IPを一定時間で制限。サーバーレスでは完全ではない） ---
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // 期限切れエントリを掃除（メモリの無限増加を防止）
  for (const [key, rec] of hits) {
    if (now - rec.ts > WINDOW_MS) hits.delete(key);
  }
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

// 制御文字（U+0000〜U+001F, U+007F）を除去する正規表現（ソースに制御文字を直書きしない）
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001F\\u007F]", "g");
// 改行（LF）だけは残す版（本文用）
const CONTROL_CHARS_KEEP_LF = new RegExp(
  "[\\u0000-\\u0009\\u000B-\\u001F\\u007F]",
  "g",
);

/** 入力値の簡易サニタイズ（制御文字除去・トリム） */
function clean(v: unknown): string {
  return String(v ?? "").replace(CONTROL_CHARS, "").trim();
}

/** 本文用サニタイズ（改行は保持し、その他の制御文字を除去） */
function cleanKeepNewline(v: unknown): string {
  return String(v ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS_KEEP_LF, "")
    .trim();
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, reason: "rate_limited" },
        { status: 429 },
      );
    }

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, reason: "invalid_json" },
        { status: 400 },
      );
    }

    // ハニーポット：値が入っていればボットとみなし、成功を装って無視
    const rawObj = (raw ?? {}) as Record<string, unknown>;
    if (clean(rawObj.company_website)) {
      return NextResponse.json({ ok: true });
    }

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, reason: "validation", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }
    // 全テキストフィールドから制御文字（改行含む）を除去
    // （メール件名・本文へのヘッダ注入対策。message のみ改行を保持）
    const p = parsed.data;
    const d = {
      ...p,
      name: clean(p.name),
      kana: clean(p.kana),
      phone: clean(p.phone),
      email: clean(p.email),
      service: p.service,
      cemeteryName: clean(p.cemeteryName),
      cemeteryAddress: clean(p.cemeteryAddress),
      section: clean(p.section),
      preferredTime: clean(p.preferredTime),
      graveCount: clean(p.graveCount),
      graveCondition: clean(p.graveCondition),
      message: cleanKeepNewline(p.message),
    };

    const toEmail = process.env.CONTACT_TO_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

    // 送信先が未設定：準備中として返す（フォームは電話・Instagramへ誘導）
    if (!toEmail || !apiKey) {
      console.info("[contact] 受信（メール未設定のためログ出力のみ）", {
        name: d.name,
        phone: d.phone,
        email: d.email,
        contactMethod: d.contactMethod,
      });
      return NextResponse.json(
        { ok: false, reason: "not_configured" },
        { status: 200 },
      );
    }

    const body = [
      `お名前：${d.name}`,
      d.kana ? `ふりがな：${d.kana}` : "",
      `電話番号：${d.phone || "（未入力）"}`,
      `メール：${d.email || "（未入力）"}`,
      `希望連絡方法：${d.contactMethod}`,
      d.service ? `希望サービス：${d.service}` : "",
      d.cemeteryName ? `墓地・霊園名：${d.cemeteryName}` : "",
      d.cemeteryAddress ? `墓地所在地：${d.cemeteryAddress}` : "",
      d.section ? `区画番号：${d.section}` : "",
      d.graveCount ? `墓石の数：${d.graveCount}` : "",
      d.preferredTime ? `希望時期：${d.preferredTime}` : "",
      d.graveCondition ? `お墓の状態：${d.graveCondition}` : "",
      "",
      "【お問い合わせ内容】",
      d.message,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `456ちんねん堂 お問い合わせ <${fromEmail}>`,
        to: [toEmail],
        reply_to: d.email || undefined,
        subject: `【お問い合わせ】${d.name}様より`,
        text: body,
      }),
    });

    if (!res.ok) {
      console.error("[contact] メール送信失敗", await res.text());
      return NextResponse.json(
        { ok: false, reason: "send_failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] 予期しないエラー", e);
    return NextResponse.json(
      { ok: false, reason: "server_error" },
      { status: 500 },
    );
  }
}
