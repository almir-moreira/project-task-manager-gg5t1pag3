ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS event_approval_status TEXT,
  ADD COLUMN IF NOT EXISTS event_category TEXT;
