import { PROJECT_PHOTOS } from "@src/application/services/project-photos";
import type { PhotoType } from "@src/domain/types/photo-type";
import type { ProjectType } from "@src/domain/types/project-type";

const photosOf = (slug: string): PhotoType[] => PROJECT_PHOTOS[slug] ?? [];

const pick = (slug: string, name: string): PhotoType => {
  const photo = photosOf(slug).find((item) => item.src.endsWith(`/${name}`));
  if (!photo) throw new Error(`Foto ${name} não encontrada em ${slug}`);
  return photo;
};

// Projetos fotografados pela Perfect, das obras de 2026 (as três primeiras) para as mais antigas.
// Originais dos seis primeiros projetos de 2023 em src/assets/images/perfect; os adicionados em
// 2026-11 ficam só no HD (design/fotos/origem-2026-11.json). Nome provisório e
// local "a confirmar" quando a pasta de fotos não diz. Título, ano, resumo e produtos
// só aparecem quando a mesma obra está publicada em perfectpvc.com.br/obras.
const PROJECTS: ProjectType[] = [
  {
    slug: "pe-direito-duplo",
    name: "Casa Pé-Direito Duplo",
    place: "Local a confirmar",
    products: [],
    cover: pick("pe-direito-duplo", "quinta-casa-perfect-57"),
    photos: photosOf("pe-direito-duplo"),
    pendingInfo: true,
  },
  {
    slug: "pedra-madeira",
    name: "Casa Pedra e Madeira",
    place: "Local a confirmar",
    products: [],
    cover: pick("pedra-madeira", "quarta-casa-perfect-3"),
    photos: photosOf("pedra-madeira"),
    pendingInfo: true,
  },
  {
    slug: "perfis-pretos",
    name: "Casa Perfis Pretos",
    place: "Local a confirmar",
    products: [],
    cover: pick("perfis-pretos", "sexta-casa-perfect-11"),
    photos: photosOf("perfis-pretos"),
    pendingInfo: true,
  },
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
    slug: "curva",
    name: "Casa Curva",
    place: "Local a confirmar",
    products: [],
    cover: pick("curva", "perfect-1"),
    photos: photosOf("curva"),
    pendingInfo: true,
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
    slug: "piscina-coberta",
    name: "Casa Piscina Coberta",
    place: "Local a confirmar",
    products: [],
    cover: pick("piscina-coberta", "primeira-casa-perfect-41"),
    photos: photosOf("piscina-coberta"),
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
    slug: "grafite",
    name: "Casa Grafite",
    place: "Local a confirmar",
    products: [],
    cover: pick("grafite", "segunda-casa-perfect-12"),
    photos: photosOf("grafite"),
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
    slug: "treze-tilias",
    name: "Casa Treze Tílias",
    place: "Treze Tílias (SC)",
    products: [],
    cover: pick("treze-tilias", "casa02trezetilias-01"),
    photos: photosOf("treze-tilias"),
    pendingInfo: true,
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
    slug: "pergolado",
    name: "Casa Pergolado",
    place: "Local a confirmar",
    products: [],
    cover: pick("pergolado", "terceira-casa-perfect-12"),
    photos: photosOf("pergolado"),
    pendingInfo: true,
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

export const projectsService = {
  list: (): ProjectType[] => PROJECTS,

  findBySlug: (slug: string): ProjectType | undefined =>
    PROJECTS.find((project) => project.slug === slug),

  photo: pick,
};
