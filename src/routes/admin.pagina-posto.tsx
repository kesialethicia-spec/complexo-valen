import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPostoPageSettings,
  updatePostoPageSettings,
  type PostoPageSettings,
} from "@/lib/posto-settings-api";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/pagina-posto")({
  component: AdminPostoPage,
});

const PAYMENT_LOGO_SLOTS = 20;

function AdminPostoPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["posto-page-settings"],
    queryFn: getPostoPageSettings,
  });

  const [form, setForm] = useState<PostoPageSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && !form) {
      const logos = [...(data.payment_logos ?? [])];
      while (logos.length < PAYMENT_LOGO_SLOTS) logos.push("");
      setForm({ ...data, payment_logos: logos });
    }
  }, [data, form]);

  if (isLoading || !form) {
    return <div className="text-sm text-muted-foreground">Carregando…</div>;
  }

  const update = <K extends keyof PostoPageSettings>(k: K, v: PostoPageSettings[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const updateLogo = (i: number, url: string) => {
    setForm((f) => {
      if (!f) return f;
      const next = [...f.payment_logos];
      next[i] = url;
      return { ...f, payment_logos: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updatePostoPageSettings({
        ...form,
        payment_logos: form.payment_logos.filter(Boolean),
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
          <h1 className="mt-2 text-3xl font-display font-bold">Página Posto Valen</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie imagens, logo e formas de pagamento exibidas na página do Posto Valen.
          </p>
        </div>
        <Link
          to="/servicos/posto-valen"
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
          <Section title="Imagens da página" description="Campos vazios usam imagens padrão elegantes.">
            <div className="grid gap-6 md:grid-cols-2">
              <ImageUploadField
                label="Imagem do hero"
                hint="Fundo do topo da página."
                value={form.hero_image_url}
                onChange={(url) => update("hero_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Imagem do posto"
                hint="Aparece na seção de apresentação."
                value={form.posto_image_url}
                onChange={(url) => update("posto_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Imagem de abastecimento"
                hint="Opcional — pode aparecer em galeria/promoções futuras."
                value={form.abastecimento_image_url}
                onChange={(url) => update("abastecimento_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Imagem da Conveniência Valen"
                hint="Aparece na seção da Conveniência."
                value={form.conveniencia_image_url}
                onChange={(url) => update("conveniencia_image_url", url)}
                aspect="landscape"
              />
              <ImageUploadField
                label="Logo do Posto Valen"
                hint="Aparece sobre o hero."
                value={form.logo_url}
                onChange={(url) => update("logo_url", url)}
              />
            </div>
          </Section>

          <Section
            title="Formas de pagamento"
            description="Envie logos individuais das bandeiras/cartões OU uma única imagem-strip com todas."
          >
            <ImageUploadField
              label="Imagem única (strip) com todas as bandeiras"
              hint="Usada quando não houver logos individuais."
              value={form.payment_strip_url}
              onChange={(url) => update("payment_strip_url", url)}
              aspect="landscape"
            />
            <div className="mt-6">
              <p className="text-sm font-semibold">Logos individuais (opcional)</p>
              <p className="text-xs text-muted-foreground mb-3">
                Se você enviar logos aqui, eles substituirão a imagem-strip acima.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: PAYMENT_LOGO_SLOTS }).map((_, i) => (
                  <ImageUploadField
                    key={i}
                    label={`Logo ${i + 1}`}
                    value={form.payment_logos[i] ?? ""}
                    onChange={(url) => updateLogo(i, url)}
                  />
                ))}
              </div>
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
            <label className="block mt-4">
              <span className="mb-1 block text-sm font-semibold">Link do WhatsApp</span>
              <input
                value={form.whatsapp_url}
                onChange={(e) => update("whatsapp_url", e.target.value)}
                placeholder="https://wa.me/55..."
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
