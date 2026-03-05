-- 029_create_storage_bucket.sql
INSERT INTO storage.buckets (id, name, public) VALUES ('spot-images', 'spot-images', true);

CREATE POLICY "spot_images_select" ON storage.objects FOR SELECT USING (bucket_id = 'spot-images');
CREATE POLICY "spot_images_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'spot-images' AND auth.role() = 'authenticated');
CREATE POLICY "spot_images_delete" ON storage.objects FOR DELETE USING (bucket_id = 'spot-images' AND auth.uid()::text = (storage.foldername(name))[1]);
