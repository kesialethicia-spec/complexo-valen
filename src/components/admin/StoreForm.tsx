import { useEffect, useState } from "react";
import {
  STORE_CATEGORIES,
  slugify,
  type StoreInput,
  type StoreRow,
  type StoreStatus,
} from "@/lib/stores-api";
import { ImageUploadField } from "./ImageUploadField";


interface Props {
  initial?: StoreRow;
  submitting: boolean;
  onSubmit: (data: StoreInput) => Promise<void> | void;
  onCancel: () => void;
}

export function StoreForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [category, setCategory] = useState<string>(initial?.category ?? STORE_CATEGORIES[0]);
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url ?? "");
  const [coverUrl, setCoverUrl] = useState(initial?.cover_url ?? "");
  const [shortDescription, setShortDescription] = useState(initial?.short_description ?? "");
  const [fullDescription, setFullDescription] = useState(initial?.full_description ?? "");
  const [hours, setHours] = useState(initial?.hours ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [block, setBlock] = useState(initial?.block ?? "");
  const [ctaText, setCtaText] = useState(initial?.cta_text ?? "Ver detalhes");
  const [ctaUrl, setCtaUrl] = useState(initial?.cta_url ?? "");
  const [status, setStatus] = useState<StoreStatus>(initial?.status ?? "rascunho");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [showOnHome, setShowOnHome] = useState(initial?.show_on_home ?? false);
  const [orderIndex, setOrderIndex] = useState<number>(initial?.order_index ?? 0);
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: StoreInput = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      category,
      logo_url: logoUrl.trim(),
      cover_url: coverUrl.trim(),
      short_description: shortDescription.trim(),
      full_description: fullDescription,
      hours: hours.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      location: location.trim(),
      block: block.trim(),
      cta_text: ctaText.trim() || "Ver detalhes",
      cta_url: ctaUrl.trim(),
      status,
      featured,
      show_on_home: showOnHome,
      order_index: Number.isFinite(orderIndex) ? orderIndex : 0,
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
    };
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Field label="Nome da loja">
          <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
        </Field>

        <Field label="Slug (URL)">
          <input
            value={slug}
            onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
            required
            className={inputCls}
          />
          <p className="text-xs text-muted-foreground mt-1">/lojas/{slug || "..."}</p>
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <ImageUploadField
            label="Logo da loja"
            hint="Recomendado: imagem quadrada (ex.: 400×400px)."
            value={logoUrl}
            onChange={setLogoUrl}
            aspect="square"
          />
          <ImageUploadField
            label="Imagem principal"
            hint="Recomendado: imagem horizontal (ex.: 1200×675px)."
            value={coverUrl}
            onChange={setCoverUrl}
            aspect="landscape"
          />
        </div>

        <Field label="Descrição curta">
          <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} className={inputCls} />
        </Field>

        <Field label="Descrição completa">
          <textarea value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} rows={8} className={inputCls} />
        </Field>

        <Field label="Horário de funcionamento">
          <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Seg a Sex 08h às 18h" className={inputCls} />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Telefone">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(98) 0000-0000" className={inputCls} />
          </Field>
          <Field label="WhatsApp">
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="5598999999999" className={inputCls} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Localização dentro do complexo">
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Galeria / Truck Center" className={inputCls} />
          </Field>
          <Field label="Bloco / Unidade">
            <input value={block} onChange={(e) => setBlock(e.target.value)} placeholder="Bloco A" className={inputCls} />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Texto do botão">
            <input value={ctaText} onChange={(e) => setCtaText(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Link do botão ou WhatsApp">
            <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://wa.me/55..." className={inputCls} />
          </Field>
        </div>
      </div>

      <aside className="space-y-5">
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value as StoreStatus)} className={inputCls}>
            <option value="rascunho">Rascunho</option>
            <option value="ativa">Ativa</option>
            <option value="inativa">Inativa</option>
          </select>
        </Field>

        <Field label="Categoria">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {STORE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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

        <Field label="Meta title (SEO)">
          <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Meta description (SEO)">
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className={inputCls} />
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
