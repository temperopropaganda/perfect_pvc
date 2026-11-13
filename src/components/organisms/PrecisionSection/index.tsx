import { useRef, useState, type ReactNode } from "react";

import type { PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";
import { ScrollTrigger, useGSAP } from "@src/lib/gsap";
import { cn } from "@src/lib/utils";

type PrecisionFact = {
  title: string;
  text: string;
  photo: PictureSource;
};

type PrecisionSectionProps = {
  label: string;
  title: string;
  facts: PrecisionFact[];
  // Elemento opcional (ex.: cena 3D) mostrado acima das fotos.
  visual?: ReactNode;
};

const precisionItems = (scope: HTMLElement | null) =>
  scope ? Array.from(scope.querySelectorAll<HTMLElement>("[data-precision-item]")) : [];

// Cada foto da coluna direita acende o atributo correspondente na coluna fixa da esquerda.
export const PrecisionSection = ({ label, title, facts, visual }: PrecisionSectionProps) => {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      precisionItems(root.current).forEach((element, index) =>
        ScrollTrigger.create({
          trigger: element,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setActive(index),
        }),
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-background py-(--spacing-section)">
      <div className="site-container grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-10 lg:sticky lg:top-32">
            <span className="text-label text-muted-foreground">{label}</span>
            <RevealText
              as="h2"
              text={title}
              className="text-display max-w-[12ch] text-[clamp(2.4rem,5vw,5.5rem)]"
            />
            <ol className="flex flex-col">
              {facts.map((fact, index) => (
                <li
                  key={fact.title}
                  className={cn(
                    "border-t border-border py-5 transition-opacity duration-700 ease-glide",
                    index === active ? "opacity-100" : "lg:opacity-35",
                  )}
                >
                  <div className="flex items-baseline gap-5">
                    <span className="text-label w-6 shrink-0 text-graphite-400">0{index + 1}</span>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-xl font-normal tracking-[-0.015em]">
                        {fact.title}
                      </h3>
                      <p className="max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">
                        {fact.text}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7 lg:gap-10">
          {visual}
          {facts.map((fact, index) => (
            <div
              key={fact.title}
              data-precision-item
              className={cn(index % 2 === 1 && "lg:pl-[18%]")}
            >
              <RevealImage
                {...fact.photo}
                sizes="(min-width: 1024px) 45vw, 100vw"
                frameClassName={cn(
                  "rounded-[6px]",
                  index % 2 === 0 ? "aspect-[4/5]" : "aspect-[5/4]",
                )}
                from={index % 2 === 0 ? "bottom" : "center"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
