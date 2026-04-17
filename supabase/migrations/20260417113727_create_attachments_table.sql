CREATE TABLE IF NOT EXISTS public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
    original_file_name TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    server_file_path TEXT NOT NULL,
    public_or_signed_url TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT
);

ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_attachments_v2" ON public.attachments;
CREATE POLICY "auth_all_attachments_v2" ON public.attachments
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DO $DO$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'activity_attachments') THEN
    INSERT INTO public.attachments (
        id, 
        task_id, 
        original_file_name, 
        file_type, 
        file_size, 
        server_file_path, 
        public_or_signed_url, 
        uploaded_by, 
        uploaded_at, 
        description
    )
    SELECT 
      id, 
      activity_id, 
      file_name, 
      content_type, 
      file_size, 
      file_path, 
      NULL, 
      uploaded_by, 
      created_at, 
      description
    FROM public.activity_attachments
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $DO$;
