import { Link } from "react-router";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { Reveal } from "@src/components/atoms/Reveal";

type BlogPostCard = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  cover: PictureSource;
};

type BlogGridProps = {
  posts: BlogPostCard[];
  formatDate: (iso: string) => string;
};

export const BlogGrid = ({ posts, formatDate }: BlogGridProps) => (
  <section className="bg-background py-(--spacing-section)">
    <ul className="site-container grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <li key={post.slug}>
          <Reveal delay={(index % 3) * 0.08}>
            <Link to={`/blog/${post.slug}`} className="group flex flex-col gap-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-muted">
                <Picture
                  {...post.cover}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="transition-transform duration-1000 ease-glide group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-label flex gap-3 text-muted-foreground">
                  <span className="text-blue-700">{post.category}</span>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
                <h2 className="font-display text-2xl font-medium leading-tight tracking-[-0.02em] text-balance">
                  {post.title}
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{post.excerpt}</p>
              </div>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  </section>
);
