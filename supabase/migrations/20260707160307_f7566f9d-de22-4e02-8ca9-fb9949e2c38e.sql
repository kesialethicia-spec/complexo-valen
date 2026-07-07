ALTER TABLE public.home_page_settings
  ADD COLUMN IF NOT EXISTS hero_bg_image_desktop_url text,
  ADD COLUMN IF NOT EXISTS hero_bg_image_mobile_url text;

UPDATE public.home_page_settings
  SET hero_bg_image_desktop_url = COALESCE(hero_bg_image_desktop_url, hero_bg_image_url)
  WHERE hero_bg_image_desktop_url IS NULL;