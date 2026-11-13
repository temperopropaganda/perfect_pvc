import type { ImgHTMLAttributes, Ref } from "react";

import { cn } from "@src/lib/utils";

// Larguras geradas para cada foto em public/images/projetos (ver design/README.md).
const WIDTHS = [800, 1400, 2400] as const;

export type PictureSource = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

type PictureProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "width" | "height" | "alt" | "loading"
> & {
  // Caminho sem o sufixo "-800.webp". Um caminho terminado em .webp é usado como arquivo único.
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  ref?: Ref<HTMLImageElement>;
};

const isSingleFile = (src: string) => /\.(webp|jpe?g|png|avif)$/i.test(src);

export const Picture = ({
  src,
  alt,
  width,
  height,
  sizes = "100vw",
  priority = false,
  className,
  ref,
  ...rest
}: PictureProps) => {
  const single = isSingleFile(src);
  return (
    <img
      ref={ref}
      src={single ? src : `${src}-1400.webp`}
      srcSet={single ? undefined : WIDTHS.map((w) => `${src}-${w}.webp ${w}w`).join(", ")}
      sizes={single ? undefined : sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
      className={cn("block size-full object-cover", className)}
      {...rest}
    />
  );
};
