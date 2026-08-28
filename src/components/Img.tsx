import { findResponsive } from "@/lib/img";

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement>;

/**
 * <img> com otimização automática:
 * - aplica srcSet/sizes responsivos quando a imagem tem variantes WebP no CDN
 * - define width/height intrínsecos (evita layout shift)
 * - lazy loading por padrão; eager + fetchPriority="high" quando marcado como prioritário
 * Não altera layout: todas as classes/estilos continuam valendo.
 */
export function Img({
  src,
  srcSet,
  sizes,
  loading,
  decoding,
  fetchPriority,
  width,
  height,
  ...rest
}: ImgProps) {
  const responsive = typeof src === "string" ? findResponsive(src) : undefined;
  const priority = fetchPriority === "high" || loading === "eager";
  const finalSrcSet = srcSet ?? responsive?.srcSet;

  return (
    <img
      src={src}
      srcSet={finalSrcSet}
      sizes={finalSrcSet ? (sizes ?? "100vw") : sizes}
      width={width ?? responsive?.width}
      height={height ?? responsive?.height}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding={decoding ?? (priority ? "auto" : "async")}
      fetchPriority={fetchPriority}
      {...rest}
    />
  );
}
