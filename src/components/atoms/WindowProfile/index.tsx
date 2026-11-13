import { cn } from "@src/lib/utils";

import "@src/components/atoms/WindowProfile/window-profile.css";

// frame = marco, track = canal do trilho (correr), sash = folha, bead = baguete do vidro.
export type WindowProfileTier = "frame" | "track" | "sash" | "bead";

type WindowProfileProps = {
  tier: WindowProfileTier;
  className?: string;
};

const SIDES = ["top", "right", "bottom", "left"] as const;

// Anel de perfil de PVC: quatro barras soldadas em meia-esquadria. A cor vem do
// [data-finish] mais próximo; a espessura, das variáveis --frame-face, --sash-face etc.
export const WindowProfile = ({ tier, className }: WindowProfileProps) => (
  <span aria-hidden="true" className={cn("window-profile", className)} data-tier={tier}>
    {SIDES.map((side) => (
      <span key={side} className="wpf-bar" data-side={side} />
    ))}
  </span>
);
