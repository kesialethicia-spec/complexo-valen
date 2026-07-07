CREATE TABLE public.experiencias_page_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  festa_image_url text NOT NULL DEFAULT '',
  cafe_image_url text NOT NULL DEFAULT '',
  cafe_instagram_urls text[] NOT NULL DEFAULT '{}',
  saude_image_urls text[] NOT NULL DEFAULT '{}',
  saude_instagram_urls text[] NOT NULL DEFAULT '{}',
  clube_image_url text NOT NULL DEFAULT '',
  valentina_image_urls text[] NOT NULL DEFAULT '{}',
  studio_image_url text NOT NULL DEFAULT '',
  studio_youtube_urls text[] NOT NULL DEFAULT '{}',
  gallery_urls text[] NOT NULL DEFAULT '{}',
  events jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.experiencias_page_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.experiencias_page_settings TO authenticated;
GRANT ALL ON public.experiencias_page_settings TO service_role;

ALTER TABLE public.experiencias_page_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read experiencias settings" ON public.experiencias_page_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert experiencias settings" ON public.experiencias_page_settings
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update experiencias settings" ON public.experiencias_page_settings
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER set_experiencias_page_settings_updated_at
  BEFORE UPDATE ON public.experiencias_page_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();