import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";

type BlogArticlePost = {
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  cover: PictureSource;
  // Parágrafos; os que começam com "## " viram subtítulos.
  body: string[];
};

type BlogArticleProps = {
  post: BlogArticlePost;
  formattedDate: string;
};

const HEADING_PREFIX = "## ";

export const BlogArticle = ({ post, formattedDate }: BlogArticleProps) => (
  <article className="bg-background pb-(--spacing-section) pt-36 md:pt-44">
    <header className="site-container flex flex-col gap-8">
      <Link
        to="/blog"
        className="group inline-flex items-center gap-2 self-start text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5"
        />
        Blog
      </Link>
      <span className="text-label flex gap-4 text-muted-foreground">
        <span className="text-blue-700">{post.category}</span>
        <time dateTime={post.publishedAt}>{formattedDate}</time>
        <span>{post.readingMinutes} min de leitura</span>
      </span>
      <h1 className="text-title max-w-[22ch] text-[clamp(2.4rem,5vw,4.75rem)] text-balance">
        {post.title}
      </h1>
      <p className="text-lead max-w-[56ch] text-muted-foreground">{post.excerpt}</p>
      <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] bg-muted">
        <Picture {...post.cover} priority sizes="100vw" />
      </div>
    </header>

    <div className="site-container mt-14 md:mt-20">
      <div className="mx-auto flex max-w-[68ch] flex-col gap-6 text-[18px] leading-[1.75] text-foreground/85">
        {post.body.map((paragraph) =>
          paragraph.startsWith(HEADING_PREFIX) ? (
            <h2
              key={paragraph}
              className="mt-6 font-display text-[1.75rem] font-medium leading-tight tracking-[-0.02em] text-foreground"
            >
              {paragraph.slice(HEADING_PREFIX.length)}
            </h2>
          ) : (
            <p key={paragraph}>{paragraph}</p>
          ),
        )}
      </div>
    </div>
  </article>
);
