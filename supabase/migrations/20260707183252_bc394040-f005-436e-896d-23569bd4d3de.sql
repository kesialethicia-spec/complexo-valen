CREATE POLICY "Public can read store-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'store-images');