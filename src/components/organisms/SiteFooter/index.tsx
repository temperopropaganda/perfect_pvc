import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router";

import { Logo } from "@src/components/atoms/Logo";
import { VariableProximity } from "@src/components/atoms/VariableProximity";
import { NAV_ITEMS, SITE } from "@src/lib/site-config";

const linkClass = "link-line text-graphite-300 transition-colors duration-300 hover:text-white";

export const SiteFooter = () => {
  const wordmarkRef = useRef<HTMLDivElement>(null);

  return (
    <footer data-nav="dark" className="dark relative overflow-hidden bg-background text-foreground">
      <div className="site-container flex flex-col gap-20 pb-8 pt-24 md:pt-32">
        <div className="grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col items-start gap-8 md:col-span-5">
            <Logo className="text-[18px] text-white" />
            <p className="text-title max-w-[18ch] text-[clamp(1.75rem,3vw,2.5rem)] text-white">
              Esquadrias em PVC com tecnologia alemã Kömmerling.
            </p>
            <a
              href={SITE.catalogUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white"
            >
              <span className="link-line">Baixar o catálogo</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-500 ease-glide group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          <nav aria-label="Rodapé" className="flex flex-col gap-3 md:col-span-2 md:col-start-7">
            <span className="text-label mb-2 text-graphite-500">Navegue</span>
            <Link to="/" className={linkClass}>
              <span>Início</span>
            </Link>
            {NAV_ITEMS.map((item) =>
              "href" in item ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex flex-col gap-3 md:col-span-3">
            <span className="text-label mb-2 text-graphite-500">Contato</span>
            <address className="not-italic leading-relaxed text-graphite-300">
              {SITE.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <a href={SITE.whatsappUrl} target="_blank" rel="noreferrer" className={linkClass}>
              {SITE.whatsappLabel}
            </a>
            <a href={`mailto:${SITE.email}`} className={linkClass}>
              {SITE.email}
            </a>
          </div>

          <div className="flex flex-col gap-3 md:col-span-2">
            <span className="text-label mb-2 text-graphite-500">Redes</span>
            <a href={SITE.instagramUrl} target="_blank" rel="noreferrer" className={linkClass}>
              Instagram
            </a>
            <a href={SITE.facebookUrl} target="_blank" rel="noreferrer" className={linkClass}>
              Facebook
            </a>
            <img
              src="/brand/selo-janela-qualificada.png"
              alt="Selo Janela Qualificada ASPEC PVC"
              loading="lazy"
              width={650}
              height={591}
              className="mt-4 w-20 rounded-lg bg-white p-2"
            />
          </div>
        </div>

        <div
          ref={wordmarkRef}
          aria-hidden="true"
          className="font-display -mb-4 select-none text-center leading-[0.78] tracking-[-0.07em] text-graphite-800 md:-mb-8"
        >
          <VariableProximity
            label="perfect"
            containerRef={wordmarkRef}
            fromFontVariationSettings="'wght' 200"
            toFontVariationSettings="'wght' 700"
            radius={280}
            falloff="gaussian"
            fontSize="clamp(5.5rem, 25vw, 24rem)"
          />
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-border pt-6 text-xs text-graphite-500 sm:flex-row">
          <span>© Perfect Esquadrias em PVC. Todos os direitos reservados.</span>
          <a href={SITE.agencyUrl} target="_blank" rel="noreferrer" className="hover:text-white">
            Tempero Propaganda
          </a>
        </div>
      </div>
    </footer>
  );
};
