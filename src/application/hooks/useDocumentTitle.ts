import { useEffect } from "react";

export const useDocumentTitle = (title: string, description?: string) => {
  useEffect(() => {
    document.title = title;
    if (!description) return;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
};
