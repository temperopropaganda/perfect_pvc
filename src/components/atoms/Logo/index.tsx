import { cn } from "@src/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

// Marca recortada do favicon oficial; o símbolo herda a cor do texto (currentColor).
export const Logo = ({ className, compact = false }: LogoProps) => {
  return (
    <span className={cn("inline-flex items-center gap-2.5 leading-none", className)}>
      <span
        aria-hidden="true"
        className="size-[1.35em] bg-current mask-[url(/brand/perfect-mark.png)] mask-contain mask-center mask-no-repeat"
      />
      {!compact && (
        <span className="font-display text-[1.25em] font-bold tracking-[-0.035em]">Perfect</span>
      )}
    </span>
  );
};
