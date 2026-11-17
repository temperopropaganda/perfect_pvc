import { useId, type Ref } from "react";

import { cn } from "@src/lib/utils";

type ShowcaseWordProps = {
  word: string;
  // "fill": letras sólidas (área escura). "outline": só o contorno (sobre a foto).
  variant: "fill" | "outline";
  // Espessura do contorno, em px.
  outlineWidth?: number;
  className?: string;
  ref?: Ref<HTMLSpanElement>;
};

// Palavra gigante da ShowcaseSection. As duas variantes são o MESMO texto, na mesma posição e
// métrica; quem decide onde cada uma aparece é o recorte do container em que ela está.
//
// Contorno: não usamos -webkit-text-stroke. A Inter Tight é variável e fontes variáveis mantêm
// contornos sobrepostos dentro de cada letra (barra do A, junções do N, til do Ã); o stroke desenha
// essas sobreposições e cria "nós". Em vez disso, o filtro abaixo pega a silhueta da letra
// preenchida, erode alguns px para dentro e mantém só a diferença: um anel uniforme que segue o
// desenho real da fonte, sem sobreposições, e encaixa exatamente na borda da camada sólida.
export const ShowcaseWord = ({
  word,
  variant,
  outlineWidth = 1.5,
  className,
  ref,
}: ShowcaseWordProps) => {
  const filterId = `showcase-outline-${useId().replace(/:/g, "")}`;
  const isOutline = variant === "outline";

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center",
        className,
      )}
    >
      {isOutline && (
        <svg className="absolute size-0" aria-hidden="true" focusable="false">
          <filter id={filterId} x="-5%" y="-20%" width="110%" height="140%">
            <feMorphology in="SourceAlpha" operator="erode" radius={outlineWidth} result="inner" />
            <feComposite in="SourceAlpha" in2="inner" operator="out" result="ring" />
            <feFlood floodColor="white" />
            <feComposite in2="ring" operator="in" />
          </filter>
        </svg>
      )}
      <span
        className="text-display whitespace-nowrap text-[length:var(--showcase-word-size)] font-normal uppercase leading-none tracking-[-0.035em] text-white"
        style={isOutline ? { filter: `url(#${filterId})` } : undefined}
      >
        {word}
      </span>
    </span>
  );
};
