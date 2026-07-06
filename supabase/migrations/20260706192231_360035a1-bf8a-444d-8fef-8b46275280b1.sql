
-- 1) Storage: only admins can write/update/delete store-images
DROP POLICY IF EXISTS "Authenticated can upload store-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update store-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete store-images" ON storage.objects;

CREATE POLICY "Admins can upload store-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'store-images' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update store-images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'store-images' AND private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'store-images' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete store-images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'store-images' AND private.has_role(auth.uid(), 'admin'::app_role));

-- 2) Stores: hide phone/whatsapp columns from anon
REVOKE SELECT ON public.stores FROM anon;
GRANT SELECT (
  id, name, slug, category, logo_url, cover_url,
  short_description, full_description, hours,
  location, block, cta_text, cta_url, status,
  featured, show_on_home, meta_title, meta_description,
  created_at, updated_at
) ON public.stores TO anon;

GRANT SELECT ON public.stores TO authenticated;
