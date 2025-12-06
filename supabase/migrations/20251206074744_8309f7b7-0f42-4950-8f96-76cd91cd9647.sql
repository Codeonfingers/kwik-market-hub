-- Drop existing overly permissive storage policies
DROP POLICY IF EXISTS "Vendors can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can update their product images" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can delete their product images" ON storage.objects;
DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;

-- Create public read access for product images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Create vendor-only upload policy using has_role function
CREATE POLICY "Only vendors can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'vendor'::public.app_role)
);

-- Create vendor-only update policy
CREATE POLICY "Only vendors can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'vendor'::public.app_role)
);

-- Create vendor-only delete policy
CREATE POLICY "Only vendors can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'vendor'::public.app_role)
);