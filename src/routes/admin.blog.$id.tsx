import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/PostForm";
import { getPostById, updatePost, type BlogPostInput, type BlogPostRow } from "@/lib/blog-api";

export const Route = createFileRoute("/admin/blog/$id")({
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await getPostById(id);
        if (!data) setError("Artigo não encontrado.");
        setPost(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao carregar artigo");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (data: BlogPostInput) => {
    setSubmitting(true);
    try {
      await updatePost(id, data);
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
      <h1 className="text-3xl font-display font-bold">Editar artigo</h1>
      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : post ? (
        <PostForm
          initial={post}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate({ to: "/admin/blog" })}
        />
      ) : null}
    </div>
  );
}
