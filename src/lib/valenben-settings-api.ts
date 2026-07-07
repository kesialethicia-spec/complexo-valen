import { supabase } from "@/integrations/supabase/client";

export interface ValenbenPageSettings {
  logo_url: string;
  hero_image_url: string;
  presentation_image_url: string;
  waiting_room_image_url: string;
  oil_change_area_image_url: string;
  team_image_url: string;
  gallery_urls: string[];
  map_url: string;
  whatsapp_url: string;
}

export const DEFAULT_VALENBEN_SETTINGS: ValenbenPageSettings = {
  logo_url: "",
  hero_image_url: "",
  presentation_image_url: "",
  waiting_room_image_url: "",
  oil_change_area_image_url: "",
  team_image_url: "",
  gallery_urls: [],
  map_url: "https://maps.google.com/?q=Complexo+Valen+São+Luís+MA",
  whatsapp_url: "https://wa.me/559884458884",
};

export async function getValenbenPageSettings(): Promise<ValenbenPageSettings> {
  const { data, error } = await supabase
    .from("valenben_page_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_VALENBEN_SETTINGS;
  return {
    logo_url: data.logo_url ?? "",
    hero_image_url: data.hero_image_url ?? "",
    presentation_image_url: data.presentation_image_url ?? "",
    waiting_room_image_url: data.waiting_room_image_url ?? "",
    oil_change_area_image_url: data.oil_change_area_image_url ?? "",
    team_image_url: data.team_image_url ?? "",
    gallery_urls: (data.gallery_urls ?? []) as string[],
    map_url: data.map_url ?? DEFAULT_VALENBEN_SETTINGS.map_url,
    whatsapp_url: data.whatsapp_url ?? DEFAULT_VALENBEN_SETTINGS.whatsapp_url,
  };
}

export async function updateValenbenPageSettings(input: ValenbenPageSettings): Promise<void> {
  const { error } = await supabase
    .from("valenben_page_settings")
    .upsert({ id: true, ...input });
  if (error) throw error;
}
