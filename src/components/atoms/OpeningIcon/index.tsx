import { useEffect, useRef, useState, type CSSProperties } from "react";

import { cn } from "@src/lib/utils";

import "@src/components/atoms/OpeningIcon/opening-icon.css";

export type OpeningIconType =
  | "correr"
  | "oscilo-batente"
  | "giro"
  | "maxim-ar"
  | "fixo"
  | "pivotante"
  | "camarao"
  | "alcante"
  | "brise"
  | "portao"
  | "tela"
  | "persiana";

type OpeningIconProps = {
  type: OpeningIconType;
  open?: boolean;
  autoplay?: boolean;
  variant?: "line" | "window";
  frameColor?: string;
  handleColor?: string;
  className?: string;
};

const SASH_COUNT: Partial<Record<OpeningIconType, number>> = {
  correr: 2,
  alcante: 2,
  camarao: 4,
  brise: 5,
};

// Precisa cobrir o gesto mais longo (alçante: alavanca, subida e deslize, cerca de 1,4 s).
const AUTOPLAY_INTERVAL_MS = 2400;

// Desenho da esquadria que abre do jeito do sistema: abre no hover do ".group" pai,
// com a prop open ou sozinho com autoplay.
export const OpeningIcon = ({
  type,
  open = false,
  autoplay = false,
  variant = "line",
  frameColor,
  handleColor,
  className,
}: OpeningIconProps) => {
  const root = useRef<HTMLSpanElement>(null);
  const [autoOpen, setAutoOpen] = useState(false);

  // O autoplay só roda com o ícone na tela; fora dela, para e volta fechado.
  useEffect(() => {
    const element = root.current;
    if (!autoplay || !element) return undefined;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (!entry?.isIntersecting) {
        setAutoOpen(false);
        return;
      }
      timer = window.setInterval(() => setAutoOpen((current) => !current), AUTOPLAY_INTERVAL_MS);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [autoplay]);

  const sashes = Array.from({ length: SASH_COUNT[type] ?? 1 }, (_, index) => index);
  const style = {
    ...(frameColor ? { "--oi-frame": frameColor } : {}),
    ...(handleColor ? { "--oi-handle": handleColor } : {}),
  } as CSSProperties;

  return (
    <span
      ref={root}
      aria-hidden="true"
      className={cn("opening-icon", className)}
      data-type={type}
      data-variant={variant}
      data-open={open || (autoplay && autoOpen)}
      style={style}
    >
      <span className="oi-frame">
        {sashes.map((index) => (
          <span
            key={index}
            className="oi-sash"
            data-index={index}
            style={{ "--i": index } as CSSProperties}
          >
            <span className="oi-pane" />
            <span className="oi-handle" />
          </span>
        ))}
      </span>
    </span>
  );
};
