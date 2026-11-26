import type { ReactNode } from "react";

import type { PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";
import { cn } from "@src/lib/utils";

type EditorialSplitProps = {
  title: string;
  children: ReactNode;
  // Duas fotos lado a lado: a primeira é o "antes" (processo) e a segunda o "depois" (resultado).
  photos: [PictureSource, PictureSource];
};

// Texto curto à esquerda e um par de fotos à direita, que ocupam quase toda a altura da seção: a primeira cola no topo, a segunda no fim.
export const EditorialSplit = ({ title, children, photos }: EditorialSplitProps) => (
  <section className="bg-graphite-100 py-(--spacing-section) md:py-0">
    <div className="site-container grid grid-cols-1 gap-14 md:min-h-[100svh] md:grid-cols-12 md:items-stretch md:gap-8">
      <div className="flex flex-col justify-center gap-8 md:col-span-4 md:py-24">
        <RevealText
          as="h2"
          text={title}
          className="text-title text-[clamp(2rem,3.6vw,3.75rem)]"
          emphasisClassName="text-graphite-400"
        />
        <div className="max-w-[40ch] text-[17px] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:col-span-8 md:col-start-5 md:-mr-[max(0px,calc((100vw-1328px)*0.3))] md:gap-2.5">
        {photos.map((photo, index) => (
          <RevealImage
            key={photo.src}
            {...photo}
            sizes="(min-width: 768px) max(42vw, 150svh), 100vw"
            from={index === 0 ? "top" : "bottom"}
            className={cn(
              "md:h-[calc(100%-clamp(4rem,12svh,8rem))]",
              index === 0 ? "md:self-start" : "md:self-end",
            )}
            frameClassName="aspect-[3/4.2] md:aspect-auto md:h-full"
          />
        ))}
      </div>
    </div>
  </section>
);
