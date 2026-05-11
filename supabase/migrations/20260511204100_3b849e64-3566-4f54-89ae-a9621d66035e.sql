create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  cover_url text not null default '',
  short_description text not null default '',
  full_description text not null default '',
  validity text not null default '',
  rules text not null default '',
  cta_text text not null default 'Ver promoção',
  cta_url text not null default '',
  status text not null default 'rascunho',
  featured boolean not null default false,
  show_on_home boolean not null default false,
  show_on_blog boolean not null default false,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.promotions enable row level security;

create policy "Public can view active promotions"
on public.promotions for select
to anon, authenticated
using (status = 'ativa' or has_role(auth.uid(), 'admin'));

create policy "Admins can insert promotions"
on public.promotions for insert
to authenticated
with check (has_role(auth.uid(), 'admin'));

create policy "Admins can update promotions"
on public.promotions for update
to authenticated
using (has_role(auth.uid(), 'admin'))
with check (has_role(auth.uid(), 'admin'));

create policy "Admins can delete promotions"
on public.promotions for delete
to authenticated
using (has_role(auth.uid(), 'admin'));

create trigger promotions_set_updated_at
before update on public.promotions
for each row execute function public.set_updated_at();

create index promotions_status_idx on public.promotions(status);
create index promotions_category_idx on public.promotions(category);