import next from "eslint-config-next";

/**
 * Next.js 公式のフラット設定を直接読み込みます。
 * （FlatCompat 経由だと ESLint 9.39 系で循環参照エラーが出るため、
 *  ネイティブのフラット設定配列をそのまま使用）
 */
const eslintConfig = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
