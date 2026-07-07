import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Plus, Trash2 } from "lucide-react";
import {
  getExperienciasPageSettings,
  updateExperienciasPageSettings,
  type ExperienciasEvent,
  type ExperienciasPageSettings,
} from "@/lib/experiencias-settings-api";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/pagina-experiencias")({
  component: AdminExperienciasPage,
});

const SAUDE_SLOTS = 6;
const VALENTINA_SLOTS = 6;
const GALLERY_SLOTS = 10;

function AdminExperienciasPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["experiencias-page-settings"],
    queryFn: getExperienciasPageSettings,
  });

  const [form, setForm] = useState<ExperienciasPageSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && !form) {
      const saude = [...(data.saude_image_urls ?? [])];
      while (saude.length < SAUDE_SLOTS) saude.push("");
      const val = [...(data.valentina_image_urls ?? [])];
      while (val.length < VALENTINA_SLOTS) val.push("");
      const gal = [...(data.gallery_urls ?? [])];
      while (gal.length < GALLERY_SLOTS) gal.push("");
      setForm({
        ...data,
        saude_image_urls: saude,
        valentina_image_urls: val,
        gallery_urls: gal,
      });
    }
  }, [data, form]);

  if (isLoading || !form) {
    return <div className="text-sm text-muted-foreground">Carregando…</div>;
  }

  const set = <K extends keyof ExperienciasPageSettings>(
    k: K,
    v: ExperienciasPageSettings[K],
  ) => setForm((f) => (f ? { ...f, [k]: v } : f));

  const setArrIdx = (
    k:
      | "saude_image_urls"
      | "valentina_image_urls"
      | "gallery_urls",
    i: number,
    v: string,
  ) =>
    setForm((f) => {
      if (!f) return f;
      const next = [...f[k]];
      next[i] = v;
      return { ...f, [k]: next };
    });

  const setLinkList = (
    k: "cafe_instagram_urls" | "saude_instagram_urls" | "studio_youtube_urls",
    i: number,
    v: string,
  ) =>
    setForm((f) => {
      if (!f) return f;
      const next = [...f[k]];
      next[i] = v;
      return { ...f, [k]: next };
    });

  const addLink = (
    k: "cafe_instagram_urls" | "saude_instagram_urls" | "studio_youtube_urls",
  ) => setForm((f) => (f ? { ...f, [k]: [...f[k], ""] } : f));

  const removeLink = (
    k: "cafe_instagram_urls" | "saude_instagram_urls" | "studio_youtube_urls",
    i: number,
  ) =>
    setForm((f) => (f ? { ...f, [k]: f[k].filter((_, idx) => idx !== i) } : f));

  const addEvent = () => {
    const ev: ExperienciasEvent = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      image_url: "",
      period: "",
      link: "",
      status: "rascunho",
      featured: false,
    };
    set("events", [...form.events, ev]);
  };
  const updEvent = (i: number, patch: Partial<ExperienciasEvent>) =>
    set(
      "events",
      form.events.map((e, idx) => (idx === i ? { ...e, ...patch } : e)),
    );
  const delEvent = (i: number) =>
    set("events", form.events.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateExperienciasPageSettings({
        ...form,
        saude_image_urls: form.saude_image_urls.filter(Boolean),
        valentina_image_urls: form.valentina_image_urls.filter(Boolean),
        gallery_urls: form.gallery_urls.filter(Boolean),
        cafe_instagram_urls: form.cafe_instagram_urls.filter(Boolean),
        saude_instagram_urls: form.saude_instagram_urls.filter(Boolean),
        studio_youtube_urls: form.studio_youtube_urls.filter(Boolean),
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
          <h1 className="mt-2 text-3xl font-display font-bold">Página Experiências</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie imagens, vídeos e eventos exibidos na página /experiencias.
          </p>
        </div>
        <Link
          to="/experiencias"
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Festa do Caminhoneiro">
          <ImageUploadField
            label="Imagem da Festa do Caminhoneiro"
            value={form.festa_image_url}
            onChange={(url) => set("festa_image_url", url)}
            aspect="landscape"
          />
        </Section>

        <Section title="Café da Manhã de Sábado">
          <ImageUploadField
            label="Imagem principal"
            value={form.cafe_image_url}
            onChange={(url) => set("cafe_image_url", url)}
            aspect="landscape"
          />
          <LinkList
            label="Links de vídeos/Reels do Instagram"
            hint="Cole a URL pública do Reel ou post. Ex: https://www.instagram.com/reel/XXXX/"
            values={form.cafe_instagram_urls}
            onChange={(i, v) => setLinkList("cafe_instagram_urls", i, v)}
            onAdd={() => addLink("cafe_instagram_urls")}
            onRemove={(i) => removeLink("cafe_instagram_urls", i)}
          />
        </Section>

        <Section title="Ações de Saúde">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: SAUDE_SLOTS }).map((_, i) => (
              <ImageUploadField
                key={i}
                label={`Imagem ${i + 1}`}
                value={form.saude_image_urls[i] ?? ""}
                onChange={(url) => setArrIdx("saude_image_urls", i, url)}
                aspect="landscape"
              />
            ))}
          </div>
          <LinkList
            label="Links de vídeos/Reels do Instagram"
            values={form.saude_instagram_urls}
            onChange={(i, v) => setLinkList("saude_instagram_urls", i, v)}
            onAdd={() => addLink("saude_instagram_urls")}
            onRemove={(i) => removeLink("saude_instagram_urls", i)}
          />
        </Section>

        <Section title="Clube do Caminhoneiro">
          <ImageUploadField
            label="Imagem do Clube do Caminhoneiro"
            value={form.clube_image_url}
            onChange={(url) => set("clube_image_url", url)}
            aspect="landscape"
          />
        </Section>

        <Section title="Espaço Valentina">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: VALENTINA_SLOTS }).map((_, i) => (
              <ImageUploadField
                key={i}
                label={`Imagem ${i + 1}`}
                value={form.valentina_image_urls[i] ?? ""}
                onChange={(url) => setArrIdx("valentina_image_urls", i, url)}
                aspect="landscape"
              />
            ))}
          </div>
        </Section>

        <Section title="Studio Valen / PodValen">
          <ImageUploadField
            label="Imagem do Studio Valen"
            value={form.studio_image_url}
            onChange={(url) => set("studio_image_url", url)}
            aspect="landscape"
          />
          <LinkList
            label="Vídeos do YouTube"
            hint="Cole a URL do vídeo no YouTube. Ex: https://www.youtube.com/watch?v=XXXX"
            values={form.studio_youtube_urls}
            onChange={(i, v) => setLinkList("studio_youtube_urls", i, v)}
            onAdd={() => addLink("studio_youtube_urls")}
            onRemove={(i) => removeLink("studio_youtube_urls", i)}
          />
        </Section>

        <Section title="Nossos eventos">
          <div className="space-y-4">
            {form.events.map((ev, i) => (
              <div key={ev.id} className="rounded-xl border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Evento #{i + 1}</h3>
                  <button
                    type="button"
                    onClick={() => delEvent(i)}
                    className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remover
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="Nome do evento"
                    value={ev.name}
                    onChange={(e) => updEvent(i, { name: e.target.value })}
                  />
                  <input
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="Data / período (ex: Julho 2026)"
                    value={ev.period}
                    onChange={(e) => updEvent(i, { period: e.target.value })}
                  />
                </div>
                <textarea
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Descrição curta"
                  rows={2}
                  value={ev.description}
                  onChange={(e) => updEvent(i, { description: e.target.value })}
                />
                <input
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Link (opcional)"
                  value={ev.link}
                  onChange={(e) => updEvent(i, { link: e.target.value })}
                />
                <ImageUploadField
                  label="Imagem do evento"
                  value={ev.image_url}
                  onChange={(url) => updEvent(i, { image_url: url })}
                  aspect="landscape"
                />
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={ev.status === "publicado"}
                      onChange={(e) =>
                        updEvent(i, {
                          status: e.target.checked ? "publicado" : "rascunho",
                        })
                      }
                    />
                    Publicado
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={ev.featured}
                      onChange={(e) => updEvent(i, { featured: e.target.checked })}
                    />
                    Destaque
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addEvent}
              className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              <Plus className="h-4 w-4" /> Adicionar evento
            </button>
          </div>
        </Section>

        <Section title="Galeria — Momentos em movimento">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: GALLERY_SLOTS }).map((_, i) => (
              <ImageUploadField
                key={i}
                label={`Imagem ${i + 1}`}
                value={form.gallery_urls[i] ?? ""}
                onChange={(url) => setArrIdx("gallery_urls", i, url)}
                aspect="landscape"
              />
            ))}
          </div>
        </Section>

        <div className="sticky bottom-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 shadow-lg"
          >
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 space-y-5">
      <h2 className="text-lg font-display font-bold">{title}</h2>
      {children}
    </div>
  );
}

function LinkList({
  label,
  hint,
  values,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  hint?: string;
  values: string[];
  onChange: (i: number, v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="https://..."
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="rounded-md border px-2 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" /> Adicionar link
        </button>
      </div>
    </div>
  );
}
