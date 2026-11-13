import { useRef } from "react";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { gsap, useGSAP } from "@src/lib/gsap";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

type FramedSceneProps = {
  photo: PictureSource;
  label: string;
  title: string;
  text: string;
};

// A foto começa emoldurada e cresce até ocupar a tela enquanto a seção fica fixa.
export const FramedScene = ({ photo, label, title, text }: FramedSceneProps) => {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=140%",
            scrub: 0.6,
            pin: true,
          },
        });
        tl.fromTo(
          frame.current,
          { clipPath: "inset(14% 26% 14% 26% round 6px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", duration: 1 },
        )
          .fromTo(media.current, { scale: 1.3 }, { scale: 1, ease: "none", duration: 1 }, 0)
          .fromTo(
            copy.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 },
            0.6,
          );
      });
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          media.current,
          { scale: 1.2 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      className="dark relative h-[100svh] min-h-[600px] overflow-hidden bg-background text-foreground"
    >
      <div ref={frame} className="absolute inset-0 overflow-hidden">
        <div ref={media} className="absolute inset-0 will-change-transform">
          <Picture {...photo} sizes="100vw" />
        </div>
        <span className="absolute inset-0 bg-linear-to-t from-scrim/80 via-scrim/10 to-scrim/30" />
      </div>
      <div
        ref={copy}
        className="site-container relative flex h-full flex-col justify-end gap-6 pb-12 md:pb-16"
      >
        <span className="text-label text-graphite-200">{label}</span>
        <h2 className="text-display max-w-[12ch] text-[clamp(2.8rem,8vw,8.5rem)] text-white">
          {title}
        </h2>
        <p className="text-lead max-w-[40ch] text-graphite-200">{text}</p>
      </div>
    </section>
  );
};
