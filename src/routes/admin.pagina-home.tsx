import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getHomePageSettings,
  updateHomePageSettings,
  type HomePageSettings,
} from "@/lib/home-settings-api";
import { CropImageUploadField } from "@/components/admin/CropImageUploadField";
import { ArrowLeft, CheckCircle2, Monitor, Smartphone } from "lucide-react";

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
            Personalize a imagem de fundo da hero principal do site. Faça upload, pré-visualize e recorte para desktop e mobile.
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

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-2xl border bg-card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-display font-bold">Imagem de fundo da hero</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Uma foto sutil aparece atrás da hero, com overlay azul escuro. Se ficar vazio, o site usa a imagem padrão.
            </p>
          </div>

          <div className="rounded-xl border bg-background p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
              <Monitor className="h-4 w-4 text-primary" /> Desktop
            </div>
            <CropImageUploadField
              label="Foto de fundo (desktop)"
              sizeLabel="16:9 · 1920×1080"
              hint="Foto institucional (estrada, caminhões, pátio, posto). O recorte é aplicado no upload."
              value={form.hero_bg_image_desktop_url}
              onChange={(url) => setForm((f) => (f ? { ...f, hero_bg_image_desktop_url: url } : f))}
              aspect={16 / 9}
              outputWidth={1920}
            />
          </div>

          <div className="rounded-xl border bg-background p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
              <Smartphone className="h-4 w-4 text-primary" /> Mobile
            </div>
            <CropImageUploadField
              label="Foto de fundo (mobile)"
              sizeLabel="3:4 · 900×1200"
              hint="Recorte vertical exibido em celulares. Se ficar vazio, usamos a imagem de desktop."
              value={form.hero_bg_image_mobile_url}
              onChange={(url) => setForm((f) => (f ? { ...f, hero_bg_image_mobile_url: url } : f))}
              aspect={3 / 4}
              outputWidth={900}
            />
          </div>
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
