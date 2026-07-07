import { supabase } from "@/integrations/supabase/client";

export interface HomePageSettings {
  hero_bg_image_url: string;
}

export const DEFAULT_HOME_SETTINGS: HomePageSettings = {
  hero_bg_image_url: "",
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
  return { hero_bg_image_url: data.hero_bg_image_url ?? "" };
}

export async function updateHomePageSettings(input: HomePageSettings): Promise<void> {
  const { error } = await client
    .from("home_page_settings")
    .upsert({ id: true, ...input });
  if (error) throw error;
}
