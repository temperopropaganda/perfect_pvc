import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { gsap } from "@src/lib/gsap";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";
import { cn } from "@src/lib/utils";

// AccordionGallery do ReactBits (reactbits.dev/c/components/accordion-gallery), adaptado: export
// nomeado, cores dos tokens, fotos com srcset (Picture), links do router e legenda com local.

export type AccordionGalleryItem = {
  photo: PictureSource;
  label: string;
  detail?: string;
  href: string;
};

type AccordionGalleryProps = {
  items: AccordionGalleryItem[];
  defaultIndex?: number;
  // Valor CSS da altura no modo horizontal (ex.: "70svh").
  height?: string;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: "hover" | "click";
  grayscale?: boolean;
  sizes?: string;
  className?: string;
};

const OVERLAY =
  "linear-gradient(180deg, transparent 45%, color-mix(in srgb, var(--scrim) 78%, transparent) 100%), color-mix(in srgb, var(--scrim) calc(var(--ag-dim, 0.35) * 100%), transparent)";

const clampRatio = (value: number) => Math.min(Math.max(value, 0.2), 0.9);

export const AccordionGallery = ({
  items,
  defaultIndex = 0,
  height = "460px",
  gap = 10,
  radius = 6,
  expandRatio = 0.52,
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 4,
  stagger = 0.06,
  trigger = "hover",
  grayscale = true,
  sizes = "(min-width: 768px) 60vw, 100vw",
  className,
}: AccordionGalleryProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);
  const captionRefs = useRef<(HTMLElement | null)[]>([]);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const firstRun = useRef(true);
  const mediaSize = useRef(320);

  const count = items.length;
  const [active, setActiveState] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));
  // Espelho síncrono do painel aberto: o pointerdown pode chegar antes de o React renderizar
  // o hover que acabou de acontecer.
  const activeNow = useRef(active);
  const setActive = (index: number) => {
    activeNow.current = index;
    setActiveState(index);
  };

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const ratio = clampRatio(expandRatio);
      // flex-grow do painel aberto para ele ocupar `expandRatio` da largura total.
      const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1;
      const reduce = prefersReducedMotion();
      const dur = animate && !reduce ? duration : 0;

      timeline.current?.kill();
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const rotation = isActive ? 0 : i < active ? tilt : -tilt;
        tl.to(panel, { flexGrow: isActive ? grow : 1, rotateY: rotation, duration: dur, ease }, 0);

        const media = mediaRefs.current[i];
        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: isActive ? 0 : drift * parallax * mediaSize.current * 0.06,
              "--ag-gray": grayscale && !isActive ? 1 : 0,
              "--ag-dim": isActive ? 0 : 0.35,
              duration: dur,
              ease,
            },
            0,
          );
        }

        const caption = captionRefs.current[i];
        if (caption) {
          const parts = Array.from(caption.children);
          tl.to(
            parts,
            isActive
              ? { opacity: 1, x: 0, duration: dur, ease, stagger: reduce ? 0 : stagger }
              : { opacity: 0, x: -14, duration: dur * 0.6, ease },
            0,
          );
        }
      });

      timeline.current = tl;
    },
    [active, count, expandRatio, duration, ease, tilt, parallax, grayscale, stagger],
  );

  // A foto é mais larga que o painel fechado: assim o painel abre revelando a imagem, em vez
  // de esticá-la.
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;
    const measure = () => {
      const usable = Math.max(element.getBoundingClientRect().width - gap * (count - 1), 120);
      const size = Math.max(140, usable * clampRatio(expandRatio) * 1.22);
      mediaSize.current = size;
      element.style.setProperty("--ag-media-size", `${size}px`);
      applyLayout(!firstRun.current);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [applyLayout, gap, count, expandRatio]);

  useEffect(() => {
    applyLayout(!firstRun.current);
    firstRun.current = false;
  }, [applyLayout]);

  useEffect(() => () => void timeline.current?.kill(), []);

  // O primeiro toque em um painel fechado só o abre; o segundo segue o link. O estado é lido
  // no pointerdown porque, no toque, o navegador dispara mouseenter e focus antes do click, e o
  // painel já chegaria aberto. Com mouse, o hover abre antes e o clique navega direto.
  const pressedClosed = useRef(false);

  const handleClick = (i: number, event: MouseEvent) => {
    const keyboard = event.detail === 0;
    if (keyboard || !pressedClosed.current) return;
    pressedClosed.current = false;
    event.preventDefault();
    setActive(i);
  };

  const handleKeyDown = (i: number, event: KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i + 1) % count);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      role="list"
      aria-label="Galeria de cases"
      className={cn(
        "flex w-full max-w-full flex-row perspective-[1400px] max-[520px]:flex-col! max-[520px]:perspective-none",
        className,
      )}
      style={{ gap: `${gap}px`, height }}
    >
      {items.map((item, i) => (
        <Link
          key={item.href}
          to={item.href}
          ref={(element) => {
            panelRefs.current[i] = element;
          }}
          role="listitem"
          aria-current={i === active ? "true" : undefined}
          aria-label={item.detail ? `${item.label}, ${item.detail}` : item.label}
          onPointerDown={() => {
            pressedClosed.current = i !== activeNow.current;
          }}
          onClick={(event) => handleClick(i, event)}
          onMouseEnter={() => trigger === "hover" && setActive(i)}
          onFocus={() => setActive(i)}
          onKeyDown={(event) => handleKeyDown(i, event)}
          className="group relative block min-h-0 min-w-0 flex-[1_1_0] cursor-pointer overflow-hidden bg-graphite-950 outline-none transform-3d shadow-[0_10px_30px_-18px_var(--scrim)] focus-visible:ring-2 focus-visible:ring-white max-[520px]:min-h-21 max-[520px]:transform-none!"
          style={{ borderRadius: `${radius}px`, willChange: "flex-grow, transform" }}
        >
          <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <span
              ref={(element) => {
                mediaRefs.current[i] = element;
              }}
              className="absolute top-1/2 left-1/2 h-full [filter:grayscale(var(--ag-gray,1))] max-[520px]:w-full!"
              style={
                {
                  width: "var(--ag-media-size, 320px)",
                  willChange: "transform, filter",
                } as CSSProperties
              }
            >
              <Picture {...item.photo} sizes={sizes} className="select-none" />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: OVERLAY }}
            />
          </span>
          <span
            ref={(element) => {
              captionRefs.current[i] = element;
            }}
            aria-hidden="true"
            className="pointer-events-none absolute right-5 bottom-5 left-5 z-2 flex items-center gap-3"
          >
            <span className="h-10 w-0.75 flex-none rounded-full bg-gold-400 opacity-0" />
            <span className="flex min-w-0 flex-col gap-1 text-white opacity-0 [text-shadow:0_2px_14px_color-mix(in_srgb,var(--scrim)_55%,transparent)]">
              <span className="font-display truncate text-[clamp(1.1rem,1.6vw,1.6rem)] font-light tracking-[-0.02em]">
                {item.label}
              </span>
              {item.detail && (
                <span className="text-label truncate text-graphite-200">{item.detail}</span>
              )}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
};
