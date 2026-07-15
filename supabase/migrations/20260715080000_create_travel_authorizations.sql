CREATE TABLE IF NOT EXISTS public.travel_authorizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_authorization_number TEXT UNIQUE,
  travel_type TEXT,
  linked_activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
  programme_id UUID REFERENCES public.programmes(id) ON DELETE SET NULL,
  traveler_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  pm_verifier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  mission_title_or_event_name TEXT,
  destination TEXT,
  travel_start_date TIMESTAMPTZ,
  travel_end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'Draft',
  current_stage TEXT DEFAULT 'Draft / Part 1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.travel_authorizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_travel_authorizations" ON public.travel_authorizations;
CREATE POLICY "auth_select_travel_authorizations" ON public.travel_authorizations
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_travel_authorizations" ON public.travel_authorizations;
CREATE POLICY "auth_insert_travel_authorizations" ON public.travel_authorizations
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_travel_authorizations" ON public.travel_authorizations;
CREATE POLICY "auth_update_travel_authorizations" ON public.travel_authorizations
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_travel_authorizations" ON public.travel_authorizations;
CREATE POLICY "auth_delete_travel_authorizations" ON public.travel_authorizations
  FOR DELETE TO authenticated USING (true);

ALTER TABLE public.programmes
  ADD COLUMN IF NOT EXISTS allotment_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.generate_ta_number()
RETURNS TRIGGER AS $$
DECLARE
  current_year INT;
  next_seq INT;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW())::INT;
  SELECT COALESCE(MAX(CAST(SUBSTRING(travel_authorization_number FROM 9 FOR 4) AS INT)), 0) + 1
  INTO next_seq
  FROM public.travel_authorizations
  WHERE travel_authorization_number LIKE 'TA-' || current_year || '-%';
  NEW.travel_authorization_number := 'TA-' || current_year::TEXT || '-' || LPAD(next_seq::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_travel_authorization_insert ON public.travel_authorizations;
CREATE TRIGGER on_travel_authorization_insert
  BEFORE INSERT ON public.travel_authorizations
  FOR EACH ROW EXECUTE FUNCTION public.generate_ta_number();

CREATE OR REPLACE FUNCTION public.update_travel_auth_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_travel_authorization_update ON public.travel_authorizations;
CREATE TRIGGER on_travel_authorization_update
  BEFORE UPDATE ON public.travel_authorizations
  FOR EACH ROW EXECUTE FUNCTION public.update_travel_auth_timestamp();

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
      new_user_id, '00000000-0000-0000-0000-000000000000',
      'almir.moreira@gmail.com', crypt('Skip@Pass', gen_salt('bf')),
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
