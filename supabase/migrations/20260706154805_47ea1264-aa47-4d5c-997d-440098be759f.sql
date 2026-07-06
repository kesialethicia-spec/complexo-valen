
CREATE POLICY "Authenticated can view store-images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'store-images');

CREATE POLICY "Authenticated can upload store-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'store-images');

CREATE POLICY "Authenticated can update store-images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'store-images');

CREATE POLICY "Authenticated can delete store-images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'store-images');
