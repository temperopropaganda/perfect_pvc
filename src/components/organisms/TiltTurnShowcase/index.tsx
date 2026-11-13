import { useEffect, useRef, useState } from "react";

import { RevealText } from "@src/components/atoms/RevealText";
import { gsap, ScrollTrigger, useGSAP } from "@src/lib/gsap";
import { prefersReducedMotion } from "@src/lib/smooth-scroll";
import { cn } from "@src/lib/utils";
import type { WindowPose, WindowScene } from "@src/lib/window-scene";

const MODEL_URL = "/models/janela-oscilo-batente-v1.glb";
const FALLBACK_URL = "/images/3d/oscilo-batente.webp";

// Benefícios do sistema oscilo-batente no catálogo Perfect 2026.
const STEPS = [
  { label: "Fechada", text: "Vedação perimetral, com trava em todos os lados." },
  { label: "Tomba", text: "Ventilação segura mesmo com a casa vazia." },
  { label: "Gira", text: "Abertura total e limpeza pelo lado de dentro." },
];

// Progresso da rolagem (0 a 1) para a posição da folha.
const poseAt = (progress: number): WindowPose => {
  const ramp = (from: number, to: number) =>
    gsap.utils.clamp(0, 1, (progress - from) / (to - from));
  const tiltIn = ramp(0.12, 0.38);
  const tiltOut = ramp(0.46, 0.58);
  return { tilt: tiltIn * (1 - tiltOut), turn: ramp(0.62, 0.9) };
};

const stepAt = (progress: number) => (progress < 0.12 ? 0 : progress < 0.55 ? 1 : 2);

const canUseWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

// Elemento 3D opcional: janela oscilo-batente ilustrativa, carregada só perto da tela.
export const TiltTurnShowcase = () => {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<WindowScene | null>(null);
  const progressRef = useRef(0);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [enabled] = useState(
    () => typeof window !== "undefined" && !prefersReducedMotion() && canUseWebGL(),
  );

  useEffect(() => {
    const element = stage.current;
    const target = canvas.current;
    if (!enabled || !element || !target) return undefined;
    let cancelled = false;
    let visibility: IntersectionObserver | null = null;

    const load = new IntersectionObserver(
      async ([entry]) => {
        if (!entry?.isIntersecting) return;
        load.disconnect();
        try {
          const { createWindowScene } = await import("@src/lib/window-scene");
          const scene = await createWindowScene(target, MODEL_URL);
          if (cancelled) {
            scene.dispose();
            return;
          }
          sceneRef.current = scene;
          scene.setPose(poseAt(progressRef.current));
          setReady(true);
          visibility = new IntersectionObserver(([item]) =>
            item?.isIntersecting ? scene.start() : scene.stop(),
          );
          visibility.observe(element);
        } catch {
          // Sem o modelo, a imagem estática continua no lugar.
        }
      },
      { rootMargin: "600px 0px" },
    );
    load.observe(element);

    const onResize = () => sceneRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      load.disconnect();
      visibility?.disconnect();
      window.removeEventListener("resize", onResize);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [enabled]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const update = (progress: number) => {
        progressRef.current = progress;
        sceneRef.current?.setPose(poseAt(progress));
        setStep(stepAt(progress));
      };
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: true,
          onUpdate: (self) => update(self.progress),
        });
      });
      mm.add("(max-width: 1023px)", () => {
        ScrollTrigger.create({
          trigger: stage.current,
          start: "top 80%",
          end: "bottom 20%",
          onUpdate: (self) => update(self.progress),
        });
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
            emphasisClassName="text-graphite-400"
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
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            sceneRef.current?.setPointer(
              ((event.clientX - rect.left) / rect.width) * 2 - 1,
              ((event.clientY - rect.top) / rect.height) * 2 - 1,
            );
          }}
          onPointerLeave={() => sceneRef.current?.setPointer(0, 0)}
          className="relative aspect-[5/6] w-full lg:col-span-6 lg:col-start-7 lg:aspect-auto lg:h-[78svh]"
        >
          <img
            src={FALLBACK_URL}
            alt="Ilustração de uma janela oscilo-batente com a folha tombada"
            width={641}
            height={702}
            loading="lazy"
            className={cn(
              "absolute inset-0 size-full object-contain transition-opacity duration-700",
              ready && "opacity-0",
            )}
          />
          {enabled && (
            <canvas
              ref={canvas}
              aria-hidden="true"
              className={cn(
                "absolute inset-0 size-full transition-opacity duration-1000",
                ready ? "opacity-100" : "opacity-0",
              )}
            />
          )}
          <span className="text-label absolute bottom-0 right-0 text-graphite-400">
            Representação ilustrativa
          </span>
        </div>
      </div>
    </section>
  );
};
