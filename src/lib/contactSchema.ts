import { z } from "zod";

/** 希望サービスの選択肢 */
export const SERVICE_OPTIONS = [
  "お墓参り代行",
  "お墓掃除代行",
  "お墓参りとお掃除",
  "定期的な管理の相談",
  "その他",
] as const;

/** 希望する連絡方法 */
export const CONTACT_METHODS = ["電話", "メール", "Instagram", "どちらでも"] as const;

/**
 * お問い合わせフォームのバリデーション（クライアント・サーバー共通）。
 * 電話番号またはメールアドレスのいずれかは必須。
 */
export const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "お名前をご入力ください" })
      .max(60, { message: "お名前が長すぎます" }),
    kana: z.string().trim().max(80).optional().or(z.literal("")),
    phone: z
      .string()
      .trim()
      .max(20)
      .optional()
      .or(z.literal(""))
      .refine((v) => !v || /^[0-9+\-()\s]{8,20}$/.test(v), {
        message: "電話番号の形式をご確認ください",
      }),
    email: z
      .string()
      .trim()
      .max(120)
      .optional()
      .or(z.literal(""))
      .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
        message: "メールアドレスの形式をご確認ください",
      }),
    contactMethod: z.enum(CONTACT_METHODS, {
      message: "ご希望の連絡方法をお選びください",
    }),
    service: z.enum(SERVICE_OPTIONS).optional().or(z.literal("")),
    cemeteryName: z.string().trim().max(120).optional().or(z.literal("")),
    cemeteryAddress: z.string().trim().max(200).optional().or(z.literal("")),
    section: z.string().trim().max(60).optional().or(z.literal("")),
    preferredTime: z.string().trim().max(120).optional().or(z.literal("")),
    graveCount: z.string().trim().max(30).optional().or(z.literal("")),
    graveCondition: z.string().trim().max(500).optional().or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(5, { message: "お問い合わせ内容をご入力ください" })
      .max(2000, { message: "お問い合わせ内容が長すぎます" }),
    privacy: z
      .boolean()
      .refine((v) => v === true, {
        message: "プライバシーポリシーへの同意が必要です",
      }),
  })
  .refine((d) => !!(d.phone && d.phone.length) || !!(d.email && d.email.length), {
    message: "電話番号またはメールアドレスのいずれかをご入力ください",
    path: ["phone"],
  });

export type ContactInput = z.infer<typeof contactSchema>;
