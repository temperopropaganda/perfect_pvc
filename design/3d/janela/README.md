# Janela 3D: oscilobatente e giro

A sequência é **FECHADA → OSCILOBATENTE → FECHADA → GIRO → FECHADA**. Ela é controlada pelo progresso do scroll, de 0 a 1.

O **oscilobatente abre para fora**: o topo da folha se afasta da câmera. O **giro abre para dentro**: a folha vem em direção à câmera. Uma única maçaneta, presa à folha, acompanha os dois movimentos. O modelo tem só a esquadria (marco e folha), o vidro, as vedações e a maçaneta: sem dobradiças aparentes e sem base inferior. O acabamento é **antracita escuro** (na tela, `#1C2D31`).

| Arquivo | O que é |
|---|---|
| `janela.blend` | Cena do Blender organizada: coleções Janela, Cameras e Luzes |
| `janela.glb` | Modelo para a web (39 KB, 1.040 triângulos, 4 materiais PBR, sem texturas) e um clip, `OsciloGiro` |
| `Janela.tsx` | Componente React Three Fiber controlado por `progress` (0 a 1) |
| `preview.html` | Conferência em three.js com a mesma câmera, luz e tone mapping do site. Sirva a pasta `perfect_materiais` com `python3 -m http.server` e abra `/janela_3d/preview.html`. Parâmetros: `?p=0.25` (pose fixa), `?dpr=2`, `?model=outro.glb` |
| `renders/estados/` | Os cinco estados renderizados no Blender (`quadro_*.png`, `sequencia_5_estados.png`) e capturados no navegador (`web_5_estados.png`) |
| `renders/preview_*.png` | Vistas frontais de conferência: fechada, oscilobatente e giro |
| `renders/detalhes/` | Closes em Cycles: canto do marco, borda da folha no giro, topo no oscilobatente, maçaneta |
| `scripts/` | Scripts que geram tudo (`build_janela.py`, `render_preview.py`, `export_glb.py`) e a auditoria `audit_geometry.py` |

Há quatro backups ao lado desta pasta:

- `../janela_3d_backup_2026-11-17/`: só a abertura de giro (52°).
- `../janela_3d_backup_2026-11-17_v2_abre_dentro/`: oscilobatente e giro abrindo para dentro, com dobradiças e base.
- `../janela_3d_backup_2026-11-17_v3_tudo_fora/`: oscilobatente e giro abrindo para fora, sem dobradiças e sem base.
- `../janela_3d_backup_2026-11-17_v4_offwhite/`: a versão off-white imediatamente anterior ao refinamento (`.blend`, `.glb` e scripts).

## Hierarquia (nomes iguais no Blender e no GLB)

```
Janela                            raiz, centro da janela na origem
├── Frame_Fixo                    marco                         · Estrutura_Antracita
├── Vedacao_Marco                 borracha do marco             · Vedacao_Preto
└── Pivo_Oscilobatente  ◄ anim.   eixo horizontal na aresta inferior EXTERNA da folha (tomba para fora)
    └── Folha_Movel     ◄ anim.   eixo vertical na lateral esquerda, aresta INTERNA (gira para dentro)
        ├── Vidro                                               · Vidro_Transparente
        ├── Vedacao_Folha         borracha do vidro e da borda  · Vedacao_Preto
        ├── Macaneta              espelho + haste               · Macaneta_Antracita
        └── Macaneta_Alavanca ◄ anim.  gira no eixo da haste    · Macaneta_Antracita
```

- **Folha dentro do vão:** a folha fica encaixada dentro do vão do marco, com 3 mm de folga e um friso de vedação, sem batente na frente nem atrás. Por isso ela pode tombar para fora e girar para dentro sem atravessar o marco. Verifiquei no Blender, a cada 3 quadros da animação, que a folha, o vidro, as vedações e a maçaneta não tocam o marco.
- **Uma maçaneta só:** `Macaneta` e `Macaneta_Alavanca` são filhas da `Folha_Movel`, que fica dentro dos dois pivôs. A maçaneta acompanha a folha nas duas aberturas. No GLB, ela vai para fora no oscilobatente e vem cerca de 85 cm para dentro no giro.
- Os dois mecanismos têm pivôs independentes. Como a folha é filha dos dois, a folha, o vidro, as vedações e a maçaneta se movem juntos.
- Escala real: o marco tem 1,00 × 1,45 m. No GLB, que usa Y para cima, a janela fica de frente para +Z.

## Geometria

- **Perfis soldados:** o marco, a folha e cada vedação são um único sólido fechado (manifold), varrido em volta do retângulo com cantos soldados a 45°. Não há faces internas nas emendas nem peças sobrepostas.
- **Cantos arredondados de verdade:** os raios do próprio perfil substituem o modificador Bevel: 2,5 mm na quina externa do marco, 2 a 3 mm nas quinas visíveis da folha e 1 mm no bisel do vidro. As normais são calculadas a partir do perfil. Assim, as faces planas ficam planas, os raios sombreiam como curva contínua e as quinas a 45° dos cantos ficam definidas.
- **Nada coplanar:** as vedações e o espelho da maçaneta entram 0,5 mm na peça onde estão presos. Não há duas faces no mesmo plano, então não há z-fighting.
- **Auditoria:** `scripts/audit_geometry.py` confere arestas não-manifold, bordas abertas, faces internas, vértices duplicados, normais invertidas, faces coplanares entre peças e colisões em todos os 121 quadros. Resultado atual: zero em todos os itens.

## Materiais (Principled BSDF → glTF PBR, sem texturas)

| Material | Base (linear) | Rugosidade | Metálico | Observação |
|---|---|---|---|---|
| `Estrutura_Antracita` | 0.0391, 0.0555, 0.0606 | 0.52 | 0 | PVC acetinado, F0 ≈ 4% |
| `Macaneta_Antracita` | igual à estrutura | 0.40 | 0 | um pouco mais lisa que o perfil |
| `Vedacao_Preto` | 0.006, 0.006, 0.007 | 0.78 | 0 | borracha EPDM fosca |
| `Vidro_Transparente` | 0.97, 0.985, 0.98 | 0.02 | 0 | transmissão 1, IOR 1.5 |

A cor-alvo `#1C2D31` é a cor que deve aparecer na tela, não a cor base. Com a cor base igual a `#1C2D31`, o tone mapping Neutral do site comprimia os escuros e a face frontal saía (8, 33, 38), quase preta e esverdeada. Por isso a cor base foi calibrada na luz e na câmera do site, e a face frontal agora aparece com exatamente (28, 45, 49). Essa base fica perto do albedo de um PVC antracita real (RAL 7016, `#383E42`), com o subtom azul-esverdeado. No Blender, que usa outra luz e o view transform Standard, a janela aparece um pouco mais clara. Se o site mudar de luz ou de tone mapping, a cor percebida muda junto.

## Sequência e scroll

| Progresso | Quadro (Blender) | Tempo (GLB) | Estado | Oscilobatente | Giro | Alavanca |
|---|---|---|---|---|---|---|
| 0.00 | 0 | 0 s | Fechada | 0° | 0° | para baixo |
| 0.25 | 30 | 1 s | Oscilobatente aberta (topo para fora) | 11° | 0° | para cima |
| 0.50 | 60 | 2 s | Fechada | 0° | 0° | para baixo |
| 0.75 | 90 | 3 s | Giro aberto (para dentro) | 0° | 78° | horizontal |
| 1.00 | 120 | 4 s | Fechada | 0° | 0° | para baixo |

- **Ângulos:** os ângulos máximos (11° e 78°) e a posição da alavanca vêm do código da seção "Duas aberturas em uma única esquadria." (`MAX_TILT`, `MAX_TURN`).
- **Sem sobreposição:** o oscilobatente só se move entre 0 e 0.5, e o giro só entre 0.5 e 1. Nunca os dois juntos: o Blender verifica isso em todos os 121 quadros, e o navegador em 1.001 posições de scroll.
- **Easing:** cada trecho começa e termina suave, sem passar do ângulo máximo.
- **Uso:** pause o clip e defina `action.time = progress × duração`, como faz o `Janela.tsx`. Qualquer progresso leva à mesma pose, tanto indo quanto voltando.
- **No Blender:** aperte Espaço para ver a sequência inteira (quadros 0 a 120), ou arraste o cursor da Timeline.

## Câmera igual à do site

A `Camera_Site` reproduz a câmera da seção de referência. Ela é a câmera ativa no `.blend`. A `Camera_Preview`, frontal como na imagem 2, continua disponível.

```tsx
<Canvas camera={{ position: [-1.55, 0.35, 3.4], fov: 28 }} onCreated={({ camera }) => camera.lookAt(0, 0, 0)}>
  <Environment preset="apartment" environmentIntensity={0.7} />
  <directionalLight position={[-2.2, 2.4, 2.6]} intensity={1.4} />
  <Janela progress={progress} />
</Canvas>
```

## Vidro

O vidro exporta com `KHR_materials_transmission`, o que custa um passe extra de render no three.js. Para economizar em celulares:

```ts
const vidro = scene.getObjectByName('Vidro') as Mesh
vidro.material = new MeshPhysicalMaterial({ color: '#f4f8f6', roughness: 0.05, transparent: true, opacity: 0.18, metalness: 0 })
```

## Regenerar

```bash
blender --background --factory-startup --python scripts/build_janela.py -- --out janela.blend
blender --background janela.blend --python scripts/export_glb.py -- --out janela.glb
blender --background janela.blend --python scripts/render_preview.py -- --frame 30 --view site --out renders/oscilo.png
```

O build aceita estas opções: `--tilt-angle` (padrão 11), `--turn-angle` (padrão 78), `--oscilo-para fora|dentro` (padrão `fora`) e `--giro-para dentro|fora` (padrão `dentro`). As quatro combinações funcionam sem colisão, porque cada pivô vai para a aresta do lado em que o movimento abre. O build imprime um relatório com os cinco estados e falha se algum quadro tiver os dois mecanismos abertos.

## Para o frontend

Nesta etapa nada muda no contrato com o site. Os nomes dos nós (`Janela`, `Frame_Fixo`, `Vedacao_Marco`, `Pivo_Oscilobatente`, `Folha_Movel`, `Vidro`, `Vedacao_Folha`, `Macaneta`, `Macaneta_Alavanca`), a hierarquia, os pivôs, as coordenadas, o clip `OsciloGiro` (4 s) e a caixa da janela (±0,5 × ±0,725 m) estão iguais. Só mudaram:

- **Materiais renomeados:** `Estrutura_OffWhite` passou a ser `Estrutura_Antracita`, e `Macaneta_OffWhite` passou a ser `Macaneta_Antracita`. O site não usa nomes de material; ele só troca o material do nó `Vidro`.
- **Tamanho:** o arquivo passou de 53 KB para 39 KB, e de 1.400 para 1.040 triângulos.
- **Atualização no site:** o site carrega uma cópia em `perfect_pvc/public/models/janela.glb`. Para ver a versão nova lá, copie `janela_3d/janela.glb` por cima dessa cópia.
