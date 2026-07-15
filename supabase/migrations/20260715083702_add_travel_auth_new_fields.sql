ALTER TABLE public.travel_authorizations
  ADD COLUMN IF NOT EXISTS reason_for_travel_option TEXT,
  ADD COLUMN IF NOT EXISTS reason_for_travel_other_details TEXT,
  ADD COLUMN IF NOT EXISTS purpose_justification TEXT,
  ADD COLUMN IF NOT EXISTS cost_center_id UUID REFERENCES public.cost_centers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS work_order_id UUID REFERENCES public.workorders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL;
