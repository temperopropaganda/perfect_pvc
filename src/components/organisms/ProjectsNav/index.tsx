import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { ScrollTrigger, useGSAP } from "@src/lib/gsap";
import { EASE_GLIDE } from "@src/lib/motion";
import { scrollToElement } from "@src/lib/smooth-scroll";
import { cn } from "@src/lib/utils";

type ProjectsNavProps = {
  items: { slug: string; label: string }[];
};

// Índice flutuante de vidro que acompanha os capítulos de projeto.
export const ProjectsNav = ({ items }: ProjectsNavProps) => {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useGSAP(() => {
    const chapters = Array.from(document.querySelectorAll<HTMLElement>("[data-project-chapter]"));
    const first = chapters[0];
    const last = chapters[chapters.length - 1];
    if (!first || !last) return;
    ScrollTrigger.create({
      trigger: first,
      endTrigger: last,
      start: "top 70%",
      end: "bottom 40%",
      onToggle: (self) => setVisible(self.isActive),
    });
    chapters.forEach((chapter) =>
      ScrollTrigger.create({
        trigger: chapter,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(chapter.dataset["projectChapter"] ?? null),
      }),
    );
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Projetos"
          className="glass fixed inset-x-0 bottom-5 z-40 mx-auto hidden w-max items-center gap-1 rounded-full p-1.5 md:flex"
          initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: EASE_GLIDE }}
        >
          {items.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => scrollToElement(`#${item.slug}`)}
              aria-current={active === item.slug}
              className={cn(
                "relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                active === item.slug ? "text-white" : "text-graphite-600 hover:text-graphite-950",
              )}
            >
              {active === item.slug && (
                <motion.span
                  layoutId="projects-nav-active"
                  className="absolute inset-0 rounded-full bg-graphite-950"
                  transition={{ duration: 0.5, ease: EASE_GLIDE }}
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
