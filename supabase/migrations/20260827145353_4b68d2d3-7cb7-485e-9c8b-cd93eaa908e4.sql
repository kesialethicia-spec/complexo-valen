CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.markets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'rascunho',
  order_index integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.markets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.markets TO authenticated;
GRANT ALL ON public.markets TO service_role;

ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view markets" ON public.markets FOR SELECT USING (status = 'publicado' OR private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert markets" ON public.markets FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update markets" ON public.markets FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete markets" ON public.markets FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER markets_set_updated_at BEFORE UPDATE ON public.markets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.markets (name, description, location, features, status, order_index) VALUES
('Armazzem Container', 'O Armazzem Container é uma opção prática de conveniência, com produtos básicos, itens essenciais e mini padaria para quem está no pátio.', 'Dentro do Pátio 01, no Valen Center III.', ARRAY['Conveniência','Produtos básicos','Itens essenciais','Mini padaria','Atendimento prático para quem está no pátio'], 'publicado', 10),
('Armazzem', 'O Armazzem é um mercado completo dentro do Complexo Valen, reunindo padaria, açougue, mercearia e produtos variados para facilitar a rotina de quem passa por aqui.', 'Valen Center IV.', ARRAY['Mercado completo','Padaria','Açougue','Mercearia','Produtos variados'], 'publicado', 20),
('Valen Mix', 'O Valen Mix é um mini mercado com itens básicos e mini padaria, pensado para oferecer praticidade aos caminhoneiros e clientes que utilizam o Pátio 5.', 'Pátio 5.', ARRAY['Mini mercado','Itens básicos','Mini padaria','Praticidade para quem está no pátio'], 'publicado', 30);

UPDATE public.services
SET name = 'Mercado',
    slug = 'mercado',
    description = 'Mercados, conveniência, produtos básicos, padaria e itens essenciais para facilitar sua parada no Valen.',
    link_url = '/servicos/mercado',
    icon = 'ShoppingBag',
    status = 'publicado'
WHERE slug IN ('mercados','armazzem');