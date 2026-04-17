DO $DO$
BEGIN
  -- Insert missing profiles for any existing attachments to avoid FK violation
  INSERT INTO public.profiles (id)
  SELECT DISTINCT uploaded_by
  FROM public.attachments
  WHERE uploaded_by IS NOT NULL 
    AND uploaded_by NOT IN (SELECT id FROM public.profiles)
  ON CONFLICT (id) DO NOTHING;

  -- Drop old constraint that references auth.users
  ALTER TABLE public.attachments DROP CONSTRAINT IF EXISTS attachments_uploaded_by_fkey;

  -- Add new constraint pointing to public.profiles
  ALTER TABLE public.attachments 
    ADD CONSTRAINT attachments_uploaded_by_fkey 
    FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
END $DO$;

NOTIFY pgrst, 'reload schema';
