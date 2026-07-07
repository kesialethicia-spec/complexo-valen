import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getOValenPageSettings,
  updateOValenPageSettings,
  type OValenPageSettings,
  type InstagramItem,
} from "@/lib/o-valen-settings-api";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ArrowLeft, CheckCircle2, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/pagina-o-valen")({
  component: AdminOValenPage,
});

const GALLERY_SLOTS = 8;

function AdminOValenPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["o-valen-page-settings"],
    queryFn: getOValenPageSettings,
  });

  const [form, setForm] = useState<OValenPageSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && !form) {
      const gallery = [...(data.gallery_urls ?? [])];
      while (gallery.length < GALLERY_SLOTS) gallery.push("");
      const insta = [...(data.instagram_urls ?? [])];
      if (insta.length === 0) insta.push({ image_url: "", link_url: "" });
      setForm({ ...data, gallery_urls: gallery, instagram_urls: insta });
    }
  }, [data, form]);

  if (isLoading || !form) return <div className="text-sm text-muted-foreground">Carregando…</div>;

  const update = <K extends keyof OValenPageSettings>(k: K, v: OValenPageSettings[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const updateGallery = (i: number, url: string) =>
    setForm((f) => {
      if (!f) return f;
      const next = [...f.gallery_urls];
      next[i] = url;
      return { ...f, gallery_urls: next };
    });

  const updateInsta = (i: number, patch: Partial<InstagramItem>) =>
    setForm((f) => {
      if (!f) return f;
      const next = [...f.instagram_urls];
      next[i] = { ...next[i], ...patch };
      return { ...f, instagram_urls: next };
    });

  const addInsta = () =>
    setForm((f) =>
      f ? { ...f, instagram_urls: [...f.instagram_urls, { image_url: "", link_url: "" }] } : f,
    );

  const removeInsta = (i: number) =>
    setForm((f) =>
      f ? { ...f, instagram_urls: f.instagram_urls.filter((_, idx) => idx !== i) } : f,
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateOValenPageSettings({
        ...form,
        gallery_urls: form.gallery_urls.filter(Boolean),
        instagram_urls: form.instagram_urls.filter((i) => i.image_url),
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
          <h1 className="mt-2 text-3xl font-display font-bold">Página O Valen</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie as imagens exibidas na página institucional "O Valen".
          </p>
        </div>
        <Link
          to="/o-valen"
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
          <Section title="Imagens principais" description="Se algum campo ficar vazio, o site usa a imagem padrão.">
            <div className="grid gap-6 md:grid-cols-2">
              <ImageUploadField
                label="Imagem do hero"
                hint="Plano de fundo do topo da página."
                value={form.hero_image_url}
                onChange={(url) => update("hero_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Imagem da apresentação"
                hint="Destaque na seção 'Um complexo criado para mover o Brasil'."
                value={form.presentation_image_url}
                onChange={(url) => update("presentation_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Imagem do propósito maior (Tino com amigo)"
                value={form.purpose_image_url}
                onChange={(url) => update("purpose_image_url", url)}
                aspect="square"
              />
              <ImageUploadField
                label="Imagem da seção Experiências"
                value={form.experiencias_image_url}
                onChange={(url) => update("experiencias_image_url", url)}
                aspect="landscape"
              />
            </div>
          </Section>

          <Section title="Linha do tempo" description="Uma imagem para cada marco histórico.">
            <div className="grid gap-6 md:grid-cols-3">
              <ImageUploadField
                label="Marco 2019"
                value={form.timeline_2019_image_url}
                onChange={(url) => update("timeline_2019_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Marco 2022"
                value={form.timeline_2022_image_url}
                onChange={(url) => update("timeline_2022_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Marco 2025/2026"
                value={form.timeline_2025_image_url}
                onChange={(url) => update("timeline_2025_image_url", url)}
                aspect="landscape"
              />
            </div>
          </Section>

          <Section title="Galeria — Valen em movimento" description="Até 8 imagens exibidas em mosaico.">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: GALLERY_SLOTS }).map((_, i) => (
                <ImageUploadField
                  key={i}
                  label={`Imagem ${i + 1}`}
                  value={form.gallery_urls[i] ?? ""}
                  onChange={(url) => updateGallery(i, url)}
                  aspect="square"
                />
              ))}
            </div>
          </Section>

          <Section
            title="Instagram — grade manual"
            description="Adicione imagens de posts do Instagram e o link opcional para cada uma."
          >
            <div className="space-y-6">
              {form.instagram_urls.map((item, i) => (
                <div key={i} className="rounded-2xl border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Post {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeInsta(i)}
                      className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remover
                    </button>
                  </div>
                  <ImageUploadField
                    label="Imagem"
                    value={item.image_url}
                    onChange={(url) => updateInsta(i, { image_url: url })}
                    aspect="square"
                  />
                  <label className="block">
                    <span className="mb-1 block text-sm font-semibold">Link do post (opcional)</span>
                    <input
                      value={item.link_url}
                      onChange={(e) => updateInsta(i, { link_url: e.target.value })}
                      placeholder="https://www.instagram.com/p/..."
                      className={inputCls}
                    />
                  </label>
                </div>
              ))}
              <button
                type="button"
                onClick={addInsta}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted"
              >
                <Plus className="h-4 w-4" /> Adicionar post
              </button>
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
                className={inputCls}
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

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30";

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
