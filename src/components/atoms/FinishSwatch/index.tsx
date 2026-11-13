import { cn } from "@src/lib/utils";

import "@src/components/atoms/FinishSwatch/finish-swatch.css";

type FinishSwatchProps = {
  // Chave do acabamento nos tokens ([data-finish] em src/styles/tokens.css).
  finish: string;
  className?: string;
};

// Amostra do acabamento com o mesmo material do perfil: volume, veio e brilho.
export const FinishSwatch = ({ finish, className }: FinishSwatchProps) => (
  <span aria-hidden="true" className={cn("finish-swatch", className)} data-finish={finish} />
);
