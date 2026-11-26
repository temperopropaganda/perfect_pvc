import type { PictureSource } from "@src/components/atoms/Picture";
import { PillButton } from "@src/components/atoms/PillButton";
import { Reveal } from "@src/components/atoms/Reveal";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";

type VerticalEngineeringProps = {
  photos: [PictureSource, PictureSource];
  contactUrl: string;
};

// Páginas "Engenharia em PVC para projetos verticais" do catálogo Perfect 2026.
const PILLARS = [
  {
    title: "Padronização em larga escala",
    text: "Processos automatizados garantem uniformidade milimétrica em lotes de alto volume.",
  },
  {
    title: "Engenharia simultânea",
    text: "Suporte técnico direto com a equipe da obra para compatibilização de projetos e otimização de vãos.",
  },
  {
    title: "Desempenho a longo prazo",
    text: "Perfis com aditivos anti-UV reduzem drasticamente a necessidade de manutenção nas fachadas.",
  },
  {
    title: "Logística otimizada",
    text: "Planejamento de entregas e instalação alinhado ao avanço físico do edifício.",
  },
  {
    title: "Adequação normativa",
    text: "Soluções desenvolvidas para cumprir e superar as exigências da Norma de Desempenho NBR 15575.",
  },
];

export const VerticalEngineering = ({ photos, contactUrl }: VerticalEngineeringProps) => (
  <section
    id="projetos-verticais"
    data-nav="dark"
    className="dark overflow-hidden bg-background py-(--spacing-section) text-foreground"
  >
    <div className="site-container flex flex-col gap-16 md:gap-24">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-8 md:col-span-6">
          <span className="text-label text-graphite-300">Construtoras e incorporadoras</span>
          <RevealText
            as="h2"
            text="Engenharia em PVC para *projetos verticais.*"
            className="text-display text-[clamp(2.4rem,5vw,5rem)] text-white"
            emphasisClassName="text-gold-300"
          />
        </div>
        <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-graphite-300 md:col-span-5 md:col-start-8 md:self-end">
          <p>
            Obras verticais exigem rigor técnico e precisão na entrega. A Perfect atua como parceira
            de construtoras e escritórios de arquitetura no fornecimento de esquadrias de alto
            desempenho para edifícios residenciais e corporativos.
          </p>
          <p>
            Nossa operação é dimensionada para absorver grandes volumes com padronização absoluta:
            cada peça mantém o isolamento acústico e a resistência estrutural do protótipo aprovado.
          </p>
          <PillButton
            href={contactUrl}
            variant="light"
            size="lg"
            icon="external"
            className="self-start"
          >
            Falar com a engenharia
          </PillButton>
        </div>
      </div>
    </div>

    {/* Mesma largura da lista de pilares: as fotos vazam da margem padrão e alinham com ela. */}
    <div className="mx-auto mt-16 grid max-w-[1760px] grid-cols-1 gap-3 px-(--spacing-gutter) md:mt-24 md:grid-cols-[2fr_3fr] md:gap-5">
      <RevealImage
        {...photos[0]}
        sizes="(min-width: 768px) 40vw, 100vw"
        from="bottom"
        className="md:h-[min(86svh,56rem)]"
        frameClassName="aspect-[4/5] rounded-[6px] md:aspect-auto md:h-full"
      />
      <RevealImage
        {...photos[1]}
        sizes="(min-width: 768px) 62vw, 100vw"
        from="top"
        className="md:h-[min(86svh,56rem)]"
        frameClassName="aspect-[4/5] rounded-[6px] md:aspect-auto md:h-full"
      />
    </div>

    <ul className="mx-auto mt-24 grid max-w-[1760px] gap-x-[clamp(2rem,4vw,5rem)] gap-y-14 px-(--spacing-gutter) sm:grid-cols-2 lg:mt-28 lg:grid-cols-5">
      {PILLARS.map((pillar, index) => (
        <li key={pillar.title}>
          <Reveal
            delay={index * 0.06}
            className="flex h-full flex-col gap-5 border-t border-gold-300/50 pt-6"
          >
            <h3 className="font-display text-[clamp(1.3rem,1.6vw,1.75rem)] font-light leading-snug tracking-[-0.02em] text-white">
              {pillar.title}
            </h3>
            <p className="text-base leading-relaxed text-graphite-300">{pillar.text}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  </section>
);
