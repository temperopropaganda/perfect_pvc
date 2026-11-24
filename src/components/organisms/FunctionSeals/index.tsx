import {
  AudioLines,
  Droplets,
  Recycle,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@src/components/atoms/Reveal";
import { RevealText } from "@src/components/atoms/RevealText";

type Seal = {
  icon: LucideIcon;
  title: string;
  text: string;
};

// Selos de função dos perfis: página 11 do catálogo Perfect 2026.
const SEALS: Seal[] = [
  {
    icon: AudioLines,
    title: "Termoacústica",
    text: "Redução significativa de ruídos externos e menor troca de calor.",
  },
  {
    icon: Droplets,
    title: "Estanqueidade",
    text: "Cantos soldados impedem a entrada de água e vento.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança",
    text: "Perfis robustos e estrutura interna em aço galvanizado.",
  },
  {
    icon: Sparkles,
    title: "Manutenção",
    text: "Não precisa de pintura ou verniz. Basta água e sabão neutro.",
  },
  {
    icon: Recycle,
    title: "Sustentabilidade",
    text: "Material 100% reciclável e livre de chumbo (fórmula Greenline).",
  },
];

export const FunctionSeals = () => (
  <section className="bg-paper py-(--spacing-section)">
    <div className="site-container flex flex-col gap-14 md:gap-20">
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <span className="text-label text-muted-foreground md:col-span-3">Em cada perfil</span>
        <RevealText
          as="h2"
          text="Cinco motivos para *viver com PVC.*"
          className="text-title text-[clamp(2rem,4vw,3.75rem)] md:col-span-9"
          emphasisClassName="text-graphite-400"
        />
      </div>

      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-5">
        {SEALS.map((seal, index) => {
          const Icon = seal.icon;
          return (
            <li key={seal.title} className="bg-paper">
              <Reveal delay={index * 0.06} className="flex h-full flex-col gap-10 p-7 md:p-8">
                <span className="flex size-12 items-center justify-center rounded-full bg-blue-700 text-white">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-xl font-medium tracking-[-0.02em]">
                    {seal.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">{seal.text}</p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);
