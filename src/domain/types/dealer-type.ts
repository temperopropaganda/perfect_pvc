export type DealerType = {
  name: string;
  city: string;
  state: string;
  // Região do Brasil, usada para agrupar a lista.
  region: "Sul" | "Sudeste" | "Centro-Oeste" | "Nordeste" | "Norte";
  address: string;
  phones: string[];
  email: string;
  instagram?: string;
};
