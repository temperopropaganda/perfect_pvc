// Linguagem de movimento única do site. Todas as animações usam estes valores.
export const MOTION = {
  ease: "expo.out",
  easeInOut: "power3.inOut",
  duration: 1.3,
  durationShort: 0.7,
  stagger: 0.07,
} as const;

// Equivalentes para o Motion (curvas cúbicas), iguais às de tokens.css.
export const EASE_GLIDE = [0.16, 1, 0.3, 1] as const;
export const EASE_SWING = [0.76, 0, 0.24, 1] as const;
