import type { WindowHardwareKind } from "@src/components/atoms/WindowHardware";

export type WindowSystemType = "giro" | "oscilo-batente" | "correr" | "maxim-ar" | "pivotante";

// "at" vira a classe wp-at-<at>, que posiciona a peça em window-preview.css.
type HardwareSpec = {
  kind: WindowHardwareKind;
  at: string;
};

export type SashSpec = {
  position: "single" | "left" | "right";
  // Face da espessura da folha que aparece quando ela abre.
  edge?: "right" | "top";
  hardware: HardwareSpec[];
};

type WindowLayout = {
  // Vão em milímetros, na mesma escala para todos: a espessura dos perfis não muda.
  width: number;
  height: number;
  sliding: boolean;
  sashes: SashSpec[];
  // Ferragens presas ao marco, que ficam paradas quando a folha abre.
  fixings: HardwareSpec[];
};

export const WINDOW_LAYOUTS: Record<WindowSystemType, WindowLayout> = {
  giro: {
    width: 800,
    height: 1100,
    sliding: false,
    sashes: [{ position: "single", edge: "right", hardware: [{ kind: "handle", at: "stile" }] }],
    fixings: [
      { kind: "hinge", at: "hinge-top" },
      { kind: "hinge", at: "hinge-bottom" },
    ],
  },
  "oscilo-batente": {
    width: 900,
    height: 1100,
    sliding: false,
    sashes: [{ position: "single", edge: "top", hardware: [{ kind: "handle", at: "stile" }] }],
    fixings: [
      { kind: "stay-hinge", at: "corner-top" },
      { kind: "corner-hinge", at: "corner-bottom" },
    ],
  },
  correr: {
    width: 1400,
    height: 1000,
    sliding: true,
    sashes: [
      { position: "left", hardware: [] },
      { position: "right", hardware: [{ kind: "latch", at: "meeting" }] },
    ],
    fixings: [],
  },
  "maxim-ar": {
    width: 1200,
    height: 800,
    sliding: false,
    sashes: [{ position: "single", edge: "top", hardware: [{ kind: "handle", at: "rail" }] }],
    fixings: [],
  },
  pivotante: {
    width: 1000,
    height: 1100,
    sliding: false,
    sashes: [{ position: "single", edge: "right", hardware: [{ kind: "handle", at: "stile" }] }],
    fixings: [
      { kind: "pivot", at: "pivot-top" },
      { kind: "pivot", at: "pivot-bottom" },
    ],
  },
};
