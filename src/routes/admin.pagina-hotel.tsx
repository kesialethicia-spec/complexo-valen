import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getHotelPageSettings,
  updateHotelPageSettings,
  type HotelPageSettings,
} from "@/lib/hotel-settings-api";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/pagina-hotel")({
  component: AdminHotelPage,
});

function AdminHotelPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["hotel-page-settings"],
    queryFn: getHotelPageSettings,
  });

  const [form, setForm] = useState<HotelPageSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && !form) {
      const gallery = [...(data.gallery_urls ?? [])];
      while (gallery.length < 4) gallery.push("");
      setForm({ ...data, gallery_urls: gallery });
    }
  }, [data, form]);

  if (isLoading || !form) {
    return <div className="text-sm text-muted-foreground">Carregando…</div>;
  }

  const update = <K extends keyof HotelPageSettings>(k: K, v: HotelPageSettings[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const updateGallery = (i: number, url: string) => {
    setForm((f) => {
      if (!f) return f;
      const next = [...f.gallery_urls];
      next[i] = url;
      return { ...f, gallery_urls: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateHotelPageSettings({
        ...form,
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
          <h1 className="mt-2 text-3xl font-display font-bold">Página Valen Porto Hotel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie as imagens e links exibidos na página pública do hotel.
          </p>
        </div>
        <Link
          to="/servicos/valen-porto-hotel"
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
          <Section title="Imagens principais" description="Se algum campo ficar vazio, o site exibirá uma imagem padrão elegante.">
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
                hint="Aparece ao lado do texto principal do hotel."
                value={form.presentation_image_url}
                onChange={(url) => update("presentation_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Logo do hotel"
                hint="PNG com fundo transparente é o ideal."
                value={form.logo_url}
                onChange={(url) => update("logo_url", url)}
                aspect="square"
              />
            </div>
          </Section>

          <Section title="Galeria" description="Envie até 4 imagens para a seção “Conheça o Valen Porto Hotel”.">
            <div className="grid gap-6 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
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
        </div>

        <aside className="space-y-6">
          <Section title="Links dos botões">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Link de reserva</span>
              <input
                value={form.reservation_url}
                onChange={(e) => update("reservation_url", e.target.value)}
                placeholder="https://reservas.exemplo.com"
                className={inputCls}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Site oficial ou link direto de reservas. Deixe vazio para direcionar ao formulário de contato.
              </p>
            </label>
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
