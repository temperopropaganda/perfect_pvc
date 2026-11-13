import { PillButton } from "@src/components/atoms/PillButton";
import { Reveal } from "@src/components/atoms/Reveal";

type CtaAction = {
  label: string;
  href: string;
};

type CtaBandProps = {
  title: string;
  primary: CtaAction;
  secondary: CtaAction;
};

// Bloco sálvia com o contorno das duas molduras do símbolo, como a capa do catálogo.
export const CtaBand = ({ title, primary, secondary }: CtaBandProps) => {
  return (
    <section className="bg-background px-3 py-20 md:px-6 md:py-28">
      <Reveal className="relative mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 overflow-hidden rounded-[28px] bg-ice px-6 py-12 text-brand-deep md:flex-row md:items-end md:px-14 md:py-16">
        <span
          aria-hidden="true"
          className="absolute -right-10 -top-16 h-72 w-56 rounded-[18px] border border-ice-deep md:right-24"
        />
        <span
          aria-hidden="true"
          className="absolute -right-24 top-10 h-72 w-56 rounded-[18px] border border-ice-deep md:right-10"
        />
        <h2 className="text-title relative max-w-[16ch] text-[clamp(2rem,4vw,3.5rem)]">{title}</h2>
        <div className="relative flex flex-wrap gap-3">
          <PillButton href={primary.href} variant="brand" size="lg">
            {primary.label}
          </PillButton>
          <PillButton href={secondary.href} variant="outline-brand" size="lg" icon="external">
            {secondary.label}
          </PillButton>
        </div>
      </Reveal>
    </section>
  );
};
