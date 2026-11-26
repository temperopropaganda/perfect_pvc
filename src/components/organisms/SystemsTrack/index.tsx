import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { gsap, useGSAP } from "@src/lib/gsap";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

type SystemItem = {
  slug: string;
  name: string;
  summary: string;
  photo: PictureSource;
};

type SystemsTrackProps = {
  items: SystemItem[];
};

// No desktop, a rolagem vertical move a faixa de sistemas na horizontal (seção fixa).
// Cards em retrato (2:3): no desktop a altura da foto é --system-card-height e a largura deriva dela.
export const SystemsTrack = ({ items }: SystemsTrackProps) => {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !track.current) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const distance = () => (track.current?.scrollWidth ?? 0) - window.innerWidth;
        const move = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-system-media]").forEach((media) => {
          gsap.fromTo(
            media,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: media.parentElement,
                containerAnimation: move,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="sistemas-titulo"
      className="overflow-hidden bg-graphite-100 py-24 [--system-card-height:64svh] lg:flex lg:h-[100svh] lg:items-center lg:py-0"
    >
      <div
        ref={track}
        className="flex w-max items-end gap-5 px-(--spacing-gutter) max-lg:w-full max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-(--spacing-gutter) max-lg:overflow-x-auto max-lg:pb-4 max-lg:[scrollbar-width:none] lg:gap-8"
      >
        <div className="flex w-[78vw] shrink-0 snap-start flex-col gap-8 self-stretch pr-6 sm:w-[46vw] lg:w-[32vw] lg:justify-between lg:py-[14svh]">
          <span className="text-label text-muted-foreground">Sistemas</span>
          <div className="flex flex-col gap-8">
            <RevealText
              as="h2"
              text={"Uma esquadria\npara cada vão."}
              className="text-display text-[clamp(2.4rem,4.6vw,5rem)]"
            />
            <p className="max-w-[34ch] text-muted-foreground">
              Perfis Kömmerling de múltiplas câmaras, soldados nos cantos por termofusão e
              reforçados com aço galvanizado.
            </p>
            <Link
              to="/produtos"
              className="group inline-flex items-center gap-2 self-start text-sm font-medium text-blue-700"
            >
              <span className="link-line">Ver todos os produtos</span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-500 ease-glide group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {items.map((item, index) => (
          <Link
            key={item.slug}
            to={`/produtos?produto=${item.slug}`}
            className="group flex w-[64vw] shrink-0 snap-start flex-col gap-5 sm:w-[38vw] lg:w-[calc(var(--system-card-height)*2/3)]"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-[6px] bg-graphite-300">
              <div data-system-media className="absolute -inset-x-[10%] inset-y-0">
                <Picture
                  {...item.photo}
                  sizes="(min-width: 1024px) 30vw, 64vw"
                  className="transition-transform duration-[1.4s] ease-glide group-hover:scale-[1.05]"
                />
              </div>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-blue-700 pt-4">
              <div className="flex flex-col gap-1">
                <span className="font-display text-2xl font-light tracking-[-0.02em]">
                  {item.name}
                </span>
                <span className="text-sm text-muted-foreground">{item.summary}</span>
              </div>
              <span className="text-label pt-2 text-graphite-400">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </Link>
        ))}
        <span aria-hidden="true" className="w-[4vw] shrink-0" />
      </div>
    </section>
  );
};
