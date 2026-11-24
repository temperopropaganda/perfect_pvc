import { useRef } from "react";

import { RevealText } from "@src/components/atoms/RevealText";
import { gsap, useGSAP } from "@src/lib/gsap";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";
import { cn } from "@src/lib/utils";

type Milestone = { year: string; text: string };

type TimelineProps = {
  title: string;
  milestones: Milestone[];
  highlight?: { value: string; text: string }[];
};

// Texto em dois tons: o gradiente de 200% de largura corre da esquerda para a direita e troca o
// cinza claro pela cor final. A animação mexe só no background-position.
const FILL =
  "bg-[linear-gradient(90deg,var(--fill-dark)_50%,var(--graphite-300)_50%)] bg-[length:200%_100%] bg-[position:100%_0%] bg-clip-text text-transparent";

// A linha se desenha com a rolagem e acende cada marco quando passa por ele.
export const Timeline = ({ title, milestones, highlight = [] }: TimelineProps) => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set("[data-fill]", { backgroundPosition: "0% 0%" });
        gsap.set("[data-dot]", { scale: 1 });
        return;
      }
      const mm = gsap.matchMedia();

      // As cores dos textos se preenchem da esquerda para a direita, marco a marco.
      const build = (scrollTrigger: ScrollTrigger.Vars) => {
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger });
        tl.fromTo("[data-timeline-line]", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
        const items = gsap.utils.toArray<HTMLElement>("[data-milestone]");
        items.forEach((element, index) => {
          const at = (index / items.length) * 0.92;
          const span = 0.92 / items.length;
          tl.fromTo(
            element.querySelector("[data-dot]"),
            { scale: 0 },
            { scale: 1, duration: 0.06 },
            at,
          );
          tl.fromTo(
            element.querySelectorAll("[data-fill]"),
            { backgroundPosition: "100% 0%" },
            { backgroundPosition: "0% 0%", duration: span * 1.1, stagger: span * 0.35 },
            at,
          );
        });
      };

      mm.add("(min-width: 768px)", () =>
        build({
          trigger: root.current,
          start: "top top",
          end: "+=160%",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
        }),
      );
      mm.add("(max-width: 767px)", () =>
        build({ trigger: "[data-timeline]", start: "top 75%", end: "bottom 45%", scrub: 0.8 }),
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="bg-background py-(--spacing-section) md:flex md:h-[100svh] md:items-center md:py-0"
    >
      <div className="site-container flex flex-col gap-20 md:gap-[clamp(3rem,8svh,6rem)]">
        <RevealText
          as="h2"
          text={title}
          className="text-display text-balance text-[clamp(2.2rem,4.4vw,5rem)] md:text-nowrap"
          emphasisClassName="text-graphite-400"
        />

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
                <span
                  data-fill
                  className={cn(
                    FILL,
                    "text-display w-fit text-transparent! text-[clamp(3rem,5vw,5.25rem)] [--fill-dark:var(--graphite-950)]",
                  )}
                >
                  {milestone.year}
                </span>
                <p data-fill className={cn(FILL, "max-w-[28ch] [--fill-dark:var(--graphite-600)]")}>
                  {milestone.text}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {highlight.length > 0 && (
          <ul className="grid gap-10 border-t border-border pt-10 md:grid-cols-12">
            {highlight.map((item, index) => (
              <li
                key={item.value}
                className={index === 0 ? "md:col-span-4 md:col-start-1" : "md:col-span-4"}
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
