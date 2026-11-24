import type { TestimonialType } from "@src/domain/types/testimonial-type";

// Mensagens reais de clientes ao pós-venda da Perfect (prints de WhatsApp enviados em 2026-11-16),
// com ajustes mínimos de grafia. Texto em validação: a Tailane pode reescrever e cada cliente
// precisa autorizar a publicação do nome.
const TESTIMONIALS: TestimonialType[] = [
  { quote: "É outra vida. Não tem nem comparação.", author: "Ariane K.", place: "Tangará (SC)" },
  {
    quote:
      "Funcionando perfeitamente. Vocês sempre muito prestativos! O pós-venda da Perfect é excelente.",
    author: "Letícia A.",
    place: "Lages (SC)",
  },
  {
    quote:
      "Ficou tudo certo, funcionando. Pessoal qualificado pra realizar o serviço é outro nível!",
    author: "Ana Maria U.",
  },
  {
    quote: "Deu para notar a diferença em várias aberturas. Parabéns.",
    author: "Adriano C.",
  },
  { quote: "O diferencial de vocês é o pós-venda. Continuem assim!", author: "Tatiane S." },
  {
    quote: "Agora está tudo ok. Mais uma vez transmito aqui minha admiração. Tudo nota 1000.",
    author: "Rozangela B.",
  },
];

export const testimonialsService = {
  list: (): TestimonialType[] => TESTIMONIALS,
};
