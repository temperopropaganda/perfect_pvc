import { type CSSProperties, useRef, useState } from "react";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { gsap, ScrollTrigger, useGSAP } from "@src/lib/gsap";
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
};

const PHOTO_SIZES = "(min-width: 1024px) 45vw, 100vw";

// No desktop, a seção fica fixa enquanto a rolagem percorre os atributos: cada trecho da
// rolagem acende um tópico e troca a foto do quadro com fade. No mobile, cada tópico mostra a
// própria foto, em sequência.
export const PrecisionSection = ({ label, title, facts }: PrecisionSectionProps) => {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const sync = (self: ScrollTrigger) =>
          setActive(Math.min(facts.length - 1, Math.floor(self.progress * facts.length)));
        sync(
          ScrollTrigger.create({
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            onUpdate: sync,
            onRefresh: sync,
          }),
        );
      });
    },
    { scope: root, dependencies: [facts.length] },
  );

  return (
    <section
      ref={root}
      style={{ "--precision-steps": facts.length } as CSSProperties}
      className="bg-background py-(--spacing-section) lg:h-[calc(100svh+var(--precision-steps)*60svh)] lg:py-0"
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center">
        <div className="site-container grid w-full grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="flex flex-col gap-10 lg:col-span-5">
            <span className="text-label text-muted-foreground">{label}</span>
            <RevealText
              as="h2"
              text={title}
              className="text-display max-w-[12ch] text-[clamp(2.4rem,5vw,5.5rem)]"
            />
            <ol className="flex flex-col">
              {facts.map((fact, index) => {
                const current = index === active;
                return (
                  <li
                    key={fact.title}
                    aria-current={current}
                    className={cn(
                      "border-t border-blue-700/20 py-5 transition-opacity duration-700 ease-glide",
                      current ? "opacity-100" : "lg:opacity-35",
                    )}
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="text-label w-6 shrink-0 text-graphite-400">
                        0{index + 1}
                      </span>
                      <div className="flex flex-col">
                        <h3 className="font-display text-xl font-normal tracking-[-0.015em]">
                          {fact.title}
                        </h3>
                        {/* No desktop só o tópico ativo abre o texto: os quatro abertos não
                            cabem na altura da tela fixa. */}
                        <div
                          className={cn(
                            "grid transition-[grid-template-rows] duration-700 ease-glide",
                            current ? "grid-rows-[1fr]" : "grid-rows-[1fr] lg:grid-rows-[0fr]",
                          )}
                        >
                          <p className="max-w-[40ch] overflow-hidden pt-2 text-[15px] leading-relaxed text-muted-foreground">
                            {fact.text}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 aspect-[4/5] overflow-hidden rounded-[6px] lg:hidden">
                      <Picture {...fact.photo} sizes={PHOTO_SIZES} />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="relative hidden h-[78svh] overflow-hidden rounded-[6px] bg-graphite-100 lg:col-span-6 lg:col-start-7 lg:block">
            {facts.map((fact, index) => (
              <Picture
                key={fact.title}
                {...fact.photo}
                sizes={PHOTO_SIZES}
                aria-hidden={index !== active}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-swing motion-reduce:transition-none",
                  index === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
