import { supabase } from "@/integrations/supabase/client";

export interface HotelPageSettings {
  hero_image_url: string;
  presentation_image_url: string;
  logo_url: string;
  gallery_urls: string[];
  reservation_url: string;
  map_url: string;
}

export const DEFAULT_HOTEL_SETTINGS: HotelPageSettings = {
  hero_image_url: "",
  presentation_image_url: "",
  logo_url: "",
  gallery_urls: [],
  reservation_url: "",
  map_url: "https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6",
};

export async function getHotelPageSettings(): Promise<HotelPageSettings> {
  const { data, error } = await supabase
    .from("hotel_page_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_HOTEL_SETTINGS;
  return {
    hero_image_url: data.hero_image_url ?? "",
    presentation_image_url: data.presentation_image_url ?? "",
    logo_url: data.logo_url ?? "",
    gallery_urls: (data.gallery_urls ?? []) as string[],
    reservation_url: data.reservation_url ?? "",
    map_url: data.map_url ?? DEFAULT_HOTEL_SETTINGS.map_url,
  };
}

export async function updateHotelPageSettings(input: HotelPageSettings): Promise<void> {
  const { error } = await supabase
    .from("hotel_page_settings")
    .upsert({ id: true, ...input });
  if (error) throw error;
}
