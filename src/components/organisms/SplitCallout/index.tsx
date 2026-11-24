import type { ReactNode } from "react";

import type { PictureSource } from "@src/components/atoms/Picture";
import { PillButton } from "@src/components/atoms/PillButton";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";
import { cn } from "@src/lib/utils";

export type CalloutAction = { label: string } & ({ to: string } | { href: string });

type SplitCalloutProps = {
  label: string;
  title: string;
  children: ReactNode;
  photo: PictureSource;
  actions?: CalloutAction[];
  // Foto à direita do texto.
  reverse?: boolean;
  tone?: "light" | "dark";
  // Conteúdo extra abaixo do texto (lista de itens, por exemplo).
  aside?: ReactNode;
};

// Chamada em duas colunas, foto e texto com botões. Usada para showroom, arquitetos e obras
// verticais.
export const SplitCallout = ({
  label,
  title,
  children,
  photo,
  actions = [],
  reverse = false,
  tone = "light",
  aside,
}: SplitCalloutProps) => {
  const dark = tone === "dark";

  return (
    <section
      data-nav={dark ? "dark" : undefined}
      className={cn(
        "overflow-hidden py-(--spacing-section)",
        dark ? "dark bg-background text-foreground" : "bg-background",
      )}
    >
      <div className="site-container grid items-center gap-12 md:grid-cols-12 md:gap-8">
        <RevealImage
          {...photo}
          sizes="(min-width: 768px) 50vw, 100vw"
          from={reverse ? "right" : "left"}
          className={cn("md:col-span-6", reverse && "md:order-2 md:col-start-7")}
          frameClassName="aspect-[4/5] rounded-[20px] md:aspect-[5/6]"
        />
        <div
          className={cn(
            "flex flex-col gap-8 md:col-span-5",
            reverse ? "md:order-1 md:col-start-1" : "md:col-start-8",
          )}
        >
          <span className="text-label text-muted-foreground">{label}</span>
          <RevealText
            as="h2"
            text={title}
            className="text-title text-[clamp(2rem,3.6vw,3.5rem)]"
            emphasisClassName={dark ? "text-gold-300" : "text-graphite-400"}
          />
          <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-muted-foreground">
            {children}
          </div>
          {aside}
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {actions.map((action, index) => {
                const variant = index === 0 ? (dark ? "light" : "primary") : "outline";
                return "to" in action ? (
                  <PillButton key={action.label} to={action.to} variant={variant} size="lg">
                    {action.label}
                  </PillButton>
                ) : (
                  <PillButton
                    key={action.label}
                    href={action.href}
                    variant={variant}
                    size="lg"
                    icon="external"
                  >
                    {action.label}
                  </PillButton>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
