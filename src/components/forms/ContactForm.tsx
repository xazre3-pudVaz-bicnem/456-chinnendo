"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Copy, Check, Phone, Instagram } from "lucide-react";
import {
  contactSchema,
  type ContactInput,
  SERVICE_OPTIONS,
  CONTACT_METHODS,
} from "@/lib/contactSchema";
import { siteConfig } from "@/data/site";

/**
 * お問い合わせフォーム（mailto方式・サーバー設定不要）。
 * 入力内容を検証したうえで、宛先・件名・本文を自動セットした
 * メールソフトを起動します。起動しない環境向けに本文コピーも用意。
 */

const labelCls = "block text-sm font-medium text-moss-700 mb-2";
// text-base(16px)：iOS Safariのフォーカス時自動ズームを防ぐ
const inputCls =
  "w-full border border-paper-400 bg-paper-50 px-4 py-3 text-base text-ink-800 rounded-none focus:outline-none focus:border-moss-600 focus:ring-1 focus:ring-moss-600 transition-colors";
const errCls = "mt-1.5 text-xs text-red-700";
const req = <span className="ml-1 align-middle text-xs text-red-700">必須</span>;
const opt = <span className="ml-1 align-middle text-xs text-ink-400">任意</span>;

/** 入力内容からメール件名・本文を組み立てる */
function buildMail(d: ContactInput): { subject: string; body: string } {
  const subject = `【お問い合わせ】${d.name}より（456ちんねん堂ホームページ）`;
  const body = [
    "456ちんねん堂 ご担当者様",
    "",
    "ホームページのお問い合わせフォームより連絡いたします。",
    "",
    `お名前：${d.name}`,
    d.kana ? `ふりがな：${d.kana}` : "",
    `電話番号：${d.phone || "（未入力）"}`,
    `メールアドレス：${d.email || "（未入力）"}`,
    `希望する連絡方法：${d.contactMethod}`,
    d.service ? `希望サービス：${d.service}` : "",
    d.cemeteryName ? `墓地・霊園名：${d.cemeteryName}` : "",
    d.cemeteryAddress ? `墓地の所在地：${d.cemeteryAddress}` : "",
    d.section ? `区画番号：${d.section}` : "",
    d.graveCount ? `墓石の数：${d.graveCount}` : "",
    d.preferredTime ? `希望時期：${d.preferredTime}` : "",
    d.graveCondition ? `お墓の状態：${d.graveCondition}` : "",
    "",
    "【お問い合わせ内容】",
    d.message,
  ]
    .filter((line) => line !== "")
    .join("\r\n");
  return { subject, body };
}

export default function ContactForm() {
  const [opened, setOpened] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  function onSubmit(values: ContactInput) {
    const mail = buildMail(values);
    setOpened(mail);
    setCopied(false);
    // メールソフトを起動（宛先・件名・本文を自動セット）
    window.location.assign(
      `mailto:${siteConfig.email}?subject=${encodeURIComponent(
        mail.subject,
      )}&body=${encodeURIComponent(mail.body)}`,
    );
  }

  async function copyMail() {
    if (!opened) return;
    try {
      await navigator.clipboard.writeText(
        `宛先：${siteConfig.email}\r\n件名：${opened.subject}\r\n\r\n${opened.body}`,
      );
      setCopied(true);
    } catch {
      // クリップボード非対応環境では何もしない（本文は画面に表示済み）
    }
  }

  if (opened) {
    return (
      <div role="status" className="border border-paper-300 bg-paper-50 p-8 md:p-12">
        <Mail className="mx-auto h-14 w-14 text-wakaba-500" strokeWidth={1.25} aria-hidden />
        <h3 className="mt-5 text-center font-heading text-xl text-moss-700">
          メールソフトを起動しました
        </h3>
        <p className="mt-4 text-center text-[15px] leading-loose text-ink-600">
          入力内容をセットしたメール画面が開きます。
          <br className="hidden md:block" />
          内容をご確認のうえ、<strong className="text-moss-700">送信ボタンを押して完了</strong>してください。
          お墓の写真がある場合は、メールにそのまま添付いただけます。
        </p>

        <div className="mx-auto mt-8 max-w-lg border border-paper-300 bg-paper-100 p-5">
          <p className="text-sm font-medium text-moss-700">
            メール画面が開かない場合
          </p>
          <p className="mt-2 text-sm leading-loose text-ink-600">
            下のボタンで内容をコピーし、お使いのメール（Gmailなど）に貼り付けて
            <a
              href={`mailto:${siteConfig.email}`}
              className="mx-1 text-moss-600 underline underline-offset-2"
            >
              {siteConfig.email}
            </a>
            までお送りください。
          </p>
          <button
            type="button"
            onClick={copyMail}
            className="mt-4 inline-flex items-center gap-2 border border-moss-600 px-5 py-2.5 text-sm tracking-wide text-moss-700 transition-colors hover:bg-moss-700 hover:text-paper-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
                コピーしました
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                宛先と本文をコピー
              </>
            )}
          </button>
        </div>

        <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
          <a
            href={siteConfig.phoneTel}
            className="flex items-center justify-center gap-2 bg-moss-700 px-6 py-3.5 text-paper-50"
          >
            <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            電話で相談する（{siteConfig.phone}）
          </a>
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-paper-300 px-6 py-3.5 text-moss-700"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Instagram でお問い合わせ
          </a>
        </div>
        <p className="mt-5 text-center text-xs leading-relaxed text-ink-500">{siteConfig.phoneNote}</p>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setOpened(null)}
            className="text-sm text-ink-500 underline underline-offset-2 transition-colors hover:text-moss-600"
          >
            入力画面に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>お名前{req}</label>
          <input
            id="name"
            type="text"
            className={inputCls}
            placeholder="例）山田 太郎"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && <p id="name-error" className={errCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="kana" className={labelCls}>ふりがな{opt}</label>
          <input id="kana" type="text" className={inputCls} placeholder="例）やまだ たろう" {...register("kana")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelCls}>
            電話番号<span className="ml-1 align-middle text-xs text-ink-400">（電話 / メールいずれか必須）</span>
          </label>
          <input
            id="phone"
            type="tel"
            className={inputCls}
            placeholder="例）090-3855-4560"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
          {errors.phone && <p id="phone-error" className={errCls}>{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            メールアドレス<span className="ml-1 align-middle text-xs text-ink-400">（電話 / メールいずれか必須）</span>
          </label>
          <input
            id="email"
            type="email"
            className={inputCls}
            placeholder="例）info@example.com"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && <p id="email-error" className={errCls}>{errors.email.message}</p>}
        </div>
      </div>

      <fieldset>
        <legend className={labelCls}>ご希望の連絡方法{req}</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {CONTACT_METHODS.map((m) => (
            <label
              key={m}
              className="flex cursor-pointer items-center justify-center gap-2 border border-paper-400 bg-paper-50 px-3 py-2.5 text-sm text-ink-700 transition-colors hover:border-moss-500 has-[:checked]:border-moss-700 has-[:checked]:bg-moss-700 has-[:checked]:text-paper-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-moss-600"
            >
              <input type="radio" value={m} className="sr-only" {...register("contactMethod")} />
              {m}
            </label>
          ))}
        </div>
        {errors.contactMethod && (
          <p id="contactMethod-error" className={errCls} role="alert">
            {errors.contactMethod.message}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="service" className={labelCls}>ご希望のサービス{opt}</label>
        <select id="service" className={inputCls} defaultValue="" {...register("service")}>
          <option value="">選択してください</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="cemeteryName" className={labelCls}>墓地・霊園名{opt}</label>
          <input id="cemeteryName" type="text" className={inputCls} placeholder="例）〇〇霊園" {...register("cemeteryName")} />
        </div>
        <div>
          <label htmlFor="cemeteryAddress" className={labelCls}>墓地の所在地{opt}</label>
          <input id="cemeteryAddress" type="text" className={inputCls} placeholder="例）千葉県〇〇市…" {...register("cemeteryAddress")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="section" className={labelCls}>区画番号{opt}</label>
          <input id="section" type="text" className={inputCls} placeholder="例）A-12" {...register("section")} />
        </div>
        <div>
          <label htmlFor="graveCount" className={labelCls}>墓石の数{opt}</label>
          <input id="graveCount" type="text" className={inputCls} placeholder="例）1基" {...register("graveCount")} />
        </div>
        <div>
          <label htmlFor="preferredTime" className={labelCls}>希望時期{opt}</label>
          <input id="preferredTime" type="text" className={inputCls} placeholder="例）お盆前まで" {...register("preferredTime")} />
        </div>
      </div>

      <div>
        <label htmlFor="graveCondition" className={labelCls}>現在分かっているお墓の状態{opt}</label>
        <input id="graveCondition" type="text" className={inputCls} placeholder="例）長く行けておらず雑草が気になる など" {...register("graveCondition")} />
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>お問い合わせ内容{req}</label>
        <textarea
          id="message"
          rows={6}
          className={inputCls}
          placeholder="ご希望の作業、お墓の状況、ご不安な点などをご記入ください。分かる範囲で構いません。"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message && <p id="message-error" className={errCls}>{errors.message.message}</p>}
      </div>

      {/* 写真はメールソフト起動後に添付してもらう方式 */}
      <div className="border border-dashed border-paper-400 bg-paper-100 px-4 py-3">
        <p className="text-sm text-ink-600">
          <span className="font-medium text-moss-700">お墓の写真がある場合：</span>
          送信ボタンを押すとメール画面が開きますので、そちらに写真を添付してお送りください。
        </p>
      </div>

      <div className="border-t border-paper-300 pt-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-700">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-moss-700"
            aria-invalid={errors.privacy ? true : undefined}
            aria-describedby={errors.privacy ? "privacy-error" : undefined}
            {...register("privacy")}
          />
          <span>
            <a href="/privacy" target="_blank" className="text-moss-600 underline underline-offset-2">
              プライバシーポリシー
            </a>
            に同意します{req}
          </span>
        </label>
        {errors.privacy && <p id="privacy-error" className={errCls} role="alert">{errors.privacy.message}</p>}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 bg-moss-700 px-12 py-4 text-sm tracking-widest text-paper-50 transition-colors hover:bg-moss-600 sm:w-auto"
        >
          <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          メールを作成する
        </button>
        <p className="mt-4 text-xs leading-relaxed text-ink-500">
          ボタンを押すと、入力内容をセットしたメールソフトが起動します（宛先：{siteConfig.email}）。
          いただいた内容は、お問い合わせ対応の目的にのみ使用します。{siteConfig.phoneNote}
        </p>
      </div>
    </form>
  );
}
