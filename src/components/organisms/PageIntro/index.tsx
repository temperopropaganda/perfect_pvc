import { useRef, useState } from "react";

import type { PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";
import { gsap, useGSAP } from "@src/lib/gsap";
import { MOTION } from "@src/lib/motion";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

type PageIntroProps = {
  label: string;
  title: string;
  text: string;
  meta?: string[];
  photo?: PictureSource;
};

// Abertura das páginas internas: título editorial grande e uma foto larga que se abre do centro.
export const PageIntro = ({ label, title, text, meta = [], photo }: PageIntroProps) => {
  const root = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      setReady(true);
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-intro-fade]",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration,
          ease: MOTION.ease,
          stagger: 0.1,
          delay: 0.5,
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      className="dark bg-background pb-6 pt-36 text-foreground md:pb-10 md:pt-48"
    >
      <div className="site-container flex flex-col gap-12 md:gap-16">
        <span data-intro-fade className="text-label text-graphite-400">
          {label}
        </span>
        <RevealText
          as="h1"
          mode="manual"
          play={ready}
          delay={0.1}
          text={title}
          className="text-display max-w-[13ch] text-[clamp(3rem,8.6vw,9.5rem)] text-white"
          emphasisClassName="text-graphite-400"
        />
        <div className="grid gap-8 border-t border-border pt-8 md:grid-cols-12">
          <p data-intro-fade className="text-lead max-w-[44ch] text-graphite-300 md:col-span-6">
            {text}
          </p>
          {meta.length > 0 && (
            <ul
              data-intro-fade
              className="flex flex-wrap gap-x-8 gap-y-2 md:col-span-5 md:col-start-8 md:justify-end"
            >
              {meta.map((item) => (
                <li key={item} className="text-label text-graphite-400">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
        {photo && (
          <RevealImage
            {...photo}
            priority
            sizes="100vw"
            from="center"
            parallax={14}
            frameClassName="aspect-[4/5] rounded-[6px] sm:aspect-[16/9] lg:aspect-[21/9]"
          />
        )}
      </div>
    </section>
  );
};
