import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";

type AnniversarySectionProps = {
  photo: PictureSource;
};

// Os 10 anos da Perfect (maio de 2026).
export const AnniversarySection = ({ photo }: AnniversarySectionProps) => (
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
          text="Dez anos *e muita história pela frente.*"
          className="text-title text-[clamp(2rem,3.4vw,3.25rem)] text-white"
          emphasisClassName="text-gold-300"
        />
        <p className="max-w-[44ch] text-[17px] leading-relaxed text-graphite-300">
          Em maio de 2026 a Perfect celebrou dez anos com clientes, parceiros e equipe. Na festa, a
          Kömmerling homenageou a parceria com uma placa: “celebramos 10 anos de uma parceria sólida
          e inspiradora”.
        </p>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] md:col-span-6 md:col-start-7">
        <Picture {...photo} sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
    </div>
  </section>
);
