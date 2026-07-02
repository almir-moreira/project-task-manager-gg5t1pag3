-- Migration: Create/Replace calendar_report_view with enhanced reporting fields
-- This view serves as the central source for KAICIID Events Calendar Report

-- Ensure updated_at column exists on activities table
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Drop the existing view first so column order/names are not constrained
-- by the previous view definition (CREATE OR REPLACE VIEW cannot rename columns)
DROP VIEW IF EXISTS public.calendar_report_view;

-- Create the calendar_report_view
CREATE VIEW public.calendar_report_view AS
SELECT
  a.id AS activity_id,
  a.id,
  a.task_number,
  a.start_date,
  a.end_date,
  a.activity_name AS event_name,
  a.activity_name,
  a.event_category,
  a.event_location AS location,
  a.event_location,
  a.event_participants_count AS pax,
  a.event_participants_count,
  a.event_approval_status AS approval_status,
  a.event_approval_status,
  a.event_date_status AS date_status,
  a.event_date_status,
  a.event_location_status AS location_status,
  a.event_location_status,
  a.short_description,
  a.project_owner_id,
  a.cost_center_id,
  a.status,
  a.priority,
  a.current_stage,
  a.created_at,
  a.updated_at,
  a.inv_ems,
  a.inv_protocol,
  a.event_include_calendar,
  a.category_id,
  DATE_TRUNC('month', a.start_date)::DATE AS month_start,
  TRIM(TO_CHAR(a.start_date, 'FMMonth YYYY')) AS month_label,
  a.start_date AS sort_date,
  CASE
    WHEN a.event_date_status IS NOT NULL AND a.event_date_status <> ''
     AND a.event_location_status IS NOT NULL AND a.event_location_status <> '' THEN
      a.event_date_status || ' / ' || a.event_location_status
    WHEN a.event_date_status IS NOT NULL AND a.event_date_status <> '' THEN
      a.event_date_status
    WHEN a.event_location_status IS NOT NULL AND a.event_location_status <> '' THEN
      a.event_location_status
    ELSE 'Not specified'
  END AS date_location_status,
  CASE
    WHEN a.inv_ems = true AND a.inv_protocol = true THEN 'EMS & Protocol'
    WHEN a.inv_ems = true THEN 'EMS'
    WHEN a.inv_protocol = true THEN 'Protocol'
    ELSE 'None'
  END AS ems_protocol_involvement,
  p.name AS project_owner_name,
  cc.code AS cost_center_code,
  cc.name AS cost_center_name,
  cat.name AS category_name
FROM public.activities a
LEFT JOIN public.profiles p ON a.project_owner_id = p.id
LEFT JOIN public.cost_centers cc ON a.cost_center_id = cc.id
LEFT JOIN public.categories cat ON a.category_id = cat.id
WHERE a.event_include_calendar = true;
