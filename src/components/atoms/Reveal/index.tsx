import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  // false deixa só o fade (e o deslocamento, se houver), sem desfoque.
  blur?: boolean;
  className?: string;
};

const EASE_GLIDE = [0.16, 1, 0.3, 1] as const;

export const Reveal = ({ children, delay = 0, y = 24, blur = true, className }: RevealProps) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, ...(blur && { filter: "blur(6px)" }) }}
      whileInView={{ opacity: 1, y: 0, ...(blur && { filter: "blur(0px)" }) }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay, ease: EASE_GLIDE }}
    >
      {children}
    </motion.div>
  );
};
