import { Instagram } from "lucide-react";
import type { InstaPost } from "@/data/content";
import ImagePlaceholder from "./ImagePlaceholder";

/** Instagram疑似カード（API未使用の静的データ） */
export default function InstagramCard({ post }: { post: InstaPost }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden border border-paper-300 bg-paper-50 transition-shadow hover:shadow-[0_10px_30px_rgba(47,72,52,0.10)]"
    >
      <div className="relative">
        <ImagePlaceholder
          src={post.image}
          alt={post.caption}
          label={post.imageLabel}
          ratio="1 / 1"
          sizes="(max-width: 768px) 50vw, 300px"
        />
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper-50/85 text-moss-700 opacity-0 transition-opacity group-hover:opacity-100">
          <Instagram className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      <div className="p-4">
        {post.date && (
          <p className="font-en text-xs tracking-wider text-ink-400">{post.date}</p>
        )}
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-600">
          {post.caption}
        </p>
      </div>
    </a>
  );
}
