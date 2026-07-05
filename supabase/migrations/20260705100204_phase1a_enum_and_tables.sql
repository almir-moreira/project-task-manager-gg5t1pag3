ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'Admin';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'Programme Manager';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'SPM';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'PROD Head';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'CPO';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'PROD Team Assistant';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'Feedback Unit User';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'EOSG Assistant';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'Read Only';

CREATE TABLE IF NOT EXISTS public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_units_user_id ON public.user_units(user_id);
CREATE INDEX IF NOT EXISTS idx_user_units_unit_id ON public.user_units(unit_id);

INSERT INTO public.units (name) VALUES
  ('Legal'), ('EMS'), ('RELEX'), ('COMMD'), ('Procurement'),
  ('Protocol'), ('Partnerships'), ('Governing Bodies'), ('M&E'), ('Technology')
ON CONFLICT (name) DO NOTHING;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.units TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_units TO authenticated;
