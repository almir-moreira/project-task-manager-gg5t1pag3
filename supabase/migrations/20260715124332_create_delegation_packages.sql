CREATE TABLE IF NOT EXISTS public.travel_delegation_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delegation_package_number TEXT UNIQUE,
  linked_activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
  event_title TEXT,
  event_type TEXT,
  event_dates TEXT,
  location TEXT,
  programme_id UUID REFERENCES public.programmes(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  event_lead_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Draft',
  current_stage TEXT DEFAULT 'Delegation Proposal',
  estimated_number_of_participants INTEGER,
  estimated_number_of_virtual_participants INTEGER,
  estimated_event_budget NUMERIC,
  benchmark_category TEXT,
  benchmark_range TEXT,
  total_proposed_travelers INTEGER DEFAULT 0,
  justification_if_above_benchmark TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.travel_delegation_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_delegation_packages" ON public.travel_delegation_packages;
CREATE POLICY "auth_select_delegation_packages" ON public.travel_delegation_packages
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_delegation_packages" ON public.travel_delegation_packages;
CREATE POLICY "auth_insert_delegation_packages" ON public.travel_delegation_packages
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_delegation_packages" ON public.travel_delegation_packages;
CREATE POLICY "auth_update_delegation_packages" ON public.travel_delegation_packages
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_delegation_packages" ON public.travel_delegation_packages;
CREATE POLICY "auth_delete_delegation_packages" ON public.travel_delegation_packages
  FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.travel_delegation_travelers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delegation_package_id UUID REFERENCES public.travel_delegation_packages(id) ON DELETE CASCADE,
  traveler_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  proposed_role_or_function TEXT,
  functional_area TEXT,
  physical_presence_justification TEXT,
  remote_participation_possible BOOLEAN DEFAULT false,
  local_support_possible BOOLEAN DEFAULT false,
  status TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.travel_delegation_travelers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_delegation_travelers" ON public.travel_delegation_travelers;
CREATE POLICY "auth_select_delegation_travelers" ON public.travel_delegation_travelers
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_delegation_travelers" ON public.travel_delegation_travelers;
CREATE POLICY "auth_insert_delegation_travelers" ON public.travel_delegation_travelers
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_delegation_travelers" ON public.travel_delegation_travelers;
CREATE POLICY "auth_update_delegation_travelers" ON public.travel_delegation_travelers
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_delegation_travelers" ON public.travel_delegation_travelers;
CREATE POLICY "auth_delete_delegation_travelers" ON public.travel_delegation_travelers
  FOR DELETE TO authenticated USING (true);

ALTER TABLE public.travel_authorizations
  ADD COLUMN IF NOT EXISTS delegation_package_id UUID REFERENCES public.travel_delegation_packages(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.generate_delegation_package_number()
RETURNS TRIGGER AS $$
DECLARE
  current_year INT;
  next_seq INT;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW())::INT;
  SELECT COALESCE(MAX(CAST(SUBSTRING(delegation_package_number FROM 10 FOR 4) AS INT)), 0) + 1
  INTO next_seq
  FROM public.travel_delegation_packages
  WHERE delegation_package_number LIKE 'DP-' || current_year || '-%';
  NEW.delegation_package_number := 'DP-' || current_year::TEXT || '-' || LPAD(next_seq::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_delegation_package_insert ON public.travel_delegation_packages;
CREATE TRIGGER on_delegation_package_insert
  BEFORE INSERT ON public.travel_delegation_packages
  FOR EACH ROW EXECUTE FUNCTION public.generate_delegation_package_number();

CREATE OR REPLACE FUNCTION public.update_delegation_package_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_delegation_package_update ON public.travel_delegation_packages;
CREATE TRIGGER on_delegation_package_update
  BEFORE UPDATE ON public.travel_delegation_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_delegation_package_timestamp();

CREATE OR REPLACE FUNCTION public.update_delegation_traveler_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_delegation_traveler_update ON public.travel_delegation_travelers;
CREATE TRIGGER on_delegation_traveler_update
  BEFORE UPDATE ON public.travel_delegation_travelers
  FOR EACH ROW EXECUTE FUNCTION public.update_delegation_traveler_timestamp();
