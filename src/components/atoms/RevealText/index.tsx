import { useRef, type ElementType } from "react";

import { gsap, useGSAP } from "@src/lib/gsap";
import { MOTION } from "@src/lib/motion";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";
import { cn } from "@src/lib/utils";

type RevealTextProps = {
  // Trechos entre *asteriscos* recebem emphasisClassName. "\n" quebra a linha.
  text: string;
  as?: ElementType;
  className?: string;
  emphasisClassName?: string;
  // "scroll": anima ao entrar na tela. "manual": anima quando `play` vira true.
  mode?: "scroll" | "manual";
  play?: boolean;
  delay?: number;
  stagger?: number;
};

type Word = { value: string; emphasis: boolean; breakAfter: boolean };

const parseWords = (text: string): Word[] => {
  const words: Word[] = [];
  let emphasis = false;
  text.split("\n").forEach((line, lineIndex, lines) => {
    const tokens = line.split(/\s+/).filter(Boolean);
    tokens.forEach((token, tokenIndex) => {
      const opens = token.startsWith("*");
      const closes = token.endsWith("*") && (token.length > 1 || !opens);
      if (opens) emphasis = true;
      words.push({
        value: token.replace(/\*/g, ""),
        emphasis,
        breakAfter: tokenIndex === tokens.length - 1 && lineIndex < lines.length - 1,
      });
      if (closes) emphasis = false;
    });
  });
  return words;
};

export const RevealText = ({
  text,
  as: Tag = "p",
  className,
  emphasisClassName = "text-muted-foreground",
  mode = "scroll",
  play = true,
  delay = 0,
  stagger = MOTION.stagger,
}: RevealTextProps) => {
  const root = useRef<HTMLElement>(null);
  const words = parseWords(text);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      const targets = root.current.querySelectorAll("[data-word]");
      if (mode === "manual" && !play) {
        gsap.set(targets, { yPercent: 115 });
        return;
      }
      gsap.fromTo(
        targets,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: MOTION.duration,
          ease: MOTION.ease,
          stagger,
          delay,
          ...(mode === "scroll" && {
            scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
          }),
        },
      );
    },
    { scope: root, dependencies: [play, mode], revertOnUpdate: false },
  );

  return (
    <Tag ref={root} className={className}>
      <span className="sr-only">{text.replace(/\*/g, "")}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word.value}-${index}`}>
            <span className="-my-[0.16em] inline-block overflow-hidden py-[0.16em] align-top">
              <span
                data-word
                className={cn(
                  "inline-block will-change-transform",
                  word.emphasis && emphasisClassName,
                )}
              >
                {word.value}
              </span>
            </span>
            {word.breakAfter ? <br /> : index < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
};
