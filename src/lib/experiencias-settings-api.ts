import { supabase } from "@/integrations/supabase/client";

export type EventStatus = "Realizado" | "Em breve" | "Inscrições abertas";
export type EventCategory =
  | "Evento"
  | "Saúde"
  | "Experiência"
  | "Campanha"
  | "Institucional";

export interface ExperienciasEvent {
  id: string;
  name: string;
  description: string;
  image_url: string;
  period: string;
  link: string;
  status: "rascunho" | "publicado";
  featured: boolean;
  title?: string;
  slug?: string;
  location?: string;
  category?: EventCategory | string;
  event_status?: EventStatus | string;
  full_description?: string;
  order?: number;
}

export interface ExperienciasPageSettings {
  festa_image_url: string;
  cafe_image_url: string;
  cafe_instagram_urls: string[];
  saude_image_urls: string[];
  saude_instagram_urls: string[];
  clube_image_url: string;
  valentina_image_urls: string[];
  studio_image_url: string;
  studio_youtube_urls: string[];
  gallery_urls: string[];
  events: ExperienciasEvent[];
}

export const DEFAULT_EXPERIENCIAS_SETTINGS: ExperienciasPageSettings = {
  festa_image_url: "",
  cafe_image_url: "",
  cafe_instagram_urls: [],
  saude_image_urls: [],
  saude_instagram_urls: [],
  clube_image_url: "",
  valentina_image_urls: [],
  studio_image_url: "",
  studio_youtube_urls: [],
  gallery_urls: [],
  events: [],
};

export async function getExperienciasPageSettings(): Promise<ExperienciasPageSettings> {
  const { data, error } = await (supabase as any)
    .from("experiencias_page_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_EXPERIENCIAS_SETTINGS;
  return {
    festa_image_url: data.festa_image_url ?? "",
    cafe_image_url: data.cafe_image_url ?? "",
    cafe_instagram_urls: (data.cafe_instagram_urls ?? []) as string[],
    saude_image_urls: (data.saude_image_urls ?? []) as string[],
    saude_instagram_urls: (data.saude_instagram_urls ?? []) as string[],
    clube_image_url: data.clube_image_url ?? "",
    valentina_image_urls: (data.valentina_image_urls ?? []) as string[],
    studio_image_url: data.studio_image_url ?? "",
    studio_youtube_urls: (data.studio_youtube_urls ?? []) as string[],
    gallery_urls: (data.gallery_urls ?? []) as string[],
    events: Array.isArray(data.events) ? (data.events as ExperienciasEvent[]) : [],
  };
}

export async function updateExperienciasPageSettings(
  input: ExperienciasPageSettings,
): Promise<void> {
  const { error } = await (supabase as any)
    .from("experiencias_page_settings")
    .upsert({ id: true, ...input });
  if (error) throw error;
}

/** Extract Instagram post/reel ID and canonicalize the URL. */
export function normalizeInstagramUrl(url: string): string {
  if (!url) return "";
  return url.trim();
}
