CREATE TABLE IF NOT EXISTS public.activity_budget_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  cost_center_id UUID REFERENCES public.cost_centers(id) ON DELETE SET NULL,
  budget_line_id UUID REFERENCES public.budget_lines(id) ON DELETE SET NULL,
  workorder_id UUID REFERENCES public.workorders(id) ON DELETE SET NULL,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_budget_lines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all_activity_budget_lines" ON public.activity_budget_lines;
CREATE POLICY "auth_all_activity_budget_lines" ON public.activity_budget_lines
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.activity_budget_lines LIMIT 1) THEN
    INSERT INTO public.activity_budget_lines (activity_id, cost_center_id, budget_line_id, workorder_id, account_id)
    SELECT id, cost_center_id, budget_line_id, workorder_id, account_id
    FROM public.activities
    WHERE cost_center_id IS NOT NULL OR budget_line_id IS NOT NULL OR workorder_id IS NOT NULL OR account_id IS NOT NULL;
  END IF;
END $$;
