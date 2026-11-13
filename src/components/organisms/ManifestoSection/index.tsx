import { useRef } from "react";

import type { PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";
import { gsap, useGSAP } from "@src/lib/gsap";
import { MOTION } from "@src/lib/motion";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

type ManifestoSectionProps = {
  wide: PictureSource;
  tall: PictureSource;
};

// Frases do "Propósito" do catálogo Perfect 2026.
const FEELINGS = [
  "O silêncio que chega primeiro.",
  "A temperatura que se mantém mais estável.",
  "A porta que fecha com firmeza.",
  "A janela que não pede manutenção a cada estação.",
];

export const ManifestoSection = ({ wide, tall }: ManifestoSectionProps) => {
  const list = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !list.current) return;
      gsap.fromTo(
        list.current.querySelectorAll("li"),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration,
          ease: MOTION.ease,
          stagger: 0.12,
          scrollTrigger: { trigger: list.current, start: "top 82%", once: true },
        },
      );
    },
    { scope: list },
  );

  return (
    <section id="proposito" className="bg-background py-(--spacing-section)">
      <div className="site-container flex flex-col gap-20 md:gap-32">
        <div className="flex flex-col gap-8">
          <span className="text-label text-muted-foreground">Propósito</span>
          <RevealText
            as="h2"
            text="Uma casa boa não é só o que se vê. *É o que se sente.*"
            className="text-display max-w-[15ch] text-[clamp(2.6rem,7vw,7.5rem)]"
            emphasisClassName="text-graphite-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-8">
          <RevealImage
            {...wide}
            sizes="(min-width: 768px) 58vw, 100vw"
            className="md:col-span-7"
            frameClassName="aspect-[4/3] rounded-[6px]"
            from="left"
          />
          <div className="flex flex-col justify-between gap-14 md:col-span-4 md:col-start-9">
            <ul ref={list} className="flex flex-col">
              {FEELINGS.map((line, index) => (
                <li
                  key={line}
                  className="flex items-baseline gap-5 border-t border-border py-5 text-lg leading-snug md:text-xl"
                >
                  <span className="text-label w-6 shrink-0 text-graphite-400">0{index + 1}</span>
                  <span className="font-display font-light tracking-[-0.01em]">{line}</span>
                </li>
              ))}
            </ul>
            <RevealImage
              {...tall}
              sizes="(min-width: 768px) 30vw, 100vw"
              frameClassName="aspect-[4/5] rounded-[6px]"
              parallax={12}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
