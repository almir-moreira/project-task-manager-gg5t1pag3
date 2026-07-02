DO $$
BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
END $$;

-- Create helper function for RLS checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  v_role public.user_role;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
  RETURN v_role = 'Administrator'::public.user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Clean up existing policies for profiles
DROP POLICY IF EXISTS "auth_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "auth_insert_profiles" ON public.profiles;
DROP POLICY IF EXISTS "auth_read_profiles" ON public.profiles;
DROP POLICY IF EXISTS "auth_update_profiles" ON public.profiles;
DROP POLICY IF EXISTS "auth_delete_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_insert_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_update_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_delete_profiles" ON public.profiles;

-- Allow all authenticated users to read profiles
CREATE POLICY "auth_read_profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- Allow only administrators to insert new profiles
CREATE POLICY "admin_insert_profiles" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- Allow users to update their own profile, and administrators to update any profile
CREATE POLICY "auth_update_profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- Allow only administrators to delete profiles
CREATE POLICY "admin_delete_profiles" ON public.profiles
  FOR DELETE TO authenticated
  USING (public.is_admin());
