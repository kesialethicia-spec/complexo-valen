ALTER TABLE public.markets
  ADD COLUMN IF NOT EXISTS slug text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS full_description text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS gallery_urls text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS cta_text text NOT NULL DEFAULT 'Ver localização',
  ADD COLUMN IF NOT EXISTS cta_url text NOT NULL DEFAULT 'https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6',
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text;

UPDATE public.markets
SET slug = regexp_replace(lower(translate(name, 'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ', 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC')), '[^a-z0-9]+', '-', 'g')
WHERE slug = '';

UPDATE public.markets SET slug = trim(both '-' from slug);

CREATE UNIQUE INDEX IF NOT EXISTS markets_slug_key ON public.markets (slug);