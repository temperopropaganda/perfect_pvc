import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { OpeningIcon, type OpeningIconType } from "@src/components/atoms/OpeningIcon";
import { publicUrl } from "@src/lib/public-url";
import { cn } from "@src/lib/utils";

export type ProductCardData = {
  slug: string;
  name: string;
  summary: string;
  mockup: string;
  opening: OpeningIconType;
};

type ProductCardProps = {
  product: ProductCardData;
  className?: string;
} & ({ to: string } | { onSelect: (slug: string) => void });

// Sem hover (telas de toque), o ícone abre e fecha sozinho enquanto o card está na tela.
const isTouchOnly = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

export const ProductCard = (props: ProductCardProps) => {
  const { product, className } = props;
  const [touchOnly] = useState(isTouchOnly);
  const classes = cn(
    "group relative flex flex-col overflow-hidden rounded-3xl bg-card text-left text-card-foreground",
    "shadow-[0_0_0_1px_rgb(0_0_0_/_0.05),0_2px_4px_rgb(30_32_70_/_0.04)] transition-shadow duration-500 ease-glide",
    "hover:shadow-[0_0_0_1px_rgb(0_0_0_/_0.06),0_24px_48px_-16px_rgb(30_32_70_/_0.22)]",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
    className,
  );

  const content = (
    <>
      <div className="relative flex aspect-[4/3.6] items-center justify-center overflow-hidden">
        <OpeningIcon
          type={product.opening}
          autoplay={touchOnly}
          className="absolute left-5 top-5 size-9 text-foreground/75"
        />
        <img
          src={publicUrl(product.mockup)}
          alt=""
          loading="lazy"
          className="relative h-[68%] w-auto max-w-[78%] object-contain drop-shadow-[0_24px_24px_rgb(30_32_70_/_0.16)] transition-transform duration-700 ease-glide group-hover:-translate-y-2 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex items-end justify-between gap-4 p-6 pt-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-title text-2xl">{product.name}</h3>
          <p className="text-[15px] text-muted-foreground">{product.summary}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/5 transition-[background-color,color,transform] duration-300 ease-glide group-hover:rotate-90 group-hover:bg-primary group-hover:text-primary-foreground">
          <Plus aria-hidden="true" className="size-4" />
        </span>
      </div>
    </>
  );

  if ("to" in props) {
    return (
      <Link to={props.to} className={classes} aria-label={`${product.name}: ${product.summary}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => props.onSelect(product.slug)}
      className={classes}
      aria-label={`Ver detalhes de ${product.name}`}
    >
      {content}
    </button>
  );
};
