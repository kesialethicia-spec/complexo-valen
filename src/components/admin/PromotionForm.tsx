import { useEffect, useState } from "react";
import {
  PROMOTION_CATEGORIES,
  slugify,
  type PromotionInput,
  type PromotionRow,
  type PromotionStatus,
} from "@/lib/promotions-api";
import { ImageUploadField } from "@/components/admin/ImageUploadField";


interface Props {
  initial?: PromotionRow;
  submitting: boolean;
  onSubmit: (data: PromotionInput) => Promise<void> | void;
  onCancel: () => void;
}

export function PromotionForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [category, setCategory] = useState<string>(initial?.category ?? PROMOTION_CATEGORIES[0]);
  const [coverUrl, setCoverUrl] = useState(initial?.cover_url ?? "");
  const [shortDescription, setShortDescription] = useState(initial?.short_description ?? "");
  const [fullDescription, setFullDescription] = useState(initial?.full_description ?? "");
  const [validity, setValidity] = useState(initial?.validity ?? "");
  const [rules, setRules] = useState(initial?.rules ?? "");
  const [ctaText, setCtaText] = useState(initial?.cta_text ?? "Ver promoção");
  const [ctaUrl, setCtaUrl] = useState(initial?.cta_url ?? "");
  const [status, setStatus] = useState<PromotionStatus>(initial?.status ?? "rascunho");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [showOnHome, setShowOnHome] = useState(initial?.show_on_home ?? false);
  const [showOnBlog, setShowOnBlog] = useState(initial?.show_on_blog ?? false);
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: PromotionInput = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      category,
      cover_url: coverUrl.trim(),
      short_description: shortDescription.trim(),
      full_description: fullDescription,
      validity: validity.trim(),
      rules,
      cta_text: ctaText.trim() || "Ver promoção",
      cta_url: ctaUrl.trim(),
      status,
      featured,
      show_on_home: showOnHome,
      show_on_blog: showOnBlog,
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
    };
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Field label="Título da promoção">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
        </Field>

        <Field label="Slug (URL)">
          <input
            value={slug}
            onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
            required
            className={inputCls}
          />
          <p className="text-xs text-muted-foreground mt-1">/promocoes/{slug || "..."}</p>
        </Field>

        <Field label="Imagem principal (URL)">
          <input
            type="url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://..."
            className={inputCls}
          />
          {coverUrl && <img src={coverUrl} alt="" className="mt-2 max-h-48 rounded-lg object-cover border" />}
        </Field>

        <Field label="Descrição curta">
          <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} className={inputCls} />
        </Field>

        <Field label="Descrição completa (como participar)">
          <textarea value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} rows={8} className={inputCls} />
        </Field>

        <Field label="Validade / período da promoção">
          <input value={validity} onChange={(e) => setValidity(e.target.value)} placeholder="Até 31/12 — válido em São Luís" className={inputCls} />
        </Field>

        <Field label="Regulamento / regras">
          <textarea value={rules} onChange={(e) => setRules(e.target.value)} rows={6} className={inputCls} />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Texto do botão">
            <input value={ctaText} onChange={(e) => setCtaText(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Link do botão">
            <input type="url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://..." className={inputCls} />
          </Field>
        </div>
      </div>

      <aside className="space-y-5">
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value as PromotionStatus)} className={inputCls}>
            <option value="rascunho">Rascunho</option>
            <option value="ativa">Ativa</option>
            <option value="inativa">Inativa</option>
          </select>
        </Field>

        <Field label="Categoria">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {PROMOTION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Marcar como destaque
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showOnHome} onChange={(e) => setShowOnHome(e.target.checked)} />
          Exibir na Home
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showOnBlog} onChange={(e) => setShowOnBlog(e.target.checked)} />
          Exibir no Blog do Caminhoneiro
        </label>

        <Field label="Meta title (SEO)">
          <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Meta description (SEO)">
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className={inputCls} />
        </Field>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {submitting ? "Salvando…" : "Salvar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            Cancelar
          </button>
        </div>
      </aside>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
