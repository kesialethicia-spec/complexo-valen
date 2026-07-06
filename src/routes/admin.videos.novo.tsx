import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { VideoForm } from "@/components/admin/VideoForm";
import { createVideo, type VideoInput } from "@/lib/videos-api";

export const Route = createFileRoute("/admin/videos/novo")({
  component: NewVideo,
});

function NewVideo() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: VideoInput) => {
    setSubmitting(true);
    try {
      await createVideo(data);
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
      <h1 className="text-3xl font-display font-bold">Novo vídeo</h1>
      <VideoForm
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate({ to: "/admin/videos" })}
      />
    </div>
  );
}
