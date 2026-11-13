import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// O CSS global vem antes do App para que a ordem das camadas do Tailwind
// (theme, base, components, utilities) seja declarada antes do CSS dos componentes.
import "@src/index.css";
import { App } from "@src/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
