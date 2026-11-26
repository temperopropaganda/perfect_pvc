import { Reveal } from "@src/components/atoms/Reveal";
import { RevealText } from "@src/components/atoms/RevealText";

type Testimonial = { quote: string; author: string; place?: string };

type TestimonialsProps = {
  items: Testimonial[];
};

// Depoimentos em texto corrido, sem caixas: muito espaço entre eles, uma linha fina azul no topo de
// cada um e o autor discreto embaixo.
export const Testimonials = ({ items }: TestimonialsProps) => (
  <section className="bg-paper py-[clamp(6rem,14svh,11rem)]">
    <div className="site-container flex flex-col gap-20 md:gap-28">
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <span className="text-label text-muted-foreground md:col-span-3">
          Quem mora com Perfect
        </span>
        <RevealText
          as="h2"
          text="O pós-venda também *faz parte da obra.*"
          className="text-title text-[clamp(2rem,4vw,3.75rem)] md:col-span-9"
          emphasisClassName="text-graphite-400"
        />
      </div>

      <ul className="grid gap-x-[clamp(2rem,5vw,6rem)] gap-y-20 md:grid-cols-2 md:gap-y-28 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.author}>
            <Reveal
              delay={(index % 3) * 0.08}
              className="flex h-full flex-col gap-14 border-t border-blue-700/25 pt-8"
            >
              <figure className="flex h-full flex-col justify-between gap-14">
                <blockquote>
                  <p className="font-display text-[clamp(1.5rem,2.1vw,2.1rem)] font-light leading-[1.25] tracking-[-0.025em] text-balance">
                    {item.quote}
                  </p>
                </blockquote>
                <figcaption className="text-label flex flex-col gap-1.5">
                  <span className="text-foreground">{item.author}</span>
                  {item.place && <span className="text-muted-foreground">{item.place}</span>}
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
