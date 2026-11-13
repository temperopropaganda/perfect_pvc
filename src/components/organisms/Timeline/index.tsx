import { useRef } from "react";

import { RevealText } from "@src/components/atoms/RevealText";
import { gsap, useGSAP } from "@src/lib/gsap";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

type Milestone = { year: string; text: string };

type TimelineProps = {
  label: string;
  title: string;
  milestones: Milestone[];
  highlight?: { value: string; text: string }[];
};

// A linha se desenha com a rolagem e acende cada marco quando passa por ele.
export const Timeline = ({ label, title, milestones, highlight = [] }: TimelineProps) => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-timeline]",
          start: "top 75%",
          end: "bottom 45%",
          scrub: 0.8,
        },
      });
      tl.fromTo("[data-timeline-line]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
      gsap.utils.toArray<HTMLElement>("[data-milestone]").forEach((element, index, all) => {
        const at = (index / Math.max(all.length - 1, 1)) * 0.9;
        tl.fromTo(element, { opacity: 0.22 }, { opacity: 1, duration: 0.1, ease: "none" }, at);
        tl.fromTo(
          element.querySelector("[data-dot]"),
          { scale: 0 },
          { scale: 1, duration: 0.1, ease: "none" },
          at,
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-background py-(--spacing-section)">
      <div className="site-container flex flex-col gap-20 md:gap-28">
        <div className="grid gap-8 md:grid-cols-12">
          <span className="text-label text-muted-foreground md:col-span-3">{label}</span>
          <RevealText
            as="h2"
            text={title}
            className="text-display max-w-[14ch] text-[clamp(2.4rem,5.6vw,6rem)] md:col-span-9"
            emphasisClassName="text-graphite-400"
          />
        </div>

        <div data-timeline className="relative">
          <span className="absolute inset-x-0 top-[7px] hidden h-px bg-graphite-200 md:block" />
          <span
            data-timeline-line
            className="absolute inset-x-0 top-[7px] hidden h-px origin-left bg-blue-700 md:block"
          />
          <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
            {milestones.map((milestone) => (
              <li key={milestone.year} data-milestone className="flex flex-col gap-6">
                <span className="relative block size-[15px] rounded-full bg-graphite-300">
                  <span data-dot className="absolute inset-0 rounded-full bg-blue-700" />
                </span>
                <span className="text-display text-[clamp(3rem,5vw,5.25rem)] text-graphite-950">
                  {milestone.year}
                </span>
                <p className="max-w-[28ch] text-muted-foreground">{milestone.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {highlight.length > 0 && (
          <ul className="grid gap-10 border-t border-border pt-10 md:grid-cols-12">
            {highlight.map((item, index) => (
              <li
                key={item.value}
                className={index === 0 ? "md:col-span-4 md:col-start-5" : "md:col-span-4"}
              >
                <span className="text-title block text-[clamp(2.4rem,4vw,4rem)] text-blue-700">
                  {item.value}
                </span>
                <span className="mt-2 block max-w-[30ch] text-muted-foreground">{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
