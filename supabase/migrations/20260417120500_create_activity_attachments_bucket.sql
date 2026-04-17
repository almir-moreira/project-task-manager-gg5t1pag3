DO $DO$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('activity-attachments', 'activity-attachments', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
END $DO$;

DROP POLICY IF EXISTS "Public View Activity Attachments" ON storage.objects;
CREATE POLICY "Public View Activity Attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'activity-attachments');

DROP POLICY IF EXISTS "Authenticated Upload Activity Attachments" ON storage.objects;
CREATE POLICY "Authenticated Upload Activity Attachments" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'activity-attachments');

DROP POLICY IF EXISTS "Authenticated Update Activity Attachments" ON storage.objects;
CREATE POLICY "Authenticated Update Activity Attachments" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'activity-attachments');

DROP POLICY IF EXISTS "Authenticated Delete Activity Attachments" ON storage.objects;
CREATE POLICY "Authenticated Delete Activity Attachments" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'activity-attachments');
