import type { PhotoType } from "@src/domain/types/photo-type";

// Acervo de fotos da Perfect (HD "Fotos Digitais/Perfect PVC"), selecionado em 2026-11.
// Versões WebP em public/images/acervo/<nome>-{800,1400,2400}.webp.
const LIBRARY_PHOTOS = {
  "casa-crepusculo": {
    src: "/images/acervo/casa-crepusculo",
    width: 800,
    height: 533,
    alt: "Casa térrea ao entardecer, com panos de vidro iluminados refletidos na piscina",
  },
  "perfil-cores": {
    src: "/images/acervo/perfil-cores",
    width: 800,
    height: 532,
    alt: "Cortes de perfis de PVC Kömmerling nas cores branca, preta e amadeirada",
  },
  "perfil-canto": {
    src: "/images/acervo/perfil-canto",
    width: 532,
    height: 800,
    alt: "Canto de esquadria branca soldado por termofusão, sem emendas aparentes",
  },
  "perfil-camaras": {
    src: "/images/acervo/perfil-camaras",
    width: 800,
    height: 532,
    alt: "Corte de perfil de PVC mostrando as câmaras internas e as vedações",
  },
  "perfil-amadeirado": {
    src: "/images/acervo/perfil-amadeirado",
    width: 532,
    height: 800,
    alt: "Canto de esquadria com acabamento amadeirado e corte das câmaras do perfil",
  },
  "perfil-detalhe": {
    src: "/images/acervo/perfil-detalhe",
    width: 800,
    height: 532,
    alt: "",
  },
  "correr-jardim": {
    src: "/images/acervo/correr-jardim",
    width: 800,
    height: 534,
    alt: "Sala aberta para o jardim por portas de correr pretas de piso a teto",
  },
  "fachada-piscina": {
    src: "/images/acervo/fachada-piscina",
    width: 800,
    height: 533,
    alt: "Casa com panos de vidro voltados para a piscina e o jardim",
  },
} satisfies Record<string, PhotoType>;

export type LibraryPhotoName = keyof typeof LIBRARY_PHOTOS;

export const libraryPhoto = (name: LibraryPhotoName): PhotoType => LIBRARY_PHOTOS[name];
