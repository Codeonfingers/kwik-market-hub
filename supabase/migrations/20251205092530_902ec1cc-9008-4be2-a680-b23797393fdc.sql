-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Product images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Vendors can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Vendors can update their product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Vendors can delete their product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Fix profiles table to restrict PII access (security fix)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow users to add vendor or shopper roles to themselves (security fix for role assignment)
CREATE POLICY "Users can add vendor or shopper roles"
ON user_roles FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND role IN ('vendor', 'shopper')
);