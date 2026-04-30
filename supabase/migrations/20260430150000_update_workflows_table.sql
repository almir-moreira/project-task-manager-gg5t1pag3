DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workflows' AND column_name='step') THEN
        ALTER TABLE public.workflows ADD COLUMN step integer DEFAULT 1;
        UPDATE public.workflows SET step = stage;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='workflows' AND column_name='category') THEN
        ALTER TABLE public.workflows ADD COLUMN category text DEFAULT 'Review';
    END IF;
END $$;
