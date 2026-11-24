export const SITE = {
  whatsappUrl: "https://wa.me/5549999785301",
  whatsappLabel: "(49) 99978-5301",
  email: "contato@perfectpvc.com.br",
  addressLines: ["Rua Francisco Nava, 1300, Centro", "Arroio Trinta (SC), 89590-000"],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Rua+Francisco+Nava+1300+Arroio+Trinta+SC",
  instagramUrl: "https://instagram.com/perfectpvc/",
  facebookUrl: "https://facebook.com/perfectpvc",
  // Endereço provisório: o canal ainda não foi confirmado pela Perfect.
  youtubeUrl: "https://www.youtube.com/@perfectpvc",
  catalogUrl: "https://m.perfectpvc.com.br/asset/2:catalogo-perfectpdf",
  whereToBuyUrl: "https://perfectpvc.com.br/onde-comprar/",
  resellerUrl: "https://perfectpvc.com.br/quero-vender-perfect-em-minha-loja/",
  agencyUrl: "https://temperopropaganda.com.br",
} as const;

export type SocialNetwork = "instagram" | "facebook" | "youtube";

export const SOCIAL_LINKS: { network: SocialNetwork; label: string; href: string }[] = [
  { network: "instagram", label: "Instagram da Perfect", href: SITE.instagramUrl },
  { network: "facebook", label: "Facebook da Perfect", href: SITE.facebookUrl },
  { network: "youtube", label: "YouTube da Perfect", href: SITE.youtubeUrl },
];

export type NavMenuId = "produtos" | "cases";

export type NavItem =
  { label: string; to: string; menu?: NavMenuId } | { label: string; href: string };

export const NAV_ITEMS: NavItem[] = [
  { label: "Produtos", to: "/produtos", menu: "produtos" },
  { label: "Cases", to: "/cases", menu: "cases" },
  { label: "Sobre", to: "/sobre" },
  { label: "Arquitetos", to: "/arquitetos" },
  { label: "Blog", to: "/blog" },
  { label: "Onde comprar", to: "/onde-comprar" },
];

// Link do WhatsApp com a mensagem inicial já escrita.
export const whatsappWith = (message: string) =>
  `${SITE.whatsappUrl}?text=${encodeURIComponent(message)}`;

export const SHOWROOM_VISIT_URL = whatsappWith(
  "Olá! Gostaria de agendar uma visita ao showroom da Perfect.",
);

// Vídeos e posts do Instagram citados na revisão de 2026-11-23. Os arquivos originais ainda não
// foram entregues, então o site leva para o Instagram até lá.
export const INSTAGRAM_POSTS = {
  institutional: "https://www.instagram.com/p/DZC_RREAPxV/",
  anniversary: [
    "https://www.instagram.com/perfectpvc/p/DYSgod7iYqz/",
    "https://www.instagram.com/perfectpvc/reel/DYUnkfZleIj/",
    "https://www.instagram.com/perfectpvc/p/DYXAHREkasZ/",
  ],
} as const;

// Prévia do mega menu de produtos (mesmos sistemas e fotos de products-service.ts).
export const NAV_PRODUCTS = [
  { slug: "correr", name: "Correr", summary: "Varandas e grandes vãos" },
  { slug: "oscilo-batente", name: "Oscilo-batente", summary: "Gira e tomba para ventilar" },
  { slug: "giro", name: "Giro", summary: "Abre para dentro ou para fora" },
  { slug: "maxim-ar", name: "Maxim-ar", summary: "Banheiros, cozinhas e serviço" },
  { slug: "pivotante", name: "Pivotante", summary: "Entradas com presença" },
  { slug: "camarao", name: "Camarão", summary: "O vão aberto por inteiro" },
  { slug: "alcante", name: "Alçante", summary: "Grandes dimensões, abertura leve" },
  { slug: "fixo", name: "Fixo", summary: "Fachadas e luz natural" },
] as const;

// Prévia do mega menu de cases (mesmas capas de projects-service.ts).
export const NAV_CASES = [
  {
    slug: "cacador",
    name: "Casa Caçador",
    place: "Caçador (SC)",
    image: "/images/projetos/cacador/perfect-166",
  },
  {
    slug: "bosque",
    name: "Casa Bosque",
    place: "Fraiburgo (SC)",
    image: "/images/projetos/bosque/casabosquefraiburgo-06",
  },
  {
    slug: "hortencias",
    name: "Casa Hortênsias",
    place: "Fraiburgo (SC)",
    image: "/images/projetos/hortencias/perfect-134",
  },
] as const;
