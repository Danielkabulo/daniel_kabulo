-- Exemple d'activation RLS et policies basiques (à adapter selon ta politique)
-- Active RLS sur tables écriture sensible (reports, faults_library)
alter table faults_library enable row level security;
alter table reports enable row level security;

-- Policy: allow authenticated users to insert/select on reports
create policy "auth can insert reports" on reports
  for insert using (auth.role() = 'authenticated');

create policy "auth can select reports" on reports
  for select using (auth.role() = 'authenticated');

-- Policy: allow authenticated users to insert/select on faults_library
create policy "auth can insert faults" on faults_library
  for insert using (auth.role() = 'authenticated');

create policy "auth can select faults" on faults_library
  for select using (auth.role() = 'authenticated');

-- If you want public read access to units (so UI can show list without auth)
alter table units enable row level security;
create policy "public select units" on units
  for select using (true);