CREATE TABLE IF NOT EXISTS public.truck_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'ativo',
  order_index INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.truck_centers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.truck_centers TO authenticated;
GRANT ALL ON public.truck_centers TO service_role;

ALTER TABLE public.truck_centers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Truck centers ativos sao publicos" ON public.truck_centers;
DROP POLICY IF EXISTS "Admins gerenciam truck centers" ON public.truck_centers;
CREATE POLICY "Truck centers ativos sao publicos" ON public.truck_centers FOR SELECT USING (status = 'ativo');
CREATE POLICY "Admins gerenciam truck centers" ON public.truck_centers FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS truck_centers_set_updated_at ON public.truck_centers;
CREATE TRIGGER truck_centers_set_updated_at BEFORE UPDATE ON public.truck_centers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.truck_centers (name, image_url, location, status, order_index)
SELECT * FROM (VALUES
  ('Truck Center Pátio 1', '', 'Pátio 1 — Complexo Valen', 'ativo', 10),
  ('Truck Center Pátio 3', '', 'Pátio 3 — Complexo Valen', 'ativo', 20),
  ('Truck Center Pátio 5', '', 'Pátio 5 — Complexo Valen', 'ativo', 30)
) AS v(name, image_url, location, status, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.truck_centers);