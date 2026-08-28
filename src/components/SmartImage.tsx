import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Img } from "@/components/Img";

/**
 * Imagem com skeleton neutro, fade-in suave e fallback com identidade Valen.
 * Nunca exibe imagens genéricas de banco de imagem.
 */
export function SmartImage({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  rounded = "rounded-2xl",
  objectFit = "cover",
  loading = "lazy",
  ...rest
}: {
  src?: string | null;
  alt?: string;
  /** classes do wrapper (aspect-ratio, tamanho, etc.) */
  className?: string;
  /** classes extras aplicadas ao <Img> */
  imgClassName?: string;
  rounded?: string;
  objectFit?: "cover" | "contain";
  loading?: "lazy" | "eager";
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className" | "loading">) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(src ? "loading" : "error");

  const showPlaceholder = !src || status !== "loaded";

  return (
    <div className={`relative overflow-hidden bg-surface ${rounded} ${className}`}>
      {showPlaceholder && (
        <div
          aria-hidden
          className={`absolute inset-0 grid place-items-center bg-gradient-to-br from-surface to-secondary/5 ${
            status === "loading" ? "animate-pulse" : ""
          }`}
        >
          <ImageIcon className="h-8 w-8 text-secondary/20" />
        </div>
      )}
      {src && status !== "error" && (
        <Img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`absolute inset-0 h-full w-full ${
            objectFit === "contain" ? "object-contain" : "object-cover"
          } transition-opacity duration-300 ${status === "loaded" ? "opacity-100" : "opacity-0"} ${imgClassName}`}
          {...rest}
        />
      )}
    </div>
  );
}
