import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";

import { RevealText } from "@src/components/atoms/RevealText";
import { gsap, ScrollTrigger, useGSAP } from "@src/lib/gsap";
import { createScrollProgress } from "@src/lib/scroll-progress";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";
import { cn } from "@src/lib/utils";
import { publicUrl } from "@src/lib/public-url";
import { windowStepAt } from "@src/lib/window-timeline";

// three.js e a cena só são baixados quando a seção se aproxima da tela.
const WindowModel = lazy(() =>
  import("@src/components/molecules/WindowModel").then((module) => ({
    default: module.WindowModel,
  })),
);

const FALLBACK_URL = publicUrl("/images/3d/janela-antracita-fechada.webp");

// Benefícios do sistema oscilo-batente no catálogo Perfect 2026.
const STEPS = [
  { label: "Fechada", text: "Vedação perimetral, com trava em todos os lados." },
  { label: "Tomba", text: "Ventilação segura mesmo com a casa vazia." },
  { label: "Gira", text: "Abertura total e limpeza pelo lado de dentro." },
];

const canUseWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

const isLowPowerDevice = () =>
  window.matchMedia("(pointer: coarse)").matches || (navigator.hardwareConcurrency ?? 8) <= 4;

// Janela oscilo-batente em 3D: a sequência fechada, tomba, fecha, gira e fecha segue o scroll.
export const TiltTurnShowcase = () => {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [progress] = useState(() => createScrollProgress());
  const [step, setStep] = useState(0);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [device] = useState(() => ({
    webgl: typeof window !== "undefined" && canUseWebGL(),
    reducedMotion: typeof window !== "undefined" && prefersReducedMotion(),
    lowPower: typeof window !== "undefined" && isLowPowerDevice(),
  }));

  useEffect(() => {
    const element = stage.current;
    if (!device.webgl || !element) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        setNear(true);
      },
      // Margem de mais de uma tela: chunk, GLB e primeira renderização ficam prontos antes de
      // a seção fixar, mesmo com rolagem rápida.
      { rootMargin: "150% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [device.webgl]);

  const handleReady = useCallback(() => setReady(true), []);
  const handleError = useCallback(() => setFailed(true), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const update = (value: number) => {
        progress.set(value);
        setStep(windowStepAt(value));
      };
      // onUpdate só dispara quando o progresso muda. Ao criar (ou recalcular) o gatilho com a
      // página já dentro ou depois da seção, o valor inicial é sincronizado à mão.
      const sync = (self: ScrollTrigger) => update(self.progress);
      mm.add("(min-width: 1024px)", () => {
        sync(
          ScrollTrigger.create({
            trigger: root.current,
            start: "top top",
            end: "+=240%",
            pin: true,
            scrub: true,
            onUpdate: sync,
            onRefresh: sync,
          }),
        );
      });
      mm.add("(max-width: 1023px)", () => {
        sync(
          ScrollTrigger.create({
            trigger: stage.current,
            start: "top 80%",
            end: "bottom 20%",
            onUpdate: sync,
            onRefresh: sync,
          }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="oscilo-titulo"
      className="overflow-hidden bg-graphite-100 py-24 lg:flex lg:h-[100svh] lg:items-center lg:py-0"
    >
      <div className="site-container grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-10 lg:col-span-5">
          <span className="text-label text-muted-foreground">Sistema oscilo-batente</span>
          <RevealText
            as="h2"
            text="Duas aberturas em *uma única esquadria.*"
            className="text-display max-w-[13ch] text-[clamp(2.4rem,4.8vw,5.25rem)]"
            emphasisClassName="text-gold-600"
          />
          <ol className="flex flex-col">
            {STEPS.map((item, index) => (
              <li
                key={item.label}
                aria-current={index === step}
                className={cn(
                  "flex items-baseline gap-5 border-t border-graphite-300 py-4 transition-opacity duration-700 ease-glide",
                  index === step ? "opacity-100" : "opacity-35",
                )}
              >
                <span className="font-display w-20 shrink-0 text-xl font-light tracking-[-0.02em]">
                  {item.label}
                </span>
                <span className="text-muted-foreground">{item.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div
          ref={stage}
          className="relative aspect-[5/6] w-full lg:col-span-6 lg:col-start-7 lg:aspect-auto lg:h-[78svh]"
        >
          <img
            src={FALLBACK_URL}
            alt="Janela oscilo-batente em PVC antracita, fechada"
            width={1282}
            height={1406}
            loading="lazy"
            className={cn(
              "absolute inset-0 size-full object-contain transition-opacity duration-700",
              ready && !failed && "opacity-0",
            )}
          />
          {near && !failed && (
            <Suspense fallback={null}>
              <WindowModel
                progress={progress}
                reducedMotion={device.reducedMotion}
                lowPower={device.lowPower}
                onReady={handleReady}
                onError={handleError}
                className={cn(
                  "absolute! inset-0 transition-opacity duration-1000",
                  ready ? "opacity-100" : "opacity-0",
                )}
              />
            </Suspense>
          )}
          <span className="text-label absolute bottom-0 right-0 text-graphite-400">
            Representação ilustrativa
          </span>
        </div>
      </div>
    </section>
  );
};
