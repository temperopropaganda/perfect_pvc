import { libraryPhoto } from "@src/application/services/library-photos";
import { projectsService } from "@src/application/services/projects-service";
import type { BlogPostType } from "@src/domain/types/blog-post-type";

// Posts de exemplo para o protótipo, escritos só com informações do catálogo Perfect 2026.
// A pauta definitiva do blog será produzida pela equipe de conteúdo.
const POSTS: BlogPostType[] = [
  {
    slug: "vidro-insulado-laminado-ou-temperado",
    title: "Vidro insulado, laminado ou temperado: qual escolher para sua janela?",
    excerpt:
      "O perfil faz metade do trabalho. A outra metade é o vidro certo para cada ambiente, do quarto silencioso à porta de entrada.",
    category: "Guia de escolha",
    publishedAt: "2026-11-20",
    readingMinutes: 4,
    cover: projectsService.photo("pe-direito-duplo", "quinta-casa-perfect-15"),
    body: [
      "Uma esquadria de alto desempenho é um conjunto: perfil, vedação, ferragem e vidro trabalham juntos. Para extrair o máximo das janelas Perfect, o vidro é especificado de acordo com a necessidade de cada vão.",
      "## Vidro insulado (duplo)",
      "Duas chapas de vidro separadas por uma câmara de ar com gás argônio. É a solução para quem busca isolamento térmico e acústico superior, ideal para quartos, salas voltadas para a rua e regiões de inverno rigoroso.",
      "## Vidro laminado",
      "Segurança em primeiro lugar. Em caso de quebra, os fragmentos ficam presos na película, que também filtra até 99% dos raios UV e protege pisos, tecidos e móveis do desbotamento.",
      "## Vidro temperado",
      "Alta resistência mecânica para portas e vitrines sujeitas a impacto. É a escolha comum para portas de correr de grandes dimensões e áreas de circulação intensa.",
      "## Como decidir",
      "Na prática, o mesmo projeto costuma combinar os três: insulado onde o conforto importa, laminado onde há risco de queda ou exposição ao sol e temperado nas portas. A equipe da Perfect indica a composição ideal já no orçamento.",
    ],
  },
  {
    slug: "pvc-sistema-construtivo-inteligente",
    title: "Por que o PVC de alto desempenho é um sistema construtivo, e não só um material",
    excerpt:
      "Câmaras internas, cantos soldados e reforço em aço: o que acontece dentro do perfil e por que isso muda o conforto da casa.",
    category: "Tecnologia",
    publishedAt: "2026-11-12",
    readingMinutes: 5,
    cover: libraryPhoto("perfil-camaras"),
    body: [
      "Olhando de fora, uma janela de PVC parece só um quadro branco, preto ou amadeirado. A diferença está no que o perfil esconde.",
      "## Múltiplas câmaras internas",
      "Os perfis têm câmaras que quebram a ponte térmica. Na prática, o calor do sol ou o frio de fora não são transferidos para dentro do ambiente.",
      "## Cantos soldados por termofusão",
      "As esquadrias são soldadas nos cantos, formando uma peça única, sem frestas. Fechada, a janela vira um bloco que barra ruído, vento e chuva.",
      "## Estrutura em aço galvanizado",
      "Por dentro, os perfis recebem reforço em aço galvanizado, que garante robustez e segurança mesmo em grandes vãos.",
      "## Manutenção e sustentabilidade",
      "O PVC não precisa de pintura nem verniz: basta água e sabão neutro. O material é 100% reciclável e livre de chumbo, e os aditivos anti-UV mantêm a cor mesmo sob o sol brasileiro.",
    ],
  },
  {
    slug: "perfect-10-anos",
    title: "Perfect, 10 anos: da reforma de casa à indústria",
    excerpt:
      "Como a busca de um casal por esquadrias melhores virou uma fábrica em Arroio Trinta (SC), com showroom e representantes pelo Brasil.",
    category: "Institucional",
    publishedAt: "2026-05-20",
    readingMinutes: 3,
    cover: { ...libraryPhoto("fabrica-aerea-sede") },
    body: [
      "A Perfect nasceu quando Dionei e Shirlei, durante a reforma da própria casa, perceberam que faltavam no mercado regional soluções que unissem estética refinada e vedação real.",
      "## De 2011 a 2026",
      "Os primeiros estudos sobre o PVC começaram em 2011. Em 2016 a empresa foi fundada oficialmente em Arroio Trinta (SC), e em 2018 ganhou sede própria. Entre 2024 e 2026, o parque fabril foi ampliado com novas linhas automatizadas.",
      "## Uma fábrica feita para crescer",
      "Foram R$ 6 milhões investidos no novo parque fabril, em um terreno de 10 mil m², com showroom exclusivo para receber clientes, arquitetos e construtoras.",
      "## O que vem pela frente",
      "Com representantes em diversos estados e foco crescente em projetos verticais, a Perfect chega aos 10 anos com a mesma ideia do começo: esquadria é parte da arquitetura e do dia a dia de quem vive a casa.",
    ],
  },
];

export const blogService = {
  list: (): BlogPostType[] => [...POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),

  findBySlug: (slug: string): BlogPostType | undefined => POSTS.find((post) => post.slug === slug),

  formatDate: (iso: string): string =>
    new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
};
