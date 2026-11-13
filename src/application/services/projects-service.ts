import { PROJECT_PHOTOS } from "@src/application/services/project-photos";
import type { PhotoType } from "@src/domain/types/photo-type";
import type { ProjectType } from "@src/domain/types/project-type";

const photosOf = (slug: string): PhotoType[] => PROJECT_PHOTOS[slug] ?? [];

const pick = (slug: string, name: string): PhotoType => {
  const photo = photosOf(slug).find((item) => item.src.endsWith(`/${name}`));
  if (!photo) throw new Error(`Foto ${name} não encontrada em ${slug}`);
  return photo;
};

// Projetos fotografados pela Perfect (src/assets/images/perfect). Título, ano, resumo e produtos
// só aparecem quando a mesma obra está publicada em perfectpvc.com.br/obras (cases-service.ts).
const PROJECTS: ProjectType[] = [
  {
    slug: "cacador",
    name: "Casa Caçador",
    title: "Sofisticação que encanta",
    place: "Caçador (SC)",
    year: 2023,
    summary:
      "Perfil preto com microcristais, persianas automatizadas e trilhos sequenciais para abrir o vão por inteiro.",
    products: ["Perfil preto", "Persianas automatizadas", "Trilhos sequenciais"],
    cover: pick("cacador", "perfect-166"),
    photos: photosOf("cacador"),
    pendingInfo: false,
  },
  {
    slug: "bosque",
    name: "Casa Bosque",
    place: "Fraiburgo (SC)",
    products: [],
    cover: pick("bosque", "casabosquefraiburgo-06"),
    photos: photosOf("bosque"),
    pendingInfo: true,
  },
  {
    slug: "hortencias",
    name: "Casa Hortênsias",
    place: "Fraiburgo (SC)",
    products: [],
    cover: pick("hortencias", "perfect-134"),
    photos: photosOf("hortencias"),
    pendingInfo: true,
  },
  {
    slug: "condominio",
    name: "Casa Condomínio",
    title: "Inovação em design e conforto",
    place: "Fraiburgo (SC)",
    year: 2023,
    summary:
      "Portas sequenciais com fixos superiores valorizam o pé-direito duplo. Perfis pretos com microcristais Kömmerling.",
    products: ["Portas sequenciais", "Fixos superiores", "Telas"],
    cover: pick("condominio", "casacondominiofraiburgo-10"),
    photos: photosOf("condominio"),
    pendingInfo: false,
  },
  {
    slug: "pequeno-paraiso",
    name: "Casa Pequeno Paraíso",
    title: "Um toque especial na entrada",
    place: "Pequeno Paraíso",
    year: 2023,
    summary:
      "Porta pivotante em chapa de PVC branco, com isolamento termoacústico e resistência ao clima da serra.",
    products: ["Pivotante em chapa de PVC"],
    cover: pick("pequeno-paraiso", "perfect-216"),
    photos: photosOf("pequeno-paraiso"),
    pendingInfo: false,
  },
  {
    slug: "videira",
    name: "Casa Videira",
    title: "Decoração dos EUA no Brasil",
    place: "Videira (SC)",
    year: 2023,
    summary:
      "Inspirado nas viagens à América do Norte, o casal trouxe o estilo para casa, com 10 anos de garantia.",
    products: ["Janelas brancas", "Portas de giro"],
    cover: pick("videira", "perfect-013"),
    photos: photosOf("videira"),
    pendingInfo: false,
  },
];

// Obras do arquivo (cases-service.ts) que já aparecem aqui como projeto fotografado.
const CASE_SLUGS_COVERED = ["sofisticacao", "inovacao-design", "toque-especial", "decoracao-eua"];

export const projectsService = {
  list: (): ProjectType[] => PROJECTS,

  findBySlug: (slug: string): ProjectType | undefined =>
    PROJECTS.find((project) => project.slug === slug),

  photo: pick,

  coveredCaseSlugs: (): string[] => CASE_SLUGS_COVERED,
};
