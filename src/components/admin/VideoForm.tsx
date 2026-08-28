import { useEffect, useState } from "react";
import {
  VIDEO_CATEGORIES,
  extractYoutubeId,
  youtubeThumbnail,
  type VideoInput,
  type VideoRow,
  type VideoStatus,
} from "@/lib/videos-api";
import { Img } from "@/components/Img";

interface Props {
  initial?: VideoRow;
  submitting: boolean;
  onSubmit: (data: VideoInput) => Promise<void> | void;
  onCancel: () => void;
}

export function VideoForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? VIDEO_CATEGORIES[0]);
  const [shortDescription, setShortDescription] = useState(initial?.short_description ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtube_url ?? "");
  const [status, setStatus] = useState<VideoStatus>(initial?.status ?? "rascunho");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [sortOrder, setSortOrder] = useState<number>(initial?.sort_order ?? 0);
  const [urlError, setUrlError] = useState<string | null>(null);

  const videoId = extractYoutubeId(youtubeUrl);

  useEffect(() => {
    if (!youtubeUrl.trim()) setUrlError(null);
    else if (!videoId) setUrlError("Não foi possível identificar um ID de vídeo válido nesta URL.");
    else setUrlError(null);
  }, [youtubeUrl, videoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId) {
      setUrlError("Informe um link válido do YouTube.");
      return;
    }
    const data: VideoInput = {
      title: title.trim(),
      category,
      short_description: shortDescription.trim(),
      youtube_url: youtubeUrl.trim(),
      youtube_id: videoId,
      status,
      featured,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    };
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Field label="Título do vídeo">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
        </Field>

        <Field label="Link do YouTube">
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
            placeholder="https://www.youtube.com/watch?v=..."
            className={inputCls}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Aceita links do tipo <code>youtube.com/watch?v=</code>, <code>youtu.be/</code>, <code>shorts</code> ou <code>embed</code>.
          </p>
          {urlError && <p className="mt-1 text-xs text-destructive">{urlError}</p>}
          {videoId && (
            <div className="mt-3 flex items-center gap-3">
              <Img
                src={youtubeThumbnail(videoId, "mq")}
                alt="Prévia da thumbnail"
                className="h-20 w-36 rounded-md object-cover border"
              />
              <div className="text-xs text-muted-foreground">
                <div><strong>ID do vídeo:</strong> {videoId}</div>
                <div>Thumbnail gerada automaticamente.</div>
              </div>
            </div>
          )}
        </Field>

        <Field label="Descrição curta">
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={3}
            className={inputCls}
          />
        </Field>
      </div>

      <aside className="space-y-5">
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value as VideoStatus)} className={inputCls}>
            <option value="rascunho">Rascunho</option>
            <option value="publicado">Publicado</option>
          </select>
        </Field>

        <Field label="Categoria">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {VIDEO_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Ordem de exibição">
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className={inputCls}
          />
          <p className="text-xs text-muted-foreground mt-1">Menor número aparece primeiro.</p>
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Marcar como destaque
        </label>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={submitting || !!urlError}
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
