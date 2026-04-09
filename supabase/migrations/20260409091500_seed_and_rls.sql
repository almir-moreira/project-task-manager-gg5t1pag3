DO $$
BEGIN
  -- Seed Organizations
  INSERT INTO public.organizations (id, name) VALUES ('e05b5cc4-7e8c-4a3d-b4b3-5750d9c4b7b2'::uuid, 'Global Org') ON CONFLICT (id) DO NOTHING;
  
  -- Seed Programmes
  INSERT INTO public.programmes (id, name, organization_id) VALUES ('3ccf1d8c-0fc3-4e78-958a-d99f01e13d9a'::uuid, 'Alpha Programme', 'e05b5cc4-7e8c-4a3d-b4b3-5750d9c4b7b2'::uuid) ON CONFLICT (id) DO NOTHING;
  
  -- Seed Task Types
  INSERT INTO public.task_types (id, name) VALUES ('c18e106f-6821-4f11-9a7c-383749d2165a'::uuid, 'Review') ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.task_types (id, name) VALUES ('d28e106f-6821-4f11-9a7c-383749d2165b'::uuid, 'Event') ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.task_types (id, name) VALUES ('e38e106f-6821-4f11-9a7c-383749d2165c'::uuid, 'Project') ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.task_types (id, name) VALUES ('f48e106f-6821-4f11-9a7c-383749d2165d'::uuid, 'Legal') ON CONFLICT (id) DO NOTHING;
  
  -- Seed Cost Centers
  INSERT INTO public.cost_centers (id, code, name) VALUES ('90b50f75-6f3b-4c07-b353-8d022b7a6db1'::uuid, 'CC-100', 'HQ') ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.cost_centers (id, code, name) VALUES ('a1b50f75-6f3b-4c07-b353-8d022b7a6db2'::uuid, 'CC-200', 'Field Office') ON CONFLICT (id) DO NOTHING;
  
  -- Seed Budget Lines
  INSERT INTO public.budget_lines (id, code, name) VALUES ('d8b3c9fc-8e4a-4a2b-bb8c-ea394d2fcd90'::uuid, 'BL-100', 'Personnel') ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.budget_lines (id, code, name) VALUES ('e9b3c9fc-8e4a-4a2b-bb8c-ea394d2fcd91'::uuid, 'BL-200', 'Travel') ON CONFLICT (id) DO NOTHING;
  
  -- Seed Workorders
  INSERT INTO public.workorders (id, code, name) VALUES ('99c82c3c-2b28-4443-8ab3-38e5e783ad76'::uuid, 'WO-300', 'Workorder 300') ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.workorders (id, code, name) VALUES ('a0c82c3c-2b28-4443-8ab3-38e5e783ad77'::uuid, 'WO-301', 'Workorder 301') ON CONFLICT (id) DO NOTHING;
  
  -- Seed Accounts
  INSERT INTO public.accounts (id, code, name) VALUES ('f5a340b0-a5b5-4b1f-aa33-87e2de1e52bc'::uuid, 'ACC-400', 'Main Account') ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.accounts (id, code, name) VALUES ('g6a340b0-a5b5-4b1f-aa33-87e2de1e52bd'::uuid, 'ACC-401', 'Reserve Account') ON CONFLICT (id) DO NOTHING;
END $$;

-- Fix RLS Policies for authenticated users to interact with master tables
DROP POLICY IF EXISTS "auth_all_profiles" ON public.profiles;
CREATE POLICY "auth_all_profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_programmes" ON public.programmes;
CREATE POLICY "auth_all_programmes" ON public.programmes FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_activities" ON public.activities;
CREATE POLICY "auth_all_activities" ON public.activities FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_cost_centers" ON public.cost_centers;
CREATE POLICY "auth_all_cost_centers" ON public.cost_centers FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_budget_lines" ON public.budget_lines;
CREATE POLICY "auth_all_budget_lines" ON public.budget_lines FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_workorders" ON public.workorders;
CREATE POLICY "auth_all_workorders" ON public.workorders FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_accounts" ON public.accounts;
CREATE POLICY "auth_all_accounts" ON public.accounts FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all_task_types" ON public.task_types;
CREATE POLICY "auth_all_task_types" ON public.task_types FOR ALL TO authenticated USING (true) WITH CHECK (true);
