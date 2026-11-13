import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { FilterBar } from "@src/components/molecules/FilterBar";
import { ProductCard, type ProductCardData } from "@src/components/molecules/ProductCard";

type CatalogFilterOption<TValue extends string> = {
  value: TValue;
  label: string;
  count: number;
};

type ProductCatalogProps<TValue extends string> = {
  options: CatalogFilterOption<TValue>[];
  filter: TValue;
  onFilterChange: (value: TValue) => void;
  products: ProductCardData[];
  onSelect: (slug: string) => void;
};

const EASE_GLIDE = [0.16, 1, 0.3, 1] as const;

export const ProductCatalog = <TValue extends string>({
  options,
  filter,
  onFilterChange,
  products,
  onSelect,
}: ProductCatalogProps<TValue>) => {
  const reduce = useReducedMotion();

  return (
    <section aria-label="Catálogo de produtos" className="bg-background pb-8 md:pb-16">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 pb-20 md:px-8 md:pb-24">
        <div className="sticky top-[84px] z-30 flex justify-center md:top-[92px]">
          <FilterBar
            label="Filtrar produtos"
            options={options}
            value={filter}
            onChange={onFilterChange}
          />
        </div>

        <motion.ul
          layout={!reduce}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {products.map((product, index) => (
              <motion.li
                key={product.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  filter: "blur(6px)",
                  transition: { duration: 0.2 },
                }}
                transition={{ duration: 0.6, delay: reduce ? 0 : index * 0.03, ease: EASE_GLIDE }}
              >
                <ProductCard product={product} onSelect={onSelect} className="h-full w-full" />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
};
