import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import type { PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { AccordionGallery } from "@src/components/molecules/AccordionGallery";

type FeaturedProject = {
  slug: string;
  name: string;
  place: string;
  cover: PictureSource;
};

type FeaturedProjectsProps = {
  items: FeaturedProject[];
};

export const FeaturedProjects = ({ items }: FeaturedProjectsProps) => {
  return (
    <section aria-labelledby="cases-titulo" className="bg-background py-(--spacing-section)">
      <div className="site-container flex flex-col gap-16 md:gap-24">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <RevealText
            as="h2"
            text="Cases"
            className="text-display text-[clamp(2.4rem,6vw,6.5rem)]"
          />
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

        <AccordionGallery
          items={items.map((item) => ({
            photo: item.cover,
            label: item.name,
            detail: item.place,
            href: `/cases#${item.slug}`,
          }))}
          height="clamp(600px, 72svh, 760px)"
          tilt={4}
        />
      </div>
    </section>
  );
};
