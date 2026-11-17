import { ProductCategoryEnum } from "@src/domain/enums/product-category-enum";
import type { FilterOptionType } from "@src/domain/types/filter-option-type";
import type { ProductType } from "@src/domain/types/product-type";

const { Janelas, Portas, Acessorios } = ProductCategoryEnum;

const BASIC_COLORS = "Branco, Embero e Preto";

// Dados técnicos copiados das páginas de produto do site atual (perfectpvc.com.br/produtos).
const PRODUCTS: ProductType[] = [
  {
    slug: "correr",
    name: "Correr",
    categories: [Janelas, Portas],
    opening: "correr",
    summary: "Varandas e grandes vãos",
    mockup: "/images/mockups/correr.webp",
    photo: "/images/produtos/correr.webp",
    photoAlt: "Porta de correr em PVC aberta para a piscina",
    portrait: {
      src: "/images/produtos/retrato/correr",
      width: 533,
      height: 800,
      alt: "Porta de correr de vidro aberta para a varanda com vista para a cidade",
    },
    highlights: [
      "Múltiplos trilhos",
      "Pequenos, médios e grandes vãos",
      "Perfil inclinado contra água",
    ],
    specs: [
      { label: "Perfil", value: "Premiline 58 e 80" },
      { label: "Isolamento acústico", value: "Até 35 dB" },
      { label: "Transmissão térmica", value: "Uw 1,7 W/m²K" },
      { label: "Vidro", value: "4 a 28 mm" },
      { label: "Cores", value: BASIC_COLORS },
    ],
  },
  {
    slug: "oscilo-batente",
    name: "Oscilo-batente",
    categories: [Janelas, Portas],
    opening: "oscilo-batente",
    summary: "Gira e tomba para ventilar",
    mockup: "/images/mockups/oscilo-batente.webp",
    photo: "/images/produtos/oscilo-batente.webp",
    photoAlt: "Janela oscilo-batente aberta com vista para a cidade",
    portrait: {
      src: "/images/produtos/retrato/oscilo-batente",
      width: 533,
      height: 800,
      alt: "Janela oscilo-batente branca basculada no showroom da Perfect",
    },
    highlights: ["Gira e tomba", "Controle de ventilação", "Limpeza pelo lado de dentro"],
    specs: [
      { label: "Perfil", value: "EuroFine 70" },
      { label: "Isolamento acústico", value: "Até 45 dB" },
      { label: "Transmissão térmica", value: "Uw 1,3 W/m²K" },
      { label: "Vidro", value: "7 a 42 mm" },
      { label: "Cores", value: BASIC_COLORS },
    ],
  },
  {
    slug: "giro",
    name: "Giro",
    categories: [Janelas, Portas],
    opening: "giro",
    summary: "Abre para dentro ou para fora",
    mockup: "/images/mockups/giro.webp",
    photo: "/images/produtos/giro.webp",
    photoAlt: "Portas de giro brancas em sala com piso de mármore",
    portrait: {
      src: "/images/produtos/retrato/giro",
      width: 533,
      height: 800,
      alt: "Porta de giro dupla branca com vidros quadriculados",
    },
    highlights: ["Giro interno ou externo", "Vedação por borracha", "Economia de energia"],
    specs: [
      { label: "Perfil", value: "EuroFine 70" },
      { label: "Isolamento acústico", value: "Até 45 dB" },
      { label: "Transmissão térmica", value: "Uw 1,3 W/m²K" },
      { label: "Vidro", value: "7 a 42 mm" },
      { label: "Cores", value: BASIC_COLORS },
    ],
  },
  {
    slug: "maxim-ar",
    name: "Maxim-ar",
    categories: [Janelas],
    opening: "maxim-ar",
    summary: "Banheiros, cozinhas e serviço",
    mockup: "/images/mockups/maxim-ar.webp",
    photo: "/images/produtos/maxim-ar.webp",
    photoAlt: "Janelas maxim-ar pretas abertas em fachada",
    portrait: {
      src: "/images/produtos/retrato/maxim-ar",
      width: 533,
      height: 800,
      alt: "Janela maxim-ar branca aberta, vista de baixo",
    },
    highlights: ["Abertura de 90°", "Controle de ventilação", "Vedação por borracha"],
    specs: [
      { label: "Perfil", value: "EuroFine 70 e ProVent" },
      { label: "Isolamento acústico", value: "Até 45 dB" },
      { label: "Transmissão térmica", value: "Uw 1,3 W/m²K" },
      { label: "Vidro", value: "4 a 42 mm" },
      { label: "Cores", value: BASIC_COLORS },
    ],
  },
  {
    slug: "fixo",
    name: "Fixo",
    categories: [Janelas],
    opening: "fixo",
    summary: "Fachadas e luz natural",
    mockup: "/images/mockups/fixo.webp",
    photo: "/images/produtos/fixo.webp",
    photoAlt: "Vidro fixo curvo em fachada de sobrado",
    portrait: {
      src: "/images/produtos/retrato/fixo",
      width: 533,
      height: 800,
      alt: "Vidro fixo curvo de piso a teto entre cortinas",
    },
    highlights: ["Pequenos, médios e grandes vãos", "Isolamento termoacústico"],
    specs: [
      { label: "Perfil", value: "EuroFine 70 e ProVent" },
      { label: "Isolamento acústico", value: "Até 45 dB" },
      { label: "Transmissão térmica", value: "Uw 1,3 W/m²K" },
      { label: "Vidro", value: "4 a 42 mm" },
      { label: "Cores", value: BASIC_COLORS },
    ],
  },
  {
    slug: "pivotante",
    name: "Pivotante",
    categories: [Portas],
    opening: "pivotante",
    summary: "Entradas com presença",
    mockup: "/images/mockups/pivotante.webp",
    photo: "/images/produtos/pivotante.webp",
    photoAlt: "Porta pivotante de vidro em entrada com pé-direito duplo",
    portrait: {
      src: "/images/produtos/retrato/pivotante",
      width: 533,
      height: 800,
      alt: "Porta pivotante amadeirada aberta para a entrada da casa",
    },
    highlights: [
      "Ferragens embutidas",
      "Múltiplos pontos de travamento",
      "Fechadura digital opcional",
    ],
    specs: [
      { label: "Perfil", value: "EuroFine 70" },
      { label: "Isolamento acústico", value: "Até 45 dB" },
      { label: "Transmissão térmica", value: "Uw 1,3 W/m²K" },
      { label: "Vidro", value: "7 a 42 mm" },
      { label: "Cores", value: BASIC_COLORS },
    ],
  },
  {
    slug: "camarao",
    name: "Camarão",
    categories: [Portas, Janelas],
    opening: "camarao",
    summary: "O vão aberto por inteiro",
    mockup: "/images/mockups/camarao.webp",
    photo: "/images/produtos/camarao.webp",
    photoAlt: "Porta camarão em PVC amadeirado aberta para a varanda",
    portrait: {
      src: "/images/produtos/retrato/camarao",
      width: 533,
      height: 800,
      alt: "Porta camarão preta aberta para o jardim florido",
    },
    highlights: ["Maior abertura do vão", "Ocupa pouco espaço", "Múltiplos pontos de tranca"],
    specs: [
      { label: "Perfil", value: "EuroFine 70" },
      { label: "Isolamento acústico", value: "Até 45 dB" },
      { label: "Transmissão térmica", value: "Uw 1,3 W/m²K" },
      { label: "Vidro", value: "7 a 42 mm" },
      { label: "Cores", value: BASIC_COLORS },
    ],
  },
  {
    slug: "alcante",
    name: "Alçante",
    categories: [Portas],
    opening: "alcante",
    summary: "Grandes dimensões, abertura leve",
    mockup: "/images/mockups/alcante.webp",
    photo: "/images/produtos/alcante.webp",
    photoAlt: "Portas alçantes em PVC preto no estande da Perfect",
    portrait: {
      src: "/images/produtos/retrato/alcante",
      width: 533,
      height: 800,
      alt: "Grandes portas de vidro em pátio interno com piscina",
    },
    highlights: ["Permite grandes dimensões", "Estanque em clima severo", "Deslizamento leve"],
    specs: [
      { label: "Perfil", value: "Premidoor 76" },
      { label: "Isolamento acústico", value: "Até 39 dB" },
      { label: "Transmissão térmica", value: "Uw 1,3 W/m²K" },
      { label: "Vidro", value: "16 a 50 mm" },
      { label: "Cores", value: BASIC_COLORS },
    ],
  },
  {
    slug: "persianas",
    name: "Persianas",
    categories: [Acessorios],
    opening: "persiana",
    summary: "Luz sob controle",
    mockup: "/images/mockups/persianas.webp",
    photo: "/images/produtos/persianas.webp",
    photoAlt: "Persiana de enrolar preta integrada à janela",
    highlights: ["Privacidade", "Controle de luminosidade", "Conforto térmico"],
    specs: [
      { label: "Perfil", value: "Rolaplus" },
      { label: "Acionamento", value: "Fita, botoeira, controle ou aplicativo" },
      { label: "Cores", value: BASIC_COLORS },
    ],
  },
  {
    slug: "telas",
    name: "Telas",
    categories: [Acessorios],
    opening: "tela",
    summary: "O ar entra, o inseto não",
    mockup: "/images/mockups/telas.webp",
    photo: "/images/produtos/telas.webp",
    photoAlt: "Portas com telas mosquiteiras em varanda",
    highlights: ["Correr, fixa ou recolhível", "Automação na recolhível"],
    specs: [
      { label: "Modelos", value: "Correr, fixa e recolhível" },
      { label: "Opcionais", value: "Tela inox, tela pet e automação" },
      { label: "Cores", value: "Branco e Cinza" },
    ],
  },
  {
    slug: "portao",
    name: "Portão seccionado",
    categories: [Acessorios],
    opening: "portao",
    summary: "Garagem silenciosa e segura",
    mockup: "/images/mockups/portao.webp",
    photo: "/images/produtos/portao.webp",
    photoAlt: "Portão seccionado branco em garagem de sobrado",
    highlights: ["Deslizamento silencioso", "Sensor anti-esmagamento", "Isolamento termoacústico"],
    specs: [
      { label: "Acionamento", value: "Automatizado, com controle" },
      { label: "Opcionais", value: "No-break, porta de abrir e vidros" },
      { label: "Cores", value: "Amadeirado, Branco e Cinza grafite" },
    ],
  },
  {
    slug: "brise",
    name: "Brise",
    categories: [Acessorios],
    opening: "brise",
    summary: "Privacidade e proteção solar",
    mockup: "/images/mockups/brise.webp",
    photo: "/images/produtos/brise.webp",
    photoAlt: "Porta com brise de ripas amadeiradas",
    highlights: ["Maior privacidade", "Controle de temperatura", "Variedade de modelos"],
    specs: [{ label: "Cores", value: BASIC_COLORS }],
  },
];

const CATEGORY_LABELS: Record<ProductCategoryEnum, string> = {
  [Janelas]: "Janelas",
  [Portas]: "Portas",
  [Acessorios]: "Acessórios",
};

export type ProductFilterValue = ProductCategoryEnum | "todos";

const SYSTEM_SLUGS = [
  "correr",
  "oscilo-batente",
  "giro",
  "maxim-ar",
  "pivotante",
  "camarao",
  "alcante",
  "fixo",
];

export const productsService = {
  list: (): ProductType[] => PRODUCTS,

  listSystems: (): ProductType[] =>
    SYSTEM_SLUGS.flatMap((slug) => PRODUCTS.filter((product) => product.slug === slug)),

  filterByCategory: (filter: ProductFilterValue): ProductType[] =>
    filter === "todos"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.categories.includes(filter)),

  findBySlug: (slug: string): ProductType | undefined =>
    PRODUCTS.find((product) => product.slug === slug),

  categoryLabel: (category: ProductCategoryEnum): string => CATEGORY_LABELS[category],

  filterOptions: (): FilterOptionType<ProductFilterValue>[] => [
    { value: "todos", label: "Todos", count: PRODUCTS.length },
    ...Object.values(ProductCategoryEnum).map((category) => ({
      value: category,
      label: CATEGORY_LABELS[category],
      count: PRODUCTS.filter((product) => product.categories.includes(category)).length,
    })),
  ],
};
