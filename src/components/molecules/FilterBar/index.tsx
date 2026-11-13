import { motion } from "motion/react";
import { useId } from "react";

import { cn } from "@src/lib/utils";

type FilterBarOption<TValue extends string> = {
  value: TValue;
  label: string;
  count: number;
};

type FilterBarProps<TValue extends string> = {
  label: string;
  options: FilterBarOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  className?: string;
};

const SPRING = { type: "spring", stiffness: 420, damping: 38, mass: 0.9 } as const;

export const FilterBar = <TValue extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: FilterBarProps<TValue>) => {
  const indicatorId = useId();

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "glass dark:glass-dark inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none]",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative isolate flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[15px] font-medium transition-colors duration-300",
              active ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={indicatorId}
                transition={SPRING}
                className="absolute inset-0 -z-10 rounded-full bg-primary shadow-[0_8px_20px_-10px_var(--primary)]"
              />
            )}
            <span>{option.label}</span>
            <span className="text-xs tabular-nums opacity-60">{option.count}</span>
          </button>
        );
      })}
    </div>
  );
};
