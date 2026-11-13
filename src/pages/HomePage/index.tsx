import { productsService } from "@src/application/services/products-service";
import { projectsService } from "@src/application/services/projects-service";
import { CertificationBand } from "@src/components/organisms/CertificationBand";
import { ClosingCta } from "@src/components/organisms/ClosingCta";
import { FeaturedProjects } from "@src/components/organisms/FeaturedProjects";
import { FramedScene } from "@src/components/organisms/FramedScene";
import { HomeHero } from "@src/components/organisms/HomeHero";
import { ManifestoSection } from "@src/components/organisms/ManifestoSection";
import { PrecisionSection } from "@src/components/organisms/PrecisionSection";
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
    photo: photo("bosque", "casabosquefraiburgo-28"),
  },
  {
    title: "Cantos soldados por termofusão",
    text: "Cada esquadria vira uma peça única, sem frestas. Fechada, bloqueia ruídos, vento e chuva.",
    photo: photo("cacador", "perfect-186"),
  },
  {
    title: "Múltiplas câmaras internas",
    text: "As câmaras quebram a ponte térmica: o calor do sol e o frio não passam para dentro do ambiente.",
    photo: photo("condominio", "casacondominiofraiburgo-07"),
  },
  {
    title: "Performance tropicalizada",
    text: "Aditivos anti-UV suportam a radiação solar brasileira sem alterar a cor dos perfis.",
    photo: photo("hortencias", "perfect-106"),
  },
];

const FEATURED_SLUGS = ["hortencias", "condominio", "pequeno-paraiso"];

export const HomePage = () => {
  useDocumentTitle("Perfect PVC · Esquadrias em PVC de alto padrão");

  const systems = productsService.listSystems().map((product) => ({
    slug: product.slug,
    name: product.name,
    summary: product.summary,
    photo: { src: product.photo, alt: product.photoAlt, width: 800, height: 600 },
  }));
  const featured = FEATURED_SLUGS.flatMap((slug) => projectsService.findBySlug(slug) ?? []);

  return (
    <SiteTemplate>
      <HomeHero photo={photo("cacador", "perfect-166")} caption="Casa Caçador · Caçador (SC)" />
      <ManifestoSection
        wide={photo("hortencias", "perfect-128")}
        tall={photo("hortencias", "perfect-119")}
      />
      <FramedScene
        photo={photo("bosque", "casabosquefraiburgo-06")}
        label="Integração sem fronteiras"
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
        photo={photo("cacador", "perfect-191")}
        primary={{ label: "Solicitar orçamento", href: SITE.whatsappUrl }}
        secondary={{ label: "Baixar catálogo", href: SITE.catalogUrl }}
      />
    </SiteTemplate>
  );
};
