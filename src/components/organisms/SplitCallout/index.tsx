import type { ReactNode } from "react";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { PillButton } from "@src/components/atoms/PillButton";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";
import { cn } from "@src/lib/utils";

export type CalloutAction = { label: string } & ({ to: string } | { href: string });

type SplitCalloutProps = {
  label: string;
  title: string;
  // Opcional só na variante "text", que pode ter apenas o título e o botão.
  children?: ReactNode;
  // Obrigatória nas variantes "split" e "banner"; a variante "text" não tem foto.
  photo?: PictureSource;
  actions?: CalloutAction[];
  // Foto à direita do texto (só na variante "split").
  reverse?: boolean;
  tone?: "light" | "dark";
  // half: foto de altura inteira em metade da tela, texto na outra metade. split: foto e texto em
  // duas colunas. banner: foto na metade esquerda, com a borda direita dissolvida no
  // fundo, e o texto à direita. text: só texto, grande.
  variant?: "split" | "banner" | "half" | "text" | "backdrop";
  // Conteúdo extra abaixo do texto (lista de itens, por exemplo).
  aside?: ReactNode;
};

type ActionsProps = { actions: CalloutAction[]; dark: boolean };

const Actions = ({ actions, dark }: ActionsProps) => (
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
);

// Chamada com texto e botões. Usada para showroom, arquitetos e obras verticais.
export const SplitCallout = ({
  label,
  title,
  children,
  photo,
  actions = [],
  reverse = false,
  tone = "light",
  variant = "split",
  aside,
}: SplitCalloutProps) => {
  const dark = tone === "dark";
  const emphasis = dark ? "text-gold-300" : "text-graphite-400";

  if (variant === "text") {
    return (
      <section
        data-nav={dark ? "dark" : undefined}
        className={cn(
          "overflow-hidden py-[clamp(6rem,16svh,12rem)]",
          dark ? "dark bg-background text-foreground" : "bg-background",
        )}
      >
        <div className="site-container flex flex-col gap-10 md:gap-14">
          <span className="text-label text-muted-foreground">{label}</span>
          <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-8">
            <RevealText
              as="h2"
              text={title}
              className="text-display max-w-[14ch] text-[clamp(3rem,9vw,9.5rem)] md:col-span-8"
              emphasisClassName={emphasis}
            />
            {children && (
              <div className="flex flex-col gap-5 text-[clamp(1.1rem,1.5vw,1.4rem)] leading-relaxed text-muted-foreground md:col-span-4 md:pb-4">
                {children}
              </div>
            )}
          </div>
          {aside}
          {actions.length > 0 && <Actions actions={actions} dark={dark} />}
        </div>
      </section>
    );
  }

  if (variant === "backdrop" && photo) {
    return (
      <section data-nav="dark" className="dark relative overflow-hidden bg-scrim text-foreground">
        <Picture
          {...photo}
          alt=""
          sizes="100vw"
          className="absolute inset-0"
          style={{ filter: "blur(4px)", transform: "scale(1.04)" }}
        />
        <span aria-hidden="true" className="absolute inset-0 bg-scrim/65" />
        <div className="site-container relative flex min-h-[88svh] items-center py-24">
          <div className="flex max-w-[40rem] flex-col gap-8">
            <span className="text-label text-graphite-300">{label}</span>
            <RevealText
              as="h2"
              text={title}
              className="text-display text-[clamp(2.6rem,5.6vw,5.5rem)] text-white"
              emphasisClassName="text-gold-300"
            />
            <div className="flex flex-col gap-5 text-[clamp(1.05rem,1.4vw,1.25rem)] leading-relaxed text-graphite-200">
              {children}
            </div>
            {aside}
            {actions.length > 0 && <Actions actions={actions} dark />}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "half" && photo) {
    return (
      <section
        data-nav={dark ? "dark" : undefined}
        className={cn(
          "relative overflow-hidden",
          dark ? "dark bg-background text-foreground" : "bg-background",
        )}
      >
        <div
          className={cn(
            "relative aspect-[4/3] md:absolute md:inset-y-0 md:aspect-auto md:w-1/2",
            reverse ? "md:right-0" : "md:left-0",
          )}
        >
          <Picture
            {...photo}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="absolute inset-0 md:object-[35%_50%]"
          />
        </div>
        <div className="site-container relative grid py-16 md:min-h-[100svh] md:grid-cols-2 md:items-center md:py-24">
          <div
            className={cn(
              "flex flex-col gap-8 md:max-w-[34rem]",
              reverse ? "md:col-start-1 md:pr-8" : "md:col-start-2 md:pl-[4vw]",
            )}
          >
            <span className="text-label text-muted-foreground">{label}</span>
            <RevealText
              as="h2"
              text={title}
              className="text-title text-[clamp(2rem,3.6vw,3.5rem)]"
              emphasisClassName={emphasis}
            />
            <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-muted-foreground">
              {children}
            </div>
            {aside}
            {actions.length > 0 && <Actions actions={actions} dark={dark} />}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "banner" && photo) {
    return (
      <section
        data-nav={dark ? "dark" : undefined}
        className={cn(
          "relative overflow-hidden",
          dark ? "dark bg-background text-foreground" : "bg-background",
        )}
      >
        <div className="relative aspect-[4/3] md:absolute md:inset-y-0 md:left-0 md:aspect-auto md:w-[58%]">
          <Picture {...photo} sizes="(min-width: 768px) 58vw, 100vw" className="absolute inset-0" />
        </div>
        {/* O degradê só disfarça a borda da foto: ela parece continuar por baixo do branco. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-[44%] hidden w-[14%] bg-linear-to-r from-transparent to-background md:block"
        />
        <div className="site-container relative grid py-16 md:min-h-[105svh] md:grid-cols-12 md:items-center md:py-24">
          <div className="flex flex-col gap-8 md:col-span-5 md:col-start-8 md:pl-[4vw]">
            <span className="text-label text-muted-foreground">{label}</span>
            <RevealText
              as="h2"
              text={title}
              className="text-title text-[clamp(2rem,3.6vw,3.5rem)]"
              emphasisClassName={emphasis}
            />
            <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-muted-foreground">
              {children}
            </div>
            {aside}
            {actions.length > 0 && <Actions actions={actions} dark={dark} />}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      data-nav={dark ? "dark" : undefined}
      className={cn(
        "overflow-hidden py-(--spacing-section)",
        dark ? "dark bg-background text-foreground" : "bg-background",
      )}
    >
      <div className="site-container grid items-center gap-12 md:grid-cols-12 md:gap-8">
        {photo && (
          <RevealImage
            {...photo}
            sizes="(min-width: 768px) 50vw, 100vw"
            from={reverse ? "right" : "left"}
            className={cn("md:col-span-6", reverse && "md:order-2 md:col-start-7")}
            frameClassName="aspect-[4/5] rounded-[20px] md:aspect-[5/6]"
          />
        )}
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
            emphasisClassName={emphasis}
          />
          <div className="flex flex-col gap-5 text-[17px] leading-relaxed text-muted-foreground">
            {children}
          </div>
          {aside}
          {actions.length > 0 && <Actions actions={actions} dark={dark} />}
        </div>
      </div>
    </section>
  );
};
