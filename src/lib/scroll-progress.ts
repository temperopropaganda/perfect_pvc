// Valor de progresso compartilhado fora do estado do React: o ScrollTrigger escreve e a cena 3D
// lê, sem re-renderizar componentes a cada evento de scroll.
export type ScrollProgress = {
  get: () => number;
  set: (value: number) => void;
  subscribe: (listener: () => void) => () => void;
};

export const createScrollProgress = (initial = 0): ScrollProgress => {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set: (next) => {
      if (next === value) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};
