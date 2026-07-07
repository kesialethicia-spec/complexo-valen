
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  tags text[] not null default '{}',
  icon text not null default 'Sparkles',
  image_url text not null default '',
  link_url text not null default '',
  status text not null default 'rascunho' check (status in ('rascunho','publicado')),
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;

alter table public.services enable row level security;

create policy "Public can view services"
  on public.services for select
  using (status = 'publicado' or private.has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can insert services"
  on public.services for insert
  to authenticated
  with check (private.has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can update services"
  on public.services for update
  to authenticated
  using (private.has_role(auth.uid(), 'admin'::app_role))
  with check (private.has_role(auth.uid(), 'admin'::app_role));

create policy "Admins can delete services"
  on public.services for delete
  to authenticated
  using (private.has_role(auth.uid(), 'admin'::app_role));

create trigger set_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

insert into public.services (name, slug, description, tags, icon, link_url, status, order_index) values
  ('Posto Valen', 'posto-valen', 'Abastecimento com confiança, equipe treinada e estrutura para atender até 22 veículos simultaneamente.',
    array['Abastecimentos simultâneos para até 22 veículos','Equipe treinada e focada','Mix de produtos e acessórios para caminhões','Super Troca de Óleo com capacidade para 19 trocas'],
    'Fuel', '/servicos/posto-valen', 'publicado', 10),
  ('Conveniência Valen', 'conveniencia-valen', 'Produtos, lanches, bebidas e itens essenciais para uma parada mais prática dentro do Complexo Valen.',
    array['Lanches e bebidas','Itens para viagem','Praticidade na parada'],
    'ShoppingBag', '/servicos/posto-valen#conveniencia', 'publicado', 20),
  ('ValenBen — Super Troca de Óleo', 'valenben-super-troca-de-oleo', 'Serviço especializado de troca de óleo para veículos leves e pesados, com praticidade e qualidade.',
    array[]::text[],
    'Droplet', '', 'publicado', 30),
  ('Valen Truck Center', 'valen-truck-center', 'Estrutura completa para manutenção, borracharia e serviços especializados.',
    array['3 Truck Centers','Mais de 25 oficinas especializadas','Borracharia','Mecânica','Peças e acessórios'],
    'Wrench', '/servicos/truck-center', 'publicado', 40),
  ('ValenLog — Triagem e Estacionamento', 'valenlog', 'Operação estruturada para organização, triagem e estacionamento de caminhões.',
    array['5 pátios para triagem e estacionamento','Sistema de marcação automática nas cancelas','Área de inspeção','Aplicativo ValenLog'],
    'ParkingSquare', '/servicos/valenlog', 'publicado', 50),
  ('Valen Center', 'valen-center', 'Espaço comercial com lojas e salas para atender às necessidades de quem passa pelo complexo. 250 lojas/salas comerciais.',
    array[]::text[],
    'Building2', '/lojas', 'publicado', 60),
  ('Valen Porto Hotel', 'valen-porto-hotel', 'Hospedagem estratégica para descanso, negócios e eventos corporativos.',
    array[]::text[],
    'Hotel', '/servicos/valen-porto-hotel', 'publicado', 70),
  ('ValenLub', 'valenlub', 'Distribuidora de lubrificantes com soluções para quem movimenta a estrada.',
    array[]::text[],
    'Fuel', '', 'publicado', 80),
  ('Lotérica Valen', 'loterica-valen', 'Facilidade e conveniência para resolver serviços financeiros sem sair do complexo.',
    array[]::text[],
    'Wallet', '', 'publicado', 90);
