import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { cn } from "@src/lib/utils";

type PillVariant =
  "primary" | "brand" | "ice" | "light" | "glass" | "outline" | "outline-brand" | "outline-light";

type PillCommonProps = {
  children: ReactNode;
  variant?: PillVariant;
  size?: "md" | "lg";
  icon?: "arrow" | "external" | "none";
  className?: string;
};

type PillLinkProps = PillCommonProps & { to: string };
type PillAnchorProps = PillCommonProps & { href: string };
type PillActionProps = PillCommonProps & { onClick: () => void };

type PillButtonProps = PillLinkProps | PillAnchorProps | PillActionProps;

const VARIANT_CLASSES: Record<PillVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/88",
  brand: "bg-blue-700 text-white hover:bg-blue-600",
  ice: "bg-sky-100 text-blue-800 hover:bg-white",
  light: "bg-white text-graphite-950 hover:bg-sky-50",
  glass: "glass text-foreground hover:bg-(--glass-hover)",
  outline: "border border-foreground/20 text-foreground hover:border-foreground/50",
  "outline-brand": "border border-blue-700/30 text-blue-700 hover:border-blue-700/70",
  "outline-light": "border border-white/35 text-white hover:border-white/80",
};

const SIZE_CLASSES = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

export const PillButton = (props: PillButtonProps) => {
  const { children, variant = "primary", size = "md", icon = "arrow", className } = props;
  const classes = cn(
    "group/pill inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-btn font-medium tracking-[0.005em]",
    "transition-[transform,background-color,border-color,color] duration-500 ease-glide active:scale-[0.97]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    icon !== "none" && "pr-5",
    className,
  );
  const IconComponent = icon === "external" ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      <span>{children}</span>
      {icon !== "none" && (
        <IconComponent
          aria-hidden="true"
          className="size-4 transition-transform duration-300 ease-glide group-hover/pill:translate-x-0.5"
        />
      )}
    </>
  );

  if ("to" in props) {
    return (
      <Link to={props.to} className={classes}>
        {content}
      </Link>
    );
  }

  if ("href" in props) {
    return (
      <a href={props.href} target="_blank" rel="noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={props.onClick} className={classes}>
      {content}
    </button>
  );
};
