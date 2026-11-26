// Arquivos de public/ são referenciados como "/images/...". Em produção o site roda em uma
// subpasta (base do Vite), então o caminho precisa do prefixo, senão aponta para a raiz do domínio.
export const publicUrl = (path: string) => {
  const base = import.meta.env.BASE_URL;
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith(base)) return path;
  return `${base}${path.slice(1)}`;
};
