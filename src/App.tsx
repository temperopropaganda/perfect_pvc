import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router";

import { useSmoothScroll } from "@src/application/hooks/useSmoothScroll";
import { HomePage } from "@src/pages/HomePage";

const ProdutosPage = lazy(() =>
  import("@src/pages/ProdutosPage").then((module) => ({ default: module.ProdutosPage })),
);
const SobrePage = lazy(() =>
  import("@src/pages/SobrePage").then((module) => ({ default: module.SobrePage })),
);
const CasesPage = lazy(() =>
  import("@src/pages/CasesPage").then((module) => ({ default: module.CasesPage })),
);

const AppRoutes = () => {
  const { pathname, hash } = useLocation();
  useSmoothScroll(pathname, hash);

  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-background" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
