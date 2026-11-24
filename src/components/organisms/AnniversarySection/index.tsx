import { ArrowUpRight } from "lucide-react";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";

type AnniversaryLink = { label: string; href: string };

type AnniversarySectionProps = {
  photo: PictureSource;
  links: AnniversaryLink[];
};

// Os 10 anos da Perfect (maio de 2026). Fotos e vídeo do evento ainda estão só no Instagram.
export const AnniversarySection = ({ photo, links }: AnniversarySectionProps) => (
  <section
    data-nav="dark"
    className="dark overflow-hidden bg-background py-(--spacing-section) text-foreground"
  >
    <div className="site-container grid gap-14 md:grid-cols-12 md:items-center md:gap-8">
      <div className="flex flex-col gap-8 md:col-span-5">
        <span className="text-label text-graphite-300">2016 · 2026</span>
        <p
          aria-hidden="true"
          className="font-display text-[clamp(7rem,18vw,15rem)] font-extralight leading-[0.8] tracking-[-0.07em] text-gold-300"
        >
          10
        </p>
        <RevealText
          as="h2"
          text="Dez anos construindo *hoje para o amanhã.*"
          className="text-title text-[clamp(2rem,3.4vw,3.25rem)] text-white"
          emphasisClassName="text-gold-300"
        />
        <p className="max-w-[44ch] text-[17px] leading-relaxed text-graphite-300">
          Em maio de 2026 a Perfect celebrou dez anos com clientes, parceiros e equipe. Na festa, a
          Kömmerling homenageou a parceria com uma placa: “celebramos 10 anos de uma parceria sólida
          e inspiradora”.
        </p>
        <ul className="flex flex-col border-t border-white/15">
          {links.map((link) => (
            <li key={link.href} className="border-b border-white/15">
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between py-4 text-white"
              >
                <span>{link.label}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-500 ease-glide group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] md:col-span-6 md:col-start-7">
        <Picture {...photo} sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
    </div>
  </section>
);
