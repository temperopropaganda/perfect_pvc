import type { ImgHTMLAttributes, Ref } from "react";

import { cn } from "@src/lib/utils";
import { publicUrl } from "@src/lib/public-url";

// Versões geradas para cada foto (ver design/README.md). O número no nome do arquivo é o lado
// MAIOR da foto: numa foto vertical, "-800" tem 533 px de largura. O srcset precisa declarar a
// largura real, senão o navegador escolhe uma versão pequena demais e a foto fica borrada.
const LONG_EDGES = [800, 1400, 2400] as const;

const srcSetFor = (src: string, width: number, height: number) =>
  LONG_EDGES.map((edge) => {
    const realWidth = width >= height ? edge : Math.round((edge * width) / height);
    return `${src}-${edge}.webp ${realWidth}w`;
  }).join(", ");

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
  const url = publicUrl(src);
  return (
    <img
      ref={ref}
      src={single ? url : `${url}-1400.webp`}
      srcSet={single ? undefined : srcSetFor(url, width, height)}
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
