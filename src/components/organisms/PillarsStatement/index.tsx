import { useRef } from "react";

import { gsap, useGSAP } from "@src/lib/gsap";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

type PillarsStatementProps = {
  label: string;
  words: string[];
};

// As palavras se preenchem de cor, da esquerda para a direita e uma a uma, e ficam todas cheias quando a seção
// está inteira na tela (centralizada na vertical).
export const PillarsStatement = ({ label, words }: PillarsStatementProps) => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set("[data-pillar-word]", { backgroundPosition: "0% 0%" });
        return;
      }
      gsap.fromTo(
        "[data-pillar-word]",
        { backgroundPosition: "100% 0%" },
        {
          backgroundPosition: "0% 0%",
          ease: "none",
          stagger: 0.5,
          scrollTrigger: { trigger: root.current, start: "top 65%", end: "top 10%", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      className="dark flex min-h-[100svh] items-center overflow-hidden bg-blue-900 py-(--spacing-section) text-foreground md:py-20"
    >
      <div className="site-container flex flex-col gap-10 md:gap-[clamp(2rem,6svh,4rem)]">
        <span className="text-label text-blue-300">{label}</span>
        <ul className="flex flex-col">
          {words.map((word) => (
            <li
              key={word}
              className="text-display border-b border-white/10 py-4 text-[clamp(3.2rem,min(11vw,17svh),12rem)] leading-[0.9] md:py-6"
            >
              <span
                data-pillar-word
                className="bg-[linear-gradient(90deg,var(--color-white)_50%,rgb(255_255_255/0.14)_50%)] bg-[length:200%_100%] bg-[position:100%_0%] bg-clip-text text-transparent"
              >
                {word}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
