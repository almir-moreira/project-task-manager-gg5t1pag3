DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('activity-attachments', 'activity-attachments', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

DROP POLICY IF EXISTS "activity_attachments_public_read" ON storage.objects;
CREATE POLICY "activity_attachments_public_read" ON storage.objects 
  FOR SELECT USING (bucket_id = 'activity-attachments');

DROP POLICY IF EXISTS "activity_attachments_auth_insert" ON storage.objects;
CREATE POLICY "activity_attachments_auth_insert" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'activity-attachments' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "activity_attachments_auth_update" ON storage.objects;
CREATE POLICY "activity_attachments_auth_update" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'activity-attachments' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "activity_attachments_auth_delete" ON storage.objects;
CREATE POLICY "activity_attachments_auth_delete" ON storage.objects 
  FOR DELETE USING (bucket_id = 'activity-attachments' AND auth.role() = 'authenticated');
