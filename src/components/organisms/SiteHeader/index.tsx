import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

import { Logo } from "@src/components/atoms/Logo";
import { OpeningIcon } from "@src/components/atoms/OpeningIcon";
import { Picture } from "@src/components/atoms/Picture";
import { ScrollTrigger } from "@src/lib/gsap";
import { EASE_GLIDE } from "@src/lib/motion";
import { NAV_CASES, NAV_ITEMS, NAV_PRODUCTS, SITE, type NavMenuId } from "@src/lib/site-config";
import { pauseScroll, resumeScroll } from "@src/lib/smooth-scroll";
import { cn } from "@src/lib/utils";

const PANEL_RADIUS = 22;
const CLOSE_DELAY_MS = 160;

const ProductsMenu = ({ onNavigate }: { onNavigate: () => void }) => {
  const [active, setActive] = useState(0);
  const product = NAV_PRODUCTS[active] ?? NAV_PRODUCTS[0];

  return (
    <div className="grid w-[680px] grid-cols-[1fr_250px] gap-6 p-3 pt-1">
      <div className="flex flex-col">
        <span className="text-label px-3 pb-3 pt-4 text-muted-foreground">Sistemas</span>
        <ul className="grid grid-cols-2 gap-x-2">
          {NAV_PRODUCTS.map((item, index) => (
            <li key={item.slug}>
              <Link
                to={`/produtos?produto=${item.slug}`}
                onClick={onNavigate}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-300",
                  index === active ? "bg-(--glass-hover)" : "opacity-75 hover:opacity-100",
                )}
              >
                <OpeningIcon
                  type={item.slug}
                  open={index === active}
                  className="size-7 shrink-0 opacity-80"
                />
                <span className="flex flex-col">
                  <span className="font-display text-[15px] font-medium tracking-[-0.01em]">
                    {item.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/produtos"
          onClick={onNavigate}
          className="group mt-3 flex items-center gap-2 px-3 py-3 text-sm font-medium"
        >
          Ver todos os produtos e acabamentos
          <ArrowRight className="size-4 transition-transform duration-500 ease-glide group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-graphite-800">
        <AnimatePresence initial={false}>
          <motion.div
            key={product.slug}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_GLIDE }}
          >
            <Picture
              src={`/images/produtos/${product.slug}.webp`}
              alt=""
              width={800}
              height={600}
            />
          </motion.div>
        </AnimatePresence>
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-scrim/70 to-transparent" />
        <span className="font-display absolute bottom-4 left-4 text-xl font-light tracking-[-0.02em] text-white">
          {product.name}
        </span>
      </div>
    </div>
  );
};

const CasesMenu = ({ onNavigate }: { onNavigate: () => void }) => {
  return (
    <div className="flex w-[680px] flex-col gap-1 p-3 pt-1">
      <span className="text-label px-3 pb-3 pt-4 text-muted-foreground">Projetos fotografados</span>
      <ul className="grid grid-cols-3 gap-3">
        {NAV_CASES.map((item) => (
          <li key={item.slug}>
            <Link
              to={`/cases#${item.slug}`}
              onClick={onNavigate}
              className="group flex flex-col gap-3"
            >
              <span className="block aspect-[4/5] overflow-hidden rounded-[14px] bg-graphite-800">
                <Picture
                  src={item.image}
                  alt=""
                  width={800}
                  height={533}
                  sizes="220px"
                  className="transition-transform duration-[1.2s] ease-glide group-hover:scale-[1.06]"
                />
              </span>
              <span className="flex flex-col px-1">
                <span className="font-display text-[15px] font-medium tracking-[-0.01em]">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground">{item.place}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to="/cases"
        onClick={onNavigate}
        className="group mt-2 flex items-center gap-2 px-1 py-3 text-sm font-medium"
      >
        Ver todos os cases
        <ArrowRight className="size-4 transition-transform duration-500 ease-glide group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export const SiteHeader = () => {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [menu, setMenu] = useState<NavMenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const darkZones = useRef(new Set<Element>());
  const closeTimer = useRef<number | undefined>(undefined);

  const openMenu = useCallback((id: NavMenuId) => {
    window.clearTimeout(closeTimer.current);
    setMenu(id);
  }, []);

  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), CLOSE_DELAY_MS);
  }, []);

  const closeAll = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setMenu(null);
    setMobileOpen(false);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    const direction = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setHidden(self.direction === 1 && self.scroll() > 200),
    });
    return () => direction.kill();
  }, []);

  // Seções com data-nav="dark" trocam o vidro para a versão fumê enquanto passam por trás.
  useEffect(() => {
    const zones = darkZones.current;
    zones.clear();
    setOnDark(false);
    let cleanup = () => {};
    const frame = requestAnimationFrame(() => {
      const triggers = Array.from(document.querySelectorAll('[data-nav="dark"]')).map((element) =>
        ScrollTrigger.create({
          trigger: element,
          start: "top 40px",
          end: "bottom 40px",
          onToggle: (self) => {
            if (self.isActive) zones.add(element);
            else zones.delete(element);
            setOnDark(zones.size > 0);
          },
          onRefresh: (self) => {
            if (self.isActive) zones.add(element);
            else zones.delete(element);
            setOnDark(zones.size > 0);
          },
        }),
      );
      cleanup = () => triggers.forEach((trigger) => trigger.kill());
    });
    return () => {
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [pathname]);

  useEffect(() => {
    if (!menu && !mobileOpen) return undefined;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeAll();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, mobileOpen, closeAll]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    pauseScroll();
    return () => resumeScroll();
  }, [mobileOpen]);

  useEffect(() => closeAll(), [pathname, closeAll]);

  const dark = onDark || mobileOpen;
  const panelTransition = reduce ? { duration: 0 } : { duration: 0.6, ease: EASE_GLIDE };

  return (
    <>
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-700 ease-glide md:px-5 md:pt-4",
          hidden && !menu && !mobileOpen && "-translate-y-[130%]",
          dark ? "dark text-foreground" : "text-foreground",
        )}
      >
        <div className="mx-auto flex max-w-(--container-site) items-start justify-between gap-3">
          <motion.div
            layout
            transition={panelTransition}
            style={{ borderRadius: PANEL_RADIUS }}
            onMouseLeave={scheduleClose}
            onMouseEnter={() => window.clearTimeout(closeTimer.current)}
            className={cn(
              "pointer-events-auto overflow-hidden transition-[background-color,border-color] duration-500",
              menu ? "glass-strong" : "glass",
            )}
          >
            <motion.nav
              layout="position"
              transition={panelTransition}
              aria-label="Principal"
              className="flex h-14 items-center gap-2 pl-4 pr-2"
            >
              <Link to="/" aria-label="Perfect, página inicial" className="mr-3 rounded-lg p-1">
                <Logo className={cn("text-[18px]", dark ? "text-white" : "text-blue-700")} />
              </Link>
              <span aria-hidden="true" className="hidden h-5 w-px bg-foreground/15 md:block" />
              <ul className="hidden items-center md:flex">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    {"href" in item ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onMouseEnter={scheduleClose}
                        className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium tracking-[0.01em] opacity-75 transition-opacity duration-300 hover:opacity-100"
                      >
                        {item.label}
                        <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-60" />
                      </a>
                    ) : (
                      <NavLink
                        to={item.to}
                        onClick={closeAll}
                        onMouseEnter={() => (item.menu ? openMenu(item.menu) : scheduleClose())}
                        onFocus={() => item.menu && openMenu(item.menu)}
                        aria-expanded={item.menu ? menu === item.menu : undefined}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium tracking-[0.01em] transition-opacity duration-300",
                            isActive || menu === item.menu
                              ? "opacity-100"
                              : "opacity-75 hover:opacity-100",
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span className="relative">
                              {item.label}
                              {isActive && (
                                <span className="absolute -bottom-1 left-0 h-px w-full bg-current" />
                              )}
                            </span>
                            {item.menu && (
                              <ChevronDown
                                aria-hidden="true"
                                className={cn(
                                  "size-3.5 opacity-60 transition-transform duration-500 ease-glide",
                                  menu === item.menu && "rotate-180",
                                )}
                              />
                            )}
                          </>
                        )}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </motion.nav>

            <AnimatePresence mode="popLayout" initial={false}>
              {menu && (
                <motion.div
                  key={menu}
                  layout="position"
                  initial={reduce ? false : { opacity: 0, y: -8, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.5, ease: EASE_GLIDE }}
                  className="hidden border-t border-foreground/10 md:block"
                >
                  {menu === "produtos" ? (
                    <ProductsMenu onNavigate={closeAll} />
                  ) : (
                    <CasesMenu onNavigate={closeAll} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div
            style={{ borderRadius: PANEL_RADIUS }}
            className="glass pointer-events-auto box-content flex h-14 shrink-0 items-center gap-2 pl-2 pr-2 transition-[background-color,border-color] duration-500"
          >
            <a
              href={SITE.catalogUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium tracking-[0.01em] opacity-75 transition-opacity duration-300 hover:opacity-100 lg:flex"
            >
              Catálogo
              <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-60" />
            </a>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "hidden h-10 items-center rounded-[14px] px-4 text-[13px] font-medium tracking-[0.01em] transition-colors duration-500 sm:flex",
                dark
                  ? "bg-white text-graphite-950 hover:bg-sky-100"
                  : "bg-blue-700 text-white hover:bg-blue-600",
              )}
            >
              Solicitar orçamento
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="menu-mobile"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              className="relative flex size-11 items-center justify-center rounded-full md:hidden"
            >
              <span
                className={cn(
                  "absolute h-px w-5 bg-current transition-transform duration-500 ease-glide",
                  mobileOpen ? "rotate-45" : "-translate-y-1",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-5 bg-current transition-transform duration-500 ease-glide",
                  mobileOpen ? "-rotate-45" : "translate-y-1",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="menu-mobile"
            className="dark glass-strong fixed inset-0 z-40 flex flex-col justify-between rounded-none border-0 px-6 pb-8 pt-28 text-foreground md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.4 }}
          >
            <ul className="flex flex-col">
              {[{ label: "Início", to: "/" }, ...NAV_ITEMS].map((item, index) => (
                <motion.li
                  key={item.label}
                  className="border-b border-border"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index + 0.05, duration: 0.8, ease: EASE_GLIDE }}
                >
                  {"href" in item ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-display flex items-center justify-between py-4 text-[2.4rem]"
                    >
                      {item.label}
                      <ArrowUpRight aria-hidden="true" className="size-6 opacity-50" />
                    </a>
                  ) : (
                    <Link
                      to={item.to}
                      onClick={closeAll}
                      className="text-display block py-4 text-[2.4rem]"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="flex flex-col gap-5"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <a
                href={SITE.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-13 items-center justify-center rounded-[16px] bg-white text-[15px] font-medium text-graphite-950"
              >
                Solicitar orçamento
              </a>
              <div className="flex justify-between text-sm text-muted-foreground">
                <a href={SITE.catalogUrl} target="_blank" rel="noreferrer">
                  Baixar catálogo
                </a>
                <a href={SITE.instagramUrl} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
