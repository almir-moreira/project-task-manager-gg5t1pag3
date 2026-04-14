DO $$
BEGIN
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_head_id UUID REFERENCES public.profiles(id);
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_head_comments TEXT;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_head_date DATE;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_head_approved BOOLEAN DEFAULT FALSE;

  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_cpo_id UUID REFERENCES public.profiles(id);
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_cpo_comments TEXT;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_cpo_date DATE;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_cpo_approved BOOLEAN DEFAULT FALSE;

  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_sg_id UUID REFERENCES public.profiles(id);
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_sg_comments TEXT;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_sg_date DATE;
  ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS approver_sg_approved BOOLEAN DEFAULT FALSE;
END $$;
