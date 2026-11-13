import type { CaseCategoryEnum } from "@src/domain/enums/case-category-enum";

export type CaseType = {
  slug: string;
  title: string;
  place?: string;
  year: number;
  image: string;
  imageAlt: string;
  categories: CaseCategoryEnum[];
  products: string[];
  summary: string;
};
