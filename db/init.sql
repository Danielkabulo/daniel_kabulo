-- Extension for UUID (Supabase supports pgcrypto)
create extension if not exists "pgcrypto";

-- Units table (identifier list)
create table if not exists units (
  unit_id text primary key,
  label text,
  metadata jsonb default '{}'::jsonb
);

-- Fault library
create table if not exists faults_library (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  description text not null,
  created_by uuid,
  created_at timestamptz default now()
);

-- Reports
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  unit_id text references units(unit_id),
  status text not null,
  emoji text,
  description text,
  start_time timestamptz,
  end_time timestamptz,
  operator_id uuid,
  raw_message text,
  created_at timestamptz default now()
);

-- Seed units
insert into units (unit_id, label) values
('CV001','CV001'),('CV002','CV002'),('CV003','CV003'),('CV004','CV004'),
('CV005','CV005'),('CV006','CV006'),('CV007','CV007'),('CV008','CV008'),
('CV009','CV009'),('TT1','TT1'),('#SILO','#SILO')
on conflict (unit_id) do nothing;

-- Seed some faults
insert into faults_library (category, description) values
('Safety','Emergency pull wire activated.'),
('Safety','Emergency stop button pressed.'),
('Mechanical','Chute blockage detected.'),
('Mechanical','Damaged belt surface found.'),
('Electrical','VFD communication error.'),
('Electrical','Motor high temperature.'),
('Planned','Planned tasks: Cable extension.')
on conflict do nothing;