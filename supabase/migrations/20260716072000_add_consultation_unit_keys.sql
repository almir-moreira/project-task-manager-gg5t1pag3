ALTER TABLE public.travel_delegation_packages
  ADD COLUMN IF NOT EXISTS consultation_required_units text[] DEFAULT '{}';

ALTER TABLE public.travel_delegation_consultations
  ADD COLUMN IF NOT EXISTS unit_key text;

UPDATE public.travel_delegation_consultations
SET unit_key = CASE
  WHEN LOWER(unit_name) = 'ems' THEN 'ems'
  WHEN LOWER(unit_name) = 'communications' THEN 'communications'
  WHEN LOWER(unit_name) = 'protocol' THEN 'protocol'
  WHEN LOWER(unit_name) LIKE 'executive office%' OR LOWER(unit_name) LIKE 'eosg%' THEN 'eosg'
  WHEN LOWER(unit_name) = 'security' THEN 'security'
  WHEN LOWER(unit_name) = 'other' THEN 'other'
  ELSE LOWER(REPLACE(unit_name, ' ', '_'))
END
WHERE unit_key IS NULL AND unit_name IS NOT NULL;

DELETE FROM public.travel_delegation_consultations
WHERE id IN (
  SELECT id FROM (
    SELECT
      id,
      delegation_package_id,
      unit_key,
      ROW_NUMBER() OVER (
        PARTITION BY delegation_package_id, unit_key
        ORDER BY
          CASE WHEN status = 'Completed' THEN 0 ELSE 1 END,
          CASE WHEN comments IS NOT NULL AND comments != '' THEN 0 ELSE 1 END,
          CASE WHEN reviewer_id IS NOT NULL THEN 0 ELSE 1 END,
          created_at ASC
      ) AS rn
    FROM public.travel_delegation_consultations
    WHERE unit_key IS NOT NULL
  ) ranked
  WHERE rn > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_delegation_consultations_pkg_unit_key
  ON public.travel_delegation_consultations(delegation_package_id, unit_key);
