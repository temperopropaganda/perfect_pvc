import { Check, ImageIcon } from "lucide-react";
import { useState, type FormEvent } from "react";

import { RevealText } from "@src/components/atoms/RevealText";

const FIELDS = [
  { name: "nome", label: "Nome", type: "text", autoComplete: "name" },
  { name: "escritorio", label: "Escritório", type: "text", autoComplete: "organization" },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
  { name: "telefone", label: "Telefone/WhatsApp", type: "tel", autoComplete: "tel" },
] as const;

// Formulário do kit para arquitetos. No protótipo o envio só confirma na tela: a integração com o
// CRM ou o e-mail da Perfect entra na versão de produção.
export const ArchitectKitForm = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="kit"
      data-nav="dark"
      className="dark overflow-hidden bg-background py-(--spacing-section) text-foreground"
    >
      <div className="site-container grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-8 md:col-span-5">
          <span className="text-label text-graphite-300">Kit do arquiteto</span>
          <RevealText
            as="h2"
            text="Receba o kit Perfect *no seu escritório.*"
            className="text-title text-[clamp(2rem,3.6vw,3.5rem)] text-white"
            emphasisClassName="text-gold-300"
          />
          <p className="max-w-[40ch] text-[17px] leading-relaxed text-graphite-300">
            Deixe seu contato e nossa equipe entra em contato para combinar a entrega do kit e
            apresentar os sistemas Perfect para o seu próximo projeto.
          </p>
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-white/25 text-graphite-400">
            <ImageIcon aria-hidden="true" className="size-8" />
            <span className="text-sm">Foto do kit (em produção)</span>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:self-center">
          {sent ? (
            <div
              role="status"
              className="flex flex-col items-start gap-6 rounded-3xl border border-white/15 p-8 md:p-10"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-gold-300 text-graphite-950">
                <Check aria-hidden="true" className="size-6" />
              </span>
              <p className="font-display text-2xl text-white">Pedido recebido.</p>
              <p className="text-graphite-300">
                Nossa equipe vai entrar em contato em breve para combinar o envio do kit.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {FIELDS.map((field) => (
                  <label key={field.name} className="flex flex-col gap-2 text-sm text-graphite-300">
                    {field.label}
                    <input
                      required
                      name={field.name}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      className="h-12 border-b border-white/30 bg-transparent text-base text-white outline-none transition-colors focus:border-white"
                    />
                  </label>
                ))}
                <label className="flex flex-col gap-2 text-sm text-graphite-300 sm:col-span-2">
                  Cidade/UF
                  <input
                    required
                    name="cidade"
                    autoComplete="address-level2"
                    className="h-12 border-b border-white/30 bg-transparent text-base text-white outline-none transition-colors focus:border-white"
                  />
                </label>
              </div>
              <label className="flex gap-3 text-xs leading-relaxed text-graphite-400">
                <input
                  required
                  type="checkbox"
                  name="lgpd"
                  className="mt-0.5 size-4 shrink-0 accent-white"
                />
                De acordo com a Lei Geral de Proteção de Dados, concordo em fornecer os dados acima
                para que a Perfect entre em contato comigo sobre o kit e seus produtos.
              </label>
              <button
                type="submit"
                className="inline-flex h-13 items-center justify-center self-start rounded-full bg-white px-7 text-[15px] font-medium text-graphite-950 transition-colors duration-500 ease-glide hover:bg-sky-50"
              >
                Solicitar o kit
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
