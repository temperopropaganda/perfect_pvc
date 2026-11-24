import { Droplets, Layers, Leaf, ShieldCheck, Wind, type LucideIcon } from "lucide-react";

import { Reveal } from "@src/components/atoms/Reveal";
import { publicUrl } from "@src/lib/public-url";

type Performance = {
  icon: LucideIcon;
  value: string;
  label: string;
  norm: string;
};

type Feature = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const PERFORMANCE: Performance[] = [
  { icon: Wind, value: "Classe 4", label: "Permeabilidade ao ar", norm: "UNE-EN 12207" },
  { icon: Droplets, value: "E750", label: "Estanqueidade à água", norm: "UNE-EN 12208" },
  { icon: ShieldCheck, value: "Classe 5", label: "Resistência ao vento", norm: "UNE-EN 12211" },
];

const FEATURES: Feature[] = [
  {
    icon: Layers,
    title: "Perfis multicâmara",
    text: "Reforço em aço galvanizado e solda por termofusão.",
  },
  { icon: Leaf, title: "PVC reciclável", text: "Fórmula livre de chumbo, com aditivo anti-UV." },
];

export const PerformanceSection = () => {
  return (
    <section
      data-nav="dark"
      aria-labelledby="desempenho-titulo"
      className="dark relative overflow-hidden bg-background py-24 text-foreground md:py-36"
    >
      <img
        src={publicUrl("/images/acervo/perfil-detalhe-2400.webp")}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <span className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/70 to-night" />

      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-14 px-5 md:px-8">
        <h2
          id="desempenho-titulo"
          className="text-title max-w-[14ch] text-[clamp(2.2rem,4.6vw,4.25rem)] text-white"
        >
          Classe máxima onde importa.
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {PERFORMANCE.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.label}
                delay={index * 0.08}
                className="glass-dark flex flex-col gap-10 rounded-3xl p-7 text-white"
              >
                <Icon aria-hidden="true" className="size-7 text-gold-300" />
                <div className="flex flex-col gap-1">
                  <span className="font-display text-[clamp(1.9rem,3vw,2.6rem)] font-light leading-[1.05] tracking-[-0.04em]">
                    {item.label}
                  </span>
                  <span className="mt-2 font-display text-lg text-gold-300">{item.value}</span>
                  <span className="text-sm text-white/55">{item.norm}</span>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-white/15 pt-10 md:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex items-start gap-4 text-white">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="font-display text-lg font-semibold">{feature.title}</span>
                  <span className="text-white/70">{feature.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
