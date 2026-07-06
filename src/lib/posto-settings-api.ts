import { supabase } from "@/integrations/supabase/client";

export interface PostoPageSettings {
  hero_image_url: string;
  posto_image_url: string;
  abastecimento_image_url: string;
  conveniencia_image_url: string;
  logo_url: string;
  payment_strip_url: string;
  payment_logos: string[];
  map_url: string;
  whatsapp_url: string;
}

export const DEFAULT_POSTO_SETTINGS: PostoPageSettings = {
  hero_image_url: "",
  posto_image_url: "",
  abastecimento_image_url: "",
  conveniencia_image_url: "",
  logo_url: "",
  payment_strip_url: "",
  payment_logos: [],
  map_url: "https://maps.google.com/?q=Complexo+Valen+São+Luís+MA",
  whatsapp_url: "https://wa.me/5598000000000",
};

export async function getPostoPageSettings(): Promise<PostoPageSettings> {
  const { data, error } = await supabase
    .from("posto_page_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_POSTO_SETTINGS;
  return {
    hero_image_url: data.hero_image_url ?? "",
    posto_image_url: data.posto_image_url ?? "",
    abastecimento_image_url: data.abastecimento_image_url ?? "",
    conveniencia_image_url: data.conveniencia_image_url ?? "",
    logo_url: data.logo_url ?? "",
    payment_strip_url: data.payment_strip_url ?? "",
    payment_logos: (data.payment_logos ?? []) as string[],
    map_url: data.map_url ?? DEFAULT_POSTO_SETTINGS.map_url,
    whatsapp_url: data.whatsapp_url ?? DEFAULT_POSTO_SETTINGS.whatsapp_url,
  };
}

export async function updatePostoPageSettings(input: PostoPageSettings): Promise<void> {
  const { error } = await supabase
    .from("posto_page_settings")
    .upsert({ id: true, ...input });
  if (error) throw error;
}
