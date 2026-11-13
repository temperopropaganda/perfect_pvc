import { useRef } from "react";

import type { PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";
import { gsap, useGSAP } from "@src/lib/gsap";
import { MOTION } from "@src/lib/motion";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

type Step = { title: string; text: string };

type ProcessStepsProps = {
  label: string;
  title: string;
  steps: Step[];
  note: Step;
  photo: PictureSource;
};

export const ProcessSteps = ({ label, title, steps, note, photo }: ProcessStepsProps) => {
  const list = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("li").forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration,
            ease: MOTION.ease,
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          },
        );
      });
    },
    { scope: list },
  );

  return (
    <section className="bg-graphite-100 py-(--spacing-section)">
      <div className="site-container grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-10 lg:sticky lg:top-32">
            <span className="text-label text-muted-foreground">{label}</span>
            <RevealText
              as="h2"
              text={title}
              className="text-display text-[clamp(2.4rem,5vw,5.5rem)]"
              emphasisClassName="text-graphite-400"
            />
            <RevealImage
              {...photo}
              sizes="(min-width: 1024px) 38vw, 100vw"
              frameClassName="aspect-[3/2] rounded-[6px]"
              className="hidden lg:flex"
            />
          </div>
        </div>
        <div className="flex flex-col gap-10 lg:col-span-6 lg:col-start-7">
          <ol ref={list} className="flex flex-col">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="group grid grid-cols-[3.5rem_1fr] gap-4 border-t border-graphite-300 py-8 md:grid-cols-[5rem_1fr]"
              >
                <span className="text-display text-[clamp(1.8rem,3vw,2.75rem)] text-graphite-400 transition-colors duration-500 group-hover:text-blue-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-2xl font-light tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  <p className="max-w-[44ch] text-muted-foreground">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="glass flex flex-col gap-2 rounded-[18px] p-6 md:p-8">
            <span className="text-label text-blue-700">Durante toda a obra</span>
            <span className="font-display text-xl font-light tracking-[-0.015em]">
              {note.title}
            </span>
            <p className="text-muted-foreground">{note.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
