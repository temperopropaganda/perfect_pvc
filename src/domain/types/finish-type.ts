// O slug também é a chave das cores em src/styles/tokens.css ([data-finish="..."]).
export type FinishSlug = "branco" | "preto" | "cinza" | "embero" | "nogal" | "bronze" | "pirita";

export type FinishType = {
  slug: FinishSlug;
  name: string;
  description: string;
};
