import { Quote } from "lucide-react";

import { Reveal } from "@src/components/atoms/Reveal";
import { RevealText } from "@src/components/atoms/RevealText";

type Testimonial = { quote: string; author: string; place?: string };

type TestimonialsProps = {
  items: Testimonial[];
};

export const Testimonials = ({ items }: TestimonialsProps) => (
  <section className="bg-paper py-(--spacing-section)">
    <div className="site-container flex flex-col gap-14 md:gap-20">
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

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.author}>
            <Reveal
              delay={(index % 3) * 0.08}
              className="flex h-full flex-col justify-between gap-10 rounded-3xl bg-background p-7 md:p-9"
            >
              <figure className="flex h-full flex-col justify-between gap-10">
                <blockquote className="flex flex-col gap-6">
                  <Quote aria-hidden="true" className="size-6 text-blue-700" />
                  <p className="font-display text-[clamp(1.25rem,1.7vw,1.5rem)] leading-snug tracking-[-0.02em] text-balance">
                    {item.quote}
                  </p>
                </blockquote>
                <figcaption className="flex flex-col gap-0.5 border-t border-border pt-5 text-sm">
                  <span className="font-medium">{item.author}</span>
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
