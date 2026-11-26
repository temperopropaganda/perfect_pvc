import { Reveal } from "@src/components/atoms/Reveal";
import { RevealText } from "@src/components/atoms/RevealText";
import { publicUrl } from "@src/lib/public-url";

type QualitySeal = {
  image: string;
  width: number;
  height: number;
  title: string;
  text: string;
};

// Selos do Programa da Qualidade ASPEC PVC: página "Provas de excelência" do catálogo Perfect 2026.
const SEALS: QualitySeal[] = [
  {
    image: "/brand/selos/aspec-associado.png",
    width: 480,
    height: 407,
    title: "Associado ASPEC PVC",
    text: "A Perfect é associada ao Programa da Qualidade da ASPEC PVC e submete seus processos às auditorias do programa.",
  },
  {
    image: "/brand/selos/janela-qualificada.png",
    width: 480,
    height: 433,
    title: "Janela Qualificada",
    text: "Programa que audita a conformidade dos produtos: as esquadrias entregam os mais altos níveis de estanqueidade, permeabilidade e resistência.",
  },
  {
    image: "/brand/selos/perfil-homologado.png",
    width: 480,
    height: 433,
    title: "Perfil Homologado",
    text: "Perfis homologados pelo Programa da Qualidade ASPEC PVC. Os produtos atendem e superam as exigências da NBR 10821 e da NBR 15575.",
  },
];

export const QualitySeals = () => (
  <section className="bg-paper py-(--spacing-section)">
    <div className="site-container flex flex-col gap-14 md:gap-20">
      <RevealText
        as="h2"
        text="Qualidade não é discurso, *é norma.*"
        className="text-title text-[clamp(2rem,4vw,3.75rem)]"
        emphasisClassName="text-graphite-400"
      />

      <ul className="grid gap-4 md:grid-cols-3">
        {SEALS.map((seal, index) => (
          <li key={seal.title}>
            <Reveal
              delay={index * 0.08}
              className="flex h-full flex-col gap-8 rounded-3xl bg-background p-7 md:p-9"
            >
              <img
                src={publicUrl(seal.image)}
                alt={`Selo ${seal.title}`}
                width={seal.width}
                height={seal.height}
                loading="lazy"
                className="h-24 w-auto self-start"
              />
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl font-medium tracking-[-0.02em]">
                  {seal.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{seal.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
