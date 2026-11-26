import { useDocumentTitle } from "@src/application/hooks/useDocumentTitle";
import { blogService } from "@src/application/services/blog-service";
import { BlogGrid } from "@src/components/organisms/BlogGrid";
import { PageIntro } from "@src/components/organisms/PageIntro";
import { SiteTemplate } from "@src/components/templates/SiteTemplate";

export const BlogPage = () => {
  useDocumentTitle(
    "Blog · Perfect PVC",
    "Notícias, guias e novidades sobre esquadrias em PVC, vidros, acabamentos e a Perfect.",
  );

  return (
    <SiteTemplate>
      <PageIntro
        label="Blog"
        title="Notícias e *guias da Perfect.*"
        text="Tudo o que ajuda a escolher, especificar e cuidar de esquadrias em PVC, além das novidades da fábrica."
      />
      <BlogGrid posts={blogService.list()} formatDate={blogService.formatDate} />
    </SiteTemplate>
  );
};
