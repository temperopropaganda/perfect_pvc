import { cn } from "@src/lib/utils";

type ScrollCueProps = {
  label?: string;
  className?: string;
};

export const ScrollCue = ({ label = "Role", className }: ScrollCueProps) => {
  return (
    <span aria-hidden="true" className={cn("flex flex-col items-center gap-3", className)}>
      <span className="text-label opacity-70">{label}</span>
      <span className="relative h-14 w-px overflow-hidden bg-current/20">
        <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-current" />
      </span>
    </span>
  );
};
