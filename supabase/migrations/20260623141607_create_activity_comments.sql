CREATE TABLE IF NOT EXISTS public.activity_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) DEFAULT auth.uid(),
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_comments_activity_id_created_at ON public.activity_comments (activity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_comments_author_id ON public.activity_comments (author_id);
CREATE INDEX IF NOT EXISTS idx_activity_comments_recipient_id ON public.activity_comments (recipient_id);

ALTER TABLE public.activity_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_activity_comments" ON public.activity_comments;
CREATE POLICY "auth_select_activity_comments" ON public.activity_comments
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_activity_comments" ON public.activity_comments;
CREATE POLICY "auth_insert_activity_comments" ON public.activity_comments
  FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'activity_comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_comments;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'almir.moreira@gmail.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'almir.moreira@gmail.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Almir Moreira"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL, '', '', ''
    );

    INSERT INTO public.profiles (id, email, name, role)
    VALUES (new_user_id, 'almir.moreira@gmail.com', 'Almir Moreira', 'Administrator'::public.user_role)
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
