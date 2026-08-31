import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Img } from "@/components/Img";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_ATTR = "image/jpeg,image/png,image/webp";
const MAX_MB = 5;
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // 10 anos

const MAX_DIMENSION = 1600;

/** Reduz e converte a imagem para WebP no navegador (mantém transparência). */
async function optimizeImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.82),
    );
    if (!blob || blob.size >= file.size) return file;
    return blob;
  } catch {
    return file;
  }
}

interface Props {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  previewClassName?: string;
  aspect?: "square" | "landscape";
}

export function ImageUploadField({
  label,
  hint,
  value,
  onChange,
  previewClassName,
  aspect = "square",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const previewSrc = localPreview ?? value;

  const handlePick = () => inputRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Formato inválido. Use JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Imagem muito grande. Máximo ${MAX_MB}MB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);

    try {
      const optimized = await optimizeImage(file);
      const ext = optimized.type === "image/webp" ? "webp" : file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("store-images")
        .upload(path, optimized, { contentType: optimized.type, upsert: false, cacheControl: "31536000" });
      if (upErr) throw upErr;

      const { data, error: signErr } = await supabase.storage
        .from("store-images")
        .createSignedUrl(path, SIGNED_URL_TTL);
      if (signErr) throw signErr;

      onChange(data.signedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload");
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    onChange("");
    setError(null);
  };

  const previewCls =
    previewClassName ??
    (aspect === "square"
      ? "h-28 w-28 rounded-2xl object-contain bg-white p-2 border"
      : "h-32 w-full max-w-xs rounded-lg object-cover border");

  return (
    <div>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_ATTR}
        onChange={handleFile}
        className="hidden"
      />

      {previewSrc ? (
        <div className="space-y-2">
          <Img src={previewSrc} alt="" className={previewCls} />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePick}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              Trocar imagem
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-60"
            >
              <X className="h-3.5 w-3.5" />
              Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handlePick}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-6 text-sm text-muted-foreground hover:bg-muted disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          <span className="font-semibold">
            {uploading ? "Enviando…" : "Enviar imagem"}
          </span>
          <span className="text-xs">JPG, PNG ou WebP · até {MAX_MB}MB</span>
        </button>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
