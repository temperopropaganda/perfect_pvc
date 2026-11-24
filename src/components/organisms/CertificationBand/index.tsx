import { useRef } from "react";

import { RevealText } from "@src/components/atoms/RevealText";
import { gsap, useGSAP } from "@src/lib/gsap";
import { MOTION } from "@src/lib/motion";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

const RESULTS = [
  { value: "Classe 4", title: "Permeabilidade ao ar", norm: "UNE-EN 12207 e UNE-EN 1026" },
  { value: "E750", title: "Estanqueidade à água", norm: "UNE-EN 1027 e UNE-EN 12208" },
  { value: "Classe 5", title: "Resistência ao vento", norm: "UNE-EN 12211" },
];

const SEALS = [
  "Selo Azul Qualitat Kömmerling desde 2018",
  "Programa Janela Qualificada",
  "NBR 10821 e NBR 15575",
];

export const CertificationBand = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-result]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration,
          ease: MOTION.ease,
          stagger: 0.14,
          scrollTrigger: { trigger: "[data-results]", start: "top 80%", once: true },
        },
      );
      gsap.fromTo(
        "[data-rule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.6,
          ease: MOTION.easeInOut,
          stagger: 0.14,
          scrollTrigger: { trigger: "[data-results]", start: "top 80%", once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      className="dark bg-background py-(--spacing-section) text-foreground"
    >
      <div className="site-container flex flex-col gap-20 md:gap-28">
        <div className="grid gap-8 md:grid-cols-12">
          <RevealText
            as="h2"
            text="Ensaiadas até o *grau máximo.*"
            className="text-display text-[clamp(2.4rem,6vw,6.5rem)] md:col-span-9"
            emphasisClassName="text-gold-300"
          />
        </div>

        <ul data-results className="grid gap-12 md:grid-cols-3 md:gap-8">
          {RESULTS.map((result) => (
            <li key={result.title} data-result className="flex flex-col gap-5">
              <span data-rule className="block h-px w-full origin-left bg-white/25" />
              <span className="text-display text-[clamp(3.4rem,6.4vw,6.75rem)] text-white">
                {result.value}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-display text-lg">{result.title}</span>
                <span className="text-sm text-graphite-400">Grau máximo · {result.norm}</span>
              </span>
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap gap-x-10 gap-y-3 border-t border-border pt-8">
          {SEALS.map((seal) => (
            <li key={seal} className="text-label text-graphite-300">
              {seal}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
