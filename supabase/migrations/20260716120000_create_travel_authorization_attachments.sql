DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('travel-attachments', 'travel-attachments', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
END $$;

DROP POLICY IF EXISTS "travel_attachments_public_read" ON storage.objects;
CREATE POLICY "travel_attachments_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'travel-attachments');

DROP POLICY IF EXISTS "travel_attachments_auth_insert" ON storage.objects;
CREATE POLICY "travel_attachments_auth_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'travel-attachments');

DROP POLICY IF EXISTS "travel_attachments_auth_update" ON storage.objects;
CREATE POLICY "travel_attachments_auth_update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'travel-attachments');

DROP POLICY IF EXISTS "travel_attachments_auth_delete" ON storage.objects;
CREATE POLICY "travel_attachments_auth_delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'travel-attachments');

CREATE TABLE IF NOT EXISTS public.travel_authorization_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_authorization_id UUID REFERENCES public.travel_authorizations(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  document_type TEXT NOT NULL,
  description TEXT,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.travel_authorization_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_travel_ta_attachments" ON public.travel_authorization_attachments;
CREATE POLICY "auth_select_travel_ta_attachments" ON public.travel_authorization_attachments
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_travel_ta_attachments" ON public.travel_authorization_attachments;
CREATE POLICY "auth_insert_travel_ta_attachments" ON public.travel_authorization_attachments
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_travel_ta_attachments" ON public.travel_authorization_attachments;
CREATE POLICY "auth_update_travel_ta_attachments" ON public.travel_authorization_attachments
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_travel_ta_attachments" ON public.travel_authorization_attachments;
CREATE POLICY "auth_delete_travel_ta_attachments" ON public.travel_authorization_attachments
  FOR DELETE TO authenticated USING (true);
