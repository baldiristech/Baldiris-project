-- Run this once in Supabase SQL Editor for the admin modules.
create table if not exists public.menu_items (
  id uuid primary key,
  category text not null,
  name text not null,
  description text default '',
  price numeric not null default 0,
  image text default '',
  visual text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.pqrs (
  id uuid primary key,
  name text default '',
  phone text default '',
  type text not null default 'sugerencia',
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint pqrs_type_check check (type in ('queja', 'reclamo', 'sugerencia', 'felicitacion')),
  constraint pqrs_status_check check (status in ('new', 'reviewed', 'resolved'))
);

alter table public.menu_items enable row level security;
alter table public.pqrs enable row level security;

-- The server uses the Supabase service role key, so it bypasses RLS.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY in browser code.

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('new', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'));
