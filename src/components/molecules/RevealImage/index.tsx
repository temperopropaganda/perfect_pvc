import { useRef } from "react";

import { Picture } from "@src/components/atoms/Picture";
import { gsap, useGSAP } from "@src/lib/gsap";
import { MOTION } from "@src/lib/motion";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";
import { cn } from "@src/lib/utils";

type RevealImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  // Proporção e raio da moldura. Sem ele, a moldura usa a proporção da foto.
  frameClassName?: string;
  imageClassName?: string;
  // Deslocamento vertical da foto dentro da moldura, em %. 0 desliga o parallax.
  parallax?: number;
  // De onde a máscara abre.
  from?: "bottom" | "center" | "left" | "right";
  caption?: string;
  priority?: boolean;
};

const CLIP_FROM: Record<NonNullable<RevealImageProps["from"]>, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  center: "inset(18% 14% 18% 14%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

export const RevealImage = ({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  frameClassName,
  imageClassName,
  parallax = 8,
  from = "bottom",
  caption,
  priority = false,
}: RevealImageProps) => {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !frame.current || !image.current) return;
      gsap.fromTo(
        frame.current,
        { clipPath: CLIP_FROM[from] },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: MOTION.easeInOut,
          scrollTrigger: { trigger: frame.current, start: "top 85%", once: true },
        },
      );
      gsap.fromTo(
        image.current,
        { scale: 1.22 },
        {
          scale: 1.04,
          duration: 2.2,
          ease: MOTION.ease,
          scrollTrigger: { trigger: frame.current, start: "top 85%", once: true },
        },
      );
      if (parallax > 0) {
        gsap.fromTo(
          image.current,
          { yPercent: -parallax / 2 },
          {
            yPercent: parallax / 2,
            ease: "none",
            scrollTrigger: {
              trigger: frame.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    },
    { scope: root },
  );

  return (
    <figure ref={root} className={cn("flex flex-col gap-3", className)}>
      <div
        ref={frame}
        className={cn("relative overflow-hidden bg-graphite-200", frameClassName)}
        style={frameClassName ? undefined : { aspectRatio: `${width} / ${height}` }}
      >
        <Picture
          ref={image}
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={cn("absolute inset-0 scale-[1.04] will-change-transform", imageClassName)}
        />
      </div>
      {caption && <figcaption className="text-label text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};
