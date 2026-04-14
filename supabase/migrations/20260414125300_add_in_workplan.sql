DO $$
BEGIN
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS in_workplan BOOLEAN DEFAULT false;
END $$;
