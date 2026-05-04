alter table public.feedback
add column if not exists target_version text not null default 'backlog';

alter table public.feedback
add column if not exists admin_decision text;

create table if not exists public.product_versions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.feedback
add column if not exists version_id uuid references public.product_versions(id) on delete set null;

alter table public.feedback
alter column status set default 'pending';

alter table public.feedback
alter column priority set default 'medium';

alter table public.feedback
alter column target_version set default 'backlog';

alter table public.feedback
drop constraint if exists feedback_status_check;

alter table public.feedback
drop constraint if exists feedback_priority_check;

alter table public.feedback
drop constraint if exists feedback_target_version_check;

update public.feedback
set status = case
  when status in ('new', 'pending') then 'pending'
  when status in ('in_review', 'reviewed') then 'reviewed'
  when status = 'planned' then 'planned'
  when status = 'in_progress' then 'in_progress'
  when status = 'done' then 'done'
  when status in ('closed', 'rejected') then 'rejected'
  else 'pending'
end,
updated_at = now();

update public.feedback
set priority = case
  when priority in ('low', 'medium', 'high', 'critical') then priority
  else 'medium'
end,
updated_at = now();

update public.feedback
set target_version = case
  when target_version in ('backlog', 'v2.1', 'v2.2', 'v3.0') then target_version
  else 'backlog'
end,
updated_at = now();

alter table public.feedback
add constraint feedback_status_check
check (status in ('pending', 'reviewed', 'planned', 'in_progress', 'done', 'rejected'));

alter table public.feedback
add constraint feedback_priority_check
check (priority in ('low', 'medium', 'high', 'critical'));

alter table public.feedback
add constraint feedback_target_version_check
check (target_version in ('backlog', 'v2.1', 'v2.2', 'v3.0'));

create or replace view public.feedback_admin_view as
select
  feedback.id,
  feedback.user_id,
  feedback.version_id,
  auth_users.email,
  feedback.title,
  feedback.message,
  feedback.category,
  feedback.priority,
  feedback.status,
  feedback.target_version,
  feedback.admin_notes,
  feedback.admin_decision,
  feedback.created_at,
  feedback.updated_at
from public.feedback
left join auth.users as auth_users
  on auth_users.id = feedback.user_id;

grant select on public.feedback_admin_view to authenticated;

alter table public.product_versions enable row level security;

drop policy if exists "product_versions_select_admin" on public.product_versions;
drop policy if exists "product_versions_insert_admin" on public.product_versions;
drop policy if exists "product_versions_update_admin" on public.product_versions;
drop policy if exists "product_versions_delete_admin" on public.product_versions;

create policy "product_versions_select_admin"
on public.product_versions
for select
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

create policy "product_versions_insert_admin"
on public.product_versions
for insert
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

create policy "product_versions_update_admin"
on public.product_versions
for update
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

create policy "product_versions_delete_admin"
on public.product_versions
for delete
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

grant select, insert, update, delete on public.product_versions to authenticated;
