-- Ejecuta esto en: Supabase Dashboard → SQL Editor → New query

create table if not exists truck_location (
  id        int primary key default 1,
  lat       float8 not null default 0,
  lng       float8 not null default 0,
  address   text   not null default '',
  updated_at timestamptz not null default now(),
  is_active boolean not null default false
);

-- Inserta la fila única (el truck siempre tiene id=1)
insert into truck_location (id, lat, lng, address, is_active)
values (1, 0, 0, '', false)
on conflict (id) do nothing;

-- Habilita Row Level Security
alter table truck_location enable row level security;

-- Política: cualquiera puede LEER la ubicación
create policy "Public read" on truck_location
  for select using (true);

-- Política: cualquiera puede ACTUALIZAR (anon key)
create policy "Public update" on truck_location
  for update using (true);

-- Activa Realtime para esta tabla
alter publication supabase_realtime add table truck_location;
