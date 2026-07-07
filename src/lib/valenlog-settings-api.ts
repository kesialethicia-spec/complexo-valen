import { supabase } from "@/integrations/supabase/client";

export interface ValenlogPageSettings {
  hero_image_url: string;
  presentation_image_url: string;
  classificacao_image_url: string;
  inspecao_image_url: string;
  valentina_image_urls: string[];
  gallery_urls: string[];
  map_url: string;
}

export const DEFAULT_VALENLOG_SETTINGS: ValenlogPageSettings = {
  hero_image_url: "",
  presentation_image_url: "",
  classificacao_image_url: "",
  inspecao_image_url: "",
  valentina_image_urls: [],
  gallery_urls: [],
  map_url: "https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6",
};

export async function getValenlogPageSettings(): Promise<ValenlogPageSettings> {
  const { data, error } = await supabase
    .from("valenlog_page_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_VALENLOG_SETTINGS;
  return {
    hero_image_url: data.hero_image_url ?? "",
    presentation_image_url: data.presentation_image_url ?? "",
    classificacao_image_url: data.classificacao_image_url ?? "",
    inspecao_image_url: data.inspecao_image_url ?? "",
    valentina_image_urls: (data.valentina_image_urls ?? []) as string[],
    gallery_urls: (data.gallery_urls ?? []) as string[],
    map_url: data.map_url ?? DEFAULT_VALENLOG_SETTINGS.map_url,
  };
}

export async function updateValenlogPageSettings(input: ValenlogPageSettings): Promise<void> {
  const { error } = await supabase
    .from("valenlog_page_settings")
    .upsert({ id: true, ...input });
  if (error) throw error;
}
