# Perfect PVC

Protótipo navegável do novo site da Perfect Esquadrias em PVC: home, produtos e cases.

## Comandos

```bash
npm install
npm run dev
npm run verify
npm run build
```

- `npm run dev`: servidor de desenvolvimento
- `npm run verify`: tipos, lint, formatação e build (tem que passar antes de commitar)
- `npm run build`: build de produção em `dist/`

## Páginas

- `/`: home (abertura, janela que abre no scroll, história da tecnologia, vitrine de sistemas,
  ambientes, credenciais, cases e parceria)
- `/produtos`: catálogo filtrável, detalhe em modal (`?produto=slug`), configurador de cor e desempenho
- `/cases`: galeria com filtro e visualizador (`?case=slug`, setas do teclado navegam)

## Design

Origem, decisões e pendências em [design/README.md](design/README.md).
