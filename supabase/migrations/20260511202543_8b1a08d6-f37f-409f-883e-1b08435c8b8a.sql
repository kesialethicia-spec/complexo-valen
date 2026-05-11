
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  category text not null,
  cover_url text not null default '',
  content text not null default '',
  author text not null default 'Equipe Valen',
  published_at date not null default current_date,
  reading_time text not null default '5 min',
  status text not null default 'rascunho' check (status in ('rascunho','publicado')),
  featured boolean not null default false,
  main_featured boolean not null default false,
  tags text[] not null default '{}',
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "Public can view published posts"
on public.blog_posts for select
to anon, authenticated
using (status = 'publicado' or public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert posts"
on public.blog_posts for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update posts"
on public.blog_posts for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete posts"
on public.blog_posts for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

create index idx_blog_posts_status_date on public.blog_posts (status, published_at desc);
