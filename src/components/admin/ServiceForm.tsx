import { useEffect, useState } from "react";
import {
  slugify,
  type ServiceInput,
  type ServiceRow,
  type ServiceStatus,
} from "@/lib/services-api";
import { SERVICE_ICON_NAMES, getServiceIcon } from "@/lib/service-icons";
import { ImageUploadField } from "./ImageUploadField";

interface Props {
  initial?: ServiceRow;
  submitting: boolean;
  onSubmit: (data: ServiceInput) => Promise<void> | void;
  onCancel: () => void;
}

export function ServiceForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join("\n"));
  const [icon, setIcon] = useState(initial?.icon ?? "Sparkles");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [linkUrl, setLinkUrl] = useState(initial?.link_url ?? "");
  const [status, setStatus] = useState<ServiceStatus>(initial?.status ?? "rascunho");
  const [orderIndex, setOrderIndex] = useState<number>(initial?.order_index ?? 100);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  const IconPreview = getServiceIcon(icon);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsText.split("\n").map((t) => t.trim()).filter(Boolean);
    const data: ServiceInput = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim(),
      tags,
      icon,
      image_url: imageUrl.trim(),
      link_url: linkUrl.trim(),
      status,
      order_index: Number.isFinite(orderIndex) ? orderIndex : 100,
    };
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Field label="Nome do serviço">
          <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
        </Field>

        <Field label="Slug (identificador)">
          <input
            value={slug}
            onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
            required
            className={inputCls}
          />
          <p className="text-xs text-muted-foreground mt-1">Usado apenas internamente.</p>
        </Field>

        <Field label="Descrição curta">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
        </Field>

        <Field label="Tags/destaques (uma por linha)">
          <textarea
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            rows={5}
            placeholder={"Ex.: Lanches e bebidas\nItens para viagem"}
            className={inputCls}
          />
        </Field>

        <ImageUploadField
          label="Imagem do card"
          hint="Recomendado: imagem horizontal (ex.: 1200×675px). JPG, PNG ou WebP."
          value={imageUrl}
          onChange={setImageUrl}
          aspect="landscape"
        />

        <Field label="Link de destino">
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="/servicos/posto-valen ou https://…"
            className={inputCls}
          />
          <p className="text-xs text-muted-foreground mt-1">Deixe em branco para o card não ser clicável.</p>
        </Field>
      </div>

      <aside className="space-y-5">
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value as ServiceStatus)} className={inputCls}>
            <option value="rascunho">Rascunho</option>
            <option value="publicado">Publicado</option>
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

        <Field label="Ícone">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-orange text-primary-foreground">
              <IconPreview className="h-5 w-5" />
            </span>
            <select value={icon} onChange={(e) => setIcon(e.target.value)} className={inputCls}>
              {SERVICE_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
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
