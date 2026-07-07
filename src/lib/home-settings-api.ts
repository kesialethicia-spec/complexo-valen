import { supabase } from "@/integrations/supabase/client";

export interface HomePageSettings {
  hero_bg_image_url: string;
  hero_bg_image_desktop_url: string;
  hero_bg_image_mobile_url: string;
}

export const DEFAULT_HOME_SETTINGS: HomePageSettings = {
  hero_bg_image_url: "",
  hero_bg_image_desktop_url: "",
  hero_bg_image_mobile_url: "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = supabase as any;

export async function getHomePageSettings(): Promise<HomePageSettings> {
  const { data, error } = await client
    .from("home_page_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_HOME_SETTINGS;
  const legacy = data.hero_bg_image_url ?? "";
  return {
    hero_bg_image_url: legacy,
    hero_bg_image_desktop_url: data.hero_bg_image_desktop_url ?? legacy ?? "",
    hero_bg_image_mobile_url: data.hero_bg_image_mobile_url ?? "",
  };
}

export async function updateHomePageSettings(input: HomePageSettings): Promise<void> {
  const { error } = await client
    .from("home_page_settings")
    .upsert({
      id: true,
      // mantém coluna legada em sincronia com o desktop
      hero_bg_image_url: input.hero_bg_image_desktop_url || input.hero_bg_image_url || "",
      hero_bg_image_desktop_url: input.hero_bg_image_desktop_url || "",
      hero_bg_image_mobile_url: input.hero_bg_image_mobile_url || "",
    });
  if (error) throw error;
}
