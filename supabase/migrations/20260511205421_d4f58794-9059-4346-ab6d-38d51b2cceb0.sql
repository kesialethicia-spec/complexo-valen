-- Create stores table for Lojas do Complexo
CREATE TABLE public.stores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  logo_url text NOT NULL DEFAULT '',
  cover_url text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  hours text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  block text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT 'Ver detalhes',
  cta_url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'rascunho',
  featured boolean NOT NULL DEFAULT false,
  show_on_home boolean NOT NULL DEFAULT false,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active stores"
ON public.stores FOR SELECT
TO anon, authenticated
USING (status = 'ativa' OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert stores"
ON public.stores FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update stores"
ON public.stores FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete stores"
ON public.stores FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER stores_updated_at
BEFORE UPDATE ON public.stores
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();