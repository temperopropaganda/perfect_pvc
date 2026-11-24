import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";

import { projectsService } from "@src/application/services/projects-service";
import { finishesService } from "@src/application/services/finishes-service";
import {
  productsService,
  type ProductFilterValue,
} from "@src/application/services/products-service";
import { FinishConfigurator } from "@src/components/organisms/FinishConfigurator";
import { PerformanceSection } from "@src/components/organisms/PerformanceSection";
import { ProductCatalog } from "@src/components/organisms/ProductCatalog";
import { ProductDetail } from "@src/components/organisms/ProductDetail";
import { ProductsHero } from "@src/components/organisms/ProductsHero";
import { SiteTemplate } from "@src/components/templates/SiteTemplate";
import { Dialog, DialogContent, DialogTitle } from "@src/components/ui/dialog";
import type { ProductType } from "@src/domain/types/product-type";
import { pauseScroll, resumeScroll } from "@src/lib/smooth-scroll";

const PRODUCT_PARAM = "produto";

const toDetail = (product: ProductType) => ({
  ...product,
  categoryLabels: product.categories.map(productsService.categoryLabel),
});

export const ProdutosPage = () => {
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<ProductFilterValue>("todos");
  const [shownSlug, setShownSlug] = useState<string | null>(null);
  // O foco inicial vai para o próprio modal, para ele não rolar até o primeiro botão.
  const popupRef = useRef<HTMLDivElement>(null);

  const products = useMemo(() => productsService.filterByCategory(filter), [filter]);
  const selectedSlug = params.get(PRODUCT_PARAM);
  const isOpen = Boolean(selectedSlug && productsService.findBySlug(selectedSlug));
  // Mantém o último produto na tela enquanto o modal anima a saída.
  const shown = productsService.findBySlug(selectedSlug ?? shownSlug ?? "");

  useEffect(() => {
    if (selectedSlug) setShownSlug(selectedSlug);
  }, [selectedSlug]);

  useEffect(() => {
    if (!isOpen) return undefined;
    pauseScroll();
    return () => resumeScroll();
  }, [isOpen]);

  const openProduct = (slug: string) =>
    setParams({ [PRODUCT_PARAM]: slug }, { preventScrollReset: true });
  const closeProduct = () => setParams({}, { preventScrollReset: true });

  return (
    <SiteTemplate>
      <ProductsHero photo={projectsService.photo("cacador", "perfect-150")} />
      <ProductCatalog
        options={productsService.filterOptions()}
        filter={filter}
        onFilterChange={setFilter}
        products={products}
        onSelect={openProduct}
      />
      <FinishConfigurator finishes={finishesService.list()} />
      <PerformanceSection />
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeProduct()}>
        <DialogContent
          ref={popupRef}
          initialFocus={popupRef}
          className="w-[min(1120px,calc(100%-2rem))] max-w-none gap-0 overflow-hidden rounded-[28px] bg-card p-0 shadow-[0_40px_120px_-20px_rgb(0_0_0_/_0.45)] ring-0 sm:max-w-none"
        >
          {shown && (
            <>
              <DialogTitle className="sr-only">{shown.name}</DialogTitle>
              <ProductDetail product={toDetail(shown)} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </SiteTemplate>
  );
};
