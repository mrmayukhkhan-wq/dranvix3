-- ─────────────────────────────────────────────────────────────────────────────
-- MedControl — Initial Schema + Row Level Security
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable uuid generation
create extension if not exists "pgcrypto";


-- ─── medicines ────────────────────────────────────────────────────────────────

create table if not exists medicines (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,

  name         text not null,
  generic_name text,
  batch_no     text,
  expiry_date  date not null,
  quantity     integer not null default 0,
  unit         text default 'strips',
  mrp          numeric(10,2),
  category     text,
  supplier     text,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-set user_id from JWT so the client never has to pass it
alter table medicines
  alter column user_id set default auth.uid();

-- Index for expiry queries (used by alert panels)
create index if not exists medicines_expiry_date_idx on medicines (user_id, expiry_date);

-- RLS
alter table medicines enable row level security;

create policy "Users can view their own medicines"
  on medicines for select
  using (auth.uid() = user_id);

create policy "Users can insert their own medicines"
  on medicines for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own medicines"
  on medicines for update
  using (auth.uid() = user_id);

create policy "Users can delete their own medicines"
  on medicines for delete
  using (auth.uid() = user_id);


-- ─── activity ─────────────────────────────────────────────────────────────────

create table if not exists activity (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,

  type         text not null,
  description  text not null,
  medicine_id  uuid references medicines(id) on delete set null,
  meta         jsonb default '{}',

  created_at   timestamptz not null default now()
);

alter table activity
  alter column user_id set default auth.uid();

create index if not exists activity_created_at_idx on activity (user_id, created_at desc);

alter table activity enable row level security;

create policy "Users can view their own activity"
  on activity for select
  using (auth.uid() = user_id);

create policy "Users can insert their own activity"
  on activity for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own activity"
  on activity for delete
  using (auth.uid() = user_id);


-- ─── invoices ─────────────────────────────────────────────────────────────────

create table if not exists invoices (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,

  distributor   text,
  invoice_no    text,
  invoice_date  date,
  raw_text      text,
  parsed_items  jsonb default '[]',
  status        text not null default 'pending'
                  check (status in ('pending','parsed','imported','failed')),

  created_at    timestamptz not null default now()
);

alter table invoices
  alter column user_id set default auth.uid();

alter table invoices enable row level security;

create policy "Users can view their own invoices"
  on invoices for select
  using (auth.uid() = user_id);

create policy "Users can insert their own invoices"
  on invoices for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own invoices"
  on invoices for update
  using (auth.uid() = user_id);

create policy "Users can delete their own invoices"
  on invoices for delete
  using (auth.uid() = user_id);


-- ─── settings ─────────────────────────────────────────────────────────────────

create table if not exists settings (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null unique references auth.users(id) on delete cascade,

  pharmacy_name     text default '',
  theme             text default 'dark',
  currency          text default 'INR',
  alert_days_red    integer default 90,
  alert_days_amber  integer default 180,

  updated_at        timestamptz not null default now()
);

alter table settings
  alter column user_id set default auth.uid();

alter table settings enable row level security;

create policy "Users can view their own settings"
  on settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on settings for update
  using (auth.uid() = user_id);


-- ─── updated_at trigger ───────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger medicines_updated_at
  before update on medicines
  for each row execute function set_updated_at();

create trigger settings_updated_at
  before update on settings
  for each row execute function set_updated_at();
