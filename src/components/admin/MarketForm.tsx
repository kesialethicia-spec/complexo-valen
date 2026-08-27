import { useState } from "react";
import type { MarketInput, MarketRow, MarketStatus } from "@/lib/markets-api";
import { ImageUploadField } from "./ImageUploadField";

interface Props {
  initial?: MarketRow;
  submitting: boolean;
  onSubmit: (data: MarketInput) => Promise<void> | void;
  onCancel: () => void;
}

export function MarketForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [featuresText, setFeaturesText] = useState((initial?.features ?? []).join("\n"));
  const [status, setStatus] = useState<MarketStatus>(initial?.status ?? "rascunho");
  const [orderIndex, setOrderIndex] = useState<number>(initial?.order_index ?? 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      location: location.trim(),
      image_url: imageUrl.trim(),
      features: featuresText.split("\n").map((t) => t.trim()).filter(Boolean),
      status,
      order_index: Number.isFinite(orderIndex) ? orderIndex : 100,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Field label="Nome do mercado">
          <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
        </Field>

        <Field label="Descrição">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputCls} />
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

        <Field label="Características (uma por linha)">
          <textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={6}
            placeholder={"Ex.: Padaria\nAçougue\nMercearia"}
            className={inputCls}
          />
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
