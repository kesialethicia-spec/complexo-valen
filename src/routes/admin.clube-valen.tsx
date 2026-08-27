import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  BENEFIT_CATEGORIES,
  DEFAULT_CLUBE_SETTINGS,
  createBenefit,
  createFaq,
  deleteBenefit,
  deleteFaq,
  getClubeSettings,
  listAllBenefits,
  listAllFaqs,
  slugify,
  updateBenefit,
  updateClubeSettings,
  updateFaq,
  type BenefitRow,
  type ClubeSettings,
  type FaqRow,
} from "@/lib/clube-valen-api";

export const Route = createFileRoute("/admin/clube-valen")({
  component: AdminClubeValen,
});

type Tab = "config" | "beneficios" | "faq";

function AdminClubeValen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("config");

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate({ to: "/admin" })}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <h1 className="mt-2 text-3xl font-display font-bold">Clube Valen Fidelidade</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie benefícios, brindes, combos, imagens, valores de pontos e perguntas frequentes.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["config", "Configurações e Hero"],
            ["beneficios", "Benefícios, brindes e combos"],
            ["faq", "Perguntas frequentes"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === key ? "bg-primary text-primary-foreground" : "border bg-card hover:bg-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "config" && <SettingsPanel />}
      {tab === "beneficios" && <BenefitsPanel />}
      {tab === "faq" && <FaqPanel />}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {hint && <span className="mb-1 block text-xs text-muted-foreground">{hint}</span>}
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
      )}
    </label>
  );
}

/* ---------------- CONFIGURAÇÕES ---------------- */

function SettingsPanel() {
  const { data, isLoading } = useQuery({ queryKey: ["clube-settings-admin"], queryFn: getClubeSettings });
  const [form, setForm] = useState<ClubeSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Carregando…</p>;

  const set = (patch: Partial<ClubeSettings>) => setForm({ ...form, ...patch });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateClubeSettings(form);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <section className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Configurações da página</h2>
        <Field label="Título SEO" value={form.seo_title} onChange={(v) => set({ seo_title: v })} />
        <Field label="Meta description" value={form.seo_description} onChange={(v) => set({ seo_description: v })} textarea />
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Status da página</span>
          <select
            value={form.page_status}
            onChange={(e) => set({ page_status: e.target.value as ClubeSettings["page_status"] })}
            className="rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <option value="publicada">Publicada</option>
            <option value="rascunho">Rascunho</option>
          </select>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Texto do botão principal" value={form.cta_text} onChange={(v) => set({ cta_text: v })} />
          <Field label="Link do botão principal" value={form.cta_url} onChange={(v) => set({ cta_url: v })} />
          <Field label="Link Google Play" value={form.google_play_url} onChange={(v) => set({ google_play_url: v })} />
          <Field label="Link App Store" value={form.app_store_url} onChange={(v) => set({ app_store_url: v })} />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Hero</h2>
        <Field label="Selo superior" value={form.hero_badge} onChange={(v) => set({ hero_badge: v })} />
        <Field label="Título principal" value={form.hero_title} onChange={(v) => set({ hero_title: v })} />
        <Field
          label="Palavra em destaque"
          hint="Precisa estar escrita exatamente como no título."
          value={form.hero_highlight}
          onChange={(v) => set({ hero_highlight: v })}
        />
        <Field label="Subtítulo" value={form.hero_subtitle} onChange={(v) => set({ hero_subtitle: v })} textarea />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <ImageUploadField
              label="Imagem de fundo"
              aspect="landscape"
              value={form.hero_bg_image_url}
              onChange={(url) => set({ hero_bg_image_url: url })}
            />
            <Field label="…ou URL da imagem de fundo" value={form.hero_bg_image_url} onChange={(v) => set({ hero_bg_image_url: v })} />
          </div>
          <div className="space-y-2">
            <ImageUploadField
              label="Mockup do celular"
              value={form.phone_mockup_url}
              onChange={(url) => set({ phone_mockup_url: url })}
            />
            <Field label="…ou URL do mockup" value={form.phone_mockup_url} onChange={(v) => set({ phone_mockup_url: v })} />
          </div>
          <div className="space-y-2">
            <ImageUploadField label="QR Code" value={form.qr_code_url} onChange={(url) => set({ qr_code_url: url })} />
            <Field label="…ou URL do QR Code" value={form.qr_code_url} onChange={(v) => set({ qr_code_url: v })} />
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
        {savedAt && (
          <span className="inline-flex items-center gap-1 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" /> Salvo
          </span>
        )}
      </div>
    </form>
  );
}

/* ---------------- BENEFÍCIOS ---------------- */

const emptyBenefit = (order: number): Omit<BenefitRow, "id"> => ({
  name: "",
  slug: "",
  category: "Brinde",
  image_url: "",
  short_description: "",
  full_description: "",
  points: null,
  status: "ativo",
  featured: false,
  order_index: order,
});

function BenefitsPanel() {
  const { data, isLoading, refetch } = useQuery({ queryKey: ["clube-benefits-admin"], queryFn: listAllBenefits });
  const [rows, setRows] = useState<(BenefitRow | (Omit<BenefitRow, "id"> & { id?: string }))[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (data) setRows(data);
  }, [data]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Carregando…</p>;

  const patch = (idx: number, p: Partial<BenefitRow>) =>
    setRows(rows.map((r, i) => (i === idx ? { ...r, ...p } : r)));

  const remove = async (idx: number) => {
    const row = rows[idx];
    if (row.id && !confirm("Remover este item?")) return;
    if (row.id) await deleteBenefit(row.id);
    setRows(rows.filter((_, i) => i !== idx));
    void refetch();
  };

  const saveAll = async () => {
    setError(null);
    setSaving(true);
    try {
      for (const row of rows) {
        const payload = {
          name: row.name,
          slug: row.slug || slugify(row.name),
          category: row.category,
          image_url: row.image_url,
          short_description: row.short_description,
          full_description: row.full_description || row.short_description,
          points: row.points === null || Number.isNaN(row.points) ? null : Number(row.points),
          status: row.status,
          featured: row.featured,
          order_index: Number(row.order_index) || 0,
        };
        if (row.id) await updateBenefit(row.id, payload);
        else await createBenefit(payload);
      }
      setSavedAt(Date.now());
      void refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {rows.map((row, idx) => (
        <div key={row.id ?? `novo-${idx}`} className="rounded-xl border bg-card p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold">{row.name || "Novo benefício"}</h3>
            <button
              type="button"
              onClick={() => void remove(idx)}
              className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome" value={row.name} onChange={(v) => patch(idx, { name: v, slug: row.slug || slugify(v) })} />
            <Field label="Slug" value={row.slug} onChange={(v) => patch(idx, { slug: slugify(v) })} />
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Categoria</span>
              <select
                value={row.category}
                onChange={(e) => patch(idx, { category: e.target.value })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                {BENEFIT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Valor em pontos</span>
              <input
                type="number"
                min={0}
                value={row.points ?? ""}
                onChange={(e) => patch(idx, { points: e.target.value === "" ? null : Number(e.target.value) })}
                placeholder="Deixe vazio para não exibir"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </label>
            <Field label="Descrição curta" value={row.short_description} onChange={(v) => patch(idx, { short_description: v })} textarea />
            <Field label="Descrição completa" value={row.full_description} onChange={(v) => patch(idx, { full_description: v })} textarea />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <ImageUploadField
                label="Imagem"
                aspect="landscape"
                value={row.image_url}
                onChange={(url) => patch(idx, { image_url: url })}
              />
              <Field label="…ou URL da imagem" value={row.image_url} onChange={(v) => patch(idx, { image_url: v })} />
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold">Status</span>
                <select
                  value={row.status}
                  onChange={(e) => patch(idx, { status: e.target.value as BenefitRow["status"] })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="rascunho">Rascunho</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold">Ordem de exibição</span>
                <input
                  type="number"
                  value={row.order_index}
                  onChange={(e) => patch(idx, { order_index: Number(e.target.value) })}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={row.featured}
                  onChange={(e) => patch(idx, { featured: e.target.checked })}
                />
                Destaque na página
              </label>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setRows([...rows, emptyBenefit(rows.length + 1)])}
        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted"
      >
        <Plus className="h-4 w-4" /> Adicionar benefício
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void saveAll()}
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
        {savedAt && (
          <span className="inline-flex items-center gap-1 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" /> Salvo
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------------- FAQ ---------------- */

function FaqPanel() {
  const { data, isLoading, refetch } = useQuery({ queryKey: ["clube-faqs-admin"], queryFn: listAllFaqs });
  const [rows, setRows] = useState<(FaqRow | (Omit<FaqRow, "id"> & { id?: string }))[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (data) setRows(data);
  }, [data]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Carregando…</p>;

  const patch = (idx: number, p: Partial<FaqRow>) => setRows(rows.map((r, i) => (i === idx ? { ...r, ...p } : r)));

  const remove = async (idx: number) => {
    const row = rows[idx];
    if (row.id && !confirm("Remover esta pergunta?")) return;
    if (row.id) await deleteFaq(row.id);
    setRows(rows.filter((_, i) => i !== idx));
    void refetch();
  };

  const saveAll = async () => {
    setError(null);
    setSaving(true);
    try {
      for (const row of rows) {
        const payload = {
          question: row.question,
          answer: row.answer,
          order_index: Number(row.order_index) || 0,
          status: row.status,
        };
        if (row.id) await updateFaq(row.id, payload);
        else await createFaq(payload);
      }
      setSavedAt(Date.now());
      void refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {rows.map((row, idx) => (
        <div key={row.id ?? `nova-${idx}`} className="rounded-xl border bg-card p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold">{row.question || "Nova pergunta"}</h3>
            <button
              type="button"
              onClick={() => void remove(idx)}
              className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </button>
          </div>
          <Field label="Pergunta" value={row.question} onChange={(v) => patch(idx, { question: v })} />
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Resposta</span>
            <textarea
              value={row.answer}
              onChange={(e) => patch(idx, { answer: e.target.value })}
              rows={6}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Ordem</span>
              <input
                type="number"
                value={row.order_index}
                onChange={(e) => patch(idx, { order_index: Number(e.target.value) })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Status</span>
              <select
                value={row.status}
                onChange={(e) => patch(idx, { status: e.target.value as FaqRow["status"] })}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setRows([...rows, { question: "", answer: "", order_index: rows.length + 1, status: "ativo" }])
        }
        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted"
      >
        <Plus className="h-4 w-4" /> Adicionar pergunta
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void saveAll()}
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
        {savedAt && (
          <span className="inline-flex items-center gap-1 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" /> Salvo
          </span>
        )}
      </div>
    </div>
  );
}
