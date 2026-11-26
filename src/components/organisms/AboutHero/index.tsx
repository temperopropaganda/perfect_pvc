import { useRef, useState } from "react";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { gsap, useGSAP } from "@src/lib/gsap";
import { MOTION } from "@src/lib/motion";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

type AboutHeroProps = {
  title: string;
  photo: PictureSource;
  // Opcionais: sem eles, o banner mostra só o título sobre a foto.
  label?: string;
  text?: string;
  meta?: string[];
  // Desfoque da foto em px (0 deixa a foto nítida).
  blur?: number;
};

// Abertura da página Sobre: a foto ocupa a tela inteira, desfocada, e o texto fica por cima.
export const AboutHero = ({ label, title, text, meta = [], photo, blur = 6 }: AboutHeroProps) => {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      setReady(true);
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        media.current,
        { scale: 1.16, opacity: 0 },
        { scale: 1.08, opacity: 1, duration: 2.2, ease: MOTION.ease },
      );
      gsap.fromTo(
        "[data-about-fade]",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration,
          ease: MOTION.ease,
          stagger: 0.1,
          delay: 0.6,
        },
      );
      // Na saída, a foto desce mais devagar que o texto.
      const scroll = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(media.current, { yPercent: 12, ease: "none", scrollTrigger: scroll });
      gsap.to(content.current, {
        yPercent: -10,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: scroll,
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      className="dark relative flex min-h-[100svh] overflow-hidden bg-scrim text-foreground"
    >
      <div ref={media} aria-hidden="true" className="absolute inset-0 scale-[1.08]">
        <Picture
          {...photo}
          alt=""
          priority
          sizes="100vw"
          className="absolute inset-0"
          style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined}
        />
      </div>
      <span className="absolute inset-0 bg-linear-to-t from-scrim/90 via-scrim/55 to-scrim/45" />
      <span className="absolute inset-y-0 left-0 w-3/4 bg-linear-to-r from-scrim/50 to-transparent" />

      <div
        ref={content}
        className="site-container relative flex w-full flex-col justify-end gap-12 pb-12 pt-36 md:gap-16 md:pb-16"
      >
        <div className="flex flex-col gap-8">
          {label && (
            <span data-about-fade className="text-label text-graphite-300">
              {label}
            </span>
          )}
          <RevealText
            as="h1"
            mode="manual"
            play={ready}
            delay={0.2}
            text={title}
            className="text-display max-w-[13ch] text-[clamp(3rem,8.6vw,9.5rem)] text-white"
            emphasisClassName="text-graphite-300"
          />
        </div>
        {(text || meta.length > 0) && (
          <div className="grid gap-8 border-t border-white/20 pt-8 md:grid-cols-12">
            <p data-about-fade className="text-lead max-w-[44ch] text-graphite-200 md:col-span-6">
              {text}
            </p>
            <ul
              data-about-fade
              className="flex flex-wrap gap-x-8 gap-y-2 md:col-span-5 md:col-start-8 md:justify-end"
            >
              {meta.map((item) => (
                <li key={item} className="text-label text-graphite-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
