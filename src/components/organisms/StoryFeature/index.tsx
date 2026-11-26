import type { ReactNode } from "react";

import type { PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";

type StoryFeatureProps = {
  index: string;
  label: string;
  title: string;
  children: ReactNode;
  photo: PictureSource;
};

// Capítulo editorial em que a foto é a protagonista: ela sai da margem esquerda da tela e ocupa
// cerca de 60% da largura; título e texto ficam na coluna da direita, dentro da margem padrão.
export const StoryFeature = ({ index, label, title, children, photo }: StoryFeatureProps) => (
  <section className="overflow-hidden bg-background py-(--spacing-section)">
    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[3fr_2fr] md:gap-0">
      <RevealImage
        {...photo}
        sizes="(min-width: 768px) 60vw, 100vw"
        from="left"
        frameClassName="aspect-[4/3] md:aspect-[3/2]"
      />
      <div className="flex flex-col gap-8 px-(--spacing-gutter) md:max-w-[34rem] md:pl-[clamp(2rem,5vw,6rem)] md:pr-(--spacing-gutter)">
        <span className="text-label flex gap-4 text-muted-foreground">
          <span>{index}</span>
          <span>{label}</span>
        </span>
        <RevealText
          as="h2"
          text={title}
          className="text-title text-[clamp(2rem,3.4vw,3.5rem)]"
          emphasisClassName="text-graphite-400"
        />
        <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  </section>
);
