import { libraryPhoto } from "@src/application/services/library-photos";
import { productsService } from "@src/application/services/products-service";
import { projectsService } from "@src/application/services/projects-service";
import { CertificationBand } from "@src/components/organisms/CertificationBand";
import { ClosingCta } from "@src/components/organisms/ClosingCta";
import { FeaturedProjects } from "@src/components/organisms/FeaturedProjects";
import { FunctionSeals } from "@src/components/organisms/FunctionSeals";
import { HomeHero } from "@src/components/organisms/HomeHero";
import { ManifestoSection } from "@src/components/organisms/ManifestoSection";
import { PrecisionSection } from "@src/components/organisms/PrecisionSection";
import { ShowcaseSection } from "@src/components/organisms/ShowcaseSection";
import { SplitCallout } from "@src/components/organisms/SplitCallout";
import { SystemsTrack } from "@src/components/organisms/SystemsTrack";
import { Testimonials } from "@src/components/organisms/Testimonials";
import { TiltTurnShowcase } from "@src/components/organisms/TiltTurnShowcase";
import { SiteTemplate } from "@src/components/templates/SiteTemplate";
import { useDocumentTitle } from "@src/application/hooks/useDocumentTitle";
import { testimonialsService } from "@src/application/services/testimonials-service";
import { SHOWROOM_VISIT_URL, SITE } from "@src/lib/site-config";

const photo = projectsService.photo;

// Textos dos atributos: página "Desempenho" do catálogo Perfect 2026.
const PRECISION_FACTS = [
  {
    title: "Tecnologia alemã",
    text: "Perfis exclusivamente Kömmerling, líder mundial em extrusão, com a mesma qualidade encontrada na Europa.",
    photo: libraryPhoto("perfil-cores"),
  },
  {
    title: "Cantos soldados por termofusão",
    text: "Cada esquadria vira uma peça única, sem frestas. Fechada, bloqueia ruídos, vento e chuva.",
    photo: libraryPhoto("perfil-canto"),
  },
  {
    title: "Múltiplas câmaras internas",
    text: "As câmaras quebram a ponte térmica: o calor do sol e o frio não passam para dentro do ambiente.",
    photo: libraryPhoto("perfil-camaras"),
  },
  {
    title: "Performance tropicalizada",
    text: "Aditivos anti-UV suportam a radiação solar brasileira sem alterar a cor dos perfis.",
    photo: libraryPhoto("perfil-amadeirado"),
  },
];

// Cases do acordeão da Home: seis painéis cabem com folga na largura do desktop. As obras de 2026
// vêm primeiro, como pedido na revisão de 2026-11-23.
const FEATURED_SLUGS = [
  "pe-direito-duplo",
  "pedra-madeira",
  "piscina-coberta",
  "perfis-pretos",
  "grafite",
  "cacador",
];

export const HomePage = () => {
  useDocumentTitle("Perfect PVC · Esquadrias em PVC de alto padrão");

  const systems = productsService.listSystems().map((product) => ({
    slug: product.slug,
    name: product.name,
    summary: product.summary,
    photo: product.portrait ?? {
      src: product.photo,
      alt: product.photoAlt,
      width: 800,
      height: 600,
    },
  }));
  const featured = FEATURED_SLUGS.flatMap((slug) => projectsService.findBySlug(slug) ?? []);

  return (
    <SiteTemplate>
      <HomeHero photo={libraryPhoto("fachada-anoitecer-piscina")} />
      <ManifestoSection photo={photo("videira", "perfect-013")} />
      <ShowcaseSection
        word="Horizonte"
        photo={libraryPhoto("correr-jardim")}
        title="O jardim também é sala."
        text="Sistemas de correr conectam ambientes internos e externos com um deslizamento suave."
      />
      <SystemsTrack items={systems} />
      <TiltTurnShowcase />
      <PrecisionSection
        label="Por trás do design"
        title="Um sistema construtivo inteligente."
        facts={PRECISION_FACTS}
      />
      <FunctionSeals />
      <CertificationBand />
      <FeaturedProjects items={featured} />
      <Testimonials items={testimonialsService.list()} />
      <SplitCallout
        label="Showroom"
        title="Venha conhecer a Perfect *de perto.*"
        photo={libraryPhoto("showroom-marca")}
        actions={[
          { label: "Agende sua visita", href: SHOWROOM_VISIT_URL },
          { label: "Saiba mais", to: "/sobre" },
        ]}
      >
        <p>
          No showroom do novo parque fabril, em Arroio Trinta (SC), você vê os sistemas de abertura,
          as cores dos perfis e as opções de vidro antes de decidir.
        </p>
      </SplitCallout>
      <SplitCallout
        label="Para arquitetos"
        title="Especifique com *quem fabrica.*"
        photo={libraryPhoto("perfil-cores")}
        tone="dark"
        reverse
        actions={[{ label: "Espaço do arquiteto", to: "/arquitetos" }]}
      >
        <p>
          Um canal direto com a engenharia da Perfect para compatibilizar projetos, escolher
          tipologias e solicitar o kit de amostras de perfis e cores.
        </p>
      </SplitCallout>
      <ClosingCta
        label="Orçamento"
        title="Realizar sonhos é o *nosso alto padrão.*"
        photo={libraryPhoto("fachada-piscina")}
        primary={{ label: "Solicitar orçamento", href: SITE.whatsappUrl }}
        secondary={{ label: "Baixar catálogo", href: SITE.catalogUrl }}
      />
    </SiteTemplate>
  );
};
