import type { PhotoType } from "@src/domain/types/photo-type";

export type BlogPostType = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  // Data no formato ISO (AAAA-MM-DD).
  publishedAt: string;
  readingMinutes: number;
  cover: PhotoType;
  // Cada item é um parágrafo; os que começam com "## " viram subtítulos.
  body: string[];
};
