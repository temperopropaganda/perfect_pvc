import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { Reveal } from "@src/components/atoms/Reveal";
import { RevealText } from "@src/components/atoms/RevealText";

type ManifestoSectionProps = {
  photo: PictureSource;
};

export const ManifestoSection = ({ photo }: ManifestoSectionProps) => {
  return (
    <section id="proposito" className="bg-background py-(--spacing-section)">
      <div className="site-container grid grid-cols-1 items-center gap-14 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-8 md:col-span-5">
          <span className="text-label text-muted-foreground">Uma nova forma de sentir o lar</span>
          <RevealText
            as="h2"
            text="O silêncio também é *uma forma de luxo.*"
            className="text-display max-w-[12ch] text-[clamp(2.4rem,4.6vw,4.75rem)]"
            emphasisClassName="text-gold-600"
          />
          <Reveal delay={0.2}>
            <p className="text-lead max-w-[38ch] text-muted-foreground">
              Há uma beleza nas coisas que não exigem nossa atenção. Na luz que atravessa os
              espaços, no conforto que permanece e na tranquilidade de simplesmente estar.
            </p>
          </Reveal>
        </div>

        <Reveal y={0} blur={false} className="md:col-span-7 md:col-start-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-graphite-200">
            <Picture
              {...photo}
              sizes="(min-width: 768px) 55vw, 100vw"
              className="absolute inset-0"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
};
