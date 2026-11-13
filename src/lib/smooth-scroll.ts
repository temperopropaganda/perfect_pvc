import type Lenis from "lenis";

// Instância única do Lenis, registrada pelo hook useSmoothScroll.
// Modais e a abertura usam pauseScroll/resumeScroll para travar o fundo. O contador
// existe porque a trava pode ser pedida antes de o Lenis ser criado.
let instance: Lenis | null = null;
let locks = 0;

export const registerSmoothScroll = (lenis: Lenis | null) => {
  instance = lenis;
  if (lenis && locks > 0) lenis.stop();
};

export const pauseScroll = () => {
  locks += 1;
  instance?.stop();
};

export const resumeScroll = () => {
  locks = Math.max(0, locks - 1);
  if (locks === 0) instance?.start();
};

export const scrollToTop = () => {
  if (instance) {
    instance.scrollTo(0, { immediate: true, force: true });
    return;
  }
  window.scrollTo(0, 0);
};

export const scrollToElement = (target: string | HTMLElement) => {
  if (instance) {
    instance.scrollTo(target, { offset: -24, duration: 1.4 });
    return;
  }
  const element = typeof target === "string" ? document.querySelector(target) : target;
  element?.scrollIntoView({ behavior: "smooth" });
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
