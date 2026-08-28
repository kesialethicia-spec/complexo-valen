import { RESPONSIVE_IMAGES, type ResponsiveImage } from "./images.generated";

const BY_URL = new Map<string, ResponsiveImage>();
for (const img of Object.values(RESPONSIVE_IMAGES)) {
  BY_URL.set(img.src, img);
  for (const part of img.srcSet.split(",")) {
    const url = part.trim().split(" ")[0];
    if (url) BY_URL.set(url, img);
  }
}

/** Retorna as variantes responsivas de uma imagem do CDN, quando existirem. */
export function findResponsive(src?: string | null): ResponsiveImage | undefined {
  if (!src) return undefined;
  return BY_URL.get(src);
}

export type { ResponsiveImage };
