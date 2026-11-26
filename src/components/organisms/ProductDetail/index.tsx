import { Check } from "lucide-react";

import { OpeningIcon, type OpeningIconType } from "@src/components/atoms/OpeningIcon";
import { PillButton } from "@src/components/atoms/PillButton";
import { publicUrl } from "@src/lib/public-url";
import { SITE } from "@src/lib/site-config";

export type ProductDetailData = {
  name: string;
  summary: string;
  photo: string;
  photoAlt: string;
  opening: OpeningIconType;
  categoryLabels: string[];
  highlights: string[];
  specs: { label: string; value: string }[];
};

type ProductDetailProps = {
  product: ProductDetailData;
};

export const ProductDetail = ({ product }: ProductDetailProps) => {
  return (
    <div
      className="grid max-h-[calc(100dvh-2rem)] grid-cols-1 overflow-y-auto md:grid-cols-[1.05fr_1fr] md:overflow-hidden"
      data-lenis-prevent
    >
      <div className="relative min-h-[260px] md:min-h-[620px]">
        <img
          src={publicUrl(product.photo)}
          alt={product.photoAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="glass absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-4 text-foreground">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/60">
            <OpeningIcon type={product.opening} autoplay className="size-7" />
          </span>
          <span className="text-sm font-medium">Como abre</span>
        </div>
      </div>

      <div className="flex flex-col gap-7 p-6 md:overflow-y-auto md:p-10" data-lenis-prevent>
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {product.categoryLabels.join(" e ")}
          </span>
          <h2 className="text-title text-[clamp(2.2rem,4vw,3.25rem)]">{product.name}</h2>
          <p className="text-lg text-muted-foreground">{product.summary}</p>
        </div>

        <ul className="flex flex-wrap gap-2">
          {product.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground"
            >
              <Check aria-hidden="true" className="size-3.5" />
              {highlight}
            </li>
          ))}
        </ul>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6">
          {product.specs.map((spec) => (
            <div key={spec.label} className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">{spec.label}</dt>
              <dd className="font-display text-lg font-semibold leading-snug tracking-[-0.01em]">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          <PillButton href={SITE.whatsappUrl}>Solicitar orçamento</PillButton>
          <PillButton href={SITE.catalogUrl} variant="outline" icon="external">
            Catálogo
          </PillButton>
        </div>
      </div>
    </div>
  );
};
