import { ArrowUpRight } from "lucide-react";

import type { CSSProperties } from "react";

import type { PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";
import { cn } from "@src/lib/utils";

type ChapterProject = {
  slug: string;
  name: string;
  place: string;
  photos: PictureSource[];
};

type ProjectChapterProps = {
  project: ChapterProject;
  // As duas fotos da composição, na ordem: principal (larga) e secundária.
  picks: [PictureSource, PictureSource];
  // Inverte o lado da foto larga, para os capítulos alternarem.
  reverse?: boolean;
  onOpen: (photoIndex: number) => void;
};
// Altura das fotos no desktop (svh) e proporção dos quadros no mobile (largura / altura).
const DESKTOP_HEIGHT = 86;
const MOBILE_RATIO = { main: 3 / 2, secondary: 4 / 5 };

// As fotos preenchem o quadro com object-cover: uma foto horizontal num quadro alto fica bem
// mais larga que a coluna. O sizes informa essa largura real, para o navegador baixar a versão
// que não perde nitidez.
const coverSizes = (photo: PictureSource, columnVw: number, mobileRatio: number) => {
  const ratio = photo.width / photo.height;
  const desktop = `max(${columnVw}vw, ${Math.round(DESKTOP_HEIGHT * ratio)}svh)`;
  const mobile = `${Math.max(100, Math.round((100 / mobileRatio) * ratio))}vw`;
  return `(min-width: 768px) ${desktop}, ${mobile}`;
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
      className="h-full"
      frameClassName={frameClassName}
      imageClassName="transition-[scale] duration-[1.4s] ease-glide group-hover/zoom:scale-[1.08]"
    />
  </button>
);

// Capítulo de um projeto: nome e local, duas fotos de ponta a ponta da tela e o acesso à galeria.
export const ProjectChapter = ({
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

  return (
    <article
      id={project.slug}
      aria-labelledby={`${project.slug}-titulo`}
      className="scroll-mt-28 py-[clamp(3.5rem,7vw,7rem)]"
    >
      <header className="site-container flex flex-col gap-3 pb-8 md:flex-row md:items-end md:justify-between md:gap-8 md:pb-12">
        <div id={`${project.slug}-titulo`}>
          <RevealText
            as="h2"
            text={project.name}
            className="text-title text-[clamp(2.2rem,5vw,5rem)]"
          />
        </div>
        <span className="text-label text-muted-foreground md:pb-3">{project.place}</span>
      </header>

      <div
        style={{ "--chapter-height": DESKTOP_HEIGHT } as CSSProperties}
        className={cn(
          "grid grid-cols-1 gap-1.5 md:h-[calc(var(--chapter-height)*1svh)] md:gap-2",
          reverse ? "md:grid-cols-[2fr_3fr]" : "md:grid-cols-[3fr_2fr]",
        )}
      >
        <ZoomButton
          photo={main}
          onClick={() => openPhoto(main)}
          sizes={coverSizes(main, 60, MOBILE_RATIO.main)}
          from={reverse ? "right" : "left"}
          frameClassName="aspect-[3/2] md:aspect-auto md:h-full"
          className={cn("md:h-full", reverse && "md:order-2")}
        />
        <ZoomButton
          photo={secondary}
          onClick={() => openPhoto(secondary)}
          sizes={coverSizes(secondary, 40, MOBILE_RATIO.secondary)}
          from="bottom"
          frameClassName="aspect-[4/5] md:aspect-auto md:h-full"
          className={cn("md:h-full", reverse && "md:order-1")}
        />
      </div>

      <div className="site-container flex justify-end pt-6 md:pt-8">
        <button
          type="button"
          onClick={() => onOpen(0)}
          className="group inline-flex items-center gap-1.5 text-sm font-medium underline decoration-graphite-400 decoration-1 underline-offset-[6px] transition-colors duration-300 hover:decoration-current"
        >
          Ver as {project.photos.length} fotos
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-500 ease-glide group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </article>
  );
};
