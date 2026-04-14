DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('activity-attachments', 'activity-attachments', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

DROP POLICY IF EXISTS "Public Access activity-attachments" ON storage.objects;
CREATE POLICY "Public Access activity-attachments" ON storage.objects FOR SELECT USING (bucket_id = 'activity-attachments');

DROP POLICY IF EXISTS "Auth Insert activity-attachments" ON storage.objects;
CREATE POLICY "Auth Insert activity-attachments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'activity-attachments' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth Update activity-attachments" ON storage.objects;
CREATE POLICY "Auth Update activity-attachments" ON storage.objects FOR UPDATE USING (bucket_id = 'activity-attachments' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth Delete activity-attachments" ON storage.objects;
CREATE POLICY "Auth Delete activity-attachments" ON storage.objects FOR DELETE USING (bucket_id = 'activity-attachments' AND auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS public.activity_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    content_type TEXT,
    description TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.activity_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_attachments" ON public.activity_attachments;
CREATE POLICY "auth_all_attachments" ON public.activity_attachments
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
