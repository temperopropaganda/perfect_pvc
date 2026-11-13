import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { SiteFooter } from "@src/components/organisms/SiteFooter";
import { SiteHeader } from "@src/components/organisms/SiteHeader";
import { EASE_GLIDE } from "@src/lib/motion";
import { cn } from "@src/lib/utils";

type SiteTemplateProps = {
  children: ReactNode;
  tone?: "light" | "dark";
};

export const SiteTemplate = ({ children, tone = "light" }: SiteTemplateProps) => {
  const reduce = useReducedMotion();

  return (
    <div
      data-nav={tone === "dark" ? "dark" : undefined}
      className={cn("min-h-[100dvh] bg-background text-foreground", tone === "dark" && "dark")}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-graphite-950"
      >
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <motion.main
        id="conteudo"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_GLIDE }}
      >
        {children}
      </motion.main>
      <SiteFooter />
    </div>
  );
};
