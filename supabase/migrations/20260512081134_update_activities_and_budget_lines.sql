ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS category_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'activities_project_id_fkey'
  ) THEN
    ALTER TABLE public.activities ADD CONSTRAINT activities_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'activities_category_id_fkey'
  ) THEN
    ALTER TABLE public.activities ADD CONSTRAINT activities_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
  END IF;
END $$;

ALTER TABLE public.activity_budget_lines ADD COLUMN IF NOT EXISTS amount NUMERIC DEFAULT 0;
