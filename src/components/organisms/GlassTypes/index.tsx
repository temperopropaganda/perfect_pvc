import { Reveal } from "@src/components/atoms/Reveal";
import { RevealText } from "@src/components/atoms/RevealText";

// Página "Vidros" do catálogo Perfect 2026.
const GLASSES = [
  {
    name: "Vidro insulado",
    text: "Duas chapas de vidro separadas por uma câmara de ar com gás argônio. É a solução definitiva para isolamento térmico e acústico superior.",
  },
  {
    name: "Vidro laminado",
    text: "Segurança em primeiro lugar. Em caso de quebra, os fragmentos ficam presos na película, além de filtrar até 99% dos raios UV.",
  },
  {
    name: "Vidro temperado",
    text: "Alta resistência mecânica para portas e vitrines sujeitas a impacto.",
  },
];

export const GlassTypes = () => (
  <section className="bg-background py-(--spacing-section)">
    <div className="site-container grid gap-14 md:grid-cols-12 md:gap-8">
      <div className="flex flex-col gap-6 md:col-span-4">
        <span className="text-label text-foreground/70">Vidros</span>
        <RevealText
          as="h2"
          text="O parceiro da *performance.*"
          className="text-title text-[clamp(2.4rem,4.6vw,4.5rem)]"
          emphasisClassName="text-graphite-400"
        />
        <p className="max-w-[34ch] text-[clamp(1.1rem,1.5vw,1.375rem)] leading-relaxed text-foreground/75">
          Para extrair o máximo das janelas Perfect, especificamos o vidro ideal para cada
          necessidade.
        </p>
      </div>
      <ol className="flex flex-col md:col-span-7 md:col-start-6">
        {GLASSES.map((glass, index) => (
          <li key={glass.name} className="border-t border-border last:border-b">
            <Reveal
              delay={index * 0.08}
              className="grid gap-3 py-8 md:grid-cols-[1fr_1.4fr] md:gap-8 md:py-10"
            >
              <h3 className="font-display text-2xl font-medium tracking-[-0.02em]">{glass.name}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{glass.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
