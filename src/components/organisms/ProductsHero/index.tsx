import { BlurText } from "@src/components/atoms/BlurText";
import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { Reveal } from "@src/components/atoms/Reveal";

// Abertura escura da página de produtos: foto noturna ao fundo, e corte seco no branco do catálogo.
type ProductsHeroProps = { photo: PictureSource };

export const ProductsHero = ({ photo }: ProductsHeroProps) => (
  <section
    data-nav="dark"
    className="dark relative flex min-h-[110svh] items-end overflow-hidden bg-scrim pb-[26svh] pt-40 text-foreground md:pb-[30svh]"
  >
    <Picture {...photo} alt="" priority sizes="100vw" className="absolute inset-0" />
    <span aria-hidden="true" className="absolute inset-0 bg-scrim/60" />

    <div className="site-container relative flex flex-col gap-6">
      <BlurText
        as="h1"
        text="Uma esquadria para cada vão."
        animateBy="words"
        trigger="load"
        stepDuration={0.24}
        delay={90}
        className="text-display max-w-[14ch] text-[clamp(2.8rem,6.4vw,6.5rem)] text-white"
      />
      <Reveal delay={0.5}>
        <p className="max-w-[40ch] text-lg leading-relaxed text-graphite-200">
          Janelas, portas e acessórios com perfis Kömmerling. Limpeza só com água e sabão neutro.
        </p>
      </Reveal>
    </div>
  </section>
);
