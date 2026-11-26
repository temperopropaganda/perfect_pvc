import { Play } from "lucide-react";
import { useState } from "react";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { publicUrl } from "@src/lib/public-url";
import { cn } from "@src/lib/utils";

type VideoFeatureProps = {
  title: string;
  poster: PictureSource;
  // Arquivo de vídeo em public/. Sem ele, o botão leva para o post do Instagram.
  videoSrc?: string;
  fallbackUrl: string;
  tone?: "light" | "dark";
};

export const VideoFeature = ({
  title,
  poster,
  videoSrc,
  fallbackUrl,
  tone = "dark",
}: VideoFeatureProps) => {
  const [playing, setPlaying] = useState(false);
  const dark = tone === "dark";

  const playButton = (
    <span className="flex size-24 items-center justify-center rounded-full bg-white text-graphite-950 shadow-[0_20px_60px_-20px_var(--scrim)] transition-transform duration-500 ease-glide group-hover:scale-110 md:size-36">
      <Play aria-hidden="true" className="ml-1.5 size-9 fill-current md:size-14" />
    </span>
  );
  const playLabel = "Assistir ao vídeo institucional";
  const centered = "group absolute inset-0 flex items-center justify-center";

  return (
    <section
      data-nav={dark ? "dark" : undefined}
      className={cn(
        "py-(--spacing-section)",
        dark ? "dark bg-background text-foreground" : "bg-background",
      )}
    >
      <div className="flex flex-col gap-10 md:gap-14">
        <div className="site-container">
          <RevealText
            as="h2"
            text={title}
            className="text-display text-balance text-center text-[clamp(2.6rem,7vw,7.5rem)] md:text-nowrap"
            emphasisClassName={dark ? "text-gold-300" : "text-graphite-400"}
          />
        </div>

        {/* Vídeo vaza da margem padrão, mas não encosta na borda da tela. */}
        <div className="mx-auto w-full max-w-[1760px] px-(--spacing-gutter)">
          <div className="relative aspect-video overflow-hidden rounded-[6px] bg-graphite-900 md:aspect-[2/1]">
            {playing && videoSrc ? (
              <video
                src={publicUrl(videoSrc)}
                controls
                autoPlay
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <>
                <Picture {...poster} sizes="100vw" />
                <span className="absolute inset-0 bg-scrim/35" />
                {videoSrc ? (
                  <button
                    type="button"
                    aria-label={playLabel}
                    onClick={() => setPlaying(true)}
                    className={centered}
                  >
                    {playButton}
                  </button>
                ) : (
                  <a
                    href={fallbackUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={playLabel}
                    className={centered}
                  >
                    {playButton}
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
