import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import type { PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";
import { cn } from "@src/lib/utils";

type FeaturedProject = {
  slug: string;
  name: string;
  place: string;
  cover: PictureSource;
};

type FeaturedProjectsProps = {
  items: FeaturedProject[];
};

// Composição assimétrica: uma obra grande, uma vertical deslocada e uma média recuada.
const LAYOUT = [
  { wrapper: "md:col-span-7", frame: "aspect-[16/11]" },
  { wrapper: "md:col-span-4 md:col-start-9 md:mt-[22vh]", frame: "aspect-[4/5]" },
  { wrapper: "md:col-span-6 md:col-start-3 md:-mt-[6vh]", frame: "aspect-[3/2]" },
];

export const FeaturedProjects = ({ items }: FeaturedProjectsProps) => {
  return (
    <section aria-labelledby="cases-titulo" className="bg-background py-(--spacing-section)">
      <div className="site-container flex flex-col gap-16 md:gap-24">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="flex flex-col gap-8">
            <span className="text-label text-muted-foreground">Cases</span>
            <RevealText
              as="h2"
              text={"Arquitetura que\n*olha para fora.*"}
              className="text-display text-[clamp(2.4rem,6vw,6.5rem)]"
              emphasisClassName="text-graphite-400"
            />
          </div>
          <Link
            to="/cases"
            className="group inline-flex items-center gap-2 self-start text-sm font-medium md:self-auto"
          >
            <span className="link-line">Ver todos os cases</span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-500 ease-glide group-hover:translate-x-1"
            />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-x-8 md:gap-y-0">
          {items.slice(0, LAYOUT.length).map((item, index) => (
            <li key={item.slug} className={cn(LAYOUT[index]?.wrapper)}>
              <Link to={`/cases#${item.slug}`} className="group flex flex-col gap-5">
                <div className="relative overflow-hidden rounded-[6px]">
                  <RevealImage
                    {...item.cover}
                    sizes="(min-width: 768px) 55vw, 100vw"
                    frameClassName={cn("rounded-[6px]", LAYOUT[index]?.frame)}
                    imageClassName="transition-[scale] duration-[1.4s] ease-glide group-hover:scale-[1.09]"
                    from={index === 1 ? "center" : "bottom"}
                  />
                  <span className="glass dark pointer-events-none absolute bottom-4 left-4 flex translate-y-3 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium text-white opacity-0 transition-[opacity,translate] duration-700 ease-glide group-hover:translate-y-0 group-hover:opacity-100">
                    Ver projeto
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border pt-4">
                  <span className="font-display text-2xl font-light tracking-[-0.02em]">
                    {item.name}
                  </span>
                  <span className="text-label text-muted-foreground">{item.place}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
