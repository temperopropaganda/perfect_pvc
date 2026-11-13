import type { ProductCategoryEnum } from "@src/domain/enums/product-category-enum";
import type { OpeningType } from "@src/domain/types/opening-type";

export type ProductSpecType = {
  label: string;
  value: string;
};

export type ProductType = {
  slug: string;
  name: string;
  categories: ProductCategoryEnum[];
  opening: OpeningType;
  summary: string;
  mockup: string;
  photo: string;
  photoAlt: string;
  highlights: string[];
  specs: ProductSpecType[];
};
