-- SETTINGS
CREATE TABLE public.clube_valen_settings (
  id boolean NOT NULL PRIMARY KEY DEFAULT true CHECK (id),
  seo_title text NOT NULL DEFAULT 'Clube Valen Fidelidade — Seu abastecimento vale benefícios',
  seo_description text NOT NULL DEFAULT 'Baixe o aplicativo Clube Valen Fidelidade, pontue no abastecimento e troque seus pontos por brindes, estacionamento e combos da conveniência.',
  page_status text NOT NULL DEFAULT 'publicada',
  hero_badge text NOT NULL DEFAULT 'Clube Valen Fidelidade',
  hero_title text NOT NULL DEFAULT 'SEU ABASTECIMENTO VALE BENEFÍCIOS',
  hero_highlight text NOT NULL DEFAULT 'BENEFÍCIOS',
  hero_subtitle text NOT NULL DEFAULT 'Baixe o aplicativo, pontue no abastecimento e troque seus pontos por brindes, serviços e combos da conveniência.',
  hero_bg_image_url text NOT NULL DEFAULT '',
  phone_mockup_url text NOT NULL DEFAULT '',
  qr_code_url text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT 'Baixe o aplicativo',
  cta_url text NOT NULL DEFAULT '',
  google_play_url text NOT NULL DEFAULT '',
  app_store_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clube_valen_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.clube_valen_settings TO authenticated;
GRANT ALL ON public.clube_valen_settings TO service_role;
ALTER TABLE public.clube_valen_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clube_settings_public_read" ON public.clube_valen_settings FOR SELECT USING (true);
CREATE POLICY "clube_settings_admin_insert" ON public.clube_valen_settings FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "clube_settings_admin_update" ON public.clube_valen_settings FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_clube_valen_settings_updated_at BEFORE UPDATE ON public.clube_valen_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BENEFITS
CREATE TABLE public.clube_valen_benefits (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Brinde',
  image_url text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  points integer,
  status text NOT NULL DEFAULT 'ativo',
  featured boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clube_valen_benefits TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_valen_benefits TO authenticated;
GRANT ALL ON public.clube_valen_benefits TO service_role;
ALTER TABLE public.clube_valen_benefits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clube_benefits_public_read" ON public.clube_valen_benefits FOR SELECT USING (status = 'ativo' OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "clube_benefits_admin_insert" ON public.clube_valen_benefits FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "clube_benefits_admin_update" ON public.clube_valen_benefits FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "clube_benefits_admin_delete" ON public.clube_valen_benefits FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_clube_valen_benefits_updated_at BEFORE UPDATE ON public.clube_valen_benefits FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FAQS
CREATE TABLE public.clube_valen_faqs (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ativo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clube_valen_faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_valen_faqs TO authenticated;
GRANT ALL ON public.clube_valen_faqs TO service_role;
ALTER TABLE public.clube_valen_faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clube_faqs_public_read" ON public.clube_valen_faqs FOR SELECT USING (status = 'ativo' OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "clube_faqs_admin_insert" ON public.clube_valen_faqs FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "clube_faqs_admin_update" ON public.clube_valen_faqs FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "clube_faqs_admin_delete" ON public.clube_valen_faqs FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_clube_valen_faqs_updated_at BEFORE UPDATE ON public.clube_valen_faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SEED
INSERT INTO public.clube_valen_settings (id) VALUES (true);

INSERT INTO public.clube_valen_benefits (name, slug, category, short_description, full_description, points, status, featured, order_index) VALUES
('Bolsa Valen', 'bolsa-valen', 'Brinde', 'Estilo e praticidade para acompanhar sua rotina.', 'Estilo e praticidade para acompanhar sua rotina.', NULL, 'ativo', false, 1),
('Boné Valen', 'bone-valen', 'Brinde', 'Conforto e identidade por onde você for.', 'Conforto e identidade por onde você for.', NULL, 'ativo', false, 2),
('12h de estacionamento grátis', '12h-de-estacionamento-gratis', 'Estacionamento', 'Mais comodidade para sua parada no Complexo Valen.', 'Mais comodidade para sua parada no Complexo Valen.', NULL, 'ativo', true, 3),
('COMBO AGRESTE', 'combo-agreste', 'Combo', 'Cuscuz com ovo + café com leite', 'Cuscuz com ovo + café com leite', NULL, 'ativo', false, 4),
('COMBO ARRETADO', 'combo-arretado', 'Combo', 'Pão com ovo + café com leite', 'Pão com ovo + café com leite', NULL, 'ativo', false, 5),
('COMBO QUERIDINHO', 'combo-queridinho', 'Combo', '2 coxinhas + refrigerante lata 220 ml', '2 coxinhas + refrigerante lata 220 ml', NULL, 'ativo', false, 6);

INSERT INTO public.clube_valen_faqs (question, answer, order_index, status) VALUES
('Como acumulo pontos?', 'É bem simples! Sempre que abastecer, informe seu CPF no caixa na hora do pagamento. Cada litro abastecido gera pontos, e o saldo é atualizado automaticamente no aplicativo Clube Valen Fidelidade logo após a compra. Assim, você acompanha seus pontos direto pelo celular.', 1, 'ativo'),
('Onde consulto meu saldo?', 'Você pode acompanhar seu saldo pelo aplicativo Clube Valen Fidelidade, disponível na Google Play Store e na App Store. Por lá, você também consegue acompanhar seus benefícios e resgates.', 2, 'ativo'),
('Como resgato um benefício?', E'O resgate é feito diretamente pelo aplicativo Clube Valen Fidelidade.\n1. Abra o aplicativo.\n2. Escolha o posto ou a conveniência onde deseja usar o benefício.\n3. Selecione o prêmio desejado.\n4. Confirme a troca dos seus pontos.\n5. O aplicativo vai gerar um voucher digital.\n6. Apresente o voucher no caixa do posto ou da conveniência para validar e retirar seu benefício.\nEscolheu, resgatou, apresentou e aproveitou.', 3, 'ativo'),
('Os pontos expiram?', 'Sim. Os pontos têm validade de 6 meses. Você pode acompanhar seu saldo pelo aplicativo e aproveitar seus pontos antes do vencimento.', 4, 'ativo'),
('Onde posso utilizar meus benefícios?', 'Os benefícios podem ser utilizados no caixa do posto ou na conveniência, de acordo com o prêmio escolhido no aplicativo. Na hora do resgate, basta apresentar o voucher digital pelo celular.', 5, 'ativo');