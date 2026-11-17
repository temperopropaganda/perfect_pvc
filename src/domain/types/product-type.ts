import type { ProductCategoryEnum } from "@src/domain/enums/product-category-enum";
import type { OpeningType } from "@src/domain/types/opening-type";
import type { PhotoType } from "@src/domain/types/photo-type";

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
  // Foto vertical (2:3) usada na faixa de sistemas da home.
  portrait?: PhotoType;
  highlights: string[];
  specs: ProductSpecType[];
};
