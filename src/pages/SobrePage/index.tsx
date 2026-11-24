import { useDocumentTitle } from "@src/application/hooks/useDocumentTitle";
import { libraryPhoto } from "@src/application/services/library-photos";
import { projectsService } from "@src/application/services/projects-service";
import { AboutHero } from "@src/components/organisms/AboutHero";
import { CertificationBand } from "@src/components/organisms/CertificationBand";
import { ClosingCta } from "@src/components/organisms/ClosingCta";
import { EditorialSplit } from "@src/components/organisms/EditorialSplit";
import { PillarsStatement } from "@src/components/organisms/PillarsStatement";
import { ProcessSteps } from "@src/components/organisms/ProcessSteps";
import { Timeline } from "@src/components/organisms/Timeline";
import { StoryFeature } from "@src/components/organisms/StoryFeature";
import { SiteTemplate } from "@src/components/templates/SiteTemplate";
import { SITE } from "@src/lib/site-config";

// Todos os textos desta página vêm do catálogo Perfect 2026 (páginas "Tranquilidade",
// "Expandindo sonhos", "Por trás do design", "Desempenho" e "Do projeto à instalação").
const MILESTONES = [
  { year: "2011", text: "O início de um sonho e os primeiros estudos sobre a tecnologia do PVC." },
  {
    year: "2016",
    text: "Fundação oficial da Perfect e início das operações em Arroio Trinta (SC).",
  },
  { year: "2018", text: "Inauguração da sede própria e modernização dos processos." },
  {
    year: "2024/26",
    text: "Expansão do parque fabril e implementação de novas linhas automatizadas.",
  },
];

const HIGHLIGHTS = [
  { value: "R$ 6 milhões", text: "investidos no novo parque fabril, com showroom exclusivo." },
  { value: "10 mil m²", text: "de terreno para atender grandes empreendimentos e residências." },
];

const STEPS = [
  { title: "Orçamento", text: "Analisamos seu projeto e sugerimos as melhores tipologias." },
  {
    title: "Medição final",
    text: "Nossa equipe visita a obra para conferir os vãos com exatidão.",
  },
  { title: "Produção", text: "Fabricação automatizada em nossa planta industrial." },
  { title: "Agendamento", text: "Definimos a data ideal conforme o avanço da sua obra." },
  { title: "Instalação", text: "Equipe própria, treinada para montagem e ajuste perfeito." },
  { title: "Entrega técnica", text: "Verificação de funcionamento e orientações de uso." },
];

const FOLLOW_UP = {
  title: "Acompanhamento da obra",
  text: "Nossa equipe acompanha a obra durante sua construção, para garantir o melhor resultado.",
};

export const SobrePage = () => {
  useDocumentTitle(
    "Sobre a Perfect · Esquadrias em PVC",
    "A Perfect nasceu em Arroio Trinta (SC) e transforma perfis Kömmerling em esquadrias de PVC de alto padrão.",
  );

  return (
    <SiteTemplate>
      <AboutHero
        label="Sobre a Perfect"
        title="Não fabricamos *apenas janelas.*"
        text="Esquadria é parte da arquitetura e também do dia a dia. Ela define como a luz entra, como o vento circula e como a chuva fica do lado de fora."
        meta={["Arroio Trinta (SC)", "Desde 2016", "Perfis Kömmerling"]}
        photo={{
          src: "/images/sobre/sobre-01.webp",
          width: 1920,
          height: 1282,
          alt: "Mulher atravessa grandes portas de vidro em PVC em direção ao jardim",
        }}
      />

      <StoryFeature
        index="01"
        label="Origem"
        title="Da reforma do lar do casal à *paixão pelos perfis em PVC.*"
        photo={{
          src: "/images/sobre/fundadores-casa",
          width: 800,
          height: 534,
          alt: "Dionei e Shirlei, fundadores da Perfect, sorriem na sala de casa",
        }}
      >
        <p>
          A Perfect nasceu quando os proprietários, Dionei e Shirlei, identificaram uma lacuna no
          mercado regional por soluções construtivas que unissem estética refinada e vedação real.
        </p>
        <p>
          O que era um sonho em 2011 transformou-se em indústria. Cada perfil soldado e cada vidro
          encaixado na fábrica tem um propósito único.
        </p>
      </StoryFeature>

      <Timeline
        title="De um barracão alugado à *sede própria.*"
        milestones={MILESTONES}
        highlight={HIGHLIGHTS}
      />

      <EditorialSplit
        title="A beleza precisa ser sustentada por *resultados técnicos.*"
        photos={[
          { ...libraryPhoto("fabrica-corte-perfil") },
          { ...projectsService.photo("bosque", "casabosquefraiburgo-28") },
        ]}
      >
        <p>
          Perfis exclusivamente Kömmerling e controle de qualidade do corte à montagem: a esquadria
          que chega à obra tem o desempenho exigido pela norma NBR 15575.
        </p>
      </EditorialSplit>

      <PillarsStatement label="Pilares" words={["Segurança", "Compromisso", "Credibilidade"]} />

      <CertificationBand />

      <ProcessSteps
        label="Como trabalhamos"
        title="Do projeto *à instalação.*"
        steps={STEPS}
        note={FOLLOW_UP}
      />

      <ClosingCta
        label="Fale com a Perfect"
        title="Tranquilidade, proteção e conforto *no seu lar.*"
        photo={projectsService.photo("hortencias", "perfect-115")}
        primary={{ label: "Solicitar orçamento", href: SITE.whatsappUrl }}
        secondary={{ label: "Baixar catálogo", href: SITE.catalogUrl }}
      />
    </SiteTemplate>
  );
};
