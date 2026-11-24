import { useDocumentTitle } from "@src/application/hooks/useDocumentTitle";
import { dealersService } from "@src/application/services/dealers-service";
import { libraryPhoto } from "@src/application/services/library-photos";
import { ClosingCta } from "@src/components/organisms/ClosingCta";
import { DealerDirectory } from "@src/components/organisms/DealerDirectory";
import { PageIntro } from "@src/components/organisms/PageIntro";
import { SplitCallout } from "@src/components/organisms/SplitCallout";
import { SiteTemplate } from "@src/components/templates/SiteTemplate";
import { SHOWROOM_VISIT_URL, SITE } from "@src/lib/site-config";

export const OndeComprarPage = () => {
  useDocumentTitle(
    "Onde comprar · Perfect PVC",
    "Fábrica em Arroio Trinta (SC) e lojas parceiras Perfect em diversos estados do Brasil.",
  );

  const dealers = dealersService.list();
  const states = dealersService.states();

  return (
    <SiteTemplate>
      <PageIntro
        label="Onde comprar"
        title="Perfect *em todo o Brasil.*"
        text="Uma indústria em Santa Catarina com lojas parceiras e representantes do Sul ao Nordeste, preparados para levar as esquadrias Perfect até a sua obra."
        meta={[
          `${dealers.length} lojas parceiras`,
          `${states.length} estados`,
          "Fábrica em Arroio Trinta (SC)",
        ]}
        photo={libraryPhoto("fabrica-aerea-sede")}
      />

      <SplitCallout
        label="Fábrica e showroom"
        title="Compre direto *de quem fabrica.*"
        photo={libraryPhoto("fabrica-aerea-logo")}
        actions={[
          { label: "Falar no WhatsApp", href: SITE.whatsappUrl },
          { label: "Agendar visita ao showroom", href: SHOWROOM_VISIT_URL },
        ]}
      >
        <address className="flex flex-col gap-1 not-italic">
          {SITE.addressLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span>Saída para Treze Tílias</span>
        </address>
        <p>
          {SITE.whatsappLabel} · {SITE.email}
        </p>
      </SplitCallout>

      <DealerDirectory groups={dealersService.groupedByRegion()} />

      <ClosingCta
        label="Seja um parceiro"
        title="Quer vender Perfect *na sua região?*"
        photo={libraryPhoto("showroom-marca")}
        primary={{ label: "Quero ser representante", href: SITE.resellerUrl }}
        secondary={{ label: "Baixar catálogo", href: SITE.catalogUrl }}
      />
    </SiteTemplate>
  );
};
