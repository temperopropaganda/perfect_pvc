import type { FinishType } from "@src/domain/types/finish-type";

// Acabamentos e descrições da página "Acabamentos" do catálogo Perfect 2026.
// As cores de cada acabamento ficam nos tokens ([data-finish] em src/styles/tokens.css).
const FINISHES: FinishType[] = [
  { slug: "branco", name: "Branco", description: "O padrão de pureza e luminosidade" },
  { slug: "preto", name: "Preto", description: "Sofisticação contemporânea" },
  { slug: "cinza", name: "Cinza", description: "Elegância metálica em cinza profundo" },
  { slug: "embero", name: "Embero", description: "Aconchego da madeira tropical clássica" },
  { slug: "nogal", name: "Nogal", description: "Madeira escura de veios marcados" },
  { slug: "bronze", name: "Bronze", description: "O toque metálico tradicional e sóbrio" },
  { slug: "pirita", name: "Pirita", description: "Brilho sutil e textura mineral" },
];

export const finishesService = {
  list: (): FinishType[] => FINISHES,
};
