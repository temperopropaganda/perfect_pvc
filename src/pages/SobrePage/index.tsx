import { useDocumentTitle } from "@src/application/hooks/useDocumentTitle";
import { libraryPhoto } from "@src/application/services/library-photos";
import { projectsService } from "@src/application/services/projects-service";
import { AboutHero } from "@src/components/organisms/AboutHero";
import { AnniversarySection } from "@src/components/organisms/AnniversarySection";
import { CertificationBand } from "@src/components/organisms/CertificationBand";
import { ClosingCta } from "@src/components/organisms/ClosingCta";
import { EditorialSplit } from "@src/components/organisms/EditorialSplit";
import { PillarsStatement } from "@src/components/organisms/PillarsStatement";
import { ProcessSteps } from "@src/components/organisms/ProcessSteps";
import { QualitySeals } from "@src/components/organisms/QualitySeals";
import { ShowcaseSection } from "@src/components/organisms/ShowcaseSection";
import { SplitCallout } from "@src/components/organisms/SplitCallout";
import { StoryFeature } from "@src/components/organisms/StoryFeature";
import { Timeline } from "@src/components/organisms/Timeline";
import { VideoFeature } from "@src/components/organisms/VideoFeature";
import { SiteTemplate } from "@src/components/templates/SiteTemplate";
import { INSTAGRAM_POSTS, SHOWROOM_VISIT_URL, SITE } from "@src/lib/site-config";

// Todos os textos desta página vêm do catálogo Perfect 2026 (páginas "Tranquilidade",
// "Expandindo sonhos", "Por trás do design", "Desempenho", "Provas de excelência" e
// "Do projeto à instalação").
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

const ANNIVERSARY_LINKS = [
  { label: "Fotos da festa de 10 anos", href: INSTAGRAM_POSTS.anniversary[0] },
  { label: "Vídeo do evento", href: INSTAGRAM_POSTS.anniversary[1] },
  { label: "Homenagens e bastidores", href: INSTAGRAM_POSTS.anniversary[2] },
];

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
        photo={libraryPhoto("fundadores-showroom")}
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

      <ShowcaseSection
        word="Fábrica"
        photo={libraryPhoto("fabrica-aerea-catalogo")}
        title="Expandindo sonhos."
        text="Um parque fabril de 10 mil m² em Arroio Trinta (SC), preparado para atender grandes empreendimentos e residências em todo o Brasil."
      />

      <EditorialSplit
        title="A beleza precisa ser sustentada por *resultados técnicos.*"
        photos={[libraryPhoto("fabrica-corte-perfil"), libraryPhoto("fabrica-montagem")]}
      >
        <p>
          Perfis exclusivamente Kömmerling e controle de qualidade do corte à montagem: a esquadria
          que chega à obra tem o desempenho exigido pela norma NBR 15575.
        </p>
      </EditorialSplit>

      <VideoFeature
        label="Vídeo institucional"
        title="Conheça a Perfect *por dentro.*"
        text="Da fábrica em Arroio Trinta à instalação na obra: o processo que transforma perfis em esquadrias de alto desempenho."
        poster={libraryPhoto("fabrica-maquina")}
        fallbackUrl={INSTAGRAM_POSTS.institutional}
      />

      <PillarsStatement label="Pilares" words={["Segurança", "Compromisso", "Credibilidade"]} />

      <QualitySeals />

      <CertificationBand />

      <SplitCallout
        label="Showroom"
        title="Veja, toque e abra *antes de escolher.*"
        photo={libraryPhoto("showroom-marca")}
        reverse
        actions={[
          { label: "Agende sua visita", href: SHOWROOM_VISIT_URL },
          { label: "Como chegar", href: SITE.mapsUrl },
        ]}
      >
        <p>
          O showroom exclusivo fica no novo parque fabril, em Arroio Trinta (SC). Lá você vê de
          perto os sistemas de abertura, as cores dos perfis e as opções de vidro.
        </p>
        <p>
          A visita é acompanhada pela nossa equipe, que ajuda a definir as soluções do seu projeto.
        </p>
      </SplitCallout>

      <AnniversarySection photo={libraryPhoto("placa-10-anos")} links={ANNIVERSARY_LINKS} />

      <ProcessSteps
        label="Como trabalhamos"
        title="Do projeto *à instalação.*"
        steps={STEPS}
        note={FOLLOW_UP}
      />

      <ClosingCta
        label="Fale com a Perfect"
        title="Tranquilidade, proteção e conforto *no seu lar.*"
        photo={projectsService.photo("pe-direito-duplo", "quinta-casa-perfect-42")}
        primary={{ label: "Solicitar orçamento", href: SITE.whatsappUrl }}
        secondary={{ label: "Baixar catálogo", href: SITE.catalogUrl }}
      />
    </SiteTemplate>
  );
};
