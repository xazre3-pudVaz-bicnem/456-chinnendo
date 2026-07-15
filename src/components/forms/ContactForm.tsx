"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Phone, Instagram } from "lucide-react";
import {
  contactSchema,
  type ContactInput,
  SERVICE_OPTIONS,
  CONTACT_METHODS,
} from "@/lib/contactSchema";
import { siteConfig } from "@/data/site";

type Status = "idle" | "sending" | "success" | "not_configured" | "error";

const labelCls = "block text-sm font-medium text-moss-700 mb-2";
const inputCls =
  "w-full border border-paper-400 bg-paper-50 px-4 py-3 text-[15px] text-ink-800 rounded-none focus:outline-none focus:border-moss-600 focus:ring-1 focus:ring-moss-600 transition-colors";
const errCls = "mt-1.5 text-xs text-red-700";
const req = <span className="ml-1 align-middle text-xs text-red-700">必須</span>;
const opt = <span className="ml-1 align-middle text-xs text-ink-400">任意</span>;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  async function onSubmit(values: ContactInput) {
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
        reset();
      } else if (data.reason === "not_configured") {
        setStatus("not_configured");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-paper-300 bg-paper-50 p-8 text-center md:p-12">
        <CheckCircle2 className="mx-auto h-14 w-14 text-wakaba-500" strokeWidth={1.25} aria-hidden />
        <h3 className="mt-5 font-heading text-xl text-moss-700">
          お問い合わせを受け付けました
        </h3>
        <p className="mt-4 text-[15px] leading-loose text-ink-600">
          この度はお問い合わせいただきありがとうございます。
          <br />
          内容を確認のうえ、折り返しご連絡いたします。
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-500">{siteConfig.phoneNote}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 inline-block border border-moss-600 px-6 py-2.5 text-sm tracking-wide text-moss-700 transition-colors hover:bg-moss-700 hover:text-paper-50"
        >
          続けて入力する
        </button>
      </div>
    );
  }

  if (status === "not_configured") {
    return (
      <div className="border border-gold-400 bg-paper-50 p-8 text-center md:p-12">
        <h3 className="font-heading text-xl text-moss-700">
          現在フォームは準備中です
        </h3>
        <p className="mt-4 text-[15px] leading-loose text-ink-600">
          恐れ入りますが、ただいまお問い合わせフォームの送信機能を準備中です。
          <br className="hidden md:block" />
          お手数ですが、お電話またはInstagramからお問い合わせください。
        </p>
        <div className="mx-auto mt-7 flex max-w-sm flex-col gap-3">
          <a
            href={siteConfig.phoneTel}
            className="flex items-center justify-center gap-2 bg-moss-700 px-6 py-3.5 text-paper-50"
          >
            <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            電話する（{siteConfig.phone}）
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
        <p className="mt-5 text-xs leading-relaxed text-ink-500">{siteConfig.phoneNote}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* ハニーポット（視覚的・支援技術的に非表示） */}
      <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden>
        <label htmlFor="company_website">Webサイト（入力しないでください）</label>
        <input
          id="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company_website")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>お名前{req}</label>
          <input id="name" type="text" className={inputCls} placeholder="例）山田 太郎" autoComplete="name" {...register("name")} />
          {errors.name && <p className={errCls}>{errors.name.message}</p>}
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
          <input id="phone" type="tel" className={inputCls} placeholder="例）090-3855-4560" autoComplete="tel" {...register("phone")} />
          {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            メールアドレス<span className="ml-1 align-middle text-xs text-ink-400">（電話 / メールいずれか必須）</span>
          </label>
          <input id="email" type="email" className={inputCls} placeholder="例）info@example.com" autoComplete="email" {...register("email")} />
          {errors.email && <p className={errCls}>{errors.email.message}</p>}
        </div>
      </div>

      <fieldset>
        <legend className={labelCls}>ご希望の連絡方法{req}</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {CONTACT_METHODS.map((m) => (
            <label
              key={m}
              className="flex cursor-pointer items-center justify-center gap-2 border border-paper-400 bg-paper-50 px-3 py-2.5 text-sm text-ink-700 transition-colors hover:border-moss-500 has-[:checked]:border-moss-700 has-[:checked]:bg-moss-700 has-[:checked]:text-paper-50"
            >
              <input type="radio" value={m} className="sr-only" {...register("contactMethod")} />
              {m}
            </label>
          ))}
        </div>
        {errors.contactMethod && <p className={errCls}>{errors.contactMethod.message}</p>}
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
          {...register("message")}
        />
        {errors.message && <p className={errCls}>{errors.message.message}</p>}
      </div>

      {/* 写真添付を想定したUI（現状は送信対象外。実装時にストレージ連携を追加） */}
      <div>
        <label htmlFor="photo" className={labelCls}>
          写真の添付{opt}<span className="ml-2 text-xs text-ink-400">※ 現在は準備中です</span>
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          disabled
          className="w-full cursor-not-allowed border border-dashed border-paper-400 bg-paper-100 px-4 py-3 text-sm text-ink-400"
        />
        <p className="mt-1.5 text-xs text-ink-400">
          お墓の写真がある場合は、お手数ですがInstagramのメッセージからお送りください。
        </p>
      </div>

      <div className="border-t border-paper-300 pt-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-700">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-moss-700" {...register("privacy")} />
          <span>
            <a href="/privacy" target="_blank" className="text-moss-600 underline underline-offset-2">
              プライバシーポリシー
            </a>
            に同意します{req}
          </span>
        </label>
        {errors.privacy && <p className={errCls}>{errors.privacy.message}</p>}
      </div>

      {status === "error" && (
        <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          送信に失敗しました。時間をおいて再度お試しいただくか、お電話（{siteConfig.phone}）にてご連絡ください。
        </p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex w-full items-center justify-center bg-moss-700 px-12 py-4 text-sm tracking-widest text-paper-50 transition-colors hover:bg-moss-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "送信中…" : "この内容で送信する"}
        </button>
        <p className="mt-4 text-xs leading-relaxed text-ink-500">
          いただいた内容は、お問い合わせ対応の目的にのみ使用します。{siteConfig.phoneNote}
        </p>
      </div>
    </form>
  );
}
