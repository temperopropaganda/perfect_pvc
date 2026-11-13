import { ArrowUpRight, Images } from "lucide-react";

import type { PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";
import { cn } from "@src/lib/utils";

type ChapterProject = {
  slug: string;
  name: string;
  title?: string;
  place: string;
  year?: number;
  summary?: string;
  products: string[];
  photos: PictureSource[];
  pendingInfo: boolean;
};

type ProjectChapterProps = {
  index: number;
  project: ChapterProject;
  // As duas fotos da composição, na ordem: principal e secundária.
  picks: [PictureSource, PictureSource];
  reverse?: boolean;
  onOpen: (photoIndex: number) => void;
};

const ZoomButton = ({
  photo,
  onClick,
  className,
  frameClassName,
  sizes,
  from,
}: {
  photo: PictureSource;
  onClick: () => void;
  className?: string;
  frameClassName: string;
  sizes: string;
  from: "bottom" | "center" | "left" | "right";
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Ampliar foto: ${photo.alt}`}
    className={cn("group/zoom relative block w-full cursor-zoom-in text-left", className)}
  >
    <RevealImage
      {...photo}
      sizes={sizes}
      from={from}
      frameClassName={frameClassName}
      imageClassName="transition-[scale] duration-[1.4s] ease-glide group-hover/zoom:scale-[1.08]"
    />
  </button>
);

export const ProjectChapter = ({
  index,
  project,
  picks,
  reverse = false,
  onOpen,
}: ProjectChapterProps) => {
  const [main, secondary] = picks;
  const openPhoto = (photo: PictureSource) =>
    onOpen(
      Math.max(
        0,
        project.photos.findIndex((item) => item.src === photo.src),
      ),
    );
  const heading = project.title ?? project.name;

  return (
    <article
      id={project.slug}
      data-project-chapter={project.slug}
      aria-labelledby={`${project.slug}-titulo`}
      className="scroll-mt-28 py-[clamp(4rem,9vw,9rem)]"
    >
      <div className="site-container flex flex-col gap-10 md:gap-14">
        <header className="grid gap-6 border-t border-border pt-6 md:grid-cols-12">
          <span className="text-label text-muted-foreground md:col-span-2">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div id={`${project.slug}-titulo`} className="flex flex-col gap-3 md:col-span-7">
            <RevealText
              as="h2"
              text={heading}
              className="text-title text-[clamp(2.2rem,5vw,5rem)]"
            />
            {project.title && (
              <span className="font-display text-lg font-light text-muted-foreground">
                {project.name}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 md:col-span-3 md:items-end md:text-right">
            <span className="text-label">{project.place}</span>
            {project.year && (
              <span className="text-label text-muted-foreground">{project.year}</span>
            )}
            {project.pendingInfo && (
              <span className="text-label mt-2 self-start rounded-full border border-dashed md:self-end border-graphite-400 px-3 py-1.5 text-graphite-500">
                Texto em validação
              </span>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          <ZoomButton
            photo={main}
            onClick={() => openPhoto(main)}
            sizes="(min-width: 768px) 62vw, 100vw"
            from={reverse ? "right" : "left"}
            frameClassName="aspect-[3/2] rounded-[6px]"
            className={cn("md:col-span-8", reverse && "md:order-2 md:col-start-5")}
          />
          <div
            className={cn(
              "flex flex-col justify-between gap-8 md:col-span-4",
              reverse && "md:order-1 md:col-start-1",
            )}
          >
            <ZoomButton
              photo={secondary}
              onClick={() => openPhoto(secondary)}
              sizes="(min-width: 768px) 30vw, 100vw"
              from="bottom"
              frameClassName="aspect-[4/5] rounded-[6px]"
            />
            <div className="flex flex-col gap-5">
              {project.summary && (
                <p className="text-[17px] leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>
              )}
              {project.products.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {project.products.map((product) => (
                    <li
                      key={product}
                      className="rounded-full border border-border px-3 py-1 text-xs text-graphite-600"
                    >
                      {product}
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => onOpen(0)}
                className="group inline-flex items-center gap-3 self-start rounded-full bg-graphite-950 py-2.5 pl-4 pr-5 text-sm font-medium text-white transition-colors duration-500 hover:bg-blue-700"
              >
                <Images aria-hidden="true" className="size-4" />
                Ver as {project.photos.length} fotos
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-500 ease-glide group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
