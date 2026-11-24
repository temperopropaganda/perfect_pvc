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

      <div className="grid gap-3 md:grid-cols-12 md:gap-2.5">
        <RevealImage
          {...photos[0]}
          sizes="(min-width: 768px) 58vw, 100vw"
          from="bottom"
          className="md:col-span-7"
          frameClassName="aspect-[4/3] rounded-[20px] md:aspect-auto md:h-full"
        />
        <RevealImage
          {...photos[1]}
          sizes="(min-width: 768px) 40vw, 100vw"
          from="top"
          className="md:col-span-5"
          frameClassName="aspect-[3/4] rounded-[20px]"
        />
      </div>

      <ul className="grid gap-x-8 gap-y-10 border-t border-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-5">
        {PILLARS.map((pillar, index) => (
          <li key={pillar.title}>
            <Reveal delay={index * 0.06} className="flex flex-col gap-3">
              <span className="text-label text-gold-300">0{index + 1}</span>
              <h3 className="font-display text-lg font-medium text-white">{pillar.title}</h3>
              <p className="text-sm leading-relaxed text-graphite-300">{pillar.text}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
