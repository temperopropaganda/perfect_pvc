# Design

## Origem

- **2026-11-05**: protótipo em código criado a partir do wireframe aprovado no Artifact
  "Perfect PVC" (Home, Produtos e Showcase), com conteúdo, fotos e dados técnicos do site
  atual (perfectpvc.com.br). "Obras/Showcase" passou a se chamar **Cases**.
- **2026-11-05**: cores refeitas a partir do catálogo do rebranding
  (`m.perfectpvc.com.br/asset/2:catalogo-perfectpdf`, InDesign, agosto de 2026).
- **2026-11-06**: redesign premium de Home, Sobre (nova rota `/sobre`) e Cases. A sálvia do
  catálogo saiu da interface; a paleta passou a ser azul, azul-vidro e grafite. Backup da versão
  anterior: `../perfect_pvc_backup-2026-11-06.tar.gz` (o projeto não está em Git).

## Paleta (tokens em `src/styles/tokens.css`)

Amostrada das páginas renderizadas do catálogo e expandida em escalas.

| Escala | Base do catálogo | Uso |
|---|---|---|
| `blue-*` (50 a 950) | `#2d3062` = `blue-700`, azul-marinho do logotipo e dos painéis | Botão principal em fundo claro, seção "Pilares", acentos |
| `sky-*` (50 a 600) | `#9cc3d5` = `sky-300`, azul claro dos selos de certificação | Vidro do 3D, destaques em fundo escuro, foco em fundo escuro |
| `graphite-*` (50 a 950) | `#2c3439` = `graphite-800` (acabamento Cinza) e cinzas de texto | Fundos claros (`50`/`100`), textos, bordas, seções escuras (`950`) |

- `--sage-detail: #d3d19e` fica documentado, mas não é usado na interface.
- Seções escuras usam `.dark` (grafite `950`); o header troca para vidro fumê sobre elas por
  `data-nav="dark"`.
- Apelidos antigos (`brand`, `ice`, `paper`, `night`...) apontam para as escalas, para a página
  de Produtos continuar coerente.

## Tipografia

- **Inter Tight** (títulos, rótulos, navegação) e **Hanken Grotesk** (texto), pelo Fontsource.
  Inter Tight é a alternativa livre mais próxima da Neue Haas Grotesk do catálogo.
- Títulos leves (`text-display`, peso 300, tracking -0.045em), rótulos em caixa alta espaçada
  (`text-label`, 0.18em), texto de apoio em `text-lead`.

## Vidro (Liquid Glass)

Uma receita única em `src/styles/base.css`: preenchimento, desfoque 22px, saturação 170%, borda
de 1px, brilho superior e sombra. Os valores vêm de variáveis `--glass-*` e mudam só entre a
versão clara (`:root`) e a fumê (`.dark`). Variações controladas:

- `glass`: header, navegação flutuante dos Cases, setas do visualizador, botões sobre fotos.
- `glass-strong`: mesmo material com mais opacidade, para o mega menu aberto e o menu mobile.
- `glass-dark`: força a versão fumê fora de uma seção escura (componentes da página Produtos).

É uma aproximação web do material da Apple, sem refração. O `GlassSurface` do ReactBits (com
refração só no Chrome) saiu do header para o vidro ficar igual em todos os navegadores.

## Movimento

- Curvas: `expo.out` para entradas, `power3.inOut` para máscaras, `none` para scrub
  (`src/lib/motion.ts`, espelhadas em `--ease-*`).
- Lenis para o scroll suave; GSAP ScrollTrigger para scrub, pin e revelações; Motion para o header,
  menus e o visualizador. Tudo respeita `prefers-reduced-motion`.
- Seções fixas (pin) só no desktop; no mobile viram rolagem simples ou carrossel com snap.

## Fotos

- Originais em `src/assets/images/perfect` (não entram no build). Versões WebP em
  `public/images/projetos/<projeto>/<nome>-{800,1400,2400}.webp`, servidas por `srcset`.
- Manifesto com proporções reais e textos alternativos: `src/application/services/project-photos.ts`.
- Projetos ligados a obras publicadas no site atual (título, ano e resumo vêm de lá): Caçador,
  Condomínio, Pequeno Paraíso e Videira. **Casa Bosque** e **Casa Hortênsias** só têm nome e
  cidade da pasta de fotos e aparecem com o selo "Texto em validação".

## 3D

- Janela oscilo-batente **ilustrativa** (não é desenho técnico da Perfect), modelada no Blender por
  script (`design/3d/build_window.py`) e exportada em `public/models/janela-oscilo-batente-v1.glb`
  (40 KB, 914 faces). Para refazer:
  `blender --background --python design/3d/build_window.py -- public/models/janela-oscilo-batente-v2.glb`.
- Cena em three.js puro (`src/lib/window-scene.ts`), carregada sob demanda perto da seção. Sem
  WebGL ou com movimento reduzido, fica a imagem `public/images/3d/oscilo-batente.webp`.

## Pendências

- Validar textos de Casa Bosque e Casa Hortênsias (título, ano, produtos).
- Vídeo curto de obra para o hero (hoje é foto com abertura animada).
- Logo em vetor (SVG): hoje o símbolo é recortado do favicon PNG e o nome é texto.
- Fotos de detalhe de perfis, encontros de vidro e ferragens em alta resolução; as fotos da página
  Sobre (`public/images/sobre`) têm 1000 px e ficam suaves em tela cheia.
- Fotos de produto mais editoriais para a faixa de sistemas da Home.
