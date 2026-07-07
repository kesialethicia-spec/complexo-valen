import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  getValenlubPageSettings,
  updateValenlubPageSettings,
  type ValenlubPageSettings,
} from "@/lib/valenlub-settings-api";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/pagina-valenlub")({
  component: AdminValenlubPage,
});

const GALLERY_SLOTS = 6;
const BRAND_SLOTS = 20;

function AdminValenlubPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["valenlub-page-settings"],
    queryFn: getValenlubPageSettings,
  });

  const [form, setForm] = useState<ValenlubPageSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && !form) {
      const gallery = [...(data.gallery_urls ?? [])];
      while (gallery.length < GALLERY_SLOTS) gallery.push("");
      const brands = [...(data.brand_logos ?? [])];
      while (brands.length < BRAND_SLOTS) brands.push("");
      setForm({ ...data, gallery_urls: gallery, brand_logos: brands });
    }
  }, [data, form]);

  if (isLoading || !form) {
    return <div className="text-sm text-muted-foreground">Carregando…</div>;
  }

  const update = <K extends keyof ValenlubPageSettings>(k: K, v: ValenlubPageSettings[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const updateGallery = (i: number, url: string) =>
    setForm((f) => {
      if (!f) return f;
      const next = [...f.gallery_urls];
      next[i] = url;
      return { ...f, gallery_urls: next };
    });

  const updateBrand = (i: number, url: string) =>
    setForm((f) => {
      if (!f) return f;
      const next = [...f.brand_logos];
      next[i] = url;
      return { ...f, brand_logos: next };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateValenlubPageSettings({
        ...form,
        gallery_urls: form.gallery_urls.filter(Boolean),
        brand_logos: form.brand_logos.filter(Boolean),
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
          <h1 className="mt-2 text-3xl font-display font-bold">Página ValenLub</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie imagens, logos das marcas e links da página ValenLub.
          </p>
        </div>
        <Link
          to="/servicos/valenlub"
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
          <Section title="Imagens principais" description="Campos vazios usam imagens padrão elegantes.">
            <div className="grid gap-6 md:grid-cols-2">
              <ImageUploadField
                label="Logo da ValenLub"
                hint="Aparece sobre o hero."
                value={form.logo_url}
                onChange={(url) => update("logo_url", url)}
              />
              <ImageUploadField
                label="Imagem do hero"
                hint="Fundo do topo da página."
                value={form.hero_image_url}
                onChange={(url) => update("hero_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Imagem da apresentação"
                hint="Foto ao lado do texto de apresentação."
                value={form.presentation_image_url}
                onChange={(url) => update("presentation_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Imagem de estoque/produtos"
                hint="Foto do estoque ou prateleiras."
                value={form.stock_image_url}
                onChange={(url) => update("stock_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Equipe comercial"
                hint="Aparece na seção de atendimento."
                value={form.team_image_url}
                onChange={(url) => update("team_image_url", url)}
                aspect="square"
              />
              <ImageUploadField
                label="Entrega / logística"
                hint="Aparece na seção de atendimento."
                value={form.delivery_image_url}
                onChange={(url) => update("delivery_image_url", url)}
                aspect="square"
              />
            </div>
          </Section>

          <Section title="Galeria" description="Envie até 6 imagens para o mosaico da galeria.">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: GALLERY_SLOTS }).map((_, i) => (
                <ImageUploadField
                  key={i}
                  label={`Imagem ${i + 1}`}
                  value={form.gallery_urls[i] ?? ""}
                  onChange={(url) => updateGallery(i, url)}
                  aspect="landscape"
                />
              ))}
            </div>
          </Section>

          <Section
            title="Logos das marcas parceiras"
            description="Envie os logos oficiais para substituir os nomes-padrão exibidos no site. Logos vazios ficam ocultos."
          >
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: BRAND_SLOTS }).map((_, i) => (
                <ImageUploadField
                  key={i}
                  label={`Marca ${i + 1}`}
                  value={form.brand_logos[i] ?? ""}
                  onChange={(url) => updateBrand(i, url)}
                />
              ))}
            </div>
          </Section>
        </div>

        <aside className="space-y-6">
          <Section title="Links">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Link do WhatsApp (Falar com a equipe)</span>
              <input
                value={form.whatsapp_url}
                onChange={(e) => update("whatsapp_url", e.target.value)}
                placeholder="https://wa.me/55..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="block mt-4">
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
