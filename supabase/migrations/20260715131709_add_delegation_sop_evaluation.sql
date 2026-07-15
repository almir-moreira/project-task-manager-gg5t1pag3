DO $$
BEGIN
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_parallel_sessions BOOLEAN DEFAULT false;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_parallel_sessions_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_venues BOOLEAN DEFAULT false;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_venues_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_site_visits BOOLEAN DEFAULT false;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_site_visits_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_vip_participation BOOLEAN DEFAULT false;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_vip_participation_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_donor_engagement BOOLEAN DEFAULT false;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_donor_engagement_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_media_presence BOOLEAN DEFAULT false;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_media_presence_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_hybrid_streaming BOOLEAN DEFAULT false;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_hybrid_streaming_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_interpretation BOOLEAN DEFAULT false;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_interpretation_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_security_sensitive BOOLEAN DEFAULT false;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_security_sensitive_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_participant_logistics BOOLEAN DEFAULT false;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_participant_logistics_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_branding_visibility BOOLEAN DEFAULT false;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS complexity_branding_visibility_comments TEXT;

  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS indicative_staffing_range TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS total_proposed_staff INTEGER;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS is_within_benchmark BOOLEAN;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS benchmark_justification TEXT;

  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS traffic_light_status TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS assessment_comments TEXT;
END $$;

CREATE TABLE IF NOT EXISTS public.travel_delegation_functional_staffing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delegation_package_id UUID REFERENCES public.travel_delegation_packages(id) ON DELETE CASCADE,
  functional_area TEXT NOT NULL,
  is_required BOOLEAN DEFAULT false,
  proposed_staff_count INTEGER DEFAULT 0,
  justification TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.travel_delegation_functional_staffing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_delegation_functional_staffing" ON public.travel_delegation_functional_staffing;
CREATE POLICY "auth_select_delegation_functional_staffing" ON public.travel_delegation_functional_staffing
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_delegation_functional_staffing" ON public.travel_delegation_functional_staffing;
CREATE POLICY "auth_insert_delegation_functional_staffing" ON public.travel_delegation_functional_staffing
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_delegation_functional_staffing" ON public.travel_delegation_functional_staffing;
CREATE POLICY "auth_update_delegation_functional_staffing" ON public.travel_delegation_functional_staffing
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_delegation_functional_staffing" ON public.travel_delegation_functional_staffing;
CREATE POLICY "auth_delete_delegation_functional_staffing" ON public.travel_delegation_functional_staffing
  FOR DELETE TO authenticated USING (true);
