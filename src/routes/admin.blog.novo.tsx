import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/PostForm";
import { createPost, type BlogPostInput } from "@/lib/blog-api";

export const Route = createFileRoute("/admin/blog/novo")({
  component: NewPost,
});

function NewPost() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: BlogPostInput) => {
    setSubmitting(true);
    try {
      await createPost(data);
      navigate({ to: "/admin/blog" });
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao salvar artigo");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para lista
      </Link>
      <h1 className="text-3xl font-display font-bold">Novo artigo</h1>
      <PostForm
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate({ to: "/admin/blog" })}
      />
    </div>
  );
}
