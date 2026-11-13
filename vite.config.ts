import { fileURLToPath, URL } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Caminho público do site. "/" para a raiz do domínio.
// Para outro caminho no build: npm run build -- --base=/outra-pasta/ (começa e termina com /).
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@src": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
