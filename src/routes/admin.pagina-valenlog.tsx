import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getValenlogPageSettings,
  updateValenlogPageSettings,
  type ValenlogPageSettings,
} from "@/lib/valenlog-settings-api";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/pagina-valenlog")({
  component: AdminValenlogPage,
});

const VALENTINA_SLOTS = 4;
const GALLERY_SLOTS = 6;

function AdminValenlogPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["valenlog-page-settings"],
    queryFn: getValenlogPageSettings,
  });

  const [form, setForm] = useState<ValenlogPageSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && !form) {
      const valentina = [...(data.valentina_image_urls ?? [])];
      while (valentina.length < VALENTINA_SLOTS) valentina.push("");
      const gallery = [...(data.gallery_urls ?? [])];
      while (gallery.length < GALLERY_SLOTS) gallery.push("");
      setForm({ ...data, valentina_image_urls: valentina, gallery_urls: gallery });
    }
  }, [data, form]);

  if (isLoading || !form) {
    return <div className="text-sm text-muted-foreground">Carregando…</div>;
  }

  const update = <K extends keyof ValenlogPageSettings>(k: K, v: ValenlogPageSettings[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const updateArray = (key: "valentina_image_urls" | "gallery_urls", i: number, url: string) => {
    setForm((f) => {
      if (!f) return f;
      const next = [...f[key]];
      next[i] = url;
      return { ...f, [key]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateValenlogPageSettings({
        ...form,
        valentina_image_urls: form.valentina_image_urls.filter(Boolean),
        gallery_urls: form.gallery_urls.filter(Boolean),
      });
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
          <h1 className="mt-2 text-3xl font-display font-bold">Página ValenLog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie as imagens exibidas na página pública do ValenLog e do Espaço Valentina.
          </p>
        </div>
        <Link
          to="/servicos/valenlog"
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

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Section title="Imagens principais" description="Campos vazios serão substituídos por imagens padrão elegantes.">
            <div className="grid gap-6 md:grid-cols-2">
              <ImageUploadField
                label="Imagem do hero"
                hint="Aparece no topo da página como plano de fundo."
                value={form.hero_image_url}
                onChange={(url) => update("hero_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Imagem da apresentação"
                hint="Aparece ao lado do texto de apresentação do ValenLog."
                value={form.presentation_image_url}
                onChange={(url) => update("presentation_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Classificação de Grãos"
                hint="Imagem da seção de classificação de grãos."
                value={form.classificacao_image_url}
                onChange={(url) => update("classificacao_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Área de Inspeção"
                hint="Imagem da seção de área de inspeção."
                value={form.inspecao_image_url}
                onChange={(url) => update("inspecao_image_url", url)}
                aspect="landscape"
              />
            </div>
          </Section>

          <Section title="Espaço Valentina" description="Envie até 4 imagens do Espaço Valentina.">
            <div className="grid gap-6 sm:grid-cols-2">
              {Array.from({ length: VALENTINA_SLOTS }).map((_, i) => (
                <ImageUploadField
                  key={i}
                  label={`Imagem ${i + 1}`}
                  value={form.valentina_image_urls[i] ?? ""}
                  onChange={(url) => updateArray("valentina_image_urls", i, url)}
                  aspect="landscape"
                />
              ))}
            </div>
          </Section>

          <Section title="Galeria" description="Envie de 4 a 6 imagens para a galeria “Conheça a estrutura ValenLog”.">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: GALLERY_SLOTS }).map((_, i) => (
                <ImageUploadField
                  key={i}
                  label={`Imagem ${i + 1}`}
                  value={form.gallery_urls[i] ?? ""}
                  onChange={(url) => updateArray("gallery_urls", i, url)}
                  aspect="landscape"
                />
              ))}
            </div>
          </Section>
        </div>

        <aside className="space-y-6">
          <Section title="Links">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Link do mapa (Como chegar)</span>
              <input
                value={form.map_url}
                onChange={(e) => update("map_url", e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </Section>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 space-y-5">
      <div>
        <h2 className="text-lg font-display font-bold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
