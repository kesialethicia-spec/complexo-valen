CREATE TABLE public.valenlog_page_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true,
  hero_image_url TEXT DEFAULT '',
  presentation_image_url TEXT DEFAULT '',
  classificacao_image_url TEXT DEFAULT '',
  inspecao_image_url TEXT DEFAULT '',
  valentina_image_urls TEXT[] NOT NULL DEFAULT '{}',
  gallery_urls TEXT[] NOT NULL DEFAULT '{}',
  map_url TEXT DEFAULT 'https://maps.google.com/?q=Complexo+Valen+São+Luís+MA',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valenlog_settings_singleton CHECK (id = true)
);

GRANT SELECT ON public.valenlog_page_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.valenlog_page_settings TO authenticated;
GRANT ALL ON public.valenlog_page_settings TO service_role;

ALTER TABLE public.valenlog_page_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read valenlog settings" ON public.valenlog_page_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert valenlog settings" ON public.valenlog_page_settings
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update valenlog settings" ON public.valenlog_page_settings
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER valenlog_page_settings_updated_at
  BEFORE UPDATE ON public.valenlog_page_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.valenlog_page_settings (id) VALUES (true) ON CONFLICT DO NOTHING;