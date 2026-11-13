import { CaseCategoryEnum } from "@src/domain/enums/case-category-enum";
import type { CaseType } from "@src/domain/types/case-type";
import type { FilterOptionType } from "@src/domain/types/filter-option-type";

const { Fachadas, Curvos, Portas, Residenciais, Especiais } = CaseCategoryEnum;

// Conteúdo resumido das obras publicadas em perfectpvc.com.br/obras.
const CASES: CaseType[] = [
  {
    slug: "fachada-ripado",
    title: "Fachada imponente em PVC ripado",
    place: "Videira (SC)",
    year: 2024,
    image: "/images/cases/fachada-ripado.webp",
    imageAlt: "Fachada com vidro fixo alto e porta pivotante em PVC ripado",
    categories: [Fachadas, Portas],
    products: ["Fixo", "Pivotante ripada"],
    summary:
      "Um fixo com mais de 6 metros de altura e a porta pivotante em PVC ripado dão luz e presença à fachada.",
  },
  {
    slug: "fixo-curvo",
    title: "O fixo curvo",
    place: "Campos Novos (SC)",
    year: 2024,
    image: "/images/cases/fixo-curvo.webp",
    imageAlt: "Sobrado branco com vidro fixo curvo na fachada",
    categories: [Curvos, Fachadas],
    products: ["Vidro fixo curvo"],
    summary:
      "O vidro curvo realça a arquitetura e deixa a luz natural correr livre pelos ambientes.",
  },
  {
    slug: "claraboia",
    title: "Claraboia sob medida",
    place: "Tangará (SC)",
    year: 2024,
    image: "/images/cases/claraboia.webp",
    imageAlt: "Vista aérea de casa com claraboia no telhado",
    categories: [Especiais],
    products: ["Claraboia"],
    summary:
      "Uma abertura no telhado, desenvolvida pela Perfect, leva luz natural para dentro de casa.",
  },
  {
    slug: "decoracao-eua",
    title: "Decoração dos EUA no Brasil",
    place: "Videira (SC)",
    year: 2023,
    image: "/images/cases/decoracao-eua.webp",
    imageAlt: "Casa em estilo norte-americano com janelas brancas em PVC",
    categories: [Residenciais],
    products: ["Janelas brancas", "Portas de giro"],
    summary:
      "Inspirado nas viagens à América do Norte, o casal trouxe o estilo para casa, com 10 anos de garantia.",
  },
  {
    slug: "inovacao-design",
    title: "Inovação em design e conforto",
    place: "Fraiburgo (SC)",
    year: 2023,
    image: "/images/cases/inovacao-design.webp",
    imageAlt: "Sobrado com portas sequenciais e perfis pretos",
    categories: [Portas, Residenciais],
    products: ["Portas sequenciais", "Fixos superiores", "Telas"],
    summary:
      "Portas sequenciais com fixos superiores valorizam o pé-direito duplo. Perfis pretos com microcristais Kömmerling.",
  },
  {
    slug: "sofisticacao",
    title: "Sofisticação que encanta",
    place: "Caçador (SC)",
    year: 2023,
    image: "/images/cases/sofisticacao.webp",
    imageAlt: "Casa moderna com esquadrias pretas e revestimento de madeira",
    categories: [Residenciais],
    products: ["Perfil preto", "Persianas automatizadas", "Trilhos sequenciais"],
    summary:
      "Perfil preto com microcristais, persianas automatizadas e trilhos sequenciais para abrir o vão por inteiro.",
  },
  {
    slug: "toque-especial",
    title: "Um toque especial na entrada",
    place: "Pequeno Paraíso",
    year: 2023,
    image: "/images/cases/toque-especial.webp",
    imageAlt: "Sobrado com esquadrias em PVC e jardim com palmeiras",
    categories: [Portas],
    products: ["Pivotante em chapa de PVC"],
    summary:
      "Porta pivotante em chapa de PVC branco, com isolamento termoacústico e resistência ao clima da serra.",
  },
  {
    slug: "privacidade",
    title: "O valor da privacidade",
    place: "Treze Tílias (SC)",
    year: 2023,
    image: "/images/cases/privacidade.webp",
    imageAlt: "Sobrado cinza em Treze Tílias com esquadrias em PVC",
    categories: [Residenciais],
    products: ["Janelas e portas em PVC"],
    summary: "Segurança, amplitude de visão e durabilidade em um recanto feito sob medida.",
  },
  {
    slug: "ousadia-tradicao",
    title: "Ousadia e tradição",
    year: 2022,
    image: "/images/cases/ousadia-tradicao.webp",
    imageAlt: "Casa com fachada curva, portão seccionado amadeirado e esquadrias em PVC",
    categories: [Fachadas, Curvos],
    products: ["Portão seccionado", "Guarda-corpo", "Vidros insulados"],
    summary:
      "Linhas retas e curvas, portão seccionado, persianas automatizadas e vidros insulados na sala de festas.",
  },
  {
    slug: "suprassumo",
    title: "O suprassumo da perfeição",
    year: 2022,
    image: "/images/cases/suprassumo.webp",
    imageAlt: "Sobrado branco com grandes vidros curvos na fachada",
    categories: [Curvos, Fachadas],
    products: ["Vidros curvos", "Portão seccionado", "Pivotante amadeirada"],
    summary: "Vidros curvos e fixos na fachada, portão seccionado e porta pivotante amadeirada.",
  },
  {
    slug: "conforto-paraiso",
    title: "Conforto no paraíso",
    year: 2022,
    image: "/images/cases/conforto-paraiso.webp",
    imageAlt: "Casa branca térrea vista a partir da piscina",
    categories: [Residenciais],
    products: ["Vidros com argônio", "Persiana entre vidros", "Pivotante"],
    summary:
      "Clima total white com vidros duplos com gás argônio, persianas entre vidros e porta pivotante no hall.",
  },
  {
    slug: "lar-apaixonar",
    title: "Um lar para se apaixonar",
    year: 2022,
    image: "/images/cases/lar-apaixonar.webp",
    imageAlt: "Sobrado com fachada branca e grandes janelas em PVC branco",
    categories: [Residenciais],
    products: ["Perfil branco", "Vidros insulados", "Persianas motorizadas"],
    summary:
      "Perfis brancos, vidros insulados e portas de grandes proporções em sistemas sequenciais.",
  },
  {
    slug: "classico-moderno",
    title: "O clássico com o moderno",
    year: 2021,
    image: "/images/cases/classico-moderno.webp",
    imageAlt: "Sobrado clássico com janelas em arco e esquadrias brancas",
    categories: [Residenciais, Curvos],
    products: ["Oscilo-batente", "Janelas em arco"],
    summary:
      "Esquadrias que viram elemento de design, com formas e cores que combinam com a arquitetura.",
  },
  {
    slug: "cantina",
    title: "Cantina Giovanni Felippo",
    place: "Arroio Trinta (SC)",
    year: 2021,
    image: "/images/cases/realizacao-sonho.webp",
    imageAlt: "Cantina de pedra com janelas altas em arco",
    categories: [Especiais, Curvos],
    products: ["Perfil curvo", "Vidros com pinázio", "Portas camarão"],
    summary:
      "Perfil curvo, vidros insulados com pinázio e portas camarão na cantina que movimenta o turismo da cidade.",
  },
];

const CATEGORY_LABELS: Record<CaseCategoryEnum, string> = {
  [Fachadas]: "Fachadas",
  [Curvos]: "Curvos",
  [Portas]: "Portas",
  [Residenciais]: "Residenciais",
  [Especiais]: "Especiais",
};

const HIGHLIGHT_SLUGS = ["fachada-ripado", "fixo-curvo", "sofisticacao"];

export type CaseFilterValue = CaseCategoryEnum | "todos";

export const casesService = {
  list: (): CaseType[] => CASES,

  listHighlights: (): CaseType[] =>
    HIGHLIGHT_SLUGS.flatMap((slug) => CASES.filter((item) => item.slug === slug)),

  filterByCategory: (filter: CaseFilterValue): CaseType[] =>
    filter === "todos" ? CASES : CASES.filter((item) => item.categories.includes(filter)),

  filterOptions: (): FilterOptionType<CaseFilterValue>[] => [
    { value: "todos", label: "Todos", count: CASES.length },
    ...Object.values(CaseCategoryEnum).map((category) => ({
      value: category,
      label: CATEGORY_LABELS[category],
      count: CASES.filter((item) => item.categories.includes(category)).length,
    })),
  ],
};
