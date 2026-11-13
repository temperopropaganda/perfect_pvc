# CLAUDE.md

## Projeto

- **Nome:** Perfect PVC
- **O que é:** Protótipo navegável do novo site da Perfect Esquadrias em PVC (home, produtos, sobre e cases).

## Stack

- React + TypeScript
- Tailwind CSS v4 (configuração em `src/styles/`)
- shadcn/ui (`src/components/ui/` é código gerado, não editar)
- Animação: GSAP + ScrollTrigger (scroll), Motion (entradas e layout), Lenis (scroll suave)
- 3D: three.js puro em `src/lib/window-scene.ts`, carregado sob demanda (modelo em `public/models/`)
- ReactBits em `src/components/atoms/` (GlassSurface, BlurText, ScrollReveal, CountUp, RotatingText, VariableProximity), ajustados para o tsconfig estrito e para export nomeado
- ESLint e Prettier

## Comandos

- `npm run dev`: servidor de desenvolvimento
- `npm run verify`: tipos, lint e build. **Tem que passar antes de qualquer commit.**
- `npm run build`: build de produção

## Padrões de código

Seguir a skill `padroes-site`. Principais pontos:

- Imports sempre por `@src/...`. Nada de `../`.
- Arrow function para componentes, funções, hooks e services. Exceção: contextos.
- Componentes e páginas são pastas com `index.tsx`.
- Cores, fontes e espaçamento vêm de `src/styles/tokens.css`. Nada de hex ou nome de fonte em componente.
- Camadas: `domain` ← `application` ← `infrastructure`. Componentes não chamam API direto.

## Git

- Branch de integração: `developer`. Features saem dela (`feat/nome-curto`).
- `main` é produção. Nunca commitar direto em `main` ou `developer`.
- Mensagens de commit no padrão Conventional Commits (`feat:`, `fix:`, `chore:`).

## Design

- Fonte do design e histórico de extração: `design/README.md`.
- Mudança de cor, fonte ou espaçamento começa pelos tokens, nunca pelo componente.

## Não mexer

- `.env` e `.env.*` (só o `.env.example` é versionado)
- `dist/` e `node_modules/`
- `src/components/ui/` (gerado pelo shadcn)
