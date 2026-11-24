import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Subpasta onde o site é publicado (dev.temperopropaganda.com.br/perfect-pvc/). O dev roda na
// raiz; build e preview usam a subpasta. Ao mudar, atualizar o RewriteBase de public/.htaccess.
const BASE = "/perfect-pvc/";

export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? BASE : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@src": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
}));
