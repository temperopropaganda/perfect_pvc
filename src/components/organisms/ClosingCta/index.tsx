import { useRef } from "react";

import { PillButton } from "@src/components/atoms/PillButton";
import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { gsap, useGSAP } from "@src/lib/gsap";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

type CtaAction = { label: string; href: string };

type ClosingCtaProps = {
  label: string;
  title: string;
  photo: PictureSource;
  primary: CtaAction;
  secondary: CtaAction;
};

export const ClosingCta = ({ label, title, photo, primary, secondary }: ClosingCtaProps) => {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        media.current,
        { yPercent: -10, scale: 1.12 },
        {
          yPercent: 6,
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
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      className="dark relative flex min-h-[88svh] items-end overflow-hidden bg-background text-foreground"
    >
      <div ref={media} className="absolute inset-0 will-change-transform">
        <Picture {...photo} sizes="100vw" />
      </div>
      <span className="absolute inset-0 bg-linear-to-t from-scrim/90 via-scrim/40 to-scrim/20" />
      <div className="site-container relative flex flex-col gap-10 pb-16 pt-40 md:pb-24">
        <span className="text-label text-graphite-200">{label}</span>
        <RevealText
          as="h2"
          text={title}
          className="text-display max-w-[14ch] text-[clamp(2.8rem,7.5vw,8rem)] text-white"
          emphasisClassName="text-gold-300"
        />
        <div className="flex flex-wrap gap-3">
          <PillButton href={primary.href} variant="light" size="lg">
            {primary.label}
          </PillButton>
          <PillButton href={secondary.href} variant="glass" size="lg" icon="external">
            {secondary.label}
          </PillButton>
        </div>
      </div>
    </section>
  );
};
