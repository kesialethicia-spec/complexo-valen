import { supabase } from "@/integrations/supabase/client";

export interface ValenlubPageSettings {
  logo_url: string;
  hero_image_url: string;
  presentation_image_url: string;
  stock_image_url: string;
  team_image_url: string;
  delivery_image_url: string;
  gallery_urls: string[];
  brand_logos: string[];
  map_url: string;
  whatsapp_url: string;
}

export const DEFAULT_VALENLUB_SETTINGS: ValenlubPageSettings = {
  logo_url: "",
  hero_image_url: "",
  presentation_image_url: "",
  stock_image_url: "",
  team_image_url: "",
  delivery_image_url: "",
  gallery_urls: [],
  brand_logos: [],
  map_url: "https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6",
  whatsapp_url: "https://wa.me/559884458884",
};

export async function getValenlubPageSettings(): Promise<ValenlubPageSettings> {
  const { data, error } = await supabase
    .from("valenlub_page_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_VALENLUB_SETTINGS;
  return {
    logo_url: data.logo_url ?? "",
    hero_image_url: data.hero_image_url ?? "",
    presentation_image_url: data.presentation_image_url ?? "",
    stock_image_url: data.stock_image_url ?? "",
    team_image_url: data.team_image_url ?? "",
    delivery_image_url: data.delivery_image_url ?? "",
    gallery_urls: (data.gallery_urls ?? []) as string[],
    brand_logos: (data.brand_logos ?? []) as string[],
    map_url: data.map_url ?? DEFAULT_VALENLUB_SETTINGS.map_url,
    whatsapp_url: data.whatsapp_url ?? DEFAULT_VALENLUB_SETTINGS.whatsapp_url,
  };
}

export async function updateValenlubPageSettings(input: ValenlubPageSettings): Promise<void> {
  const { error } = await supabase
    .from("valenlub_page_settings")
    .upsert({ id: true, ...input });
  if (error) throw error;
}
