import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { EASE_GLIDE } from "@src/lib/motion";
import { cn } from "@src/lib/utils";

type ProjectViewerProps = {
  title: string;
  meta: string;
  summary?: string;
  photos: PictureSource[];
  index: number;
  onSelect: (index: number) => void;
};

const SWIPE_THRESHOLD = 60;

const ArrowButton = ({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={direction === "prev" ? "Foto anterior" : "Próxima foto"}
    className="glass flex size-12 items-center justify-center rounded-full text-white transition-transform duration-500 ease-glide hover:scale-105 active:scale-95"
  >
    {direction === "prev" ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
  </button>
);

export const ProjectViewer = ({
  title,
  meta,
  summary,
  photos,
  index,
  onSelect,
}: ProjectViewerProps) => {
  const reduce = useReducedMotion();
  const strip = useRef<HTMLDivElement>(null);
  const photo = photos[index] ?? photos[0];
  const total = photos.length;
  const step = (direction: 1 | -1) => onSelect((index + direction + total) % total);

  useEffect(() => {
    strip.current?.querySelector<HTMLElement>(`[data-thumb="${index}"]`)?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [index, reduce]);

  if (!photo) return null;

  return (
    <div className="dark flex h-full min-w-0 flex-col gap-4 text-foreground" data-lenis-prevent>
      <header className="flex items-end justify-between gap-6 px-5 pr-16 pt-5 md:px-8 md:pr-20">
        <div className="flex flex-col gap-1">
          <span className="font-display text-xl font-light tracking-[-0.02em] text-white md:text-2xl">
            {title}
          </span>
          <span className="text-label text-graphite-400">{meta}</span>
        </div>
        <span className="text-label tabular-nums text-graphite-300" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </header>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.figure
            key={photo.src}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 md:px-24"
            initial={reduce ? false : { opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_GLIDE }}
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) step(1);
              if (info.offset.x > SWIPE_THRESHOLD) step(-1);
            }}
          >
            <Picture
              {...photo}
              priority
              sizes="(min-width: 768px) 80vw, 100vw"
              className="h-auto max-h-full w-auto max-w-full rounded-[4px] object-contain"
            />
          </motion.figure>
        </AnimatePresence>
        {total > 1 && (
          <div className="pointer-events-none absolute inset-x-3 top-1/2 hidden -translate-y-1/2 justify-between md:flex">
            <span className="pointer-events-auto">
              <ArrowButton direction="prev" onClick={() => step(-1)} />
            </span>
            <span className="pointer-events-auto">
              <ArrowButton direction="next" onClick={() => step(1)} />
            </span>
          </div>
        )}
      </div>

      <footer className="flex flex-col gap-4 px-5 pb-5 md:px-8">
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-baseline">
          <p className="text-sm text-graphite-300">{photo.alt}</p>
          {summary && (
            <p className="max-w-[60ch] text-sm text-graphite-500 md:text-right">{summary}</p>
          )}
        </div>
        {total > 1 && (
          <div
            ref={strip}
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
          >
            {photos.map((item, thumbIndex) => (
              <button
                key={item.src}
                type="button"
                data-thumb={thumbIndex}
                onClick={() => onSelect(thumbIndex)}
                aria-label={`Ver foto ${thumbIndex + 1}: ${item.alt}`}
                aria-current={thumbIndex === index}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-[4px] transition-opacity duration-300 md:h-16 md:w-24",
                  thumbIndex === index
                    ? "opacity-100 ring-1 ring-white"
                    : "opacity-45 hover:opacity-80",
                )}
              >
                <Picture {...item} alt="" sizes="96px" />
              </button>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
};
