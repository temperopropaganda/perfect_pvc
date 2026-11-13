import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useState } from "react";

import { Picture } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { EASE_GLIDE } from "@src/lib/motion";
import { cn } from "@src/lib/utils";

type ArchiveItem = {
  slug: string;
  title: string;
  place?: string;
  year: number;
  image: string;
  imageAlt: string;
};

type ArchiveFilter = { value: string; label: string; count: number };

type ArchiveIndexProps = {
  items: ArchiveItem[];
  filters: ArchiveFilter[];
  filter: string;
  onFilterChange: (value: string) => void;
  onSelect: (slug: string) => void;
};

// Índice editorial: no desktop, a foto da obra acompanha o cursor sobre a linha.
export const ArchiveIndex = ({
  items,
  filters,
  filter,
  onFilterChange,
  onSelect,
}: ArchiveIndexProps) => {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 24, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 180, damping: 24, mass: 0.6 });
  const preview = items.find((item) => item.slug === hovered);

  return (
    <section aria-labelledby="arquivo-titulo" className="bg-background py-(--spacing-section)">
      <div className="site-container flex flex-col gap-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="flex flex-col gap-6">
            <span className="text-label text-muted-foreground">Arquivo</span>
            <RevealText
              as="h2"
              text="Mais obras *com Perfect.*"
              className="text-display text-[clamp(2.4rem,5.6vw,6rem)]"
              emphasisClassName="text-graphite-400"
            />
          </div>
          <div role="group" aria-label="Filtrar obras" className="flex flex-wrap gap-2">
            {filters.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onFilterChange(option.value)}
                aria-pressed={filter === option.value}
                className={cn(
                  "rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                  filter === option.value
                    ? "border-graphite-950 bg-graphite-950 text-white"
                    : "border-border text-graphite-600 hover:border-graphite-500",
                )}
              >
                {option.label}
                <span className="ml-1.5 tabular-nums opacity-50">{option.count}</span>
              </button>
            ))}
          </div>
        </div>

        <ul
          className="flex flex-col"
          onMouseMove={(event) => {
            x.set(event.clientX);
            y.set(event.clientY);
          }}
          onMouseLeave={() => setHovered(null)}
        >
          {items.map((item) => (
            <li key={item.slug} className="border-t border-border last:border-b">
              <button
                type="button"
                onClick={() => onSelect(item.slug)}
                onMouseEnter={() => setHovered(item.slug)}
                onFocus={() => setHovered(item.slug)}
                className="group grid w-full grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-[1fr_14rem_5rem_2rem] md:gap-8 md:py-7"
              >
                <span className="relative aspect-square overflow-hidden rounded-[4px] md:hidden">
                  <Picture src={item.image} alt="" width={160} height={160} />
                </span>
                <span className="font-display text-xl font-light tracking-[-0.02em] transition-transform duration-700 ease-glide md:text-[clamp(1.5rem,2.6vw,2.5rem)] md:group-hover:translate-x-3">
                  {item.title}
                  <span className="mt-1 block text-sm text-muted-foreground md:hidden">
                    {[item.place, item.year].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <span className="text-label hidden text-muted-foreground md:block">
                  {item.place ?? "Local não informado"}
                </span>
                <span className="text-label hidden tabular-nums text-muted-foreground md:block">
                  {item.year}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 opacity-40 transition-[opacity,transform] duration-500 ease-glide group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-30 hidden aspect-[4/3] w-[22rem] overflow-hidden rounded-[6px] shadow-[0_40px_80px_-30px_var(--scrim)] md:block"
          style={{ x: springX, y: springY, translateX: "-50%", translateY: "-115%" }}
          initial={false}
          animate={{ opacity: preview ? 1 : 0, scale: preview ? 1 : 0.85 }}
          transition={{ duration: 0.4, ease: EASE_GLIDE }}
        >
          {items.map((item) => (
            <img
              key={item.slug}
              src={item.image}
              alt=""
              loading="lazy"
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-500",
                item.slug === hovered ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </motion.div>
      )}
    </section>
  );
};
