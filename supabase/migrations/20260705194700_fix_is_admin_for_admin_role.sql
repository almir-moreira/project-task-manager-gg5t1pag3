-- Fix is_admin() to recognize both 'Admin' and 'Administrator' roles
-- The phase1a migration updated the user's role to 'Admin', but is_admin()
-- only checked for 'Administrator', causing RLS to block all profile updates.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  v_role public.user_role;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
  RETURN v_role IN ('Administrator'::public.user_role, 'Admin'::public.user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure the UPDATE policy on profiles is correct for Admin/Administrator users
DROP POLICY IF EXISTS "auth_update_profiles" ON public.profiles;
CREATE POLICY "auth_update_profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());
