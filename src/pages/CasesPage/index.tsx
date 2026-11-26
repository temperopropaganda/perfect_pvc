import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";

import { useDocumentTitle } from "@src/application/hooks/useDocumentTitle";
import { libraryPhoto } from "@src/application/services/library-photos";
import { projectsService } from "@src/application/services/projects-service";
import type { PictureSource } from "@src/components/atoms/Picture";
import { ClosingCta } from "@src/components/organisms/ClosingCta";
import { AboutHero } from "@src/components/organisms/AboutHero";
import { ProjectChapter } from "@src/components/organisms/ProjectChapter";
import { ProjectViewer } from "@src/components/organisms/ProjectViewer";
import { SiteTemplate } from "@src/components/templates/SiteTemplate";
import { Dialog, DialogContent, DialogTitle } from "@src/components/ui/dialog";
import { SITE } from "@src/lib/site-config";
import { pauseScroll, resumeScroll } from "@src/lib/smooth-scroll";

const PROJECT_PARAM = "projeto";
const PHOTO_PARAM = "foto";

const photo = projectsService.photo;

// Fotos de cada composição (principal e secundária), escolhidas pelo enquadramento.
const PICKS: Record<string, [PictureSource, PictureSource]> = {
  cacador: [photo("cacador", "perfect-154"), photo("cacador", "perfect-195")],
  bosque: [photo("bosque", "casabosquefraiburgo-03"), photo("bosque", "casabosquefraiburgo-10")],
  hortencias: [photo("hortencias", "perfect-142"), photo("hortencias", "perfect-139")],
  condominio: [
    photo("condominio", "casacondominiofraiburgo-03"),
    photo("condominio", "casacondominiofraiburgo-10"),
  ],
  "pequeno-paraiso": [
    photo("pequeno-paraiso", "perfect-005"),
    photo("pequeno-paraiso", "perfect-012"),
  ],
  videira: [photo("videira", "perfect-025"), photo("videira", "perfect-013")],
  curva: [photo("curva", "perfect-14"), photo("curva", "perfect-41")],
  "piscina-coberta": [
    photo("piscina-coberta", "primeira-casa-perfect-103"),
    photo("piscina-coberta", "primeira-casa-perfect-45"),
  ],
  grafite: [
    photo("grafite", "segunda-casa-perfect-56"),
    photo("grafite", "segunda-casa-perfect-48"),
  ],
  "treze-tilias": [
    photo("treze-tilias", "casa02trezetilias-09"),
    photo("treze-tilias", "casa02trezetilias-29"),
  ],
  pergolado: [
    photo("pergolado", "terceira-casa-perfect-10"),
    photo("pergolado", "terceira-casa-perfect-19"),
  ],
};

type ViewerData = {
  key: string;
  title: string;
  meta: string;
  summary?: string;
  photos: PictureSource[];
};

const joinMeta = (...parts: (string | number | undefined)[]) =>
  parts.filter((part) => part !== undefined && part !== "").join(" · ");

export const CasesPage = () => {
  useDocumentTitle(
    "Cases · Perfect PVC",
    "Projetos residenciais com esquadrias em PVC Perfect: fotos, sistemas e acabamentos de cada obra.",
  );
  const [params, setParams] = useSearchParams();
  const [lastViewer, setLastViewer] = useState<ViewerData | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const projects = projectsService.list();

  const projectSlug = params.get(PROJECT_PARAM);
  const photoIndex = Number(params.get(PHOTO_PARAM) ?? 0) || 0;

  const viewer = useMemo<ViewerData | null>(() => {
    const project = projectSlug ? projectsService.findBySlug(projectSlug) : undefined;
    if (project) {
      return {
        key: project.slug,
        title: project.title ?? project.name,
        meta: joinMeta(project.title ? project.name : undefined, project.place, project.year),
        ...(project.summary && { summary: project.summary }),
        photos: project.photos,
      };
    }
    return null;
  }, [projectSlug]);

  const isOpen = viewer !== null;
  const shown = viewer ?? lastViewer;

  useEffect(() => {
    if (viewer) setLastViewer(viewer);
  }, [viewer]);

  useEffect(() => {
    if (!isOpen) return undefined;
    pauseScroll();
    return () => resumeScroll();
  }, [isOpen]);

  const openProject = useCallback(
    (slug: string, index: number) =>
      setParams(
        { [PROJECT_PARAM]: slug, [PHOTO_PARAM]: String(index) },
        { preventScrollReset: true },
      ),
    [setParams],
  );
  const selectPhoto = useCallback(
    (index: number) => {
      if (!projectSlug) return;
      setParams(
        { [PROJECT_PARAM]: projectSlug, [PHOTO_PARAM]: String(index) },
        { preventScrollReset: true, replace: true },
      );
    },
    [projectSlug, setParams],
  );
  const close = () => setParams({}, { preventScrollReset: true });

  useEffect(() => {
    if (!isOpen || !viewer || viewer.photos.length < 2) return undefined;
    const total = viewer.photos.length;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") selectPhoto((photoIndex + 1) % total);
      if (event.key === "ArrowLeft") selectPhoto((photoIndex - 1 + total) % total);
    };
    // Captura: o modal do Base UI consome as setas antes de o evento subir até a janela.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [isOpen, viewer, photoIndex, selectPhoto]);

  return (
    <SiteTemplate>
      <AboutHero
        title="Cada obra, uma *paisagem própria.*"
        photo={libraryPhoto("piscina-fachada-pedra")}
        blur={0}
      />

      <div className="bg-background">
        {projects.map((project, index) => {
          const picks = PICKS[project.slug] ?? [project.cover, project.cover];
          return (
            <ProjectChapter
              key={project.slug}
              project={project}
              picks={picks}
              reverse={index % 2 === 1}
              onOpen={(photoIndex) => openProject(project.slug, photoIndex)}
            />
          );
        })}
      </div>

      <ClosingCta
        label="Seu projeto"
        title="Sua obra pode ser *a próxima.*"
        photo={photo("cacador", "perfect-182")}
        primary={{ label: "Solicitar orçamento", href: SITE.whatsappUrl }}
        secondary={{ label: "Ver no Instagram", href: SITE.instagramUrl }}
      />

      <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
        <DialogContent
          ref={popupRef}
          initialFocus={popupRef}
          className="dark grid h-[100dvh] w-screen max-w-none grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] gap-0 rounded-none bg-scrim/95 p-0 text-white ring-0 sm:max-w-none"
        >
          {shown && (
            <>
              <DialogTitle className="sr-only">{shown.title}</DialogTitle>
              <ProjectViewer
                key={shown.key}
                title={shown.title}
                meta={shown.meta}
                {...(shown.summary && { summary: shown.summary })}
                photos={shown.photos}
                index={Math.min(photoIndex, shown.photos.length - 1)}
                onSelect={selectPhoto}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </SiteTemplate>
  );
};
