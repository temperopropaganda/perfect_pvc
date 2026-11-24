import { Play } from "lucide-react";
import { useState } from "react";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { RevealText } from "@src/components/atoms/RevealText";
import { publicUrl } from "@src/lib/public-url";
import { cn } from "@src/lib/utils";

type VideoFeatureProps = {
  label: string;
  title: string;
  text: string;
  poster: PictureSource;
  // Arquivo de vídeo em public/. Sem ele, o botão leva para o post do Instagram.
  videoSrc?: string;
  fallbackUrl: string;
  tone?: "light" | "dark";
};

export const VideoFeature = ({
  label,
  title,
  text,
  poster,
  videoSrc,
  fallbackUrl,
  tone = "dark",
}: VideoFeatureProps) => {
  const [playing, setPlaying] = useState(false);
  const dark = tone === "dark";

  const playButton = (
    <span className="flex items-center gap-4">
      <span className="flex size-16 items-center justify-center rounded-full bg-white text-graphite-950 transition-transform duration-500 ease-glide group-hover:scale-110 md:size-20">
        <Play aria-hidden="true" className="ml-1 size-6 fill-current" />
      </span>
      <span className="text-sm font-medium text-white">
        {videoSrc ? "Assistir ao vídeo" : "Assistir no Instagram"}
      </span>
    </span>
  );

  return (
    <section
      data-nav={dark ? "dark" : undefined}
      className={cn(
        "py-(--spacing-section)",
        dark ? "dark bg-background text-foreground" : "bg-background",
      )}
    >
      <div className="site-container flex flex-col gap-12">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="flex flex-col gap-6 md:col-span-7">
            <span className="text-label text-muted-foreground">{label}</span>
            <RevealText
              as="h2"
              text={title}
              className="text-title text-[clamp(2rem,4vw,3.75rem)]"
              emphasisClassName={dark ? "text-gold-300" : "text-graphite-400"}
            />
          </div>
          <p className="text-[17px] leading-relaxed text-muted-foreground md:col-span-4 md:col-start-9">
            {text}
          </p>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-[24px] bg-graphite-900">
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
              <span className="absolute inset-0 bg-linear-to-t from-scrim/70 to-scrim/10" />
              {videoSrc ? (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="group absolute bottom-6 left-6 md:bottom-10 md:left-10"
                >
                  {playButton}
                </button>
              ) : (
                <a
                  href={fallbackUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group absolute bottom-6 left-6 md:bottom-10 md:left-10"
                >
                  {playButton}
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
