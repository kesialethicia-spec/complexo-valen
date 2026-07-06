import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { VideoForm } from "@/components/admin/VideoForm";
import { getVideoById, updateVideo, type VideoInput, type VideoRow } from "@/lib/videos-api";

export const Route = createFileRoute("/admin/videos/$id")({
  component: EditVideo,
});

function EditVideo() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<VideoRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const row = await getVideoById(id);
        if (!row) setError("Vídeo não encontrado");
        else setInitial(row);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao carregar");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (data: VideoInput) => {
    setSubmitting(true);
    try {
      await updateVideo(id, data);
      alert("Vídeo salvo com sucesso!");
      navigate({ to: "/admin/videos" });
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao salvar vídeo");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/videos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para lista
      </Link>
      <h1 className="text-3xl font-display font-bold">Editar vídeo</h1>
      {loading ? (
        <div className="text-sm text-muted-foreground">Carregando…</div>
      ) : error ? (
        <div className="text-sm text-destructive">{error}</div>
      ) : initial ? (
        <VideoForm
          initial={initial}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate({ to: "/admin/videos" })}
        />
      ) : null}
    </div>
  );
}
