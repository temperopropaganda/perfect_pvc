import type { ReactNode } from "react";

import type { PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { RevealImage } from "@src/components/molecules/RevealImage";
import { cn } from "@src/lib/utils";

type EditorialSplitProps = {
  index: string;
  label: string;
  title: string;
  children: ReactNode;
  photo: PictureSource;
  secondaryPhoto?: PictureSource;
  reverse?: boolean;
  tone?: "light" | "muted";
};

export const EditorialSplit = ({
  index,
  label,
  title,
  children,
  photo,
  secondaryPhoto,
  reverse = false,
  tone = "light",
}: EditorialSplitProps) => {
  return (
    <section
      className={cn(
        "py-(--spacing-section)",
        tone === "muted" ? "bg-graphite-100" : "bg-background",
      )}
    >
      <div className="site-container grid grid-cols-1 items-start gap-14 md:grid-cols-12 md:gap-8">
        <div
          className={cn(
            "relative md:col-span-6",
            reverse ? "md:order-2 md:col-start-7" : "md:col-start-1",
          )}
        >
          <RevealImage
            {...photo}
            sizes="(min-width: 768px) 50vw, 100vw"
            frameClassName="aspect-[4/5] rounded-[6px]"
            from={reverse ? "right" : "left"}
          />
          {secondaryPhoto && (
            <RevealImage
              {...secondaryPhoto}
              sizes="(min-width: 768px) 22vw, 50vw"
              parallax={0}
              className={cn(
                "absolute -bottom-12 hidden w-[42%] shadow-[0_40px_80px_-30px_var(--scrim)] md:flex",
                reverse ? "-left-[14%]" : "-right-[14%]",
              )}
              frameClassName="aspect-[3/4] rounded-[6px]"
            />
          )}
        </div>
        <div
          className={cn(
            "flex flex-col gap-8 md:col-span-5 md:pt-[12vh]",
            reverse ? "md:order-1 md:col-start-1" : "md:col-start-8",
          )}
        >
          <span className="text-label flex gap-4 text-muted-foreground">
            <span>{index}</span>
            <span>{label}</span>
          </span>
          <RevealText
            as="h2"
            text={title}
            className="text-title text-[clamp(2rem,3.6vw,3.75rem)]"
            emphasisClassName="text-graphite-400"
          />
          <div className="flex max-w-[46ch] flex-col gap-5 text-[17px] leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};
