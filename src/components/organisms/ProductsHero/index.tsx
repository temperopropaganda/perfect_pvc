import { useRef } from "react";

import { BlurText } from "@src/components/atoms/BlurText";
import { Reveal } from "@src/components/atoms/Reveal";
import { gsap, useGSAP } from "@src/lib/gsap";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

const FLOATING = [
  { src: "/images/mockups/correr.webp", className: "left-[6%] top-[18%] w-[52%] z-10", depth: -14 },
  { src: "/images/mockups/giro.webp", className: "right-[4%] top-[4%] w-[28%]", depth: 22 },
  {
    src: "/images/mockups/maxim-ar.webp",
    className: "right-[10%] bottom-[2%] w-[34%] z-20",
    depth: -26,
  },
];

export const ProductsHero = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((element, index) => {
        const depth = Number(element.dataset["depth"] ?? 0);
        gsap.from(element, {
          opacity: 0,
          y: 60,
          rotate: index % 2 === 0 ? -4 : 4,
          duration: 1.4,
          delay: 0.25 + index * 0.12,
          ease: "expo.out",
        });
        gsap.to(element, {
          yPercent: depth,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-background pb-16 pt-32 md:pb-24 md:pt-40"
    >
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-5 md:grid-cols-[1.05fr_1fr] md:px-8">
        <div className="flex flex-col gap-6">
          <BlurText
            as="h1"
            text="Uma esquadria para cada vão."
            animateBy="words"
            trigger="load"
            stepDuration={0.24}
            delay={90}
            className="text-display text-[clamp(2.8rem,6.4vw,6rem)]"
          />
          <Reveal delay={0.5}>
            <p className="max-w-[36ch] text-lg leading-relaxed text-muted-foreground">
              Janelas, portas e acessórios com perfis Kömmerling. Limpeza só com água e sabão
              neutro.
            </p>
          </Reveal>
        </div>

        <div aria-hidden="true" className="relative aspect-[1.05] w-full">
          <div className="absolute inset-[10%] rounded-full bg-ice" />
          {FLOATING.map((item) => (
            <img
              key={item.src}
              src={item.src}
              alt=""
              data-depth={item.depth}
              className={`absolute h-auto drop-shadow-[0_30px_30px_rgb(30_32_70_/_0.18)] ${item.className}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
