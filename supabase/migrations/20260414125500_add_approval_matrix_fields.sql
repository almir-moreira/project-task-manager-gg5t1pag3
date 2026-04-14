DO $$
BEGIN
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS inv_comments_to_ems TEXT;
  
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS urgency_of_approval TEXT DEFAULT 'Standard';
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS nature_of_urgency TEXT;
  
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_team_leader_id UUID REFERENCES public.profiles(id);
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_team_leader_comments TEXT;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_team_leader_date DATE;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_team_leader_approved BOOLEAN DEFAULT FALSE;

  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_head_id UUID REFERENCES public.profiles(id);
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_head_comments TEXT;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_head_date DATE;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_head_approved BOOLEAN DEFAULT FALSE;

  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_cpo_id UUID REFERENCES public.profiles(id);
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_cpo_comments TEXT;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_cpo_date DATE;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS reviewer_cpo_approved BOOLEAN DEFAULT FALSE;
END $$;
