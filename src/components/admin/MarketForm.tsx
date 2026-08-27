import { useState } from "react";
import { slugify, type MarketInput, type MarketRow, type MarketStatus } from "@/lib/markets-api";
import { ImageUploadField } from "./ImageUploadField";

interface Props {
  initial?: MarketRow;
  submitting: boolean;
  onSubmit: (data: MarketInput) => Promise<void> | void;
  onCancel: () => void;
}

export function MarketForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [fullDescription, setFullDescription] = useState(initial?.full_description ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [galleryText, setGalleryText] = useState((initial?.gallery_urls ?? []).join("\n"));
  const [featuresText, setFeaturesText] = useState((initial?.features ?? []).join("\n"));
  const [ctaText, setCtaText] = useState(initial?.cta_text ?? "Ver localização");
  const [ctaUrl, setCtaUrl] = useState(initial?.cta_url ?? "https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6");
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");
  const [status, setStatus] = useState<MarketStatus>(initial?.status ?? "rascunho");
  const [orderIndex, setOrderIndex] = useState<number>(initial?.order_index ?? 100);

  const handleName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: name.trim(),
      slug: (slug.trim() || slugify(name)).trim(),
      description: description.trim(),
      full_description: fullDescription.trim(),
      location: location.trim(),
      image_url: imageUrl.trim(),
      gallery_urls: galleryText.split("\n").map((t) => t.trim()).filter(Boolean),
      features: featuresText.split("\n").map((t) => t.trim()).filter(Boolean),
      cta_text: ctaText.trim(),
      cta_url: ctaUrl.trim(),
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      status,
      order_index: Number.isFinite(orderIndex) ? orderIndex : 100,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Field label="Nome do mercado">
          <input value={name} onChange={(e) => handleName(e.target.value)} required className={inputCls} />
        </Field>

        <Field label="Slug (endereço na web)">
          <input
            value={slug}
            onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }}
            placeholder="gerado automaticamente pelo nome"
            className={inputCls}
          />
        </Field>

        <Field label="Descrição curta">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
        </Field>

        <Field label="Descrição completa (opcional)">
          <textarea value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} rows={5} className={inputCls} />
        </Field>

        <Field label="Localização">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex.: Valen Center IV."
            className={inputCls}
          />
        </Field>

        <ImageUploadField
          label="Imagem do mercado"
          hint="Recomendado: imagem horizontal (ex.: 1200×800px). JPG, PNG ou WebP. Também é possível colar uma URL."
          value={imageUrl}
          onChange={setImageUrl}
          aspect="landscape"
        />

        <Field label="Imagem por URL">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            className={inputCls}
          />
        </Field>

        <Field label="Galeria de imagens (uma URL por linha)">
          <textarea
            value={galleryText}
            onChange={(e) => setGalleryText(e.target.value)}
            rows={4}
            placeholder="https://…"
            className={inputCls}
          />
        </Field>

        <Field label="Características (uma por linha)">
          <textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={6}
            placeholder={"Ex.: Padaria\nAçougue\nMercearia"}
            className={inputCls}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Texto do botão">
            <input value={ctaText} onChange={(e) => setCtaText(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Link do botão / localização">
            <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://…" className={inputCls} />
          </Field>
        </div>

        <Field label="Meta title (SEO)">
          <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputCls} />
        </Field>

        <Field label="Meta description (SEO)">
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className={inputCls} />
        </Field>
      </div>

      <aside className="space-y-5">
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value as MarketStatus)} className={inputCls}>
            <option value="rascunho">Rascunho (inativo)</option>
            <option value="publicado">Publicado (ativo)</option>
          </select>
        </Field>

        <Field label="Ordem de exibição">
          <input
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(Number(e.target.value))}
            className={inputCls}
          />
          <p className="text-xs text-muted-foreground mt-1">Menor número aparece primeiro.</p>
        </Field>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={submitting} className="flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {submitting ? "Salvando…" : "Salvar"}
          </button>
          <button type="button" onClick={onCancel} className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-muted">
            Cancelar
          </button>
        </div>
      </aside>
    </form>
  );
}

const inputCls = "w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
