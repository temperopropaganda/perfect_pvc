import Lenis from "lenis";
import { useEffect } from "react";

import { gsap, ScrollTrigger } from "@src/lib/gsap";
import {
  prefersReducedMotion,
  registerSmoothScroll,
  scrollToElement,
  scrollToTop,
} from "@src/lib/smooth-scroll";

export const useSmoothScroll = (pathname: string, hash: string) => {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    const onTick = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    registerSmoothScroll(lenis);

    return () => {
      gsap.ticker.remove(onTick);
      registerSmoothScroll(null);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (hash) {
      // Espera a página nova montar antes de procurar a âncora.
      const timer = window.setTimeout(() => scrollToElement(hash), 120);
      return () => window.clearTimeout(timer);
    }
    scrollToTop();
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
};
