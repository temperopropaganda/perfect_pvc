import { useLayoutEffect, useRef } from "react";

import { Picture, type PictureSource } from "@src/components/atoms/Picture";
import { ShowcaseWord } from "@src/components/atoms/ShowcaseWord";
import { gsap, useGSAP } from "@src/lib/gsap";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";

// Ajustes finos da seção. Uma única timeline (scrub) controla tudo; as posições abaixo são
// frações do scroll total da seção fixa (0 = início, 1 = fim).
const REVEAL_END = 0.9; // a foto termina de abrir aqui

const SHOWCASE_CONFIG = {
  // Quanto o usuário rola com a seção fixa. Mais = animação mais lenta.
  scrollLength: "+=220%",
  // Suavização do scrub (segundos de atraso em relação ao scroll).
  scrub: 0.8,
  // Recorte inicial da foto: top right bottom left.
  startInset: { desktop: "18% 25% 18% 25%", mobile: "30% 20% 30% 20%" },
  startRadius: 6,
  // A palavra ocupa esta fração da largura da tela.
  wordWidth: { desktop: 0.9, mobile: 0.92 },
  // Zoom da foto no início (desfaz enquanto revela).
  startScale: 1.25,
  timeline: {
    revealEnd: REVEAL_END,
    // A palavra some entre 80% e 95% da expansão da foto: já invisível quando ela termina de abrir.
    wordFadeStart: REVEAL_END * 0.8,
    wordFadeEnd: REVEAL_END * 0.95,
    // Os textos entram logo antes da palavra sumir de vez (leve sobreposição) e terminam junto com
    // o fim do scroll, sem trecho morto com a foto aberta e nada na tela.
    copyStart: REVEAL_END * 0.92,
    copyEnd: 1,
  },
} as const;

type ShowcaseSectionProps = {
  word: string;
  photo: PictureSource;
  title: string;
  text: string;
};

// Seção fixa com scroll: a foto cresce a partir de um recorte central enquanto uma palavra gigante
// atravessa a composição. Na área escura a palavra é sólida; sobre a foto, só contorno.
// Truque: a versão sólida fica ATRÁS da foto (a foto a esconde onde aparece) e a versão vazada fica
// DENTRO do recorte da foto (só aparece onde a foto aparece). Mesmo lugar, mesma métrica.
export const ShowcaseSection = ({ word, photo, title, text }: ShowcaseSectionProps) => {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const outline = useRef<HTMLSpanElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  // Ajusta o tamanho da fonte para a palavra ocupar a largura configurada, seja qual for o texto.
  useLayoutEffect(() => {
    const section = root.current;
    const glyphs = fill.current?.firstElementChild as HTMLElement | null;
    if (!section || !glyphs) return undefined;
    const fit = () => {
      section.style.setProperty("--showcase-word-size", "100px");
      const viewport = document.documentElement.clientWidth;
      const isMobile = viewport < 768;
      const target =
        viewport *
        (isMobile ? SHOWCASE_CONFIG.wordWidth.mobile : SHOWCASE_CONFIG.wordWidth.desktop);
      const size = (100 * target) / glyphs.getBoundingClientRect().width;
      section.style.setProperty("--showcase-word-size", `${size}px`);
    };
    fit();
    void document.fonts.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [word]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const { timeline: at } = SHOWCASE_CONFIG;
      const mm = gsap.matchMedia();

      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (context) => {
        const inset = context.conditions?.["desktop"]
          ? SHOWCASE_CONFIG.startInset.desktop
          : SHOWCASE_CONFIG.startInset.mobile;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: SHOWCASE_CONFIG.scrollLength,
            scrub: SHOWCASE_CONFIG.scrub,
            pin: true,
          },
        });

        // 1. A foto abre do recorte central até a tela inteira.
        tl.fromTo(
          frame.current,
          { clipPath: `inset(${inset} round ${SHOWCASE_CONFIG.startRadius}px)` },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: at.revealEnd },
          0,
        )
          .fromTo(
            media.current,
            { scale: SHOWCASE_CONFIG.startScale },
            { scale: 1, duration: at.revealEnd },
            0,
          )
          // 2. Perto do fim da expansão a palavra (as duas camadas juntas) some com suavidade.
          .fromTo(
            [fill.current, outline.current],
            { opacity: 1 },
            { opacity: 0, ease: "sine.inOut", duration: at.wordFadeEnd - at.wordFadeStart },
            at.wordFadeStart,
          )
          // 3. Os textos da seção entram enquanto a foto termina de abrir.
          .fromTo(
            copy.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, ease: "sine.out", duration: at.copyEnd - at.copyStart },
            at.copyStart,
          );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      className="dark relative h-[100svh] min-h-[600px] overflow-hidden bg-background text-foreground"
    >
      {/* Camada sólida: atrás da foto, visível só na área escura. */}
      <ShowcaseWord ref={fill} word={word} variant="fill" className="motion-reduce:hidden" />

      <div ref={frame} className="absolute inset-0 overflow-hidden">
        <div ref={media} className="absolute inset-0 will-change-transform">
          <Picture {...photo} sizes="100vw" />
        </div>
        <span className="absolute inset-0 bg-linear-to-t from-scrim/80 via-scrim/10 to-scrim/30" />
        {/* Camada vazada: dentro do recorte, visível só sobre a foto. */}
        <ShowcaseWord
          ref={outline}
          word={word}
          variant="outline"
          className="motion-reduce:hidden"
        />
      </div>

      <div
        ref={copy}
        className="site-container relative flex h-full flex-col justify-end gap-6 pb-12 md:pb-16"
      >
        <h2 className="text-display max-w-[12ch] text-[clamp(2.8rem,8vw,8.5rem)] text-white">
          {title}
        </h2>
        <p className="text-lead max-w-[40ch] text-graphite-200">{text}</p>
      </div>
    </section>
  );
};
