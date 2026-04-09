-- Ensure the sequence exists
CREATE SEQUENCE IF NOT EXISTS task_number_seq START 1;

-- Update the trigger function to format the number as A-00001
CREATE OR REPLACE FUNCTION public.generate_task_number()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.task_number IS NULL THEN
    NEW.task_number := 'A-' || LPAD(nextval('task_number_seq')::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$function$;
