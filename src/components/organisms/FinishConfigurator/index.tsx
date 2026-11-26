import { DoorClosed, DoorOpen } from "lucide-react";
import { useState } from "react";

import { FinishSwatch } from "@src/components/atoms/FinishSwatch";
import { OpeningIcon } from "@src/components/atoms/OpeningIcon";
import { Reveal } from "@src/components/atoms/Reveal";
import { WindowPreview, type WindowSystemType } from "@src/components/molecules/WindowPreview";
import { cn } from "@src/lib/utils";

export type FinishOption = {
  slug: string;
  name: string;
  description: string;
};

type FinishConfiguratorProps = {
  finishes: FinishOption[];
  // Cores sob consulta, sem amostra no configurador.
  others?: string[];
};

const SYSTEMS: { type: WindowSystemType; name: string; detail: string }[] = [
  { type: "giro", name: "Giro", detail: "Abre para dentro sobre dobradiças laterais." },
  {
    type: "oscilo-batente",
    name: "Oscilo-batente",
    detail: "Gira como o giro ou tomba no topo para ventilar.",
  },
  { type: "correr", name: "Correr", detail: "Duas folhas deslizam em trilhos paralelos." },
  { type: "maxim-ar", name: "Maxim-ar", detail: "Projeta para fora a partir do topo." },
  { type: "pivotante", name: "Pivotante", detail: "Gira sobre um eixo vertical central." },
];

const VIEW_PHOTO = "/images/cases/lar-apaixonar.webp";

// Monte a sua: escolha o sistema e a cor; o botão "Ver abertura" mostra o movimento.
export const FinishConfigurator = ({ finishes, others = [] }: FinishConfiguratorProps) => {
  const [system, setSystem] = useState<WindowSystemType>("giro");
  const [finishSlug, setFinishSlug] = useState(finishes[0]?.slug ?? "");
  const [open, setOpen] = useState(false);
  const finish = finishes.find((item) => item.slug === finishSlug) ?? finishes[0];
  const current = SYSTEMS.find((item) => item.type === system) ?? SYSTEMS[0];
  const openLabel = open ? "Fechar janela" : "Ver abertura";

  const selectSystem = (type: WindowSystemType) => {
    setSystem(type);
    setOpen(false);
  };

  return (
    <section aria-labelledby="configurador-titulo" className="bg-card py-24 md:py-36">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-5 md:grid-cols-2 md:gap-20 md:px-8">
        <div className="@container relative aspect-square overflow-hidden rounded-[28px] bg-paper-deep">
          <div
            role="img"
            aria-label={`Janela ${current?.name ?? ""} com perfil ${finish?.name ?? ""}`}
            className="absolute inset-0"
          >
            <WindowPreview
              system={system}
              finish={finish?.slug ?? ""}
              view={VIEW_PHOTO}
              open={open}
            />
          </div>
          <div className="absolute inset-x-3 bottom-3 flex items-end gap-2 @lg:inset-x-4 @lg:bottom-4">
            <div
              aria-live="polite"
              className="glass flex min-w-0 flex-col rounded-2xl px-3.5 py-2.5 @lg:px-4 @lg:py-3"
            >
              <span className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase @lg:text-xs">
                {current?.name} · {finish?.name}
              </span>
              <span className="font-display text-[15px] leading-snug font-light tracking-[-0.02em] @lg:text-lg">
                {finish?.description}
              </span>
            </div>
            <button
              type="button"
              title={openLabel}
              onClick={() => setOpen((value) => !value)}
              className="glass ml-auto flex size-11 shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium transition-transform duration-300 ease-glide hover:-translate-y-0.5 @lg:w-auto @lg:pr-4 @lg:pl-3.5"
            >
              {open ? (
                <DoorClosed aria-hidden="true" className="size-4" />
              ) : (
                <DoorOpen aria-hidden="true" className="size-4" />
              )}
              <span className="sr-only @lg:not-sr-only">{openLabel}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <Reveal className="flex flex-col gap-4">
            <h2 id="configurador-titulo" className="text-title text-[clamp(2.2rem,4.4vw,4rem)]">
              Veja a sua janela na cor do projeto.
            </h2>
          </Reveal>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-sm font-semibold">Sistema</legend>
            <div className="flex flex-wrap gap-2">
              {SYSTEMS.map((item) => {
                const active = item.type === system;
                return (
                  <button
                    key={item.type}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectSystem(item.type)}
                    className={cn(
                      "group flex h-12 items-center gap-2.5 rounded-full border pr-4 pl-2 text-[15px] font-medium transition-colors duration-300",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-foreground/30",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full",
                        active ? "bg-white/15" : "bg-muted",
                      )}
                    >
                      <OpeningIcon type={item.type} className="size-5" />
                    </span>
                    {item.name}
                  </button>
                );
              })}
            </div>
            <p aria-live="polite" className="mt-1 text-sm text-muted-foreground">
              {current?.detail}
            </p>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-sm font-semibold">Cor do perfil</legend>
            <div className="flex flex-wrap gap-4">
              {finishes.map((item) => {
                const active = item.slug === finishSlug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    aria-pressed={active}
                    aria-label={item.name}
                    onClick={() => setFinishSlug(item.slug)}
                    className="group flex flex-col items-center gap-2"
                  >
                    <FinishSwatch
                      finish={item.slug}
                      className={cn(
                        "size-12 outline-2 outline-offset-4 outline-transparent transition-[translate,outline-color] duration-300 ease-glide group-hover:-translate-y-0.5",
                        active && "outline-primary",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[13px]",
                        active ? "font-semibold" : "text-muted-foreground",
                      )}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Tons ilustrativos. Confira no mostruário.
            </p>
          </fieldset>
          {others.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-border pt-6">
              <span className="text-label text-muted-foreground">Outras possibilidades</span>
              <p className="text-sm leading-relaxed text-muted-foreground">{others.join(" · ")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
