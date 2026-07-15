DO $$
BEGIN
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS consultation_started_at TIMESTAMPTZ;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS consultation_completed_at TIMESTAMPTZ;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS certifying_officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS certifying_officer_status TEXT DEFAULT 'Pending';
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS certifying_officer_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS certified_at TIMESTAMPTZ;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS head_of_division_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS head_of_division_status TEXT DEFAULT 'Pending';
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS head_of_division_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS head_reviewed_at TIMESTAMPTZ;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS sg_approver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS sg_decision TEXT DEFAULT 'Pending';
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS sg_comments TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS sg_decided_at TIMESTAMPTZ;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS returned_for_revision_reason TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS rejected_reason TEXT;
  ALTER TABLE public.travel_delegation_packages ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
END $$;

CREATE TABLE IF NOT EXISTS public.travel_delegation_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delegation_package_id UUID NOT NULL REFERENCES public.travel_delegation_packages(id) ON DELETE CASCADE,
  unit_name TEXT NOT NULL,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Pending',
  recommendation TEXT,
  comments TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.travel_delegation_consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_delegation_consultations" ON public.travel_delegation_consultations;
CREATE POLICY "auth_select_delegation_consultations" ON public.travel_delegation_consultations
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_delegation_consultations" ON public.travel_delegation_consultations;
CREATE POLICY "auth_insert_delegation_consultations" ON public.travel_delegation_consultations
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_delegation_consultations" ON public.travel_delegation_consultations;
CREATE POLICY "auth_update_delegation_consultations" ON public.travel_delegation_consultations
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_delegation_consultations" ON public.travel_delegation_consultations;
CREATE POLICY "auth_delete_delegation_consultations" ON public.travel_delegation_consultations
  FOR DELETE TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_delegation_consultations_package_id
  ON public.travel_delegation_consultations(delegation_package_id);

CREATE INDEX IF NOT EXISTS idx_delegation_consultations_unit_name
  ON public.travel_delegation_consultations(unit_name);

CREATE OR REPLACE FUNCTION public.update_delegation_consultation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_delegation_consultation_update ON public.travel_delegation_consultations;
CREATE TRIGGER on_delegation_consultation_update
  BEFORE UPDATE ON public.travel_delegation_consultations
  FOR EACH ROW EXECUTE FUNCTION public.update_delegation_consultation_timestamp();
