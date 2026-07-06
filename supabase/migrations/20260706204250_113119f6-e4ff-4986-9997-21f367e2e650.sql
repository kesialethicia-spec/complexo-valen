
-- Storage: restrict store-images SELECT to admins only
DROP POLICY IF EXISTS "Authenticated can view store-images" ON storage.objects;
CREATE POLICY "Admins can view store-images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'store-images' AND private.has_role(auth.uid(), 'admin'::app_role));

-- Profiles: add explicit INSERT policy so users can only insert their own profile
-- (creation is normally handled by the SECURITY DEFINER trigger on auth.users)
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
