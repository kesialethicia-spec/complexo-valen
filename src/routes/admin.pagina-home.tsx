import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getHomePageSettings,
  updateHomePageSettings,
  type HomePageSettings,
} from "@/lib/home-settings-api";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/pagina-home")({
  component: AdminHomePage,
});

function AdminHomePage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["home-page-settings"],
    queryFn: getHomePageSettings,
  });

  const [form, setForm] = useState<HomePageSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  if (isLoading || !form) return <div className="text-sm text-muted-foreground">Carregando…</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateHomePageSettings(form);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate({ to: "/admin" })}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <h1 className="mt-2 text-3xl font-display font-bold">Página Home</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Personalize a imagem de fundo da hero principal do site.
          </p>
        </div>
        <Link
          to="/"
          target="_blank"
          className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          Ver página
        </Link>
      </div>

      {savedAt && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <CheckCircle2 className="h-4 w-4" /> Configurações salvas com sucesso.
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-2xl border bg-card p-6 space-y-5">
          <div>
            <h2 className="text-lg font-display font-bold">Imagem de fundo da hero</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Uma foto sutil aparece atrás da hero principal, com overlay azul escuro para preservar a identidade visual. Se ficar vazio, o site usa a imagem padrão.
            </p>
          </div>
          <ImageUploadField
            label="Foto de fundo"
            hint="Recomendado: foto institucional do complexo (estrada, caminhões, pátio, posto)."
            value={form.hero_bg_image_url}
            onChange={(url) => setForm((f) => (f ? { ...f, hero_bg_image_url: url } : f))}
            aspect="landscape"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
