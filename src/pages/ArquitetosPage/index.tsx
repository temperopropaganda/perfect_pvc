import { useDocumentTitle } from "@src/application/hooks/useDocumentTitle";
import { libraryPhoto } from "@src/application/services/library-photos";
import { AboutHero } from "@src/components/organisms/AboutHero";
import { ArchitectKitForm } from "@src/components/organisms/ArchitectKitForm";
import { FunctionSeals } from "@src/components/organisms/FunctionSeals";
import { SplitCallout } from "@src/components/organisms/SplitCallout";
import { SiteTemplate } from "@src/components/templates/SiteTemplate";
import { SITE, whatsappWith } from "@src/lib/site-config";

// Conteúdo provisório: a equipe de conteúdo vai produzir o texto definitivo para arquitetos.
const ENGINEERING_URL = whatsappWith(
  "Olá! Sou arquiteto(a) e gostaria de falar com a engenharia da Perfect sobre um projeto.",
);

export const ArquitetosPage = () => {
  useDocumentTitle(
    "Para arquitetos · Perfect PVC",
    "Kit do arquiteto, suporte da engenharia e especificação de esquadrias em PVC Perfect.",
  );

  return (
    <SiteTemplate>
      <AboutHero
        label="Para arquitetos"
        title="Seu projeto, *nossa engenharia.*"
        text="Da escolha da tipologia à compatibilização dos vãos, a Perfect trabalha junto com o escritório para que a esquadria entregue o que o projeto desenhou."
        meta={["Kit de amostras", "Suporte técnico", "Visita ao showroom"]}
        photo={libraryPhoto("jantar-vista-panoramica")}
        blur={2}
      />

      <SplitCallout
        label="Engenharia simultânea"
        title="Especifique com *quem fabrica.*"
        variant="text"
        actions={[
          { label: "Falar com a engenharia", href: ENGINEERING_URL },
          { label: "Baixar catálogo", href: SITE.catalogUrl },
        ]}
      >
        <p>
          Suporte técnico direto com a equipe do projeto e da obra para compatibilizar detalhes,
          otimizar vãos e indicar o vidro ideal para cada ambiente.
        </p>
        <p>
          Perfis Kömmerling com cantos soldados por termofusão, múltiplas câmaras e reforço em aço
          galvanizado, ensaiados até o grau máximo de permeabilidade, estanqueidade e resistência ao
          vento.
        </p>
      </SplitCallout>

      <ArchitectKitForm />

      <FunctionSeals />
    </SiteTemplate>
  );
};
