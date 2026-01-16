-- Active RLS
alter table reports enable row level security;
alter table faults_library enable row level security;
alter table units enable row level security;

-- Allow public read of units (UI needs to list units without auth)
create policy "public select units" on units
  for select using (true);

-- Allow authenticated users to select/insert reports (adjust if you want operators to only modify their own)
create policy "auth can select reports" on reports
  for select using (auth.role() = 'authenticated');

create policy "auth can insert reports" on reports
  for insert with check (auth.role() = 'authenticated');

-- Allow authenticated users to select/insert faults
create policy "auth can select faults" on faults_library
  for select using (auth.role() = 'authenticated');

create policy "auth can insert faults" on faults_library
  for insert with check (auth.role() = 'authenticated');