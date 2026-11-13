import { useRef } from "react";

import { gsap, useGSAP } from "@src/lib/gsap";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

type PillarsStatementProps = {
  label: string;
  words: string[];
  caption: string;
};

// As palavras acendem uma a uma conforme a seção atravessa a tela.
export const PillarsStatement = ({ label, words, caption }: PillarsStatementProps) => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-pillar]",
        { opacity: 0.14, x: (index: number) => (index % 2 === 0 ? -40 : 40) },
        {
          opacity: 1,
          x: 0,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 70%", scrub: 0.8 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      className="dark overflow-hidden bg-blue-900 py-(--spacing-section) text-foreground"
    >
      <div className="site-container flex flex-col gap-14">
        <span className="text-label text-blue-300">{label}</span>
        <ul className="flex flex-col">
          {words.map((word, index) => (
            <li
              key={word}
              data-pillar
              className="text-display border-b border-white/10 py-4 text-[clamp(3.2rem,11vw,12rem)] leading-[0.9] text-white md:py-6"
              style={{ paddingLeft: `${index * 8}%` }}
            >
              {word}
            </li>
          ))}
        </ul>
        <p className="text-lead max-w-[44ch] self-end text-blue-200">{caption}</p>
      </div>
    </section>
  );
};
