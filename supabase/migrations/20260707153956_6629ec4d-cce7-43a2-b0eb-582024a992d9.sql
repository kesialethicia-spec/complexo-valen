CREATE TABLE public.home_page_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  hero_bg_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.home_page_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.home_page_settings TO authenticated;
GRANT ALL ON public.home_page_settings TO service_role;

ALTER TABLE public.home_page_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read home settings" ON public.home_page_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert home settings" ON public.home_page_settings
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update home settings" ON public.home_page_settings
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER set_home_page_settings_updated_at
  BEFORE UPDATE ON public.home_page_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();