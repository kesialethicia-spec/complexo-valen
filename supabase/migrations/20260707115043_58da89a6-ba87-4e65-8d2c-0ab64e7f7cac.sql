CREATE TABLE public.o_valen_page_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  hero_image_url text,
  presentation_image_url text,
  purpose_image_url text,
  experiencias_image_url text,
  timeline_2019_image_url text,
  timeline_2022_image_url text,
  timeline_2025_image_url text,
  gallery_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  instagram_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  map_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.o_valen_page_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.o_valen_page_settings TO authenticated;
GRANT ALL ON public.o_valen_page_settings TO service_role;

ALTER TABLE public.o_valen_page_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read o_valen settings" ON public.o_valen_page_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert o_valen settings" ON public.o_valen_page_settings
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update o_valen settings" ON public.o_valen_page_settings
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER set_o_valen_page_settings_updated_at
  BEFORE UPDATE ON public.o_valen_page_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();