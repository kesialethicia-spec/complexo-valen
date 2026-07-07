import { useRef, useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Upload, X, Loader2, Crop as CropIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_ATTR = "image/jpeg,image/png,image/webp";
const MAX_MB = 8;
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

interface Props {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  /** largura / altura */
  aspect: number;
  /** rótulo do tamanho, ex: "1920×1080 (desktop)" */
  sizeLabel?: string;
  /** largura de saída em px (mantém a proporção) */
  outputWidth?: number;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function cropToBlob(
  src: string,
  area: Area,
  outputWidth: number,
  aspect: number,
): Promise<Blob> {
  const img = await loadImage(src);
  const canvas = document.createElement("canvas");
  const w = outputWidth;
  const h = Math.round(outputWidth / aspect);
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, w, h);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Falha ao gerar imagem"))),
      "image/jpeg",
      0.9,
    ),
  );
}

export function CropImageUploadField({
  label,
  hint,
  value,
  onChange,
  aspect,
  sizeLabel,
  outputWidth = 1920,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handlePick = () => inputRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const url = URL.createObjectURL(file);
    setRawSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const closeModal = () => {
    if (rawSrc) URL.revokeObjectURL(rawSrc);
    setRawSrc(null);
    setCroppedAreaPixels(null);
  };

  const handleConfirm = async () => {
    if (!rawSrc || !croppedAreaPixels) return;
    setUploading(true);
    setError(null);
    try {
      const blob = await cropToBlob(rawSrc, croppedAreaPixels, outputWidth, aspect);
      const path = `home-hero/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("store-images")
        .upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (upErr) throw upErr;
      const { data, error: signErr } = await supabase.storage
        .from("store-images")
        .createSignedUrl(path, SIGNED_URL_TTL);
      if (signErr) throw signErr;
      onChange(data.signedUrl);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  return (
    <div>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {(hint || sizeLabel) && (
        <p className="text-xs text-muted-foreground mb-2">
          {sizeLabel && <span className="font-medium">{sizeLabel}</span>}
          {sizeLabel && hint && " · "}
          {hint}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_ATTR}
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className="space-y-2">
          <div
            className="w-full max-w-md overflow-hidden rounded-xl border bg-muted"
            style={{ aspectRatio: aspect }}
          >
            <img src={value} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePick}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
            >
              <Upload className="h-3.5 w-3.5" /> Trocar imagem
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
            >
              <X className="h-3.5 w-3.5" /> Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handlePick}
          className="flex w-full max-w-md flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-8 text-sm text-muted-foreground hover:bg-muted"
          style={{ aspectRatio: aspect }}
        >
          <Upload className="h-5 w-5" />
          <span className="font-semibold">Enviar imagem</span>
          <span className="text-xs">JPG, PNG ou WebP · até {MAX_MB}MB</span>
        </button>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

      {rawSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-background shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <div className="flex items-center gap-2">
                <CropIcon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-display font-bold">
                  Recortar imagem {sizeLabel ? `— ${sizeLabel}` : ""}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={uploading}
                className="rounded-full p-1.5 hover:bg-muted disabled:opacity-60"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative h-[420px] bg-black">
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                objectFit="contain"
              />
            </div>

            <div className="space-y-4 px-5 py-4">
              <label className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="w-12 font-semibold">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
              </label>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={uploading}
                  className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={uploading || !croppedAreaPixels}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CropIcon className="h-4 w-4" />}
                  {uploading ? "Enviando…" : "Aplicar recorte"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
