import { libraryPhoto } from "@src/application/services/library-photos";
import { productsService } from "@src/application/services/products-service";
import { projectsService } from "@src/application/services/projects-service";
import { CertificationBand } from "@src/components/organisms/CertificationBand";
import { ClosingCta } from "@src/components/organisms/ClosingCta";
import { FeaturedProjects } from "@src/components/organisms/FeaturedProjects";
import { HomeHero } from "@src/components/organisms/HomeHero";
import { ManifestoSection } from "@src/components/organisms/ManifestoSection";
import { PrecisionSection } from "@src/components/organisms/PrecisionSection";
import { ShowcaseSection } from "@src/components/organisms/ShowcaseSection";
import { SystemsTrack } from "@src/components/organisms/SystemsTrack";
import { TiltTurnShowcase } from "@src/components/organisms/TiltTurnShowcase";
import { SiteTemplate } from "@src/components/templates/SiteTemplate";
import { useDocumentTitle } from "@src/application/hooks/useDocumentTitle";
import { SITE } from "@src/lib/site-config";

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

// Cases do acordeão da Home: seis painéis cabem com folga na largura do desktop.
const FEATURED_SLUGS = ["cacador", "curva", "piscina-coberta", "grafite", "condominio", "videira"];

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
      <CertificationBand />
      <FeaturedProjects items={featured} />
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
