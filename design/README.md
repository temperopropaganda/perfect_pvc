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

- `glass`: header, setas do visualizador, botões sobre fotos.
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
- **2026-11-19**: cinco projetos novos e mais fotos da Videira, selecionados no HD "Fotos
  Digitais/Perfect PVC" (`_2026/002_Fotos 2026` casas 1 a 3, `_OUTRAS/009_Novas Fotos/_02` e
  `_OUTRAS/012_Fotos SET`). Nomes provisórios, a confirmar com a Perfect: **Casa Piscina Coberta**,
  **Casa Grafite**, **Casa Pergolado** e **Casa Curva** (local a confirmar) e **Casa Treze Tílias**.
  Todos aparecem com o selo "Texto em validação".
- O acervo (`public/images/acervo`, `library-photos.ts`) ganhou 38 fotos soltas de
  `_OUTRAS/009_Novas Fotos` e `_OUTRAS/022_Fotos SET 2024`, entre elas a fábrica e o showroom.
- Desses lotes só as WebP entram no repositório; o arquivo original de cada uma está em
  `design/fotos/origem-2026-11.json`.

- **2026-11-24** (revisão da Lu, 23/11): três casas novas de `_2026/002_Fotos 2026` (casas 4 a 6),
  com nomes provisórios **Casa Pedra e Madeira**, **Casa Pé-Direito Duplo** e **Casa Perfis
  Pretos**, local a confirmar. Elas e as casas 1 a 3 abrem a lista de cases e o acordeão da Home.
- Do catálogo 2026 (`003.3_Catálogo 2026/_FINAL/Miolo_Catálogo Perfect (30 x 30 cm).pdf`) saíram a
  foto aérea da fábrica (pág. 8), a foto dos fundadores no showroom (pág. 7), a placa dos 10 anos
  (pág. 12), os prédios de "projetos verticais" (págs. 41 e 42) em `public/images/sobre` e
  `public/images/verticais`, e os três selos ASPEC PVC em `public/brand/selos`. As imagens do PDF
  vêm em CMYK invertido: na conversão é preciso `-negate` antes de `-colorspace sRGB`.

## 3D

- Janela oscilo-batente **ilustrativa** (não é desenho técnico da Perfect), em PVC antracita,
  modelada no Blender por script. Fonte em `design/3d/janela/` (`janela.blend`, `scripts/` com a
  auditoria de geometria, e o README com hierarquia, pivôs, ângulos e materiais). O GLB exportado
  fica em `public/models/janela.glb` (39 KB, clip `OsciloGiro`).
- O oscilobatente tomba o topo para fora (11°, eixo na aresta inferior) e o giro abre para dentro
  (78°, eixo na lateral esquerda). Os dois nunca se movem juntos.
- Cena em React Three Fiber (`src/components/molecules/WindowModel`), carregada sob demanda a
  uma tela e meia da seção. O scroll define o tempo do clip pausado
  (`src/lib/window-timeline.ts`), então a pose é a mesma descendo ou subindo. Sem WebGL, ou
  enquanto o modelo carrega, fica a imagem `public/images/3d/janela-antracita-fechada.webp`. Com
  movimento reduzido, a janela fica parada com a oscilobatente aberta.
- A cor antracita foi calibrada no `preview.html` do Blender, que usa three 0.170. O site usa
  three 0.187 e, com a mesma luz, a face frontal sai mais clara: cerca de (41, 55, 59) em vez de
  (28, 45, 49). Para acertar, recalibre a cor base no Blender com o preview em three 0.187.
- Para regerar o GLB: `blender --background design/3d/janela/janela.blend --python
  design/3d/janela/scripts/export_glb.py -- --out public/models/janela.glb`.

## Pendências

- Validar textos de Casa Bosque e Casa Hortênsias (título, ano, produtos).
- Vídeo curto de obra para o hero. O `HomeHero` já aceita `videoSrc`; os vídeos de drone de
  `_2026/002_Fotos 2026/007_Drone Casa` estão em HEVC 4K e precisam ser convertidos para H.264.
- Arquivos originais do vídeo institucional e do vídeo dos 10 anos (hoje o site leva ao Instagram).
- Foto do kit do arquiteto e texto definitivo da página de arquitetos.
- Autorização dos clientes citados nos depoimentos e revisão dos textos.
- Endereço do canal do YouTube (provisório em `site-config.ts`).
- Pauta real do blog (os três posts são exemplos com dados do catálogo).
- Logo em vetor (SVG): hoje o símbolo é recortado do favicon PNG e o nome é texto.
- Fotos de detalhe de perfis, encontros de vidro e ferragens em alta resolução.
- Fotos de produto mais editoriais para a faixa de sistemas da Home.
