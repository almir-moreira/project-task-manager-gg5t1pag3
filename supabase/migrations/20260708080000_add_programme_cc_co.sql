ALTER TABLE public.programmes
  ADD COLUMN IF NOT EXISTS cost_center_id UUID REFERENCES public.cost_centers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS certifying_officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
