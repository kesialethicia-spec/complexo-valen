
CREATE TABLE public.posto_page_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true,
  hero_image_url TEXT DEFAULT '',
  posto_image_url TEXT DEFAULT '',
  abastecimento_image_url TEXT DEFAULT '',
  conveniencia_image_url TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  payment_strip_url TEXT DEFAULT '',
  payment_logos TEXT[] NOT NULL DEFAULT '{}',
  map_url TEXT DEFAULT 'https://maps.google.com/?q=Complexo+Valen+São+Luís+MA',
  whatsapp_url TEXT DEFAULT 'https://wa.me/5598000000000',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT posto_settings_singleton CHECK (id = true)
);

GRANT SELECT ON public.posto_page_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.posto_page_settings TO authenticated;
GRANT ALL ON public.posto_page_settings TO service_role;

ALTER TABLE public.posto_page_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posto settings" ON public.posto_page_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert posto settings" ON public.posto_page_settings
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update posto settings" ON public.posto_page_settings
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER posto_page_settings_updated_at
  BEFORE UPDATE ON public.posto_page_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.posto_page_settings (id) VALUES (true) ON CONFLICT DO NOTHING;
