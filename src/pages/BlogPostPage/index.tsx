import { Navigate, useParams } from "react-router";

import { useDocumentTitle } from "@src/application/hooks/useDocumentTitle";
import { blogService } from "@src/application/services/blog-service";
import { BlogArticle } from "@src/components/organisms/BlogArticle";
import { BlogGrid } from "@src/components/organisms/BlogGrid";
import { SiteTemplate } from "@src/components/templates/SiteTemplate";

export const BlogPostPage = () => {
  const { slug = "" } = useParams();
  const post = blogService.findBySlug(slug);

  useDocumentTitle(post ? `${post.title} · Blog Perfect` : "Blog · Perfect PVC", post?.excerpt);

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogService.list().filter((item) => item.slug !== post.slug);

  return (
    <SiteTemplate>
      <BlogArticle post={post} formattedDate={blogService.formatDate(post.publishedAt)} />
      {related.length > 0 && <BlogGrid posts={related} formatDate={blogService.formatDate} />}
    </SiteTemplate>
  );
};
