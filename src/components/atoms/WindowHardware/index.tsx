import { cn } from "@src/lib/utils";

import "@src/components/atoms/WindowHardware/window-hardware.css";

// handle = maçaneta, hinge = dobradiça de giro, corner-hinge e stay-hinge = ferragens de canto
// do oscilo-batente (inferior e superior), pivot = pino do pivotante, latch = fecho do correr.
export type WindowHardwareKind =
  "handle" | "hinge" | "corner-hinge" | "stay-hinge" | "pivot" | "latch";

type WindowHardwareProps = {
  kind: WindowHardwareKind;
  className?: string;
};

const PARTS: Record<WindowHardwareKind, string[]> = {
  handle: ["rosette", "lever", "boss"],
  hinge: ["barrel"],
  "corner-hinge": ["plate", "barrel"],
  "stay-hinge": ["plate", "barrel"],
  pivot: ["plate", "pin"],
  latch: ["housing", "tab"],
};

// Ferragem aparente na cor de --finish-hardware. O pai posiciona pelo className e pode
// girar a peça com --wh-rotate e a alavanca com --wh-lever.
export const WindowHardware = ({ kind, className }: WindowHardwareProps) => (
  <span aria-hidden="true" className={cn("window-hardware", className)} data-kind={kind}>
    <span className="wh-body">
      {PARTS[kind].map((part) => (
        <span key={part} className="wh-part" data-part={part} />
      ))}
    </span>
  </span>
);
