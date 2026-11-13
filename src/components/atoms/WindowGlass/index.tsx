import { cn } from "@src/lib/utils";

import "@src/components/atoms/WindowGlass/window-glass.css";

type WindowGlassProps = {
  className?: string;
};

// Vidro encaixado no perfil: borracha, sombra do baguete, reflexo do próprio perfil nas
// bordas e reflexos suaves. Fica por cima da vista; a vista é desenhada atrás pelo pai.
export const WindowGlass = ({ className }: WindowGlassProps) => (
  <span aria-hidden="true" className={cn("window-glass", className)}>
    <span className="wg-reflection" />
  </span>
);
