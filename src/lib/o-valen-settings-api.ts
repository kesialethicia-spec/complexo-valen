import { supabase } from "@/integrations/supabase/client";

export interface InstagramItem {
  image_url: string;
  link_url: string;
}

export interface OValenPageSettings {
  hero_image_url: string;
  presentation_image_url: string;
  purpose_image_url: string;
  experiencias_image_url: string;
  timeline_2019_image_url: string;
  timeline_2022_image_url: string;
  timeline_2025_image_url: string;
  gallery_urls: string[];
  instagram_urls: InstagramItem[];
  map_url: string;
}

export const DEFAULT_O_VALEN_SETTINGS: OValenPageSettings = {
  hero_image_url: "",
  presentation_image_url: "",
  purpose_image_url: "",
  experiencias_image_url: "",
  timeline_2019_image_url: "",
  timeline_2022_image_url: "",
  timeline_2025_image_url: "",
  gallery_urls: [],
  instagram_urls: [],
  map_url: "https://maps.google.com/?q=Complexo+Valen+São+Luís+MA",
};

export async function getOValenPageSettings(): Promise<OValenPageSettings> {
  const { data, error } = await supabase
    .from("o_valen_page_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_O_VALEN_SETTINGS;
  return {
    hero_image_url: data.hero_image_url ?? "",
    presentation_image_url: data.presentation_image_url ?? "",
    purpose_image_url: data.purpose_image_url ?? "",
    experiencias_image_url: data.experiencias_image_url ?? "",
    timeline_2019_image_url: data.timeline_2019_image_url ?? "",
    timeline_2022_image_url: data.timeline_2022_image_url ?? "",
    timeline_2025_image_url: data.timeline_2025_image_url ?? "",
    gallery_urls: (data.gallery_urls ?? []) as string[],
    instagram_urls: (data.instagram_urls ?? []) as unknown as InstagramItem[],
    map_url: data.map_url ?? DEFAULT_O_VALEN_SETTINGS.map_url,
  };
}

export async function updateOValenPageSettings(input: OValenPageSettings): Promise<void> {
  const { error } = await supabase
    .from("o_valen_page_settings")
    .upsert({ id: true, ...input, instagram_urls: input.instagram_urls as unknown as never });
  if (error) throw error;
}
