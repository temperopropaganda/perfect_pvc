import { useRef, useState } from "react";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { ScrollCue } from "@src/components/atoms/ScrollCue";
import { gsap, useGSAP } from "@src/lib/gsap";
import { MOTION } from "@src/lib/motion";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

type HomeHeroProps = {
  photo: PictureSource;
  caption: string;
};

// A foto se abre como uma janela: começa num vão estreito e se expande até a tela inteira.
export const HomeHero = ({ photo, caption }: HomeHeroProps) => {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [titleReady, setTitleReady] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setTitleReady(true);
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: MOTION.easeInOut } });
      intro
        .fromTo(
          frame.current,
          { clipPath: "inset(32% 41% 32% 41% round 4px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.9 },
          0.2,
        )
        .fromTo(
          media.current,
          { scale: 1.35 },
          { scale: 1.06, duration: 2.6, ease: MOTION.ease },
          0.2,
        )
        .call(() => setTitleReady(true), [], 1.15)
        .fromTo(
          "[data-hero-fade]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1.2, ease: MOTION.ease, stagger: 0.12 },
          1.6,
        );

      gsap.to(media.current, {
        yPercent: 14,
        scale: 1.16,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(content.current, {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "35% top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      className="dark relative h-[100svh] min-h-[640px] overflow-hidden bg-scrim text-foreground"
    >
      <div ref={frame} className="absolute inset-0 overflow-hidden">
        <div ref={media} className="absolute inset-0 scale-[1.06] will-change-transform">
          <Picture {...photo} priority sizes="100vw" className="object-[42%_50%]" />
        </div>
        <span className="absolute inset-0 bg-linear-to-t from-scrim/85 via-scrim/20 to-scrim/35" />
        <span className="absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-scrim/45 to-transparent" />
      </div>

      <div
        ref={content}
        className="site-container relative flex h-full flex-col justify-end pb-10 md:pb-14"
      >
        <span data-hero-fade className="text-label mb-6 text-graphite-200 md:mb-8">
          Esquadrias em PVC · Tecnologia Kömmerling
        </span>
        <RevealText
          as="h1"
          mode="manual"
          play={titleReady}
          text={"Molduras\nda paisagem."}
          className="text-display max-w-[11ch] text-[clamp(3.4rem,9.4vw,10rem)] text-white"
        />
        <div className="mt-10 flex items-end justify-between gap-8 border-t border-white/15 pt-6 md:mt-14">
          <p data-hero-fade className="text-lead max-w-[36ch] text-graphite-200">
            Janelas e portas que deixam a luz entrar e o ruído, o vento e a chuva do lado de fora.
          </p>
          <div data-hero-fade className="hidden items-end gap-10 md:flex">
            <span className="text-label text-right text-graphite-300">{caption}</span>
            <ScrollCue className="text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};
