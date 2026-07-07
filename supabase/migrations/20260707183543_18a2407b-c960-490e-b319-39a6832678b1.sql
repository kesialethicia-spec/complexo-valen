
CREATE TABLE public.valenlub_page_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  logo_url text NOT NULL DEFAULT '',
  hero_image_url text NOT NULL DEFAULT '',
  presentation_image_url text NOT NULL DEFAULT '',
  stock_image_url text NOT NULL DEFAULT '',
  team_image_url text NOT NULL DEFAULT '',
  delivery_image_url text NOT NULL DEFAULT '',
  gallery_urls text[] NOT NULL DEFAULT '{}',
  brand_logos text[] NOT NULL DEFAULT '{}',
  map_url text NOT NULL DEFAULT 'https://maps.google.com/?q=Complexo+Valen+São+Luís+MA',
  whatsapp_url text NOT NULL DEFAULT 'https://wa.me/559884458884',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.valenlub_page_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.valenlub_page_settings TO authenticated;
GRANT ALL ON public.valenlub_page_settings TO service_role;

ALTER TABLE public.valenlub_page_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read valenlub settings" ON public.valenlub_page_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert valenlub settings" ON public.valenlub_page_settings
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update valenlub settings" ON public.valenlub_page_settings
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER set_valenlub_page_settings_updated_at
  BEFORE UPDATE ON public.valenlub_page_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
