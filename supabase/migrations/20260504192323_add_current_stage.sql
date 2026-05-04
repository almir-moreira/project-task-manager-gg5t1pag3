ALTER TABLE public.activities
ADD COLUMN IF NOT EXISTS current_stage TEXT DEFAULT 'Preparation',
ADD COLUMN IF NOT EXISTS stage_started_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'activities'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE activities;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'activity_workflows'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE activity_workflows;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
